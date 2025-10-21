'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

const formatCurrency = (value) => {
    const number = parseFloat(value);
    if (isNaN(number)) return 'Chưa có';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
};

export default function Page() {
    const router = useRouter();

    const [user, setUser] = useState(null);

    // ===== Left panel: picker (search + pagination via getAdminProduct) =====
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [page, setPage] = useState(1);
    const [pickerLoading, setPickerLoading] = useState(true);
    const [pickerError, setPickerError] = useState(null);
    const [pickerItems, setPickerItems] = useState([]);
    const [pickerTotal, setPickerTotal] = useState(0);
    const [pickerLastPage, setPickerLastPage] = useState(1);

    const [state, setState] = useState({ loading: true, submitting: false, error: null });
    const [allProducts, setAllProducts] = useState([]);
    const [form, setForm] = useState({
        product_id: '',
        qty: '',
        price_root: '',
    });

    useEffect(() => {
        const userString = localStorage.getItem('user');
        if (userString) {
            const userData = JSON.parse(userString);
            setUser(userData);
        }
    }, [router]);

    // Debounce search
    useEffect(() => {
        const t = setTimeout(() => setDebouncedQuery(query.trim()), 350);
        return () => clearTimeout(t);
    }, [query]);

    useEffect(() => {
        (async () => {
            try {
                setState(s => ({ ...s, loading: true }));
                const resAll = await fetch(`${API_BASE}/getAllProduct`, { cache: 'no-store' });
                const jsonAll = resAll.ok ? await resAll.json() : [];
                setAllProducts(Array.isArray(jsonAll?.data) ? jsonAll.data : (Array.isArray(jsonAll) ? jsonAll : []));
            } catch (e) {
            } finally {
                setState(s => ({ ...s, loading: false }));
            }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            try {
                setPickerLoading(true);
                setPickerError(null);
                const qs = new URLSearchParams();
                qs.set('page', String(page));
                if (debouncedQuery) qs.set('search', debouncedQuery);

                const res = await fetch(`${API_BASE}/getAdminProduct?${qs.toString()}`, { cache: 'no-store' });
                if (!res.ok) throw new Error(`Lỗi tải sản phẩm (HTTP ${res.status})`);
                const json = await res.json();

                const items = Array.isArray(json?.data) ? json.data : [];
                setPickerItems(items);
                setPickerTotal(json?.total || items.length || 0);
                setPickerLastPage(json?.last_page || 1);
            } catch (e) {
                setPickerError(e?.message || 'Không tải được danh sách sản phẩm');
            } finally {
                setPickerLoading(false);
            }
        })();
    }, [debouncedQuery, page]);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handlePickProduct = (p) => {
        setForm(prev => ({ ...prev, product_id: String(p.id) }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.product_id || !form.qty) {
            return alert("Vui lòng chọn sản phẩm và nhập số lượng.");
        }
        if (parseInt(form.qty) <= 0) {
            return alert("Số lượng nhập phải lớn hơn 0.");
        }

        setState(s => ({ ...s, submitting: true, error: null }));
        try {
            const payload = {
                product_id: Number(form.product_id),
                qty: parseInt(form.qty),
                price_root: parseInt(form.price_root),
                status: 1,
                created_by: user?.id || 0,
            };

            const res = await fetch(`${API_BASE}/product-store`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || "Tạo phiếu nhập thất bại.");
            }

            alert('Nhập hàng thành công!');
            router.push('/admin/product_store');
        } catch (err) {
            console.error(err);
            setState(s => ({ ...s, submitting: false, error: err.message }));
        }
    };

    if (state.loading) return <div className="p-8 text-center animate-pulse">Đang tải...</div>;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <aside className="lg:col-span-6 bg-white shadow-xl rounded-2xl border border-gray-100">
                <div className="p-6 border-b border-gray-200 rounded-t-2xl">
                    <h6 className="text-gray-800 text-lg font-semibold">Chọn sản phẩm</h6>
                    <p className="text-sm text-gray-500 mt-1">Tìm kiếm & phân trang</p>
                    <div className="mt-4 flex gap-3">
                        <input
                            value={query}
                            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                            placeholder="Tìm theo tên sản phẩm…"
                            className="flex-1 h-11 px-4 rounded-lg bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                <div className="p-4">
                    {pickerLoading ? (
                        <div className="p-6 text-center animate-pulse">Đang tải sản phẩm...</div>
                    ) : pickerError ? (
                        <div className="p-6 text-center text-red-500">{pickerError}</div>
                    ) : pickerItems.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">Không có sản phẩm phù hợp</div>
                    ) : (
                        <ul className="grid sm:grid-cols-2 gap-3">
                            {pickerItems.map((p) => {
                                const name = p.name || p.product_name || `#${p.id}`;
                                const active = Number(form.product_id) === p.id;
                                return (
                                    <li key={p.id}>
                                        <button
                                            type="button"
                                            onClick={() => handlePickProduct(p)}
                                            className={`w-full text-left rounded-xl border p-3 hover:shadow-md transition ${active ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-200'}`}
                                            title="Chọn sản phẩm"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                                                    {p.thumbnail ? (
                                                        <img src={p.thumbnail} alt={name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="text-xs text-gray-500">No img</span>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-medium text-gray-800 truncate">{name}</p>
                                                    <p className="text-xs text-gray-500">ID: {p.id}</p>
                                                    <p className="text-xs text-gray-500">Tồn kho: {p.qty_store - p.qty_sold}</p>
                                                </div>
                                            </div>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}

                    <div className="mt-4 flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                            Tổng: {pickerTotal} • Trang {page}/{pickerLastPage}
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page <= 1 || pickerLoading}
                                className="px-3 py-2 text-sm rounded-lg bg-gray-100 disabled:opacity-50"
                            >
                                Trước
                            </button>
                            <button
                                type="button"
                                onClick={() => setPage(p => Math.min(pickerLastPage, p + 1))}
                                disabled={page >= pickerLastPage || pickerLoading}
                                className="px-3 py-2 text-sm rounded-lg bg-gray-100 disabled:opacity-50"
                            >
                                Sau
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            <section className="lg:col-span-6 bg-white p-6 md:p-8 shadow-sm rounded-lg border">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Tạo Phiếu Nhập Kho</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mã sản phẩm</label>
                        <input
                            type="text"
                            value={form.product_id}
                            disabled
                            className="w-full h-12 px-4 rounded-lg bg-gray-200 border border-gray-300 cursor-not-allowed"
                        />
                        <p className="text-xs text-gray-500 mt-1">* Chọn sản phẩm ở panel bên trái.</p>
                    </div>

                    <div>
                        <label htmlFor="qty" className="block text-sm font-medium text-gray-700 mb-1">
                            Giá nhập <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            id="price_root"
                            name="price_root"
                            placeholder="Nhập giá nhập..."
                            value={form.price_root}
                            onChange={handleFormChange}
                            required
                            className="w-full h-12 px-4 rounded-lg bg-gray-50 border border-gray-300"
                        />
                    </div>

                    <div>
                        <label htmlFor="qty" className="block text-sm font-medium text-gray-700 mb-1">
                            Số lượng nhập mới <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            id="qty"
                            name="qty"
                            placeholder="Nhập số lượng..."
                            value={form.qty}
                            onChange={handleFormChange}
                            required
                            className="w-full h-12 px-4 rounded-lg bg-gray-50 border border-gray-300"
                        />
                    </div>

                    {state.error && <p className="text-red-500 text-sm text-center">Lỗi: {state.error}</p>}

                    <div className="flex justify-end gap-3 border-t pt-6">
                        <Link href="/admin/product_store" className="px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium rounded-lg">
                            Hủy
                        </Link>
                        <button
                            type="submit"
                            disabled={state.submitting}
                            className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {state.submitting ? 'Đang xử lý...' : 'Xác nhận nhập hàng'}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}
