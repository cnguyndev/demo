'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image';
import { useRouter } from 'next/navigation'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

const createSlug = (str) =>
    str
        ? str
            .toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/[^a-z0-9\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
        : '';

export default function Page() {
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const userString = localStorage.getItem('user');
        if (userString) {
            try { setUser(JSON.parse(userString)); } catch { }
        }
    }, [router]);

    // 1. Quản lý state tập trung
    const [state, setState] = useState({ loading: true, submitting: false, error: null });

    const [allCategories, setAllCategories] = useState([]);
    const [form, setForm] = useState({
        name: '',
        slug: '',
        parent_id: 0,
        description: '',
        sort_order: 1,
        status: 1,
    });

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    // 2. Fetch dữ liệu ban đầu
    useEffect(() => {
        const fetchData = async () => {
            setState(s => ({ ...s, loading: true, error: null }));
            try {
                const res = await fetch(`${API_BASE}/category`);
                if (!res.ok) throw new Error('Không thể tải danh sách danh mục.');
                const json = await res.json();
                setAllCategories(Array.isArray(json) ? json : []);
            } catch (e) {
                setState(s => ({ ...s, error: e.message }));
            } finally {
                setState(s => ({ ...s, loading: false }));
            }
        };
        fetchData();
    }, []);

    // Tạo preview cho ảnh
    useEffect(() => {
        if (imageFile) {
            const url = URL.createObjectURL(imageFile);
            setImagePreview(url);
            return () => URL.revokeObjectURL(url);
        }
        setImagePreview(null);
    }, [imageFile]);

    // 3. Hàm upload ảnh nhất quán
    const uploadSingleToLaravel = async (file) => {
        const fd = new FormData();
        fd.append('image', file);
        fd.append('slug', createSlug(form.name));
        fd.append('perfix', "categories");

        const res = await fetch(`${API_BASE}/upload`, { method: 'POST', body: fd });
        if (!res.ok) {
            const t = await res.text().catch(() => '');
            throw new Error(t || `Upload ảnh thất bại (${res.status})`);
        }
        return (await res.json());
    };

    // Tính toán thứ tự sắp xếp
    const siblings = useMemo(() => {
        return allCategories
            .filter(c => Number(c.parent_id) === Number(form.parent_id))
            .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
    }, [allCategories, form.parent_id]);

    const effectiveSortOrder = useMemo(() => {
        return form.sort_order || (siblings.length + 1);
    }, [form.sort_order, siblings.length]);

    // 4. Hàm xử lý form chung
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));

        if (name === 'name') {
            setForm(prev => ({ ...prev, slug: createSlug(value) }));
        }
        if (name === 'parent_id') {
            // Khi đổi danh mục cha, reset thứ tự về cuối
            const newSiblings = allCategories.filter(c => Number(c.parent_id) === Number(value));
            setForm(prev => ({ ...prev, sort_order: newSiblings.length + 1 }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.name.trim()) {
            alert('Vui lòng nhập Tên danh mục.');
            return;
        }

        setState(s => ({ ...s, submitting: true, error: null }));
        try {
            let imageUrl = null;
            // Nếu có chọn ảnh thì mới upload
            if (imageFile) {
                const uploadData = await uploadSingleToLaravel(imageFile);
                imageUrl = uploadData.url;
            }

            const payload = {
                name: form.name.trim(),
                slug: form.slug.trim(),
                parent_id: Number(form.parent_id),
                sort_order: Number(effectiveSortOrder) || 1,
                description: form.description.trim(),
                status: Number(form.status),
                image: imageUrl,
                created_by: user?.id || 0,
            };

            const res = await fetch(`${API_BASE}/category`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP ${res.status}`);
            }

            alert('Tạo danh mục thành công!');
            router.push('/admin/category');

        } catch (err) {
            console.error(err);
            setState(s => ({ ...s, error: err.message || 'Thao tác thất bại' }));
        } finally {
            setState(s => ({ ...s, submitting: false }));
        }
    };

    if (state.loading) return <div className="p-8 text-center animate-pulse">Đang tải...</div>;
    if (state.error && !state.submitting) return <div className="p-8 text-center text-red-500">Lỗi: {state.error}</div>;

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Thêm Danh mục mới</h1>
                <div className="flex gap-3">
                    <Link href="/admin/category" className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium rounded-lg">
                        Hủy
                    </Link>
                    <button type="submit" disabled={state.submitting} className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-60">
                        {state.submitting ? 'Đang tạo...' : 'Tạo Danh mục'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-6 shadow-sm rounded-lg border">
                        <h3 className="text-lg font-semibold mb-4">Thông tin cơ bản</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Tên Danh mục <span className="text-red-500">*</span></label>
                                <input name="name" type="text" required value={form.name} onChange={handleFormChange} className="w-full h-12 px-4 rounded-lg bg-gray-50 border border-gray-300" />
                                {form.slug && <p className="text-xs text-gray-500 mt-1">Slug: {form.slug}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Mô tả</label>
                                <textarea name="description" value={form.description} onChange={handleFormChange} rows={4} className="w-full p-4 rounded-lg bg-gray-50 border border-gray-300" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-white p-6 shadow-sm rounded-lg border">
                        <h3 className="text-lg font-semibold mb-4">Tổ chức</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Danh mục cha</label>
                                <select name="parent_id" value={form.parent_id} onChange={handleFormChange} className="w-full h-12 px-4 rounded-lg bg-gray-50 border border-gray-300">
                                    <option value={0}>— Là danh mục gốc —</option>
                                    {allCategories.filter(c => c.parent_id === 0).map((cat) => (
                                        <option key={cat.id} value={cat.id} className="font-bold">{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Trạng thái</label>
                                <select name="status" value={form.status} onChange={handleFormChange} className="w-full h-12 px-4 rounded-lg bg-gray-50 border border-gray-300">
                                    <option value={1}>Hoạt động</option>
                                    <option value={0}>Tạm ẩn</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 shadow-sm rounded-lg border">
                        <h3 className="text-lg font-semibold mb-4">Ảnh đại diện (Tùy chọn)</h3>
                        <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" />
                        {imagePreview && (
                            <div className="mt-4">
                                <Image src={imagePreview} alt="Preview" width={120} height={120} className="rounded border border-gray-300 object-cover" />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {state.error && <p className="text-red-500 text-sm mt-4 text-center">Lỗi: {state.error}</p>}
        </form>
    );
}