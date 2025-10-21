'use client'
import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

// --- Helper Functions ---
const formatCurrency = (value) => {
    const number = parseFloat(value);
    if (isNaN(number)) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
};

const getOrderStatus = (status) => {
    switch (status) {
        case 0: return { text: 'Đã hủy', className: 'bg-red-100 text-red-800' };
        case 1: return { text: 'Chờ xử lý', className: 'bg-yellow-100 text-yellow-800' };
        case 2: return { text: 'Đang giao', className: 'bg-blue-100 text-blue-800' };
        case 3: return { text: 'Đã giao', className: 'bg-green-100 text-green-800' };
        default: return { text: 'Không xác định', className: 'bg-gray-100 text-gray-800' };
    }
};

const getUserStatus = (status) => {
    return status === 1
        ? { text: 'Hoạt động', className: 'bg-green-100 text-green-800' }
        : { text: 'Bị khóa', className: 'bg-red-100 text-red-800' };
};

const getUserRole = (role) => {
    return role === 'admin'
        ? { text: 'Admin', className: 'bg-purple-100 text-purple-800' }
        : { text: 'Customer', className: 'bg-blue-100 text-blue-800' };
};


const Page = () => {
    const { id } = useParams();
    const router = useRouter();

    const [userData, setUserData] = useState(null);
    const [passwordForm, setPasswordForm] = useState({ new_password: '', confirm_password: '' });
    const [state, setState] = useState({ loading: true, submitting: false, error: null });

    useEffect(() => {
        if (!id || isNaN(Number(id))) {
            router.push("/admin/user");
            return;
        }
        const fetchUserData = async () => {
            setState(s => ({ ...s, loading: true }));
            try {
                const res = await fetch(`${API_BASE}/user/${id}`);
                if (res.status === 404) throw new Error("Không tìm thấy người dùng.");
                if (!res.ok) throw new Error("Lỗi khi tải dữ liệu người dùng.");
                const json = await res.json();
                setUserData(json);
            } catch (e) {
                setState(s => ({ ...s, error: e.message }));
            } finally {
                setState(s => ({ ...s, loading: false }));
            }
        };
        fetchUserData();
    }, [id, router]);

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (!passwordForm.new_password || !passwordForm.confirm_password) {
            return alert("Vui lòng nhập mật khẩu mới và xác nhận.");
        }
        if (passwordForm.new_password !== passwordForm.confirm_password) {
            return alert("Mật khẩu xác nhận không khớp.");
        }
        if (passwordForm.new_password.length < 6) {
            return alert("Mật khẩu phải có ít nhất 6 ký tự.");
        }

        setState(s => ({ ...s, submitting: true, error: null }));
        try {
            const res = await fetch(`${API_BASE}/updatePassword`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(
                    {
                        user_id: id,
                        password: passwordForm.new_password

                    }
                ),
            });
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || 'Cập nhật mật khẩu thất bại.');
            }
            alert('Cập nhật mật khẩu thành công!');
            setPasswordForm({ new_password: '', confirm_password: '' }); // Reset form
        } catch (err) {
            alert(`Lỗi: ${err.message}`);
        } finally {
            setState(s => ({ ...s, submitting: false }));
        }
    };

    if (state.loading) return <div className="p-8 text-center animate-pulse">Đang tải chi tiết người dùng...</div>;
    if (state.error) return <div className="p-8 text-center text-red-500">Lỗi: {state.error}</div>;
    if (!userData) return null;

    const statusInfo = getUserStatus(userData.status);
    const roleInfo = getUserRole(userData.role);

    return (
        <div className="space-y-8">
            {/* --- PHẦN 1: THÔNG TIN CHI TIẾT --- */}
            <div className="bg-white p-6 md:p-8 shadow-sm rounded-lg border">
                <div className="flex items-start justify-between flex-wrap gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{userData.name}</h2>
                        <p className="text-sm text-gray-500 mt-1">Chi tiết tài khoản người dùng</p>
                    </div>
                    <Link href="/admin/user" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">← Quay lại danh sách</Link>
                </div>

                <div className="mt-6 border-t border-gray-200 pt-6">
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                        <div className="md:col-span-2 flex items-center gap-6">
                            {userData.avatar ? (
                                <Image src={userData.avatar} alt="Avatar" width={96} height={96} className="h-24 w-24 rounded-full object-cover border" unoptimized />
                            ) : (
                                <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center text-4xl text-gray-400 border">
                                    <i className="fas fa-user"></i>
                                </div>
                            )}
                            <div>
                                <h3 className="text-lg font-semibold">{userData.name}</h3>
                                <p className="text-gray-600">{userData.email}</p>
                            </div>
                        </div>
                        <div>
                            <dt className="font-medium text-gray-500 text-sm">Username</dt>
                            <dd className="mt-1 text-gray-900 font-mono">{userData.username}</dd>
                        </div>
                        <div>
                            <dt className="font-medium text-gray-500 text-sm">Số điện thoại</dt>
                            <dd className="mt-1 text-gray-900">{userData.phone || 'Chưa cập nhật'}</dd>
                        </div>
                        <div>
                            <dt className="font-medium text-gray-500 text-sm">Vai trò</dt>
                            <dd className="mt-1 text-gray-900">
                                <span className={`px-3 py-1 font-semibold rounded-full text-xs ${roleInfo.className}`}>{roleInfo.text}</span>
                            </dd>
                        </div>
                        <div>
                            <dt className="font-medium text-gray-500 text-sm">Trạng thái</dt>
                            <dd className="mt-1 text-gray-900">
                                <span className={`px-3 py-1 font-semibold rounded-full text-xs ${statusInfo.className}`}>{statusInfo.text}</span>
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>

            {/* --- PHẦN 2: LỊCH SỬ MUA HÀNG --- */}
            <div className="bg-white p-6 md:p-8 shadow-sm rounded-lg border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Lịch sử mua hàng ({userData.order?.length || 0} đơn)</h3>
                <div className="overflow-x-auto">
                    {userData.order && userData.order.length > 0 ? (
                        <table className="min-w-full divide-y divide-gray-200 text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase">Mã ĐH</th>
                                    <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase">Ngày đặt</th>
                                    <th className="px-4 py-2 text-right font-medium text-gray-500 uppercase">Tổng tiền</th>
                                    <th className="px-4 py-2 text-center font-medium text-gray-500 uppercase">Trạng thái</th>
                                    <th className="px-4 py-2 text-right font-medium text-gray-500 uppercase"></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {userData.order.map(order => {
                                    const totalAmount = order.order_detail.reduce((sum, item) => sum + parseFloat(item.amount), 0);
                                    const orderStatusInfo = getOrderStatus(order.status);
                                    return (
                                        <tr key={order.id}>
                                            <td className="px-4 py-3 font-semibold text-indigo-600">#{order.id}</td>
                                            <td className="px-4 py-3">{new Date(order.created_at).toLocaleDateString('vi-VN')}</td>
                                            <td className="px-4 py-3 text-right font-medium">{formatCurrency(totalAmount)}</td>
                                            <td className="px-4 py-3 text-center">
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${orderStatusInfo.className}`}>{orderStatusInfo.text}</span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <Link href={`/admin/order/show/${order.id}`} className="font-medium text-indigo-600 hover:text-indigo-800">Xem chi tiết</Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-center text-gray-500 py-4">Người dùng này chưa có đơn hàng nào.</p>
                    )}
                </div>
            </div>

            {/* --- PHẦN 3: CẬP NHẬT MẬT KHẨU --- */}
            <div className="bg-white p-6 md:p-8 shadow-sm rounded-lg border">
                <h3 className="text-lg font-semibold text-gray-900">Đặt lại mật khẩu</h3>
                <form onSubmit={handlePasswordUpdate} className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700">Mật khẩu mới</label>
                        <input type="password" name="new_password" value={passwordForm.new_password} onChange={handlePasswordChange} className="mt-1 w-full h-11 px-4 rounded-lg bg-gray-50 border border-gray-300" />
                    </div>
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700">Xác nhận mật khẩu mới</label>
                        <input type="password" name="confirm_password" value={passwordForm.confirm_password} onChange={handlePasswordChange} className="mt-1 w-full h-11 px-4 rounded-lg bg-gray-50 border border-gray-300" />
                    </div>
                    <div className="md:col-span-1">
                        <button type="submit" disabled={state.submitting} className="w-full h-11 px-4 bg-indigo-600 text-white rounded-lg disabled:opacity-60 flex items-center justify-center">
                            {state.submitting ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Page;