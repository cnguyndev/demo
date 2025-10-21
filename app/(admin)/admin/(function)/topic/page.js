'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL


export default function Page() {
    const [page, setPage] = useState(1)
    const [topicRes, setTopicRes] = useState(null)
    const [state, setState] = useState({ loading: true, error: null })
    const [topicData, setTopicData] = useState([])

    const fetchData = async (page) => {
        try {
            const res = await fetch(`${API_BASE}/getAdminTopic?page=${page || 1}`)
            if (!res.ok) throw new Error(`Topic HTTP ${res.status}`)
            const json = await res.json()
            setTopicRes(json ?? null)
            setTopicData(Array.isArray(json.data) ? json.data : [])
            setState({ loading: false, error: null })
        } catch (e) {
            if (e.name !== 'AbortError') {
                setState({ loading: false, error: e.message || 'Fetch error' })
            }
        }
    }

    useEffect(() => {
        fetchData(page)
    }, [page])

    if (state.loading) {
        return (
            <div className="flex flex-col min-w-0 mb-6 break-words bg-white border-0 shadow-xl rounded-2xl">
                <div className="p-6 pb-4 mb-0 border-b border-gray-200 rounded-t-2xl">
                    <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
                        <div><div className="w-50 h-10 bg-gray-200 rounded-lg" /></div>
                        <div className="flex space-x-3 items-center">
                            <div className="w-30 h-10 bg-gray-200 rounded-lg" />
                        </div>
                    </div>
                </div>
                <div className="flex-auto p-4">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm align-top text-slate-600">
                            <thead className="align-bottom">
                                <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b border-gray-200">
                                    <th className="px-6 py-3 w-[15%]">ID</th>
                                    <th className="px-6 py-3 w-[35%]">Tiêu đề / slug</th>
                                    <th className="px-6 py-3 w-[25%]">Trạng thái</th>
                                    <th className="px-6 py-3 w-[25%]">Chức năng</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {[...Array(10)].map((_, i) => (
                                    <tr className="hover:bg-gray-50" key={i}>
                                        <td className="px-6 py-4"><div className="w-10 h-7 mb-1 bg-gray-200 rounded-lg" /></td>
                                        <td className="px-6 py-4">
                                            <div className="w-50 h-7 mb-1 bg-gray-200 rounded-lg" />
                                            <div className="w-50 h-5 bg-gray-200 rounded-lg" />
                                        </td>
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
                                <th className="px-6 py-3 w-[15%]">ID</th>
                                <th className="px-6 py-3 w-[35%]">Tiêu đề / slug</th>
                                <th className="px-6 py-3 w-[25%]">Trạng thái</th>
                                <th className="px-6 py-3 w-[25%]">Chức năng</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {topicData?.map((topic) => (
                                <tr className="hover:bg-gray-50" key={topic.id}>
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-gray-900">{topic.id}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <h2 className="font-bold text-gray-900">{topic.name}</h2>
                                        <p className="text-gray-500">{topic.slug}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        {topic.status === 1 ? (
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
                                        <Link href={"/admin/topic/show/" + topic.id} className="p-2 rounded-full hover:bg-gray-200 transition-colors" title="Xem">
                                            <i className="far fa-eye text-blue-500" />
                                        </Link>
                                        <Link href={"/admin/topic/edit/" + topic.id} className="p-2 rounded-full hover:bg-gray-200 transition-colors" title="Sửa">
                                            <i className="far fa-edit text-yellow-500" />
                                        </Link>
                                        <button onClick={() => {
                                            if (confirm('Bạn có chắc chắn muốn xóa topic này?')) {
                                                fetch(`${API_BASE}/menu/${topic.id}`, {
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

                            {topicRes?.total === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-500">Không có dữ liệu</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                </div>
                {topicRes && topicRes.total > 0 && (
                    <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
                        <p className="text-sm text-gray-600">
                            Hiển thị {topicRes.from} – {topicRes.to} / {topicRes.total}
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage(page - 1)}
                                disabled={!topicRes.prev_page_url}
                                className="px-3 py-1 border rounded disabled:opacity-50"
                                aria-label="Trang trước"
                            >
                                ← Trước
                            </button>

                            <button
                                onClick={() => setPage(page + 1)}
                                disabled={!topicRes.next_page_url}
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
