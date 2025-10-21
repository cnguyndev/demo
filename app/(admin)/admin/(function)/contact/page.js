'use client'
import React, { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

export default function Page() {
    const [page, setPage] = useState(1);
    const [contactRes, setContactRes] = useState(null);
    const [pagedContacts, setPagedContacts] = useState([]);
    const [state, setState] = useState({ loading: true, error: null });

    const fetchData = async (pageToFetch) => {
        setState({ loading: true, error: null });
        try {
            const res = await fetch(`${API_BASE}/getAdminContact?page=${pageToFetch || 1}`, { cache: 'no-store' });
            if (!res.ok) throw new Error(`Contact HTTP ${res.status}`);

            const json = await res.json();
            setContactRes(json ?? null);
            setPagedContacts(Array.isArray(json.data) ? json.data : []);
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
        if (!confirm('Bạn có chắc muốn xóa liên hệ này? Nếu đây là một câu hỏi, các câu trả lời liên quan cũng sẽ khó theo dõi.')) return;

        try {
            const res = await fetch(`${API_BASE}/contact/${id}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || 'Xóa thất bại');
            }

            const res1 = await fetch(`${API_BASE}/getReply/${id}`);
            if (res1.ok) {
                const json = await res1.json();
                if (json.id) {
                    const res2 = await fetch(`${API_BASE}/contact/${json.id}`, {
                        method: 'DELETE',
                    });
                    if (!res2.ok) {
                        const errorData = await res2.json().catch(() => ({}));
                        throw new Error(errorData.message || 'Xóa thất bại');
                    }
                }
            }

            alert('Xóa liên hệ thành công!');
            if (pagedContacts.length === 1 && page > 1) {
                setPage(page - 1);
            } else {
                fetchData(page);
            }

        } catch (err) {
            alert(err.message);
            console.error(err);
        }
    }

    if (state.loading) {
        return <div className="p-8 text-center animate-pulse">Đang tải dữ liệu liên hệ...</div>;
    }

    if (state.error) {
        return (
            <div className="p-8 text-center text-red-500">
                Không tải được dữ liệu: {state.error}
            </div>
        );
    }
    return (
        <div className="flex flex-col min-w-0 mb-6 break-words bg-white border-0 shadow-xl rounded-2xl">
            <div className="p-6 pb-4 mb-0 border-b border-gray-200 rounded-t-2xl">
                <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
                    <div>
                        <h6 className="text-gray-800 text-xl font-bold">Hộp thư Liên hệ</h6>
                        <nav aria-label="breadcrumb" className="text-sm font-medium text-gray-500">
                            <ol className="flex items-center space-x-1">
                                <li><Link href="/admin" className="hover:underline">Trang chủ</Link></li>
                                <li><span className="mx-1">/</span></li>
                                <li>Liên hệ</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>

            <div className="flex-auto p-4">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm align-top text-slate-600">
                        <thead className="align-bottom">
                            <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b border-gray-200">
                                <th className="px-6 py-3 w-[5%]">ID</th>
                                <th className="px-6 py-3 w-[25%]">Người gửi</th>
                                <th className="px-6 py-3 w-[35%]">Nội dung</th>
                                <th className="px-6 py-3 w-[15%]">Ngày gửi</th>
                                <th className="px-6 py-3 w-[10%]">Trạng thái</th>
                                <th className="px-6 py-3 w-[10%]">Chức năng</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {pagedContacts.map((contact) => (
                                <tr className="hover:bg-gray-50" key={contact.id}>
                                    <td className="px-6 py-4 font-bold text-gray-900">{contact.id}</td>
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-gray-900">{contact.name}</p>
                                        <p className="text-xs text-gray-600">{contact.email}</p>
                                        <p className="text-xs text-gray-600">{contact.phone}</p>
                                    </td>
                                    <td className="px-6 py-4 text-gray-700">
                                        <p className="line-clamp-3">{contact.content}</p>
                                    </td>
                                    <td className="px-6 py-4 text-xs">
                                        {new Date(contact.created_at).toLocaleString('vi-VN', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </td>
                                    <td className="px-6 py-4">
                                        {contact.status === 1 ? (
                                            <span className="px-3 py-1 font-semibold rounded-full text-xs bg-yellow-100 text-yellow-800">
                                                Chờ trả lời
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 font-semibold rounded-full text-xs bg-green-100 text-green-800">
                                                Đã trả lời
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 flex gap-2 items-center">
                                        <Link href={`/admin/contact/show/${contact.id}`} className="p-2 rounded-full hover:bg-gray-200" title="Xem và Trả lời">
                                            <i className="fas fa-reply text-blue-500" />
                                        </Link>
                                        <button onClick={() => handleDelete(contact.id)} className="p-2 rounded-full hover:bg-gray-200" title="Xóa">
                                            <i className="far fa-trash-alt text-red-500" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {contactRes?.total === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-500">Không có liên hệ nào.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {contactRes && contactRes.total > contactRes.per_page && (
                    <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
                        <p className="text-sm text-gray-600">
                            Hiển thị {contactRes.from} – {contactRes.to} / {contactRes.total}
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage(page - 1)}
                                disabled={!contactRes.prev_page_url}
                                className="px-3 py-1 border rounded disabled:opacity-50"
                            >
                                ← Trước
                            </button>
                            <button
                                onClick={() => setPage(page + 1)}
                                disabled={!contactRes.next_page_url}
                                className="px-3 py-1 border rounded disabled:opacity-50"
                            >
                                Sau →
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}