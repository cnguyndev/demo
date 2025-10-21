'use client'
import { useState } from 'react';
import Link from 'next/link';
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;


export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = 'Tên đăng nhập là bắt buộc!';
        }
        if (!formData.password) {
            newErrors.password = 'Mật khẩu là bắt buộc!';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    async function handleSubmit(e) {
        e.preventDefault();
        if (validateForm()) {
            try {
                const res = await fetch(`${API_BASE}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(
                        {
                            username: formData.username,
                            password: formData.password
                        }
                    ),
                });

                if (res.status === 409) {
                    const data = await res.json();
                    alert(`${data.message}`)
                    return;
                }

                if (!res.ok) {
                    const errorData = await res.json().catch(() => null);
                    throw new Error(errorData?.message || 'Đăng nhập thất bại!');
                }

                const data = await res.json();
                localStorage.setItem('token', JSON.stringify(data));

                alert('Đăng nhập thành công!');
                window.location.href = '/';
                return;

            } catch (e) {
                alert(e.message ?? 'Lỗi không xác định');
                return;
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold text-gray-900">Chào mừng quay trở lại!</h1>
                        <p className="text-gray-600">Đăng nhập để tiếp tục mua sắm ngay!</p>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                Tên đăng nhập
                            </label>
                            <div className="relative">
                                <i className="fa-solid fa-user absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"></i>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className={`w-full pl-10 pr-4 py-3 border ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none`}
                                    placeholder='Nhập tên đăng nhập'
                                />
                            </div>
                            {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username}</p>}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Mật khẩu
                            </label>
                            <div className="relative">
                                <i className="fa-solid fa-lock absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"></i>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full pl-10 pr-12 py-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none`}
                                    placeholder='Nhập mật khẩu'
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <i className="fa-solid fa-eye w-5 h-5"></i> : <i className="fa-solid fa-eye-slash w-5 h-5"></i>}
                                </button>
                            </div>
                            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                        </div>

                        <div className="flex items-center justify-between">
                            <div></div>
                            <a href="#" className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors">
                                Quên mật khẩu?
                            </a>
                        </div>

                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transform hover:scale-[1.02] transition-all shadow-lg hover:shadow-xl"
                        >
                            Đăng nhập
                        </button>
                    </div>


                    <div className="text-center text-sm text-gray-600">
                        Chưa có tài khoản?{' '}
                        <Link href="/dang-ky" className="text-purple-600 font-semibold hover:text-purple-700 transition-colors">
                            Đăng ký
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}