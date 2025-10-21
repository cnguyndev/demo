'use client';

import { useEffect, useMemo, useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || '';

/* ---------------- Utils ---------------- */
const fmtVND = (n) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
        Number.isFinite(+n) ? +n : 0
    );

const toDate = (s) => {
    if (!s) return null;
    const d = new Date(String(s).replace(' ', 'T'));
    return isNaN(+d) ? null : d;
};

const fmtDate = (s) => {
    const d = toDate(s);
    return d ? d.toLocaleString('vi-VN') : '—';
};

const statusBadge = (st) => {
    if (+st === 1)
        return (
            <span className="inline-flex items-center gap-1.5 text-green-700 bg-green-50 border-2 border-green-200 px-3 py-1.5 rounded-full text-xs font-bold">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Thành công
            </span>
        );
    if (+st === 0)
        return (
            <span className="inline-flex items-center gap-1.5 text-amber-700 bg-amber-50 border-2 border-amber-200 px-3 py-1.5 rounded-full text-xs font-bold">
                <svg className="w-3.5 h-3.5 animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Chờ xử lý
            </span>
        );
    return (
        <span className="inline-flex items-center gap-1.5 text-gray-700 bg-gray-50 border-2 border-gray-200 px-3 py-1.5 rounded-full text-xs font-bold">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            Không rõ
        </span>
    );
};

const sumOrderAmount = (o) =>
    (o?.order_detail || []).reduce((s, d) => s + Number(d?.amount || 0), 0);

