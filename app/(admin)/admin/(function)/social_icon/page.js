'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

export default function Page() {
    const [page, setPage] = useState(1);
    const [iconRes, setIconRes] = useState(null);
    const [pagedIcons, setPagedIcons] = useState([]);
    const [state, setState] = useState({ loading: true, error: null });

    const fetchData = async (pageToFetch) => {
        setState({ loading: true, error: null });
        try {
            const res = await fetch(`${API_BASE}/getAdminSocialIcon?page=${pageToFetch || 1}`, { cache: 'no-store' });
            if (!res.ok) throw new Error(`SocialIcon HTTP ${res.status}`);

            const json = await res.json();
            setIconRes(json ?? null);
            setPagedIcons(Array.isArray(json.data) ? json.data : []);
        } catch (e) {
            setState({ loading: false, error: e.message || 'Fetch error' });
        } finally {
            setState({ loading: false });
        }
    };

    useEffect(() => {
        fetchData(page);
    }, [page]);

    const handleDelete = async (id) => {
        if (!confirm('Bạn có chắc chắn muốn xóa icon này? Các liên kết sử dụng icon này có thể bị lỗi.')) return;

        try {
            // Giả sử endpoint xóa là /social-icon/{id}
            const res = await fetch(`${API_BASE}/social-icon/${id}`, { method: 'DELETE' });
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || 'Xóa thất bại');
            }
            alert('Xóa icon thành công!');
            if (pagedIcons.length === 1 && page > 1) {
                setPage(page - 1);
            } else {
                fetchData(page);
            }
        } catch (err) {
            alert(err.message);
            console.error(err);
        }
    }

    if (state.loading) return <div className="p-8 text-center animate-pulse">Đang tải...</div>;
    if (state.error) return <div className="p-8 text-center text-red-500">Lỗi: {state.error}</div>;

    return (
        <div className="flex flex-col min-w-0 mb-6 break-words bg-white border-0 shadow-xl rounded-2xl">
            <div className="p-6 pb-4 mb-0 border-b border-gray-200 rounded-t-2xl">
                <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
                    <div>
                        <h6 className="text-gray-800 text-xl font-bold">Quản lý Icon Mạng xã hội</h6>
                        <nav aria-label="breadcrumb" className="text-sm font-medium text-gray-500">
                            <ol className="flex items-center space-x-1">
                                <li><Link href="/admin" className="hover:underline">Trang chủ</Link></li>
                                <li><span className="mx-1">/</span></li>
                                <li>Icon MXH</li>
                            </ol>
                        </nav>
                    </div>
                    <div>
                        <Link href="/admin/social_icon/create" className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-md">
                            <i className="fas fa-plus mr-2"></i> Thêm mới
                        </Link>
                    </div>
                </div>
            </div>

            <div className="flex-auto p-4">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm align-top text-slate-600">
                        <thead className="align-bottom">
                            <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b border-gray-200">
                                <th className="px-6 py-3 w-[5%]">ID</th>
                                <th className="px-6 py-3 w-[10%] text-center">Icon</th>
                                <th className="px-6 py-3 w-[20%]">Tên Mạng xã hội</th>
                                <th className="px-6 py-3 w-[35%]">Link gốc</th>
                                <th className="px-6 py-3 w-[20%]">Class Icon</th>
                                <th className="px-6 py-3 w-[10%] text-center">Chức năng</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {pagedIcons.map((icon) => (
                                <tr className="hover:bg-gray-50" key={icon.id}>
                                    <td className="px-6 py-4 font-bold text-gray-900">{icon.id}</td>
                                    <td className="px-6 py-4 text-center">
                                        <i className={`${icon.icon} text-2xl`}></i>
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-gray-800">{icon.name}</td>
                                    <td className="px-6 py-4 text-blue-600">{icon.link}</td>
                                    <td className="px-6 py-4 font-mono text-xs">{icon.icon}</td>
                                    <td className="px-6 py-4 flex gap-2 justify-center">
                                        <Link href={`/admin/social_icon/edit/${icon.id}`} className="p-2 rounded-full hover:bg-gray-200" title="Sửa">
                                            <i className="far fa-edit text-yellow-500" />
                                        </Link>
                                        <button onClick={() => handleDelete(icon.id)} className="p-2 rounded-full hover:bg-gray-200" title="Xóa">
                                            <i className="far fa-trash-alt text-red-500" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {iconRes?.total === 0 && (
                                <tr><td colSpan={6} className="p-8 text-center text-gray-500">Chưa có icon nào.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {iconRes && iconRes.total > iconRes.per_page && (
                    <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
                        <p className="text-sm text-gray-600">Hiển thị {iconRes.from} – {iconRes.to} / {iconRes.total} mục</p>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setPage(page - 1)} disabled={!iconRes.prev_page_url} className="px-3 py-1 border rounded disabled:opacity-50">← Trước</button>
                            <button onClick={() => setPage(page + 1)} disabled={!iconRes.next_page_url} className="px-3 py-1 border rounded disabled:opacity-50">Sau →</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}