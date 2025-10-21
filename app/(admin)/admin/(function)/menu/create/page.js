'use client'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

export default function Page() {
    const [menuData, setMenuData] = useState([])
    const [state, setState] = useState({ loading: false })

    const [form, setForm] = useState({
        name: '',
        link: '',
        type: 'navbar',
        parent_id: 0,
        sort_order: 1,
        status: 1,
    })

    useEffect(() => {
        const [user, setUser] = useState(null);
        const router = useRouter();

        useEffect(() => {
            const userString = localStorage.getItem('user');

            if (userString) {
                const userData = JSON.parse(userString);
                setUser(userData);
            }
        }, [router]);

        (async () => {
            try {
                const res = await fetch(`${API_BASE}/menu`)
                if (!res.ok) throw new Error(`Menu HTTP ${res.status}`)
                const json = await res.json()
                setMenuData(Array.isArray(json) ? json : [])
            } catch (e) {
                console.error(e)
            }
        })()
    }, [])

    const siblings = menuData
        .filter(m => Number(m.parent_id) === Number(form.parent_id) && String(m.type) === String(form.type))
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))

    const effectiveSortOrder = form.sort_order || (siblings.length + 1)

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!form.name.trim()) alert("Vui lòng nhập Tên menu.")
        if (!form.link.trim()) alert("Vui lòng nhập Liên kết.")

        setState({ loading: true })
        try {
            const payload = {
                name: form.name.trim(),
                link: form.link.trim(),
                type: form.type,
                parent_id: Number(form.parent_id) || 0,
                sort_order: Number(effectiveSortOrder) || 1,
                status: Number(form.status) || 0,
                created_at: new Date().toISOString(),
                created_by: user?.id || 0,
            }

            const res = await fetch(`${API_BASE}/menu`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })
            if (!res.ok) throw new Error(`HTTP ${res.status}`)

            alert('Tạo menu thành công!')
            window.location.href = '/admin/menu'

        } catch (err) {
            alert("Gửi thất bại: " + err.message)
        }
    }

    return (
        <div className="bg-white dark:bg-slate-800 shadow-xl rounded-2xl border border-gray-200 dark:border-slate-700">
            <div className="p-6 md:p-8 border-b border-gray-200 dark:border-slate-700">
                <h6 className="text-xl text-gray-800 dark:text-white font-bold">Thêm Menu mới</h6>
                <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Nhập thông tin chi tiết của Menu.</p>
            </div>

            <form className="p-6 md:p-8" onSubmit={handleSubmit}>
                <div className="space-y-6 mb-3">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-slate-300">
                            Tên Menu <span className="text-red-500 ml-1">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                required
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="w-full h-12 pl-4 pr-4 rounded-lg bg-gray-100 dark:bg-slate-700/50 border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-6 mb-3">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-slate-300">
                            Liên kết <span className="text-red-500 ml-1">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                required
                                value={form.link}
                                onChange={(e) => setForm({ ...form, link: e.target.value })}
                                className="w-full h-12 pl-4 pr-4 rounded-lg bg-gray-100 dark:bg-slate-700/50 border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500 transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-3">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-slate-300">
                            Loại <span className="text-red-500 ml-1">*</span>
                        </label>
                        <select
                            value={form.type}
                            onChange={(e) => setForm({ ...form, type: e.target.value })}
                            className="w-full h-12 px-4 rounded-lg bg-gray-100 dark:bg-slate-700/50 border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="navbar">Navbar</option>
                            <option value="footer1">Footer 1</option>
                            <option value="footer2">Footer 2</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-slate-300">
                            Thư mục cha <span className="text-red-500 ml-1">*</span>
                        </label>
                        <select
                            value={form.parent_id}
                            onChange={(e) => setForm({ ...form, parent_id: Number(e.target.value), sort_order: siblings.length + 1 })}
                            className="w-full h-12 px-4 rounded-lg bg-gray-100 dark:bg-slate-700/50 border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value={0}>Không có</option>
                            {menuData
                                .filter(menu => Number(menu.parent_id) === 0 && String(menu.type) === String(form.type))
                                .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
                                .map(menu => (
                                    <option key={menu.id} value={menu.id}>{menu.name}</option>
                                ))}
                        </select>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-3">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-slate-300">
                            Thứ tự <span className="text-red-500 ml-1">*</span>
                        </label>
                        <select
                            value={effectiveSortOrder}
                            onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
                            className="w-full h-12 px-4 rounded-lg bg-gray-100 dark:bg-slate-700/50 border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value={1}>Đầu tiên</option>
                            {siblings.map((m) => (
                                <option key={m.id} value={(m.sort_order ?? 0) + 1}>
                                    Sau: {m.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-slate-300">Trạng thái</label>
                        <select
                            value={form.status}
                            onChange={(e) => setForm({ ...form, status: Number(e.target.value) })}
                            className="w-full h-12 px-4 rounded-lg bg-gray-100 dark:bg-slate-700/50 border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value={1}>Hoạt động</option>
                            <option value={0}>Tạm ẩn</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-end gap-x-4 mt-8 border-t border-gray-200 dark:border-slate-700 pt-6">
                    <Link href="/admin/menu"
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-800 dark:text-white text-sm font-medium rounded-lg"
                    >
                        Hủy
                    </Link>

                    <button
                        type="submit"
                        disabled={state.loading}
                        className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-60"
                    >
                        {state.loading ? 'Đang gửi...' : 'Thêm'}
                    </button>
                </div>
            </form>
        </div>
    )
}
