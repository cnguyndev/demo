'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Page() {
    const router = useRouter();
    const [state, setState] = useState({ submitting: false, error: null });
    const [form, setForm] = useState({ name: '' });

    const handleFormChange = (e) => {
        setForm({ name: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) {
            return alert("Vui lòng nhập tên thuộc tính.");
        }

        setState(s => ({ ...s, submitting: true, error: null }));
        try {
            const res = await fetch(`${API_BASE}/attribute`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || "Tạo mới thất bại.");
            }
            alert('Tạo thuộc tính mới thành công!');
            router.push('/admin/attribute');
        } catch (err) {
            setState(s => ({ ...s, submitting: false, error: err.message }));
        }
    };

    return (
        <div className="bg-white p-6 md:p-8 shadow-sm rounded-lg border max-w-lg mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Thêm Thuộc tính mới</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Tên thuộc tính <span className="text-red-500">*</span></label>
                    <input type="text" id="name" name="name" value={form.name} onChange={handleFormChange} required className="w-full h-12 px-4 rounded-lg bg-gray-50 border border-gray-300" placeholder="VD: Màu sắc" />
                </div>

                {state.error && <p className="text-red-500 text-sm text-center">Lỗi: {state.error}</p>}

                <div className="flex justify-end gap-3 border-t pt-6">
                    <Link href="/admin/attribute" className="px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium rounded-lg">Hủy</Link>
                    <button type="submit" disabled={state.submitting} className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg disabled:opacity-60">
                        {state.submitting ? 'Đang tạo...' : 'Tạo mới'}
                    </button>
                </div>
            </form>
        </div>
    );
}