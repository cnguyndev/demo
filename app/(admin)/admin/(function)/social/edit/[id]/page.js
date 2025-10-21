'use client'

import React, { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Page() {
    const { id } = useParams();
    const router = useRouter();
    const [allSocialIcons, setAllSocialIcons] = useState([]);
    const [state, setState] = useState({ loading: true, submitting: false, error: null });
    const [user, setUser] = useState(null);

    const [form, setForm] = useState({
        title: '',
        social_id: '',
        username: '',
        status: 1,
    });

    useEffect(() => {
        const userString = localStorage.getItem('user');
        if (userString) {
            const userData = JSON.parse(userString);
            setUser(userData);
        }
    }, []);

    useEffect(() => {
        if (!id) return;
        const fetchData = async () => {
            setState(s => ({ ...s, loading: true }));
            try {
                const [socialRes, iconsRes] = await Promise.all([
                    fetch(`${API_BASE}/social/${id}`),
                    fetch(`${API_BASE}/social-icon`)
                ]);

                if (socialRes.status === 404) throw new Error("Không tìm thấy liên kết này.");
                if (!socialRes.ok || !iconsRes.ok) throw new Error("Lỗi khi tải dữ liệu.");

                const socialJson = await socialRes.json();
                const iconsJson = await iconsRes.json();

                setAllSocialIcons(Array.isArray(iconsJson) ? iconsJson : []);
                setForm({
                    title: socialJson.title || '',
                    social_id: socialJson.social_id || '',
                    username: socialJson.username || '',
                    status: socialJson.status,
                });

            } catch (e) {
                setState(s => ({ ...s, error: e.message }));
            } finally {
                setState(s => ({ ...s, loading: false }));
            }
        };
        fetchData();
    }, [id]);

    const selectedSocial = useMemo(() => {
        if (!form.social_id) return null;
        return allSocialIcons.find(s => s.id === Number(form.social_id));
    }, [form.social_id, allSocialIcons]);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title || !form.social_id || !form.username) {
            return alert("Vui lòng điền đầy đủ các trường bắt buộc.");
        }

        setState(s => ({ ...s, submitting: true, error: null }));
        try {
            const payload = {
                title: form.title.trim(),
                social_id: Number(form.social_id),
                username: form.username.trim(),
                status: Number(form.status),
                updated_at: new Date().toISOString(),
                updated_by: user?.id || 0,
            };

            const res = await fetch(`${API_BASE}/social/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || "Cập nhật thất bại.");
            }

            alert('Cập nhật liên kết thành công!');
            router.push('/admin/social');

        } catch (err) {
            console.error(err);
            setState(s => ({ ...s, submitting: false, error: err.message }));
        }
    };

    if (state.loading) return <div className="p-8 text-center animate-pulse">Đang tải...</div>;
    if (state.error) return <div className="p-8 text-center text-red-500">Lỗi: {state.error}</div>;

    return (
        <div className="bg-white p-6 md:p-8 shadow-sm rounded-lg border max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Cập nhật Liên kết Mạng xã hội</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="social_id" className="block text-sm font-medium text-gray-700 mb-1">Loại mạng xã hội <span className="text-red-500">*</span></label>
                    <select id="social_id" name="social_id" value={form.social_id} onChange={handleFormChange} required className="w-full h-12 px-4 rounded-lg bg-gray-50 border border-gray-300">
                        <option value="" disabled>— Chọn một mạng xã hội —</option>
                        {allSocialIcons.map(icon => (
                            <option key={icon.id} value={icon.id}>{icon.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Tên hiển thị <span className="text-red-500">*</span></label>
                    <input type="text" id="title" name="title" value={form.title} onChange={handleFormChange} required className="w-full h-12 px-4 rounded-lg bg-gray-50 border border-gray-300" placeholder="VD: Fanpage Facebook của Shop" />
                </div>

                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username / ID <span className="text-red-500">*</span></label>
                    <div className="flex items-center">
                        {selectedSocial && <span className="h-12 flex items-center px-3 bg-gray-200 text-gray-600 border border-r-0 border-gray-300 rounded-l-lg">{selectedSocial.link}</span>}
                        <input type="text" id="username" name="username" value={form.username} onChange={handleFormChange} required className={`w-full h-12 px-4 border border-gray-300 ${selectedSocial ? 'rounded-r-lg' : 'rounded-lg'}`} placeholder="myshop.fb" />
                    </div>
                </div>

                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                    <select id="status" name="status" value={form.status} onChange={handleFormChange} className="w-full h-12 px-4 rounded-lg bg-gray-50 border border-gray-300">
                        <option value={1}>Hiển thị</option>
                        <option value={0}>Tạm ẩn</option>
                    </select>
                </div>

                {state.error && <p className="text-red-500 text-sm text-center">Lỗi: {state.error}</p>}

                <div className="flex justify-end gap-3 border-t pt-6">
                    <Link href="/admin/social" className="px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium rounded-lg">Hủy</Link>
                    <button type="submit" disabled={state.submitting} className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg disabled:opacity-60">
                        {state.submitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                </div>
            </form>
        </div>
    );
}