'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

// --- Helper Functions ---

// Định dạng số thành tiền tệ VNĐ
const formatCurrency = (value) => {
    if (!value) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

// Lấy thông tin trạng thái đơn hàng (text và màu sắc)
const getOrderStatus = (status) => {
    switch (status) {
        case 0:
            return { text: 'Đã hủy', className: 'bg-red-100 text-red-800' };
        case 1:
            return { text: 'Chờ xử lý', className: 'bg-yellow-100 text-yellow-800' };
        case 2:
            return { text: 'Đang giao hàng', className: 'bg-blue-100 text-blue-800' };
        case 3:
            return { text: 'Đã giao', className: 'bg-green-100 text-green-800' };
        case 4:
            return { text: 'Hoàn trả', className: 'bg-purple-100 text-purple-800' };
        default:
            return { text: 'Không xác định', className: 'bg-gray-100 text-gray-800' };
    }
};


export default function Page() {
    const [page, setPage] = useState(1);
    const [orderRes, setOrderRes] = useState(null);
    const [pagedOrders, setPagedOrders] = useState([]);
    const [state, setState] = useState({ loading: true, error: null });

    const fetchData = async (pageToFetch) => {
        setState({ loading: true, error: null });
        try {
            // Giả sử endpoint để lấy danh sách đơn hàng là /getAdminOrder
            const res = await fetch(`${API_BASE}/getAdminOrder?page=${pageToFetch || 1}`, { cache: 'no-store' });
            if (!res.ok) throw new Error(`Order HTTP ${res.status}`);

            const json = await res.json();
            setOrderRes(json ?? null);
            setPagedOrders(Array.isArray(json.data) ? json.data : []);
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
        if (!confirm('Bạn có chắc chắn muốn xóa đơn hàng này? Thao tác này không thể hoàn tác.')) return;

        try {
            const res = await fetch(`${API_BASE}/order/${id}`, { method: 'DELETE' });
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || 'Xóa thất bại');
            }

            alert('Xóa đơn hàng thành công!');
            if (pagedOrders.length === 1 && page > 1) {
                setPage(page - 1);
            } else {
                fetchData(page);
            }
        } catch (err) {
            alert(err.message);
            console.error(err);
        }
    }

    // UI khi đang tải
    if (state.loading) {
        // Có thể thay thế bằng Skeleton UI chi tiết hơn
        return <div className="p-8 text-center animate-pulse">Đang tải danh sách đơn hàng...</div>;
    }

    // UI khi có lỗi
    if (state.error) {
        return <div className="p-8 text-center text-red-500">Không tải được dữ liệu: {state.error}</div>;
    }

    return (
        <div className="flex flex-col min-w-0 mb-6 break-words bg-white border-0 shadow-xl rounded-2xl">
            <div className="p-6 pb-4 mb-0 border-b border-gray-200 rounded-t-2xl">
                <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
                    <div>
                        <h6 className="text-gray-800 text-xl font-bold">Danh sách Đơn hàng</h6>
                        <nav aria-label="breadcrumb" className="text-sm font-medium text-gray-500">
                            <ol className="flex items-center space-x-1">
                                <li><Link href="/admin" className="hover:underline">Trang chủ</Link></li>
                                <li><span className="mx-1">/</span></li>
                                <li>Đơn hàng</li>
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
                                <th className="px-6 py-3 w-[10%]">Mã ĐH</th>
                                <th className="px-6 py-3 w-[25%]">Khách hàng</th>
                                <th className="px-6 py-3 w-[15%]">Ngày đặt</th>
                                <th className="px-6 py-3 w-[15%] text-right">Tổng tiền</th>
                                <th className="px-6 py-3 w-[15%] text-center">Trạng thái</th>
                                <th className="px-6 py-3 w-[10%] text-center">Chức năng</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {pagedOrders.map((order) => {
                                // Tính tổng tiền cho mỗi đơn hàng
                                const totalAmount = order.order_detail.reduce((sum, item) => sum + parseFloat(item.amount), 0);
                                const statusInfo = getOrderStatus(order.status);
                                return (
                                    <tr className="hover:bg-gray-50" key={order.id}>
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-indigo-600">#{order.id}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-gray-900">{order.name}</p>
                                            <p className="text-xs text-gray-600">{order.phone}</p>
                                            <p className="text-xs text-gray-500 truncate">{order.address}</p>
                                        </td>
                                        <td className="px-6 py-4 text-xs">
                                            {new Date(order.created_at).toLocaleDateString('vi-VN', {
                                                day: '2-digit', month: '2-digit', year: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-right">
                                            {formatCurrency(totalAmount)}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-3 py-1 font-semibold rounded-full text-xs ${statusInfo.className}`}>
                                                {statusInfo.text}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 flex gap-2 justify-center">
                                            <Link href={`/admin/order/show/${order.id}`} className="p-2 rounded-full hover:bg-gray-200" title="Xem chi tiết">
                                                <i className="far fa-eye text-blue-500" />
                                            </Link>
                                            <button onClick={() => handleDelete(order.id)} className="p-2 rounded-full hover:bg-gray-200" title="Xóa">
                                                <i className="far fa-trash-alt text-red-500" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            {orderRes?.total === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-500">Không có đơn hàng nào.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Phân trang */}
                {orderRes && orderRes.total > orderRes.per_page && (
                    <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
                        <p className="text-sm text-gray-600">
                            Hiển thị {orderRes.from} – {orderRes.to} / {orderRes.total}
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage(page - 1)}
                                disabled={!orderRes.prev_page_url}
                                className="px-3 py-1 border rounded disabled:opacity-50"
                            >← Trước</button>
                            <button
                                onClick={() => setPage(page + 1)}
                                disabled={!orderRes.next_page_url}
                                className="px-3 py-1 border rounded disabled:opacity-50"
                            >Sau →</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}