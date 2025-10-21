'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import TinyMCE from '../.../../../../../../_components/TinyMCE/TinyMCE';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

const createSlug = (str) =>
    str
        ? str.toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/[^a-z0-9\s-]/g, '')
            .trim().replace(/\s+/g, '-').replace(/-+/g, '-')
        : '';

export default function page() {
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const userString = localStorage.getItem('user');

        if (userString) {
            const userData = JSON.parse(userString);
            setUser(userData);
        }
    }, [router]);
    const { id } = useParams();

    const [state, setState] = useState({ loading: true, submitting: false, error: null });
    const [allCategories, setAllCategories] = useState([]);
    const [allAttributesList, setAllAttributesList] = useState([]);

    const [form, setForm] = useState({
        name: '', slug: '', category_id: '', price_buy: '',
        description: '', content: '', status: 1, thumbnail: '',
        price_root: '', qty: '',
    });

    const [attributes, setAttributes] = useState([{ attribute_id: '', value: '' }]);

    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [oldThumbnail, setOldThumbnail] = useState('');

    const [existingGallery, setExistingGallery] = useState([]);
    const [deleteGalleryIds, setDeleteGalleryIds] = useState([]);
    const [galleryFiles, setGalleryFiles] = useState([]);
    const [galleryPreviews, setGalleryPreviews] = useState([]);

    useEffect(() => {
        if (!id) return;
        (async () => {
            setState(s => ({ ...s, loading: true, error: null }));
            try {
                const [catRes, attrRes, prodRes] = await Promise.all([
                    fetch(`${API_BASE}/category`),
                    fetch(`${API_BASE}/attribute`),
                    fetch(`${API_BASE}/getAdminProductDetail/${id}`),
                ]);
                if (!catRes.ok || !attrRes.ok || !prodRes.ok) throw new Error('Không tải được dữ liệu.');

                const cats = await catRes.json();
                const attrs = await attrRes.json();
                const prod = await prodRes.json();
                const p = prod?.data || prod;

                const ps = p?.product_store || {};
                const imgs = Array.isArray(p?.product_image) ? p.product_image : [];
                const pattrs = Array.isArray(p?.product_attribute)
                    ? p.product_attribute.map(x => ({ attribute_id: x.attribute_id, value: x.value }))
                    : [];

                setAllCategories(Array.isArray(cats) ? cats : []);
                setAllAttributesList(Array.isArray(attrs) ? attrs : []);

                setForm({
                    name: p?.name || '',
                    slug: p?.slug || '',
                    category_id: String(p?.category_id || ''),
                    price_buy: p?.price_buy ?? '',
                    description: p?.description || '',
                    content: p?.content || '',
                    status: p?.status ?? 1,
                    thumbnail: p?.thumbnail || '',
                    price_root: ps?.price_root ?? '',
                    qty: ps?.qty ?? '',
                });
                setOldThumbnail(p?.thumbnail || '');

                setAttributes(pattrs.length ? pattrs : [{ attribute_id: '', value: '' }]);
                setExistingGallery(imgs);
                setDeleteGalleryIds([]);
                setGalleryFiles([]);
                setGalleryPreviews([]);
            } catch (e) {
                setState(s => ({ ...s, error: e.message }));
            } finally {
                setState(s => ({ ...s, loading: false }));
            }
        })();
    }, [id]);

    useEffect(() => {
        if (thumbnailFile) {
            const url = URL.createObjectURL(thumbnailFile);
            setThumbnailPreview(url);
            return () => URL.revokeObjectURL(url);
        }
        setThumbnailPreview(null);
    }, [thumbnailFile]);

    useEffect(() => {
        if (galleryFiles.length) {
            const urls = galleryFiles.map(f => URL.createObjectURL(f));
            setGalleryPreviews(urls);
            return () => urls.forEach(u => URL.revokeObjectURL(u));
        }
        setGalleryPreviews([]);
    }, [galleryFiles]);

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const onAttrChange = (idx, e) => {
        const { name, value } = e.target;
        setAttributes(prev => {
            const next = [...prev];
            next[idx][name] = value;
            return next;
        });
    };

    const addAttr = () => setAttributes(prev => [...prev, { attribute_id: '', value: '' }]);
    const rmAttr = (idx) => setAttributes(prev => prev.filter((_, i) => i !== idx));

    const toggleDeleteGallery = (imgId) => {
        setDeleteGalleryIds(prev =>
            prev.includes(imgId) ? prev.filter(x => x !== imgId) : [...prev, imgId]
        );
    };

    const deleteFile = async (filepath) => {
        const res = await fetch('/api/upload', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filepath }),
        });
        return res.ok;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.category_id || !form.price_buy || !form.qty || !form.price_root) {
            alert('Vui lòng điền đủ các trường bắt buộc (*).');
            return;
        }

        setState(s => ({ ...s, submitting: true, error: null }));

        try {
            let thumbnailUrl = form.thumbnail;

            if (thumbnailFile) {
                if (oldThumbnail) {
                    try { await deleteFile(oldThumbnail); } catch { }
                }
                const fd = new FormData();
                fd.append('file', thumbnailFile);
                fd.append('slug', createSlug(form.name));
                fd.append('action', 'update');
                fd.append('prefix', 'product');
                const up = await fetch('/api/upload', { method: 'POST', body: fd });
                const js = await up.json();
                if (!up.ok) throw new Error(js?.error || 'Upload thumbnail thất bại');
                thumbnailUrl = js.file.filepath;
            }

            const imgIdsToDelete = [...deleteGalleryIds];
            if (imgIdsToDelete.length) {
                const toDeleteFiles = existingGallery.filter(x => imgIdsToDelete.includes(x.id)).map(x => x.image);
                for (const filepath of toDeleteFiles) {
                    try { await deleteFile(filepath); } catch { }
                }
            }

            const galleryToAdd = [];
            for (const f of galleryFiles) {
                const fd = new FormData();
                fd.append('file', f);
                fd.append('slug', createSlug(form.name));
                fd.append('action', 'create');
                fd.append('prefix', 'product_gallery');
                const r = await fetch('/api/upload', { method: 'POST', body: fd });
                const j = await r.json();
                if (!r.ok) throw new Error(j?.error || 'Upload ảnh album thất bại');
                galleryToAdd.push({ image: j.file.filepath, status: 1 });
            }

            const payload = {
                category_id: Number(form.category_id),
                name: form.name,
                slug: createSlug(form.name),
                thumbnail: thumbnailUrl,
                content: form.content,
                description: form.description,
                price_buy: Number(form.price_buy),
                status: Number(form.status),
                updated_at: new Date().toISOString(),
                updated_by: user?.id || 0,

                product_attribute: attributes
                    .filter(a => a.attribute_id && a.value)
                    .map(a => ({ attribute_id: Number(a.attribute_id), value: String(a.value).trim() })),

                gallery_images: galleryToAdd,
                product_image_ids_delete: imgIdsToDelete,
            };

            const res = await fetch(`${API_BASE}/product/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                let js = {};
                try { js = await res.json(); } catch { }
                throw new Error(js?.message || js?.error || 'Cập nhật thất bại');
            }

            alert('Cập nhật sản phẩm thành công!');
            router.push('/admin/product');
        } catch (err) {
            console.error(err);
            setState(s => ({ ...s, submitting: false, error: err.message }));
        }
    };

    if (state.loading) return <div className="p-8 text-center animate-pulse">Đang tải...</div>;
    if (state.error && !state.submitting)
        return <div className="p-8 text-center text-red-500">Lỗi: {state.error}</div>;

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa sản phẩm</h1>
                    <p className="text-sm text-gray-500 mt-1">ID: {id}</p>
                </div>
                <div className="flex gap-3">
                    <Link href="/admin/product" className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium rounded-lg">Hủy</Link>
                    <button type="submit" disabled={state.submitting} className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-60">
                        {state.submitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-6 shadow-sm rounded-lg border">
                        <h3 className="text-lg font-semibold mb-4">Thông tin cơ bản</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Tên sản phẩm <span className="text-red-500">*</span></label>
                                <input name="name" value={form.name} onChange={onChange} required className="w-full h-12 px-4 rounded-lg bg-gray-50 border border-gray-300" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Mô tả ngắn</label>
                                <textarea name="description" value={form.description} onChange={onChange} rows={3} className="w-full p-4 rounded-lg bg-gray-50 border border-gray-300" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Nội dung chi tiết</label>
                                <TinyMCE name="content" value={form.content} onChange={onChange} className="w-full p-4 rounded-lg bg-gray-50 border border-gray-300" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 shadow-sm rounded-lg border">
                        <h3 className="text-lg font-semibold mb-4">Hình ảnh</h3>
                        <div className="space-y-3">
                            <label className="block text-sm font-medium">Ảnh đại diện — để trống nếu giữ nguyên</label>
                            <div className="flex items-center gap-4">
                                {thumbnailPreview ? (
                                    <Image src={thumbnailPreview} alt="New thumbnail" width={120} height={120} className="rounded-lg border" />
                                ) : form.thumbnail ? (
                                    <Image src={form.thumbnail} alt="Current thumbnail" width={120} height={120} className="rounded-lg border" />
                                ) : null}
                                <input type="file" accept="image/*" onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)} />
                            </div>
                        </div>

                        <div className="mt-6">
                            <label className="block text-sm font-medium mb-2">Album hiện có</label>
                            {existingGallery.length === 0 ? (
                                <p className="text-gray-500 text-sm">Chưa có ảnh.</p>
                            ) : (
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                                    {existingGallery.map(img => {
                                        const marked = deleteGalleryIds.includes(img.id);
                                        return (
                                            <div key={img.id} className="relative">
                                                <Image src={img.image} alt={img.title || 'Image'} width={110} height={110}
                                                    className={`rounded-lg border object-cover aspect-square ${marked ? 'opacity-40' : ''}`} />
                                                <button type="button" onClick={() => toggleDeleteGallery(img.id)}
                                                    className={`absolute top-2 right-2 text-xs px-2 py-1 rounded ${marked ? 'bg-gray-700 text-white' : 'bg-red-600 text-white'}`}>
                                                    {marked ? 'Bỏ' : 'Xoá'}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        <div className="mt-6">
                            <label className="block text-sm font-medium mb-2">Thêm ảnh vào album</label>
                            <input type="file" multiple accept="image/*"
                                onChange={(e) => setGalleryFiles(Array.from(e.target.files || []))}
                                className="w-full text-sm" />
                            {galleryPreviews.length > 0 && (
                                <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                                    {galleryPreviews.map((src, i) => (
                                        <Image key={i} src={src} alt={`new-${i}`} width={100} height={100}
                                            className="rounded-lg border object-cover aspect-square" />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white p-6 shadow-sm rounded-lg border">
                        <h3 className="text-lg font-semibold mb-4">Thuộc tính sản phẩm</h3>
                        <div className="space-y-4">
                            {attributes.map((attr, idx) => (
                                <div key={idx} className="flex items-center gap-4">
                                    <select name="attribute_id" value={attr.attribute_id} onChange={(e) => onAttrChange(idx, e)}
                                        className="w-1/3 h-12 px-4 rounded-lg bg-gray-50 border border-gray-300">
                                        <option value="" disabled>Chọn thuộc tính</option>
                                        {allAttributesList.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                                    </select>
                                    <input name="value" value={attr.value} onChange={(e) => onAttrChange(idx, e)}
                                        placeholder="VD: Đỏ, L, Vải Kate"
                                        className="flex-1 h-12 px-4 rounded-lg bg-gray-50 border border-gray-300" />
                                    <button type="button" onClick={() => rmAttr(idx)} className="p-3 text-red-500 hover:bg-gray-100 rounded-full">
                                        <i className="far fa-trash-alt" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={() => setAttributes(prev => [...prev, { attribute_id: '', value: '' }])}
                            className="mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-500">
                            + Thêm thuộc tính
                        </button>
                    </div>
                </div>

                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-white p-6 shadow-sm rounded-lg border">
                        <h3 className="text-lg font-semibold mb-4">Kho hàng & Giá cả</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Giá gốc (giá nhập) <span className="text-red-500">*</span></label>
                                <input name="price_root" type="number" value={form.price_root} onChange={onChange} required
                                    className="w-full h-12 px-4 rounded-lg bg-gray-50 border border-gray-300" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Giá bán <span className="text-red-500">*</span></label>
                                <input name="price_buy" type="number" value={form.price_buy} onChange={onChange} required
                                    className="w-full h-12 px-4 rounded-lg bg-gray-50 border border-gray-300" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Số lượng nhập kho <span className="text-red-500">*</span></label>
                                <input name="qty" type="number" value={form.qty} onChange={onChange} required
                                    className="w-full h-12 px-4 rounded-lg bg-gray-50 border border-gray-300" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 shadow-sm rounded-lg border">
                        <h3 className="text-lg font-semibold mb-4">Tổ chức</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Danh mục sản phẩm <span className="text-red-500">*</span></label>
                                <select name="category_id" value={form.category_id} onChange={onChange} required
                                    className="w-full h-12 px-4 rounded-lg bg-gray-50 border border-gray-300">
                                    <option value="" disabled>— Chọn danh mục —</option>
                                    {allCategories.filter(c => c.parent_id === 0).map(cat => (
                                        <React.Fragment key={cat.id}>
                                            <option value={cat.id} className="font-bold">{cat.name}</option>
                                            {allCategories.filter(sub => sub.parent_id === cat.id).map(sub => (
                                                <option key={sub.id} value={sub.id}>&nbsp;&nbsp;&nbsp;-- {sub.name}</option>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Trạng thái</label>
                                <select name="status" value={form.status} onChange={onChange}
                                    className="w-full h-12 px-4 rounded-lg bg-gray-50 border border-gray-300">
                                    <option value={1}>Đang bán</option>
                                    <option value={0}>Ngừng bán</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {state.error && <p className="text-red-500 text-sm mt-4 text-center">Lỗi: {state.error}</p>}
        </form>
    );
}
