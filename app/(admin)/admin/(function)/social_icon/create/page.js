'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Page() {
    const router = useRouter();
    const [state, setState] = useState({ submitting: false, error: null });
    const [form, setForm] = useState({ name: '', link: '', icon: '' });

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.link || !form.icon) {
            return alert("Vui lòng điền đầy đủ thông tin.");
        }

        setState(s => ({ ...s, submitting: true, error: null }));
        try {
            const res = await fetch(`${API_BASE}/social-icon`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || "Tạo mới thất bại.");
            }
            alert('Tạo icon mới thành công!');
            router.push('/admin/social_icon');
        } catch (err) {
            setState(s => ({ ...s, submitting: false, error: err.message }));
        }
    };

    return (
        <div className="bg-white p-6 md:p-8 shadow-sm rounded-lg border max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Thêm Icon Mạng xã hội</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Tên Mạng xã hội <span className="text-red-500">*</span></label>
                    <input type="text" id="name" name="name" value={form.name} onChange={handleFormChange} required className="w-full h-12 px-4 rounded-lg bg-gray-50 border border-gray-300" placeholder="VD: Facebook" />
                </div>
                <div>
                    <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-1">Link gốc <span className="text-red-500">*</span></label>
                    <input type="text" id="link" name="link" value={form.link} onChange={handleFormChange} required className="w-full h-12 px-4 rounded-lg bg-gray-50 border border-gray-300" placeholder="VD: https://facebook.com/" />
                </div>
                <div>
                    <label htmlFor="icon" className="block text-sm font-medium text-gray-700 mb-1">Class Icon (Font Awesome) <span className="text-red-500">*</span></label>
                    <input type="text" id="icon" name="icon" value={form.icon} onChange={handleFormChange} required className="w-full h-12 px-4 rounded-lg bg-gray-50 border border-gray-300" placeholder="VD: fa fa-facebook" />
                </div>

                {state.error && <p className="text-red-500 text-sm text-center">Lỗi: {state.error}</p>}

                <div className="flex justify-end gap-3 border-t pt-6">
                    <Link href="/admin/socialicon" className="px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium rounded-lg">Hủy</Link>
                    <button type="submit" disabled={state.submitting} className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg disabled:opacity-60">
                        {state.submitting ? 'Đang tạo...' : 'Tạo mới'}
                    </button>
                </div>
            </form>
        </div>
    );
}