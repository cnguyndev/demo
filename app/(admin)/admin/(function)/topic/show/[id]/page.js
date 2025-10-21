'use client'
import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
const page = () => {
    const { id } = useParams()
    const router = useRouter()

    const [topicData, setTopicData] = useState(null)
    const [state, setState] = useState({ loading: true, error: null })

    useEffect(() => {
        if (!id) return

        if (isNaN(Number(id))) {
            alert("Trường ID không hợp lệ!")
            router.push("/admin/topic")
            return
        }

        (async () => {
            try {
                const res = await fetch(`${API_BASE}/topic/${id}`)
                if (res.status === 404) {
                    alert("Không tìm thấy topic!")
                    router.push("/admin/topic")
                }
                if (!res.ok) throw new Error(`Topic HTTP ${res.status}`)
                const json = await res.json()
                setTopicData(json)
                setState({ loading: false, error: null })
            } catch (e) {
                if (e.name !== 'AbortError') {
                    setState({ loading: false, error: e.message || 'Fetch error' })
                }
            }
        })()

    }, [id, router])

    if (state.loading) return <p>Đang tải dữ liệu...</p>
    if (state.error) return <p className="text-red-500">Lỗi: {state.error}</p>
    if (!topicData) return null
    return (

        <div className="bg-white  shadow-xl rounded-2xl border border-gray-200">
            <div className="p-6 md:p-8 border-b border-gray-200 ">
                <h6 className="text-xl text-gray-800  font-bold">Chi tiết Topic</h6>
                <p className="text-sm text-gray-500  mt-1">Thông tin chi tiết của {topicData.name}</p>
            </div>

            <div className="p-6 md:p-8">
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500 ">ID</dt>
                        <dd className="mt-1 text-base font-semibold text-gray-900">#{topicData.id}</dd>
                    </div>
                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500 ">Tiêu đề</dt>
                        <dd className="mt-1 text-base font-semibold text-gray-900">{topicData.name}</dd>
                    </div>
                    <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-500 ">Slug</dt>
                        <dd className="mt-1 text-base font-semibold text-gray-900">{topicData.slug}</dd>
                    </div>
                    <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-500 ">Mô tả</dt>
                        <dd className="mt-1 text-base font-semibold text-gray-900">{topicData.description}</dd>
                    </div>
                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Trạng thái</dt>
                        <dd className="mt-1">
                            <span
                                className={`px-2 py-1 font-semibold text-xs rounded-full ${topicData.status ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                {topicData.status ? "Kích hoạt" : "Ẩn"}
                            </span>
                        </dd>
                    </div>
                </dl>

                <div className="flex justify-end gap-x-4 mt-8 border-t border-gray-200 pt-6">
                    <Link href={"/admin/topic"}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-30 text-gray-800 text-sm font-medium rounded-lg">Quay
                        lại</Link>
                    <Link href={"/admin/topic/edit/" + topicData.id}
                        className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-medium rounded-lg shadow-md"><i
                            className="fas fa-edit mr-2"></i> Sửa</Link>
                </div>
            </div>
        </div>

    )
}

export default page