'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

function paginate(array, page = 1, pageSize = 10) {
    const totalItems = array.length
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
    const currentPage = Math.min(Math.max(page, 1), totalPages)
    const start = (currentPage - 1) * pageSize
    const end = start + pageSize
    return {
        items: array.slice(start, end),
        page: currentPage,
        pageSize,
        totalItems,
        totalPages,
        hasPrev: currentPage > 1,
        hasNext: currentPage < totalPages,
    }
}

export default function Page() {
    const [menuData, setMenuData] = useState([])
    const [state, setState] = useState({ loading: true, error: null })
    const [page, setPage] = useState(1)

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`${API_BASE}/menu`)
                if (!res.ok) throw new Error(`menu HTTP ${res.status}`)
                const json = await res.json()
                setMenuData(Array.isArray(json) ? json : [])
                setState({ loading: false, error: null })
            } catch (e) {
                if (e.name !== 'AbortError') {
                    setState({ loading: false, error: e.message || 'Fetch error' })
                }
            }
        })()
    }, [])

    const p = paginate(menuData, page, 10)

    if (p.page !== page) {
        setPage(p.page)
    }

    if (state.loading) {
        return (
            <div className="flex flex-col min-w-0 mb-6 break-words bg-white border-0 shadow-xl rounded-2xl">
                <div className="p-6 pb-4 mb-0 border-b border-gray-200 rounded-t-2xl">
                    <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
                        <div><div className="w-50 h-10 bg-gray-200 rounded-lg" /></div>
                        <div className="flex space-x-3 items-center">
                            <div className="w-30 h-10 bg-gray-200 rounded-lg" />
                            <div className="w-30 h-10 bg-gray-200 rounded-lg" />
                        </div>
                    </div>
                </div>
                <div className="flex-auto p-4">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm align-top text-slate-600">
                            <thead className="align-bottom">
                                <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b border-gray-200">
                                    <th className="px-6 py-3 w-[5%]">ID</th>
                                    <th className="px-6 py-3 w-[20%]">Tên / Loại</th>
                                    <th className="px-6 py-3 w-[20%]">Liên kết</th>
                                    <th className="px-6 py-3 w-[20%]">Danh mục Cha</th>
                                    <th className="px-6 py-3 w-[15%]">Trạng thái</th>
                                    <th className="px-6 py-3 w-[20%]">Chức năng</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {[...Array(10)].map((_, i) => (
                                    <tr className="hover:bg-gray-50" key={i}>
                                        <td className="px-6 py-4"><div className="w-10 h-7 mb-1 bg-gray-200 rounded-lg" /></td>
                                        <td className="px-6 py-4"><div className="w-25 h-10 mb-1 bg-gray-200 rounded-lg" /></td>
                                        <td className="px-6 py-4">
                                            <div className="w-50 h-7 mb-1 bg-gray-200 rounded-lg" />
                                            <div className="w-50 h-5 bg-gray-200 rounded-lg" />
                                        </td>
                                        <td className="px-6 py-4"><div className="w-50 h-7 mb-1 bg-gray-200 rounded-lg" /></td>
                                        <td className="px-6 py-4"><div className="w-25 h-7 mb-1 bg-gray-200 rounded-lg" /></td>
                                        <td className="px-6 py-4 flex gap-2">
                                            <div className="w-10 h-7 mb-1 bg-gray-200 rounded-full" />
                                            <div className="w-10 h-7 mb-1 bg-gray-200 rounded-full" />
                                            <div className="w-10 h-7 mb-1 bg-gray-200 rounded-full" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }

    if (state.error) {
        return (
            <div className="flex flex-col min-w-0 mb-6 break-words bg-white border-0 shadow-xl rounded-2xl">
                <div className="p-6 pb-4 mb-0 border-b border-gray-200 rounded-t-2xl">
                    <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
                        <div><div className="w-50 h-10 bg-gray-200 rounded-lg" /></div>
                        <div className="flex space-x-3 items-center">
                            <div className="w-30 h-10 bg-gray-200 rounded-lg" />
                            <div className="w-30 h-10 bg-gray-200 rounded-lg" />
                        </div>
                    </div>
                </div>
                <div className="flex-auto p-4">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm align-top text-slate-600">
                            <thead className="align-bottom">
                                <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b border-gray-200">
                                    <th className="px-6 py-3 w-[5%]">ID</th>
                                    <th className="px-6 py-3 w-[20%]">Tên / Loại</th>
                                    <th className="px-6 py-3 w-[20%]">Liên kết</th>
                                    <th className="px-6 py-3 w-[20%]">Danh mục Cha</th>
                                    <th className="px-6 py-3 w-[15%]">Trạng thái</th>
                                    <th className="px-6 py-3 w-[20%]">Chức năng</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-500">
                                        Không tải được dữ liệu menu: {state.error}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col min-w-0 mb-6 break-words bg-white border-0 shadow-xl rounded-2xl">
            <div className="p-6 pb-4 mb-0 border-b border-gray-200 rounded-t-2xl">
                <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
                    <div>
                        <h6 className="text-gray-800 text-xl font-bold">Danh sách menu</h6>
                        <nav aria-label="breadcrumb" className="text-sm font-medium text-gray-500">
                            <ol className="flex items-center space-x-1">
                                <li><Link href="/" className="hover:underline">Trang chủ</Link></li>
                                <li><span className="mx-1">/</span></li>
                                <li>Danh sách menu</li>
                            </ol>
                        </nav>
                    </div>

                    <div className="flex space-x-3 items-center">
                        <Link href={"/admin/menu/create"} className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-md hover:-translate-y-0.5 transition-transform">
                            <i className="fas fa-plus mr-2 text-base"></i> Thêm </Link>

                    </div>
                </div>
            </div>

            <div className="flex-auto p-4">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm align-top text-slate-600">
                        <thead className="align-bottom">
                            <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b border-gray-200">
                                <th className="px-6 py-3 w-[5%]">ID</th>
                                <th className="px-6 py-3 w-[20%]">Tên / Loại</th>
                                <th className="px-6 py-3 w-[20%]">Liên kết</th>
                                <th className="px-6 py-3 w-[20%]">Danh mục Cha</th>
                                <th className="px-6 py-3 w-[15%]">Trạng thái</th>
                                <th className="px-6 py-3 w-[20%]">Chức năng</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {p.items.map((menu) => (
                                <tr className="hover:bg-gray-50" key={menu.id}>
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-gray-900">{menu.id}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <h2 className="font-bold text-gray-900">{menu.name}</h2>
                                        <p className="text-gray-500">{menu.type}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link href={menu.link} className="text-indigo-600 hover:underline">
                                            {menu.link}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-gray-500">{menu.parent?.name || 'Không có'}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        {menu.status === 1 ? (
                                            <span className="px-3 py-1 font-semibold rounded-full text-xs bg-green-100 text-green-800">
                                                Hoạt động
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 font-semibold rounded-full text-xs bg-yellow-100 text-yellow-800">
                                                Tạm ẩn
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 flex gap-2">
                                        <Link href={"/admin/menu/show/" + menu.id} className="p-2 rounded-full hover:bg-gray-200 transition-colors" title="Xem">
                                            <i className="far fa-eye text-blue-500" />
                                        </Link>
                                        <Link href={"/admin/menu/edit/" + menu.id} className="p-2 rounded-full hover:bg-gray-200 transition-colors" title="Sửa">
                                            <i className="far fa-edit text-yellow-500" />
                                        </Link>
                                        <button onClick={() => {
                                            if (confirm('Bạn có chắc chắn muốn xóa menu này?')) {
                                                fetch(`${API_BASE}/menu/${menu.id}`, {
                                                    method: 'DELETE',
                                                })
                                                alert('Xóa thành công!')
                                                window.location.reload()
                                            }
                                        }} className="p-2 rounded-full hover:bg-gray-200 transition-colors" title="Xóa">
                                            <i className="far fa-trash-alt text-red-500" />
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {p.totalItems === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-500">Không có dữ liệu</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {p.totalItems > 0 && (
                    <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
                        <p className="text-sm text-gray-600">
                            Hiển thị {p.totalItems === 0 ? 0 : (p.page - 1) * p.pageSize + 1}
                            –
                            {Math.min(p.page * p.pageSize, p.totalItems)}
                            /{p.totalItems}
                        </p>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage(p.page - 1)}
                                disabled={!p.hasPrev}
                                className="px-3 py-1 border rounded disabled:opacity-50"
                                aria-label="Trang trước"
                            >
                                ← Trước
                            </button>

                            {Array.from({ length: p.totalPages }, (_, i) => i + 1).map(n => (
                                <button
                                    key={n}
                                    onClick={() => setPage(n)}
                                    className={`px-3 py-1 border rounded ${n === p.page ? 'bg-gray-900 text-white' : ''}`}
                                    aria-current={n === p.page ? 'page' : undefined}
                                >
                                    {n}
                                </button>
                            ))}

                            <button
                                onClick={() => setPage(p.page + 1)}
                                disabled={!p.hasNext}
                                className="px-3 py-1 border rounded disabled:opacity-50"
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
