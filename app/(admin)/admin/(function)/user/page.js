'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

// --- Helper Functions ---
const getUserStatus = (status) => {
    return status === 1
        ? { text: 'Hoạt động', className: 'bg-green-100 text-green-800' }
        : { text: 'Bị khóa', className: 'bg-red-100 text-red-800' };
};

const getUserRole = (role) => {
    return role === 'admin'
        ? { text: 'Admin', className: 'bg-purple-100 text-purple-800' }
        : { text: 'Customer', className: 'bg-blue-100 text-blue-800' };
};

export default function Page() {
    // State để quản lý trang hiện tại cho phân trang
    const [page, setPage] = useState(1);

    const [userRes, setUserRes] = useState(null);
    const [pagedUsers, setPagedUsers] = useState([]);
    const [state, setState] = useState({ loading: true, error: null });

    // Hàm tải dữ liệu, nhận vào số trang cần tải
    const fetchData = async (pageToFetch) => {
        setState({ loading: true, error: null });
        try {
            const res = await fetch(`${API_BASE}/getAdminUser?page=${pageToFetch || 1}`, { cache: 'no-store' });
            if (!res.ok) throw new Error(`User HTTP ${res.status}`);
            const json = await res.json();
            setUserRes(json ?? null);
            setPagedUsers(Array.isArray(json.data) ? json.data : []);
        } catch (e) {
            setState({ loading: false, error: e.message || 'Fetch error' });
        } finally {
            setState({ loading: false });
        }
    };

    // useEffect sẽ chạy lại mỗi khi state 'page' thay đổi, để tải dữ liệu trang mới
    useEffect(() => {
        fetchData(page);
    }, [page]);

    const handleDelete = async (user) => {
        if (!confirm(`Bạn có chắc chắn muốn xóa người dùng "${user.name}"?`)) return;
        try {
            if (user.avatar) {
                fetch('/api/upload', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ imagePath: user.avatar }),
                }).catch(err => console.error(`Lỗi khi xóa avatar:`, err));
            }
            const res = await fetch(`${API_BASE}/user/${user.id}`, { method: 'DELETE' });
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || 'Xóa thất bại');
            }
            alert('Xóa người dùng thành công!');
            // Nếu xóa item cuối cùng của trang, lùi về trang trước
            if (pagedUsers.length === 1 && page > 1) {
                setPage(page - 1);
            } else {
                fetchData(page);
            }
        } catch (err) {
            alert(err.message);
            console.error(err);
        }
    }

    if (state.loading) return <div className="p-8 text-center animate-pulse">Đang tải danh sách người dùng...</div>;
    if (state.error) return <div className="p-8 text-center text-red-500">Không tải được dữ liệu: {state.error}</div>;

    return (
        <div className="flex flex-col min-w-0 mb-6 break-words bg-white border-0 shadow-xl rounded-2xl">
            <div className="p-6 pb-4 mb-0 border-b border-gray-200 rounded-t-2xl">
                <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
                    <div><h6 className="text-gray-800 text-xl font-bold">Quản lý Người dùng</h6></div>
                    <div>
                        <Link href="/admin/user/create" className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-md">
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
                                <th className="px-6 py-3 w-[25%]">Người dùng</th>
                                <th className="px-6 py-3 w-[25%]">Thông tin liên hệ</th>
                                <th className="px-6 py-3 w-[15%]">Username</th>
                                <th className="px-6 py-3 w-[15%] text-center">Vai trò</th>
                                <th className="px-6 py-3 w-[10%] text-center">Trạng thái</th>
                                <th className="px-6 py-3 w-[10%] text-center">Chức năng</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {pagedUsers.map((user) => {
                                const statusInfo = getUserStatus(user.status);
                                const roleInfo = getUserRole(user.role);
                                return (
                                    <tr className="hover:bg-gray-50" key={user.id}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                {user.avatar ? (
                                                    <Image src={user.avatar} alt={user.name} width={40} height={40} className="h-10 w-10 rounded-full object-cover" unoptimized />
                                                ) : (
                                                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                        <i className="fas fa-user text-gray-500"></i>
                                                    </div>
                                                )}
                                                <p className="font-semibold text-gray-800">{user.name}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-xs">
                                            <p className="text-gray-800">{user.email}</p>
                                            <p className="text-gray-500">{user.phone}</p>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-xs">{user.username}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-3 py-1 font-semibold rounded-full text-xs ${roleInfo.className}`}>{roleInfo.text}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-3 py-1 font-semibold rounded-full text-xs ${statusInfo.className}`}>{statusInfo.text}</span>
                                        </td>
                                        <td className="px-6 py-4 flex gap-2 justify-center">
                                            <Link href={`/admin/user/show/${user.id}`} className="p-2 rounded-full hover:bg-gray-200" title="Xem chi tiết"><i className="far fa-eye text-blue-500" /></Link>
                                            <Link href={`/admin/user/edit/${user.id}`} className="p-2 rounded-full hover:bg-gray-200" title="Sửa"><i className="far fa-edit text-yellow-500" /></Link>
                                            <button onClick={() => handleDelete(user)} className="p-2 rounded-full hover:bg-gray-200" title="Xóa"><i className="far fa-trash-alt text-red-500" /></button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* --- PHẦN PHÂN TRANG --- */}
                {userRes && userRes.total > userRes.per_page && (
                    <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
                        <p className="text-sm text-gray-600">
                            Hiển thị {userRes.from} – {userRes.to} trên tổng số {userRes.total} người dùng
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage(page - 1)}
                                disabled={!userRes.prev_page_url}
                                className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label="Trang trước"
                            >
                                ← Trước
                            </button>

                            <button
                                onClick={() => setPage(page + 1)}
                                disabled={!userRes.next_page_url}
                                className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label="Trang sau"
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