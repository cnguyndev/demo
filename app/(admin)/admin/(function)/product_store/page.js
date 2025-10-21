'use client'
import React, { useEffect, useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

// --- Helper Functions ---
const formatCurrency = (value) => {
    const number = parseFloat(value);
    if (isNaN(number)) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
};

export default function Page() {
    const [page, setPage] = useState(1);
    const [storeRes, setStoreRes] = useState(null);
    const [pagedStoreEntries, setPagedStoreEntries] = useState([]);
    const [state, setState] = useState({ loading: true, error: null });

    const fetchData = async (pageToFetch) => {
        setState({ loading: true, error: null });
        try {
            const res = await fetch(`${API_BASE}/getAdminProductStore?page=${pageToFetch || 1}`, { cache: 'no-store' });
            if (!res.ok) throw new Error(`ProductStore HTTP ${res.status}`);
            const json = await res.json();
            setStoreRes(json ?? null);
            setPagedStoreEntries(Array.isArray(json.data) ? json.data : []);
        } catch (e) {
            setState({ loading: false, error: e.message || 'Fetch error' });
        } finally {
            setState({ loading: false });
        }
    };

    useEffect(() => {
        fetchData(page);
    }, [page]);


    // *** NEW: Xử lý xóa toàn bộ sản phẩm và dữ liệu liên quan ***
    const handleDelete = async (productId) => {
        if (!confirm(`Bạn có chắc chắn muốn xóa vĩnh viễn sản phẩm ID: ${productId} và TOÀN BỘ dữ liệu liên quan (ảnh, thuộc tính, kho...)? Thao tác này không thể hoàn tác.`)) return;

        try {
            // Bước 1: Lấy thông tin chi tiết sản phẩm để thu thập đường dẫn tất cả các ảnh
            const productRes = await fetch(`${API_BASE}/product/${productId}`);
            if (!productRes.ok) throw new Error("Không tìm thấy sản phẩm để thu thập thông tin ảnh.");
            const productData = await productRes.json();

            const imagesToDelete = [];
            if (productData.thumbnail) imagesToDelete.push(productData.thumbnail);
            if (Array.isArray(productData.product_image)) {
                productData.product_image.forEach(img => imagesToDelete.push(img.image));
            }

            // Bước 2: Xóa các file ảnh trên server
            if (imagesToDelete.length > 0) {
                imagesToDelete.forEach(imagePath => {
                    fetch('/api/upload', {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ imagePath }),
                    }).catch(err => console.error(`Lỗi khi xóa ảnh ${imagePath}:`, err));
                });
            }

            // Bước 3: Gọi API để xóa sản phẩm (backend sẽ xử lý xóa các record liên quan trong DB)
            const deleteRes = await fetch(`${API_BASE}/product/${productId}`, { method: 'DELETE' });
            if (!deleteRes.ok) {
                const errorData = await deleteRes.json().catch(() => ({}));
                throw new Error(errorData.message || 'Xóa sản phẩm thất bại.');
            }

            alert(`Xóa thành công sản phẩm ID: ${productId}`);
            fetchData(page); // Tải lại dữ liệu trang hiện tại

        } catch (err) {
            alert(`Đã có lỗi xảy ra: ${err.message}`);
            console.error(err);
        }
    };


    if (state.loading) return <div className="p-8 text-center animate-pulse">Đang tải dữ liệu kho...</div>;
    if (state.error) return <div className="p-8 text-center text-red-500">Không tải được dữ liệu: {state.error}</div>;

    return (
        <div className="flex flex-col min-w-0 mb-6 break-words bg-white border-0 shadow-xl rounded-2xl">
            <div className="p-6 pb-4 mb-0 border-b border-gray-200 rounded-t-2xl">
                <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
                    <div>
                        <h6 className="text-gray-800 text-xl font-bold">Quản lý Kho hàng</h6>
                    </div>
                    <div>
                        <Link href="/admin/product_store/create" className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-md">
                            <i className="fas fa-plus mr-2"></i> Nhập hàng mới
                        </Link>
                    </div>
                </div>
            </div>

            <div className="flex-auto p-4">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm align-top text-slate-600">
                        <thead className="align-bottom">
                            <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b border-gray-200">
                                <th className="px-6 py-3 w-[10%]">ID Sản phẩm</th>
                                <th className="px-6 py-3 w-[40%]">Sản phẩm</th>
                                <th className="px-6 py-3 w-[20%]">Giá bán</th>
                                <th className="px-6 py-3 w-[10%] text-center">Tổng đã nhập</th>
                                <th className="px-6 py-3 w-[10%] text-center">Tổng đã bán</th>
                                <th className="px-6 py-3 w-[10%] text-center">Chức năng</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {storeRes.data.map((product) => (
                                <tr className="hover:bg-gray-50" key={product.product_id}>
                                    <td className="px-6 py-4 font-bold text-gray-900">{product.product_id}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <Image
                                                src={product?.product?.thumbnail || '/placeholder.jpg'}
                                                alt="Image"
                                                width={64}
                                                height={64}
                                                className="h-16 w-16 rounded-md object-cover mr-4" unoptimized />
                                            <p className="font-semibold text-gray-800">{product?.product?.name}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-gray-700">{formatCurrency(product?.product?.price_buy)}</td>
                                    <td className="px-6 py-4 font-bold text-center text-blue-600 text-lg">{product.qty_store}</td>
                                    <td className="px-6 py-4 font-bold text-center text-blue-600 text-lg">{product.qty_sold || 0}</td>
                                    <td className="px-6 py-4 text-center">
                                        {/* Nút xóa đã được thêm vào */}
                                        <button onClick={() => handleDelete(product.id)} className="p-2 rounded-full hover:bg-gray-200" title="Xóa vĩnh viễn sản phẩm">
                                            <i className="far fa-trash-alt text-red-500" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {storeRes?.total === 0 && (
                                <tr><td colSpan={5} className="p-8 text-center text-gray-500">Chưa có dữ liệu nhập kho.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {storeRes && storeRes.total > storeRes.per_page && (
                    <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
                        <p className="text-sm text-gray-600">Hiển thị {storeRes.from} – {storeRes.to} / {storeRes.total} dòng dữ liệu</p>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setPage(page - 1)} disabled={!storeRes.prev_page_url} className="px-3 py-1 border rounded disabled:opacity-50">← Trước</button>
                            <button onClick={() => setPage(page + 1)} disabled={!storeRes.next_page_url} className="px-3 py-1 border rounded disabled:opacity-50">Sau →</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}