/* ---------------- Page ---------------- */
export default function AccountPage() {
    const [me, setMe] = useState(null); // dữ liệu user + mảng order như JSON bạn gửi
    const [loadingMe, setLoadingMe] = useState(true);
    const [errMe, setErrMe] = useState('');

    const [activeTab, setActiveTab] = useState('profile');

    const [pwForm, setPwForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [savingPw, setSavingPw] = useState(false);

    // Lấy user từ localStorage và fetch chi tiết từ BE
    useEffect(() => {
        (async () => {
            try {
                setLoadingMe(true);
                const raw = localStorage.getItem('user');
                if (!raw) {
                    setErrMe('Chưa đăng nhập.');
                    setMe(null);
                    setLoadingMe(false);
                    return;
                }
                const u = JSON.parse(raw);
                if (!u?.id) {
                    setErrMe('Không tìm thấy thông tin người dùng.');
                    setMe(null);
                    setLoadingMe(false);
                    return;
                }
                // API trả JSON như bạn dán (user + order + order_detail)
                const r = await fetch(`${API_BASE}/user/${u.id}`);
                if (!r.ok) throw new Error(`HTTP ${r.status}`);
                const j = await r.json();
                setMe(j);
                setErrMe('');
            } catch (e) {
                console.error(e);
                setErrMe('Không tải được thông tin người dùng.');
            } finally {
                setLoadingMe(false);
            }
        })();
    }, []);

    // Tổng chi tiêu CHỈ cộng order_detail.status === 1
    const totalSpent = useMemo(() => {
        const orders = me?.order || [];
        return orders.reduce((sum, o) => {
            const paid = (o?.order_detail || [])
                .filter((d) => +d.status === 1)
                .reduce((s, d) => s + Number(d.amount || 0), 0);
            return sum + paid;
        }, 0);
    }, [me]);

    const successOrders = useMemo(() => {
        return (me?.order || []).filter((o) => +o.status === 1).length;
    }, [me]);

    const handlePwChange = (e) => {
        const { name, value } = e.target;
        setPwForm((s) => ({ ...s, [name]: value }));
    };

    const submitChangePassword = async (e) => {
        e.preventDefault();
        if (!pwForm.currentPassword || !pwForm.newPassword || !pwForm.confirmPassword) {
            return alert('Vui lòng điền đầy đủ các trường.');
        }
        if (pwForm.newPassword.length < 8) {
            return alert('Mật khẩu mới phải có ít nhất 8 ký tự.');
        }
        if (pwForm.newPassword !== pwForm.confirmPassword) {
            return alert('Xác nhận mật khẩu không khớp.');
        }

        try {
            setSavingPw(true);
            // tuỳ BE của bạn: ví dụ POST /change-password
            const r = await fetch(`${API_BASE}/changePassword`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: me?.id,
                    current_password: pwForm.currentPassword,
                    new_password: pwForm.newPassword,
                    updated_by: me?.id,
                }),
            });
            if (!r.ok) {
                const j = await r.json().catch(() => ({}));
                throw new Error(j?.message || `Đổi mật khẩu thất bại (HTTP ${r.status})`);
            }
            alert('Đổi mật khẩu thành công!');
            setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (e) {
            alert(e.message || 'Đổi mật khẩu thất bại.');
        } finally {
            setSavingPw(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
            <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-10">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-4 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-xl">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                                Tài khoản của tôi
                            </h1>
                            <p className="text-gray-600 mt-1">Quản lý hồ sơ và xem lịch sử mua hàng</p>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100 hover:shadow-xl transition-shadow">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Tổng đơn hàng</p>
                                    <p className="text-2xl font-bold text-gray-900">{me?.order?.length ?? 0}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100 hover:shadow-xl transition-shadow">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Đơn thành công</p>
                                    <p className="text-2xl font-bold text-gray-900">{successOrders}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100 hover:shadow-xl transition-shadow">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Tổng chi tiêu</p>
                                    <p className="text-2xl font-bold text-gray-900">{fmtVND(totalSpent)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-2xl shadow-lg p-2 mb-8 inline-flex gap-2">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all ${activeTab === 'profile'
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Hồ sơ
                    </button>
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all ${activeTab === 'orders'
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Đơn hàng
                    </button>
                    <button
                        onClick={() => setActiveTab('password')}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all ${activeTab === 'password'
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                        Bảo mật
                    </button>
                </div>

                {/* Content */}
                {loadingMe ? (
                    <div className="text-center text-gray-500">Đang tải…</div>
                ) : errMe ? (
                    <div className="text-center text-red-600">{errMe}</div>
                ) : !me ? null : (
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <div className="lg:col-span-3">
                                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-12 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                                        <div className="relative z-10 flex items-center gap-6">
                                            <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-4xl shadow-2xl">
                                                {String(me?.name || 'U').trim().charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h2 className="text-3xl font-bold text-white mb-2">{me?.name || '—'}</h2>
                                                <p className="text-blue-100">ID: #{me?.id ?? '—'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-8">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-xs text-gray-500 mb-1">Email</p>
                                                        <p className="font-semibold text-gray-900">{me?.email || '—'}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                        </svg>
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-xs text-gray-500 mb-1">Số điện thoại</p>
                                                        <p className="font-semibold text-gray-900">{me?.phone || '—'}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs text-gray-500 mb-1">Địa chỉ</p>
                                                    <p className="font-semibold text-gray-900">{me?.address || '—'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-8 flex gap-4">
                                            <button className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-bold hover:shadow-xl transition-all">
                                                Chỉnh sửa hồ sơ
                                            </button>
                                            <button
                                                className="px-6 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all"
                                                onClick={() => {
                                                    localStorage.removeItem('user');
                                                    window.location.href = '/dang-nhap';
                                                }}
                                            >
                                                Đăng xuất
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Orders Tab */}
                        {activeTab === 'orders' && (
                            <div className="lg:col-span-3">
                                <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                                    <div className="flex items-center justify-between mb-8">
                                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                </svg>
                                            </div>
                                            Lịch sử đơn hàng
                                        </h2>
                                        <a
                                            href="/san-pham"
                                            className="px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all flex items-center gap-2"
                                        >
                                            Mua sắm ngay
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </a>
                                    </div>

                                    {(me?.order || []).length === 0 ? (
                                        <div className="text-center py-12">
                                            <svg className="w-20 h-20 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                            </svg>
                                            <p className="text-gray-500 mb-4">Chưa có đơn hàng nào</p>
                                            <a href="/san-pham" className="text-blue-600 font-semibold hover:underline">
                                                Mua sắm ngay →
                                            </a>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {(me?.order || []).map((o) => {
                                                const total = sumOrderAmount(o);
                                                return (
                                                    <div key={o.id} className="rounded-2xl border-2 border-gray-200 p-6 hover:shadow-xl hover:border-blue-300 transition-all">
                                                        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                                                            <div className="flex items-start gap-4">
                                                                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                                                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                                    </svg>
                                                                </div>
                                                                <div>
                                                                    <div className="font-bold text-lg text-gray-900 mb-1">Đơn hàng #{o.id}</div>
                                                                    <div className="text-sm text-gray-500 flex items-center gap-2">
                                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                        </svg>
                                                                        {fmtDate(o.created_at)}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="mb-2">{statusBadge(o.status)}</div>
                                                                <div className="text-xs text-gray-500 mb-1">Tổng tiền</div>
                                                                <div className="text-2xl font-bold text-blue-600">{fmtVND(total)}</div>
                                                            </div>
                                                        </div>

                                                        <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                                                            <div className="flex items-start gap-2">
                                                                <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                </svg>
                                                                <span className="text-gray-700">
                                                                    <span className="font-medium">Địa chỉ:</span> {o.address || '—'}
                                                                </span>
                                                            </div>
                                                            {o.note && (
                                                                <div className="flex items-start gap-2">
                                                                    <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                                                    </svg>
                                                                    <span className="text-gray-700">
                                                                        <span className="font-medium">Ghi chú:</span> {o.note}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="mt-4 flex items-center gap-3">
                                                            <a
                                                                href={`/don-hang/${o.id}`}
                                                                className="flex-1 text-center px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 font-semibold text-gray-700 transition-all"
                                                            >
                                                                Xem chi tiết
                                                            </a>

                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Password Tab */}
                        {activeTab === 'password' && (
                            <div className="lg:col-span-2">
                                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Đổi mật khẩu</h2>
                                    <form onSubmit={submitChangePassword} className="space-y-5">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Mật khẩu hiện tại</label>
                                            <input
                                                type="password"
                                                name="currentPassword"
                                                value={pwForm.currentPassword}
                                                onChange={handlePwChange}
                                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                placeholder="Nhập mật khẩu hiện tại"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Mật khẩu mới</label>
                                            <input
                                                type="password"
                                                name="newPassword"
                                                value={pwForm.newPassword}
                                                onChange={handlePwChange}
                                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                placeholder="Ít nhất 8 ký tự"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Xác nhận mật khẩu mới</label>
                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                value={pwForm.confirmPassword}
                                                onChange={handlePwChange}
                                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                placeholder="Nhập lại mật khẩu mới"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={savingPw}
                                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-bold hover:shadow-xl transition-all disabled:opacity-60"
                                        >
                                            {savingPw ? 'Đang lưu…' : 'Cập nhật mật khẩu'}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* Quick Profile Card (right column when password tab) */}
                        {activeTab === 'password' && (
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl">
                                            {String(me?.name || 'U').trim().charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-bold">{me?.name}</div>
                                            <div className="text-sm text-gray-500">{me?.email}</div>
                                        </div>
                                    </div>
                                    <div className="space-y-2 text-sm text-gray-700">
                                        <div><span className="font-medium">SĐT:</span> {me?.phone || '—'}</div>
                                        <div><span className="font-medium">Địa chỉ:</span> {me?.address || '—'}</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <style jsx>{`
          .animate-spin-slow { animation: spin 2s linear infinite; }
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
            </div>
        </div>
    );
}
