'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

const formatForDB = (dateString) => {
    if (!dateString) return null
    return new Date(dateString).toISOString().slice(0, 19).replace('T', ' ')
}

export default function Page() {
    const router = useRouter()

    const [user, setUser] = useState(null)
    const [state, setState] = useState({ loading: true, submitting: false, error: null })

    const [form, setForm] = useState({
        name: '',
        product_id: '',
        price_sale: '',
        date_begin: '',
        date_end: '',
        status: 1,
    })

    const [allSales, setAllSales] = useState([])

    const [query, setQuery] = useState('')
    const [debouncedQuery, setDebouncedQuery] = useState('')
    const [page, setPage] = useState(1)
    const [pickerLoading, setPickerLoading] = useState(true)
    const [pickerError, setPickerError] = useState(null)
    const [pickerItems, setPickerItems] = useState([])
    const [pickerTotal, setPickerTotal] = useState(0)
    const [pickerLastPage, setPickerLastPage] = useState(1)

    useEffect(() => {
        const userString = localStorage.getItem('user')
        if (userString) {
            try {
                setUser(JSON.parse(userString))
            } catch { }
        }
    }, [router])

    useEffect(() => {
        (async () => {
            try {
                setState(s => ({ ...s, loading: true, error: null }))
                const salesRes = await fetch(`${API_BASE}/product-sale`)
                if (!salesRes.ok) throw new Error('Lỗi tải khuyến mãi')
                const salesJson = await salesRes.json()
                setAllSales(Array.isArray(salesJson) ? salesJson : (Array.isArray(salesJson?.data) ? salesJson.data : []))
            } catch (e) {
                setState(s => ({ ...s, error: e?.message || 'Lỗi tải dữ liệu' }))
            } finally {
                setState(s => ({ ...s, loading: false }))
            }
        })()
    }, [])

    useEffect(() => {
        const t = setTimeout(() => setDebouncedQuery(query.trim()), 350)
        return () => clearTimeout(t)
    }, [query])


    useEffect(() => {
        (async () => {
            try {
                setPickerLoading(true)
                setPickerError(null)
                const res = await fetch(`${API_BASE}/getAdminProduct`)
                if (!res.ok) throw new Error(`Lỗi tải sản phẩm (HTTP ${res.status})`)
                const json = await res.json()

                setPickerItems(Array.isArray(json.data) ? json.data : [])
                setPickerTotal(json.total || 0)
                setPickerLastPage(json.last_page || 1)
            } catch (e) {
                if (e?.name !== 'AbortError') {
                    setPickerError(e?.message || 'Không tải được danh sách sản phẩm')
                }
            } finally {
                setPickerLoading(false)
            }
        })()
    }, [debouncedQuery, page])


    const handleFormChange = (e) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: name === 'status' ? Number(value) : value }))
    }

    const handlePickProduct = (p) => {
        setForm(prev => ({
            ...prev,
            name: `Khuyến mãi cho ${p.name}`.trim(),
            price_buy: `${Intl.NumberFormat('vi-VN').format(p.price_buy)}  ₫`,
            product_id: p.id,
        }))
    }

    const validateTimeOverlap = () => {
        if (!form.name) return 'Vui lòng nhập tên chương trình.'
        if (!form.product_id) return 'Vui lòng chọn sản phẩm.'
        const price = parseFloat(form.price_sale)
        if (isNaN(price) || price <= 0) return 'Giá giảm giá không hợp lệ.'
        if (!form.date_begin || !form.date_end) return 'Vui lòng chọn ngày bắt đầu và kết thúc.'

        const formStartDate = new Date(form.date_begin)
        const formEndDate = new Date(form.date_end)
        if (formEndDate <= formStartDate) return 'Ngày kết thúc phải sau ngày bắt đầu.'

        const related = allSales.filter(s => Number(s.product_id) === Number(form.product_id) && Number(s.status) === 1)
        for (const other of related) {
            const otherStart = new Date(other.date_begin)
            const otherEnd = new Date(other.date_end)
            if (formStartDate < otherEnd && otherStart < formEndDate) {
                return (
                    `Lỗi: Thời gian khuyến mãi bị trùng!\n\n` +
                    `Sản phẩm này đã có CTKM khác (ID: ${other.id} - ${other.name}) ` +
                    `từ ${otherStart.toLocaleString('vi-VN')} đến ${otherEnd.toLocaleString('vi-VN')}.\n\n` +
                    `Vui lòng điều chỉnh lại thời gian.`
                )
            }
        }
        return null
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const err = validateTimeOverlap()
        if (err) return alert(err)

        setState(s => ({ ...s, submitting: true, error: null }))
        try {
            const payload = {
                name: form.name,
                product_id: Number(form.product_id),
                price_sale: parseFloat(form.price_sale),
                date_begin: formatForDB(form.date_begin),
                date_end: formatForDB(form.date_end),
                status: Number(form.status),
                created_at: new Date().toISOString(),
                created_by: user?.id || 0,
            }

            const res = await fetch(`${API_BASE}/product-sale`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}))
                throw new Error(errorData.message || `HTTP ${res.status}`)
            }

            alert('Tạo khuyến mãi mới thành công!')
            router.push('/admin/product_sale')
        } catch (err) {
            setState(s => ({ ...s, error: err?.message || 'Thao tác thất bại' }))
        } finally {
            setState(s => ({ ...s, submitting: false }))
        }
    }

    if (state.loading) return <div className="p-8 text-center animate-pulse">Đang tải dữ liệu...</div>
    if (state.error && !state.submitting) return <div className="p-8 text-center text-red-500">Lỗi: {state.error}</div>

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <aside className="lg:col-span-5 bg-white shadow-xl rounded-2xl border border-gray-100">
                <div className="p-6 border-b border-gray-200 rounded-t-2xl">
                    <h6 className="text-gray-800 text-lg font-semibold">Chọn sản phẩm</h6>
                    <p className="text-sm text-gray-500 mt-1">Tìm kiếm & phân trang (chuẩn trang list sản phẩm)</p>
                    <div className="mt-4 flex gap-3">
                        <input
                            value={query}
                            onChange={(e) => { setQuery(e.target.value); setPage(1) }}
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
                                const name = p.name
                                const price = p.price_buy
                                const active = Number(form.product_id) === p.id
                                return (
                                    <li key={p.id}>
                                        <button
                                            type="button"
                                            onClick={() => handlePickProduct(p)}
                                            className={`w-full text-left rounded-xl border p-3 hover:shadow-md transition ${active ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-200'}`}
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
                                                    <p className="text-sm text-gray-700">
                                                        Giá gốc: {new Intl.NumberFormat('vi-VN').format(price)} ₫
                                                    </p>
                                                </div>
                                            </div>
                                        </button>
                                    </li>
                                )
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

            {/* RIGHT: Form */}
            <section className="lg:col-span-7 flex flex-col min-w-0 mb-6 break-words bg-white border-0 shadow-xl rounded-2xl">
                <div className="p-6 pb-4 mb-0 border-b border-gray-200 rounded-t-2xl">
                    <h6 className="text-gray-800 text-xl font-bold">Thêm Khuyến mãi mới</h6>
                </div>

                <form className="p-6 md:p-8" onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-700">
                            Tên chương trình khuyến mãi <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={form.name}
                            onChange={handleFormChange}
                            required
                            className="w-full h-12 pl-4 pr-4 rounded-lg bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2 text-gray-700">Mã sản phẩm</label>
                            <input
                                type="text"
                                value={form.product_id}
                                disabled
                                className="w-full h-12 pl-4 pr-4 rounded-lg bg-gray-200 border border-gray-300 cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2 text-gray-700">Giá gốc (Tham khảo)</label>
                            <input
                                type="text"
                                value={form.price_buy}
                                disabled
                                className="w-full h-12 pl-4 pr-4 rounded-lg bg-gray-200 border border-gray-300 cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="price_sale" className="block text-sm font-medium mb-2 text-gray-700">
                            Giá giảm giá (VNĐ) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            id="price_sale"
                            name="price_sale"
                            value={form.price_sale}
                            onChange={handleFormChange}
                            required
                            className="w-full h-12 pl-4 pr-4 rounded-lg bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="mb-6">
                            <label htmlFor="date_begin" className="block text-sm font-medium mb-2 text-gray-700">
                                Ngày bắt đầu <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="datetime-local"
                                id="date_begin"
                                name="date_begin"
                                value={form.date_begin}
                                onChange={handleFormChange}
                                required
                                className="w-full h-12 px-4 rounded-lg bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="date_end" className="block text-sm font-medium mb-2 text-gray-700">
                                Ngày kết thúc <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="datetime-local"
                                id="date_end"
                                name="date_end"
                                value={form.date_end}
                                onChange={handleFormChange}
                                required
                                className="w-full h-12 px-4 rounded-lg bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="status" className="block text-sm font-medium mb-2 text-gray-700">Trạng thái</label>
                        <select
                            id="status"
                            name="status"
                            value={form.status}
                            onChange={handleFormChange}
                            className="w-full h-12 px-4 rounded-lg bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value={1}>Kích hoạt</option>
                            <option value={0}>Tạm ẩn</option>
                        </select>
                    </div>

                    {state.error && <p className="text-red-500 text-sm mb-4">Lỗi: {state.error}</p>}

                    <div className="flex justify-end gap-3 border-t border-gray-200 pt-6">
                        <Link
                            href="/admin/product_sale"
                            className="px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium rounded-lg"
                        >
                            Hủy
                        </Link>
                        <button
                            type="submit"
                            disabled={state.submitting}
                            className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {state.submitting ? 'Đang xử lý...' : 'Thêm Khuyến mãi'}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    )
}
