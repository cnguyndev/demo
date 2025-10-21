'use client'
import React, { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

const formatCurrency = (value) => {
    const number = parseFloat(value)
    if (isNaN(number)) return '0 ₫'
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number)
}

const getProductStatus = (status) => {
    switch (status) {
        case 1: return { text: 'Đang bán', className: 'bg-green-100 text-green-800' }
        case 0: return { text: 'Ngừng bán', className: 'bg-red-100 text-red-800' }
        default: return { text: 'Lưu nháp', className: 'bg-yellow-100 text-yellow-800' }
    }
}



const buildPageList = (current, last, windowSize = 2) => {
    if (!last || last <= 1) return [1]
    const pages = []
    const add = (p) => pages.push(p)

    const start = Math.max(2, current - windowSize)
    const end = Math.min(last - 1, current + windowSize)

    add(1)
    if (start > 2) add('…')
    for (let i = start; i <= end; i++) add(i)
    if (end < last - 1) add('…')
    if (last > 1) add(last)
    return pages
}

export default function Page() {
    const [page, setPage] = useState(1)
    const [productRes, setProductRes] = useState(null)
    const [pagedProducts, setPagedProducts] = useState([])
    const [state, setState] = useState({ loading: true, error: null })

    const [filters, setFilters] = useState({ search: '', category_id: '' })
    const [categories, setCategories] = useState([])


    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`${API_BASE}/category`, { cache: 'no-store' })
                if (!res.ok) throw new Error(`HTTP ${res.status}`)
                const json = await res.json()
                setCategories(Array.isArray(json) ? json : [])
            } catch {
                setCategories([])
            }
        }
        fetchCategories()
    }, [])

    const fetchData = async (pageToFetch = 1, nextFilters = filters) => {
        setState({ loading: true, error: null })
        try {
            const qs = new URLSearchParams()
            qs.set('page', String(pageToFetch))
            if (nextFilters.search?.trim()) qs.set('search', nextFilters.search.trim())
            if (nextFilters.category_id) qs.set('category_id', String(nextFilters.category_id))

            const res = await fetch(`${API_BASE}/getAdminProduct?${qs.toString()}`, { cache: 'no-store' })
            if (!res.ok) throw new Error(`Product HTTP ${res.status}`)

            const json = await res.json()
            setProductRes(json ?? null)
            setPagedProducts(Array.isArray(json?.data) ? json.data : [])
        } catch (e) {
            setState({ loading: false, error: e.message || 'Fetch error' })
            return
        } finally {
            setState((s) => ({ ...s, loading: false }))
        }
    }

    useEffect(() => {
        fetchData(page, filters)
    }, [page])

    const handleFilterSubmit = (e) => {
        e.preventDefault()
        setPage(1)
        fetchData(1, filters)
    }

    const pageNumbers = useMemo(() => {
        const current = productRes?.current_page ?? page
        const last = productRes?.last_page ?? 1
        return buildPageList(current, last, 2)
    }, [productRes, page])

    const handleDelete = async (id) => {
        if (!confirm('Bạn có chắc muốn xóa sản phẩm này? Ảnh và mọi dữ liệu liên quan sẽ bị xóa.')) return
        try {
            const productRes = await fetch(`${API_BASE}/product/${id}`, { cache: 'no-store' })
            if (!productRes.ok) throw new Error('Không lấy được thông tin sản phẩm.')
            const productJson = await productRes.json()
            const p = productJson?.data || productJson

            const filepaths = []
            if (p?.thumbnail) filepaths.push(p.thumbnail)
            if (Array.isArray(p?.product_image)) {
                for (const img of p.product_image) {
                    if (img?.image) filepaths.push(img.image)
                }
            }

            if (filepaths.length) {
                await Promise.all(
                    filepaths.map((fp) =>
                        fetch('/api/upload', {
                            method: 'DELETE',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ filepath: fp }),
                        }).catch((err) => console.warn('Lỗi xoá file:', fp, err))
                    )
                )
            }

            const del = await fetch(`${API_BASE}/product/${id}`, { method: 'DELETE' })
            if (!del.ok) {
                const err = await del.json().catch(() => ({}))
                throw new Error(err?.message || err?.error || 'Xoá sản phẩm thất bại.')
            }
            const json = await del.json()
            alert(`${json.message}`);

            if (pagedProducts.length === 1 && (productRes?.current_page || page) > 1) {
                setPage((productRes?.current_page || page) - 1)
            } else {
                fetchData(productRes?.current_page || page, filters)
            }
        } catch (e) {
            console.error(e)
            alert(e.message || 'Đã xảy ra lỗi khi xoá.')
        }
    }

    if (state.loading) return <div className="p-8 text-center animate-pulse">Đang tải danh sách sản phẩm...</div>
    if (state.error) return <div className="p-8 text-center text-red-500">Không tải được dữ liệu: {state.error}</div>

    return (
        <div className="flex flex-col min-w-0 mb-6 break-words bg-white border-0 shadow-xl rounded-2xl">
            <div className="p-6 pb-4 mb-0 border-b border-gray-200 rounded-t-2xl">
                <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
                    <h6 className="text-gray-800 text-xl font-bold">Danh sách Sản phẩm</h6>
                    <Link
                        href="/admin/product/create"
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-md hover:-translate-y-0.5 transition-transform"
                    >
                        <i className="fas fa-plus mr-2 text-base"></i> Thêm sản phẩm
                    </Link>
                </div>

                <form className="flex flex-wrap items-end gap-4" onSubmit={handleFilterSubmit}>
                    <div className="flex-1 min-w-[220px]">
                        <label className="block text-sm font-medium mb-1">Tìm kiếm</label>
                        <input
                            value={filters.search}
                            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
                            placeholder="Nhập tên sản phẩm"
                            className="w-full h-12 px-4 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="min-w-[220px]">
                        <label className="block text-sm font-medium mb-1">Danh mục</label>
                        <select
                            value={filters.category_id}
                            onChange={(e) => setFilters((f) => ({ ...f, category_id: e.target.value }))}
                            className="w-full h-12 px-4 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">— Tất cả —</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="h-12 px-5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow"
                    >
                        Áp dụng
                    </button>

                    {(filters.search || filters.category_id) && (
                        <button
                            type="button"
                            onClick={() => {
                                const cleared = { search: '', category_id: '' }
                                setFilters(cleared)
                                setPage(1)
                                fetchData(1, cleared)
                            }}
                            className="h-12 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 font-medium"
                        >
                            Xóa lọc
                        </button>
                    )}
                </form>
            </div>

            <div className="flex-auto p-4">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm align-top text-slate-600">
                        <thead className="align-bottom">
                            <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b border-gray-200">
                                <th className="px-6 py-3 w-[5%]">ID</th>
                                <th className="px-6 py-3 w-[30%]">Sản phẩm</th>
                                <th className="px-6 py-3 w-[15%]">Danh mục</th>
                                <th className="px-6 py-3 w-[15%]">Giá bán</th>
                                <th className="px-6 py-3 w-[10%] text-center">Tồn kho</th>
                                <th className="px-6 py-3 w-[15%] text-center">Trạng thái</th>
                                <th className="px-6 py-3 w-[10%] text-center">Chức năng</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {pagedProducts.map((product) => {
                                const statusInfo = getProductStatus(product.status)
                                const qtyStore = parseInt(product.qty_store, 10) || 0
                                const qtySold = parseInt(product.qty_sold, 10) || 0
                                const stockQty = qtyStore - qtySold

                                return (
                                    <tr className="hover:bg-gray-50" key={product.id}>
                                        <td className="px-6 py-4 font-bold text-gray-900">{product.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <Image
                                                    src={product.thumbnail}
                                                    alt={product.name}
                                                    width={64}
                                                    height={64}
                                                    className="h-16 w-16 rounded-md object-cover mr-4"
                                                    unoptimized
                                                />
                                                <p className="font-semibold text-gray-800 line-clamp-2">{product.name}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">{product?.category?.name || 'N/A'}</td>
                                        <td className="px-6 py-4 font-semibold text-gray-700">{formatCurrency(product.price_buy)}</td>
                                        <td className={`px-6 py-4 font-bold text-center ${stockQty < 10 ? 'text-red-500' : 'text-gray-700'}`}>
                                            {stockQty}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-3 py-1 font-semibold rounded-full text-xs ${statusInfo.className}`}>
                                                {statusInfo.text}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 flex gap-2 justify-center">
                                            <Link href={`/admin/product/show/${product.id}`} className="p-2 rounded-full hover:bg-gray-200" title="Xem">
                                                <i className="far fa-eye text-blue-500" />
                                            </Link>
                                            <Link href={`/admin/product/edit/${product.id}`} className="p-2 rounded-full hover:bg-gray-200" title="Sửa">
                                                <i className="far fa-edit text-yellow-500" />
                                            </Link>
                                            <button onClick={() => handleDelete(product.id)} className="p-2 rounded-full hover:bg-gray-200" title="Xóa">
                                                <i className="far fa-trash-alt text-red-500" />
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                            {productRes?.total === 0 && (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-gray-500">Chưa có sản phẩm nào.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Phân trang: nút số trang + Trước/Sau */}
                {productRes && productRes.total > productRes.per_page && (
                    <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
                        <p className="text-sm text-gray-600">
                            Hiển thị {productRes.from} – {productRes.to} / {productRes.total}
                            {filters.search || filters.category_id ? (
                                <span className="ml-2 italic text-gray-500">
                                    (đã lọc{filters.search && ` | search: "${filters.search}"`}{filters.category_id && ` | category_id: ${filters.category_id}`})
                                </span>
                            ) : null}
                        </p>

                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={(productRes.current_page || 1) <= 1}
                                className="px-3 py-1 border rounded disabled:opacity-50"
                            >
                                ← Trước
                            </button>

                            {pageNumbers.map((p, idx) => (
                                <button
                                    key={`${p}-${idx}`}
                                    disabled={p === '…'}
                                    onClick={() => typeof p === 'number' && setPage(p)}
                                    className={`px-3 py-1 border rounded ${p === productRes.current_page ? 'bg-indigo-600 text-white border-indigo-600' : ''} ${p === '…' ? 'cursor-default opacity-70' : ''}`}
                                >
                                    {p}
                                </button>
                            ))}

                            <button
                                onClick={() => setPage((p) => Math.min(productRes.last_page || p, p + 1))}
                                disabled={(productRes.current_page || 1) >= (productRes.last_page || 1)}
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
