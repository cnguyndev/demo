'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

const formatCurrency = (value) => {
    const number = parseFloat(value);
    if (isNaN(number)) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
};

const formatDateTime = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
};

const getSaleStatus = (sale) => {
    if (sale.status === 0) {
        return { text: 'Tạm ẩn', className: 'bg-gray-100 text-gray-800' };
    }
    const now = new Date();
    const startDate = new Date(sale.date_begin);
    const endDate = new Date(sale.date_end);

    if (now < startDate) {
        return { text: 'Sắp diễn ra', className: 'bg-blue-100 text-blue-800' };
    } else if (now > endDate) {
        return { text: 'Đã kết thúc', className: 'bg-red-100 text-red-800' };
    } else {
        return { text: 'Đang diễn ra', className: 'bg-green-100 text-green-800' };
    }
};

export default function Page() {
    const [page, setPage] = useState(1);
    const [saleRes, setSaleRes] = useState(null);
    const [pagedSales, setPagedSales] = useState([]);
    const [state, setState] = useState({ loading: true, error: null });

    const fetchData = async (pageToFetch) => {
        setState({ loading: true, error: null });
        try {
            const res = await fetch(`${API_BASE}/getAdminProductSale?page=${pageToFetch || 1}`, { cache: 'no-store' });
            if (!res.ok) throw new Error(`ProductSale HTTP ${res.status}`);
            const json = await res.json();
            setSaleRes(json ?? null);
            setPagedSales(Array.isArray(json.data) ? json.data : []);
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
        if (!confirm('Bạn có chắc chắn muốn xóa chương trình giảm giá này?')) return;

        try {
            const res = await fetch(`${API_BASE}/product-sale/${id}`, { method: 'DELETE' });
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || 'Xóa thất bại');
            }
            alert('Xóa khuyến mãi thành công!');
            if (pagedSales.length === 1 && page > 1) {
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
        return <div className="p-8 text-center animate-pulse">Đang tải danh sách khuyến mãi...</div>;
    }

    if (state.error) {
        return <div className="p-8 text-center text-red-500">Không tải được dữ liệu: {state.error}</div>;
    }

    return (
        <div className="flex flex-col min-w-0 mb-6 break-words bg-white border-0 shadow-xl rounded-2xl">
            <div className="p-6 pb-4 mb-0 border-b border-gray-200 rounded-t-2xl">
                <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
                    <div>
                        <h6 className="text-gray-800 text-xl font-bold">Quản lý Khuyến mãi</h6>
                        <nav aria-label="breadcrumb" className="text-sm font-medium text-gray-500">
                            <ol className="flex items-center space-x-1">
                                <li><Link href="/admin" className="hover:underline">Trang chủ</Link></li>
                                <li><span className="mx-1">/</span></li>
                                <li>Khuyến mãi</li>
                            </ol>
                        </nav>
                    </div>
                    <div className="flex space-x-3 items-center">
                        <Link href="/admin/product_sale/create" className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-md hover:-translate-y-0.5 transition-transform">
                            <i className="fas fa-plus mr-2 text-base"></i> Thêm mới
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
                                <th className="px-6 py-3 w-[25%]">Sản phẩm</th>
                                <th className="px-6 py-3 w-[15%]">Giá gốc</th>
                                <th className="px-6 py-3 w-[15%]">Giá giảm giá</th>
                                <th className="px-6 py-3 w-[20%]">Thời gian áp dụng</th>
                                <th className="px-6 py-3 w-[10%] text-center">Trạng thái</th>
                                <th className="px-6 py-3 w-[10%] text-center">Chức năng</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {pagedSales.map((sale) => {
                                const statusInfo = getSaleStatus(sale);
                                const originalPrice = parseFloat(sale.product.price_buy);
                                const salePrice = parseFloat(sale.price_sale);
                                const discountPercent = originalPrice > 0 ? Math.round(((originalPrice - salePrice) / originalPrice) * 100) : 0;

                                return (
                                    <tr className="hover:bg-gray-50" key={sale.id}>
                                        <td className="px-6 py-4 font-bold text-gray-900">{sale.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <Image src={sale.product.thumbnail} alt={sale.product.name} width={56} height={56} className="h-14 w-14 rounded-md object-cover mr-4" unoptimized />
                                                <div>
                                                    <p className="font-semibold text-gray-800">{sale.product.name}</p>
                                                    <p className="text-xs text-gray-500">ID Sản phẩm: {sale.product_id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 line-through">{formatCurrency(originalPrice)}</td>
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-red-600">{formatCurrency(salePrice)}</p>
                                            {discountPercent > 0 && (
                                                <span className="text-xs font-bold text-green-600"> (Giảm {discountPercent}%)</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-xs">
                                            <p>BĐ: {formatDateTime(sale.date_begin)}</p>
                                            <p>KT: {formatDateTime(sale.date_end)}</p>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-3 py-1 font-semibold rounded-full text-xs ${statusInfo.className}`}>
                                                {statusInfo.text}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 flex gap-2 justify-center">
                                            <Link href={`/admin/product_sale/edit/${sale.id}`} className="p-2 rounded-full hover:bg-gray-200" title="Sửa">
                                                <i className="far fa-edit text-yellow-500" />
                                            </Link>
                                            <button onClick={() => handleDelete(sale.id)} className="p-2 rounded-full hover:bg-gray-200" title="Xóa">
                                                <i className="far fa-trash-alt text-red-500" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            {saleRes?.total === 0 && (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-gray-500">Chưa có chương trình khuyến mãi nào.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Phân trang */}
                {saleRes && saleRes.total > saleRes.per_page && (
                    <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
                        <p className="text-sm text-gray-600">
                            Hiển thị {saleRes.from} – {saleRes.to} / {saleRes.total}
                        </p>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setPage(page - 1)} disabled={!saleRes.prev_page_url} className="px-3 py-1 border rounded disabled:opacity-50">← Trước</button>
                            <button onClick={() => setPage(page + 1)} disabled={!saleRes.next_page_url} className="px-3 py-1 border rounded disabled:opacity-50">Sau →</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}