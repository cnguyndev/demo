'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Page() {
    const [user, setUser] = useState(null);
    const [state, setState] = useState({ loading: true, submitting: false, error: null });
    const [settingData, setSettingData] = useState(null);
    const [form, setForm] = useState({
        site_name: '',
        slogan: '',
        email: '',
        phone: '',
        hotline: '',
        address: '',
    });
    const [logoFile, setLogoFile] = useState(null);
    const [faviconFile, setFaviconFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState('');
    const [faviconPreview, setFaviconPreview] = useState('');

    const router = useRouter();

    useEffect(() => {
        const userString = localStorage.getItem('user');
        if (userString) {
            try { setUser(JSON.parse(userString)); } catch { }
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setState(s => ({ ...s, loading: true, error: null }));
            try {
                const res = await fetch(`${API_BASE}/setting`);

                if (res.status === 404) {
                    // Nếu chưa có setting, coi như form trống
                    setSettingData(null);
                    return;
                }
                if (!res.ok) throw new Error("Không thể tải dữ liệu cài đặt.");

                const json = await res.json();
                setSettingData(json);
                setForm({
                    site_name: json.site_name || '',
                    slogan: json.slogan || '',
                    email: json.email || '',
                    phone: json.phone || '',
                    hotline: json.hotline || '',
                    address: json.address || '',
                });

            } catch (e) {
                setState(s => ({ ...s, error: e.message }));
            } finally {
                setState(s => ({ ...s, loading: false }));
            }
        };
        fetchData();
    }, []);

    // Tạo preview cho logo
    useEffect(() => {
        if (logoFile) {
            const url = URL.createObjectURL(logoFile);
            setLogoPreview(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [logoFile]);

    // Tạo preview cho favicon
    useEffect(() => {
        if (faviconFile) {
            const url = URL.createObjectURL(faviconFile);
            setFaviconPreview(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [faviconFile]);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    // 1. Hàm upload ảnh được chuẩn hóa
    const uploadSettingImage = async (file, perfix) => {
        if (!file) return null; // Không có file thì không làm gì cả

        const fd = new FormData();
        fd.append('image', file);
        fd.append('perfix', perfix); // e.g., 'logo', 'favicon'

        const res = await fetch(`${API_BASE}/upload`, { method: 'POST', body: fd });
        if (!res.ok) {
            const t = await res.text().catch(() => '');
            throw new Error(t || `Upload ${perfix} thất bại (${res.status})`);
        }
        return await res.json(); // Trả về object chứa { url: '...' }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setState(s => ({ ...s, submitting: true, error: null }));

        try {
            // 2. Upload đồng thời 2 ảnh để tối ưu tốc độ
            const [logoUploadRes, faviconUploadRes] = await Promise.all([
                uploadSettingImage(logoFile, 'logo'),
                uploadSettingImage(faviconFile, 'favicon')
            ]);

            // Xác định URL cuối cùng: nếu có ảnh mới thì dùng, không thì giữ ảnh cũ
            const finalLogoUrl = logoUploadRes ? logoUploadRes.url : settingData?.logo;
            const finalFaviconUrl = faviconUploadRes ? faviconUploadRes.url : settingData?.favicon;

            const isUpdating = !!settingData;

            // 3. Payload được tinh gọn, bỏ timestamp
            const payload = {
                ...form,
                logo: finalLogoUrl,
                favicon: finalFaviconUrl,
                ...(isUpdating
                    ? { updated_by: user?.id || 0 }
                    : { created_by: user?.id || 0 }
                )
            };

            const url = isUpdating ? `${API_BASE}/setting/${settingData.id}` : `${API_BASE}/setting`;
            const method = isUpdating ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || "Lưu cài đặt thất bại.");
            }

            alert('Lưu cài đặt thành công!');
            // Tải lại dữ liệu cho trang hiện tại để cập nhật ảnh và thông tin
            router.refresh();

        } catch (err) {
            console.error(err);
            setState(s => ({ ...s, error: err.message }));
        } finally {
            setState(s => ({ ...s, submitting: false }));
        }
    };

    if (state.loading) return <div className="p-8 text-center animate-pulse">Đang tải...</div>;

    // Giao diện giữ nguyên vì đã khá tốt
    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 shadow-sm rounded-lg border max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Cài đặt Website</h1>
                <p className="text-sm text-gray-500 mt-1">Quản lý các thông tin chung của trang web.</p>
            </div>

            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tên Website</label>
                        <input name="site_name" value={form.site_name} onChange={handleFormChange} className="w-full h-11 px-4 rounded-lg bg-gray-50 border border-gray-300" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Slogan</label>
                        <input name="slogan" value={form.slogan} onChange={handleFormChange} className="w-full h-11 px-4 rounded-lg bg-gray-50 border border-gray-300" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input name="email" type="email" value={form.email} onChange={handleFormChange} className="w-full h-11 px-4 rounded-lg bg-gray-50 border border-gray-300" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input name="phone" value={form.phone} onChange={handleFormChange} className="w-full h-11 px-4 rounded-lg bg-gray-50 border border-gray-300" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Hotline</label>
                        <input name="hotline" value={form.hotline} onChange={handleFormChange} className="w-full h-11 px-4 rounded-lg bg-gray-50 border border-gray-300" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                    <textarea name="address" value={form.address} onChange={handleFormChange} rows={3} className="w-full p-4 rounded-lg bg-gray-50 border border-gray-300" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
                        <input type="file" accept="image/svg+xml, image/png, image/jpeg" onChange={e => setLogoFile(e.target.files[0])} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" />
                        <div className="mt-4 p-4 border border-dashed rounded-lg h-28 flex items-center justify-center">
                            {logoPreview ? <Image src={logoPreview} alt="Logo preview" width={100} height={40} className="max-h-20 w-auto" />
                                : (settingData?.logo ? <Image src={settingData.logo} alt="Current Logo" width={100} height={40} className="max-h-20 w-auto" unoptimized /> : <p className="text-xs text-gray-400">Chưa có ảnh</p>)}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Favicon (.ico, .png)</label>
                        <input type="file" accept="image/x-icon, image/png" onChange={e => setFaviconFile(e.target.files[0])} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" />
                        <div className="mt-4 p-4 border border-dashed rounded-lg h-28 flex items-center justify-center">
                            {faviconPreview ? <Image src={faviconPreview} alt="Favicon preview" width={48} height={48} />
                                : (settingData?.favicon ? <Image src={settingData.favicon} alt="Current Favicon" width={48} height={48} unoptimized /> : <p className="text-xs text-gray-400">Chưa có ảnh</p>)}
                        </div>
                    </div>
                </div>
            </div>

            {state.error && <p className="text-red-500 text-sm text-center mt-4">Lỗi: {state.error}</p>}

            <div className="flex justify-end gap-3 border-t pt-6 mt-8">
                <button type="submit" disabled={state.submitting} className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg disabled:opacity-60 disabled:cursor-not-allowed">
                    {state.submitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
            </div>
        </form>
    );
}