'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

const fmtVND = (n) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
        .format(Number.isFinite(n) ? n : 0);

/** SSR-safe cart hook: KHÔNG đọc localStorage trong useState initializer */
const useCart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [cartMounted, setCartMounted] = useState(false);

    // Đọc giỏ hàng sau khi mount (client-only)
    useEffect(() => {
        try {
            const raw = localStorage.getItem('cart');
            if (raw) {
                const data = JSON.parse(raw);
                const safe = Array.isArray(data)
                    ? data.map((i) => ({ ...i, qty: Math.max(1, Number(i.qty || 1)) }))
                    : [];
                setCartItems(safe);
            }
        } catch {
            // ignore
        } finally {
            setCartMounted(true);
        }
    }, []);

    // Đồng bộ localStorage khi có thay đổi
    useEffect(() => {
        if (!cartMounted) return;
        try {
            localStorage.setItem('cart', JSON.stringify(cartItems));
            window.dispatchEvent(new Event('cartUpdated'));
        } catch { }
    }, [cartItems, cartMounted]);

    const subtotal = useMemo(
        () => cartItems.reduce((s, it) => s + (Number(it.price) || 0) * (Number(it.qty) || 1), 0),
        [cartItems]
    );

    return { cartItems, setCartItems, subtotal, cartMounted };
};

export default function PaymentPage() {
    const router = useRouter();
    const { cartItems, subtotal, cartMounted } = useCart();

    const [mounted, setMounted] = useState(false);           // gate chống hydration mismatch
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [authChecking, setAuthChecking] = useState(true);

    const [step, setStep] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState('momo');
    const [loading, setLoading] = useState(false);

    const [shippingInfo, setShippingInfo] = useState({
        email: '',
        phone: '',
        name: '',
        address: '',
        note: '',
    });

    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [saveCard, setSaveCard] = useState(false);

    // ===== Formatters =====
    const formatCardNumber = (val) => {
        const digits = val.replace(/\D/g, '').slice(0, 19);
        const grouped = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
        setCardNumber(grouped);
    };
    const formatExpiry = (val) => {
        const digits = val.replace(/\D/g, '').slice(0, 4);
        let out = digits;
        if (digits.length >= 3) out = `${digits.slice(0, 2)}/${digits.slice(2)}`;
        setExpiry(out);
    };

    const shippingFee = 0;
    const total = useMemo(() => subtotal + shippingFee, [subtotal, shippingFee]);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        let cancelled = false;

        const run = async () => {
            try {
                const token = localStorage.getItem("token");

                setToken(token);

                if (!token) {
                    setAuthChecking(false);
                    alert('Vui lòng đăng nhập lại.');
                    router.replace('/dang-nhap');
                    return;
                }

                const rs = await fetch(`${API_BASE}/verifyUser`, {
                    headers: { Authorization: token },
                    cache: 'no-store',
                });

                if (!rs.ok) {
                    setAuthChecking(false);
                    alert('Vui lòng đăng nhập lại.');
                    router.replace('/dang-nhap');
                    return;
                }

                const data = await rs.json();
                if (cancelled) return;

                setUser(data);

                setShippingInfo(() => ({
                    email: data.email || '',
                    phone: data.phone || '',
                    name: data.name || '',
                    address: '',
                    note: '',
                }));
            } catch (e) {
                console.error(e);
                router.replace('/dang-nhap');
            } finally {
                if (!cancelled) setAuthChecking(false);
            }
        };

        run();
        return () => {
            cancelled = true;
        };
    }, [router]);

    const createOrderAndPayWithMomo = async () => {
        if (!user || !token) {
            alert('Vui lòng đăng nhập lại.');
            router.replace('/dang-nhap');
            return;
        }
        if (cartItems.length === 0) {
            alert('Giỏ hàng trống.');
            router.replace('/san-pham');
            return;
        }

        setLoading(true);
        try {
            const orderRes = await fetch(`${API_BASE}/order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: user.id,
                    name: shippingInfo.name,
                    email: shippingInfo.email,
                    phone: shippingInfo.phone,
                    address: shippingInfo.address,
                    note: shippingInfo.note,
                    status: 0,
                    created_by: user.id,
                    total,
                    items: cartItems.map((it) => ({
                        id: it.id,
                        price: Number(it.price) || 0,
                        qty: Number(it.qty) || 1,
                    })),
                }),
            });
            if (!orderRes.ok) throw new Error(`Create order HTTP ${orderRes.status}`);
            const orderJson = await orderRes.json();
            const orderId = orderJson?.id || orderJson?.data?.id || orderJson?.order?.id;
            if (!orderId) throw new Error('Không nhận được orderId');

            const momoRes = await fetch(`${API_BASE}/payments/momo/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orderId,
                    amount: total,
                }),
            });
            if (!momoRes.ok) throw new Error(`MoMo create HTTP ${momoRes.status}`);
            const momoJson = await momoRes.json();
            const payUrl = momoJson?.payUrl || momoJson?.data?.payUrl || momoJson?.result?.payUrl;
            if (!payUrl) throw new Error('Không nhận được payUrl từ backend');

            window.location.href = payUrl;
        } catch (err) {
            console.error(err);
            alert(err?.message || 'Không thể khởi tạo thanh toán. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (step === 1) {
            if (!shippingInfo.email || !shippingInfo.phone || !shippingInfo.name || !shippingInfo.address) {
                alert('Vui lòng điền đầy đủ thông tin giao hàng.');
                return;
            }
            setStep(2);
            return;
        }

        if (paymentMethod === 'momo') {
            createOrderAndPayWithMomo();
        } else if (paymentMethod === 'card') {
            alert('Thanh toán thẻ (demo).');
        }
    };

    if (!mounted || !cartMounted || authChecking) {
        return (
            <div className="min-h-screen grid place-items-center">
                <div className="text-gray-600">Đang tải…</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-30">
            <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <Link
                        href="/gio-hang"
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4 font-semibold"
                    >
                        <i className="fa-solid fa-arrow-left w-5 h-5" />
                        Quay lại giỏ hàng
                    </Link>

                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent flex items-center gap-3">
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-2xl shadow-lg">
                            <i className="fa-solid fa-lock w-8 h-8 text-white" />
                        </div>
                        Thanh toán an toàn
                    </h1>

                    <div className="flex items-center gap-4 mt-6">
                        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
                                    }`}
                            >
                                {step > 1 ? <i className="fa-solid fa-check w-6 h-6" /> : '1'}
                            </div>
                            <span className="font-semibold hidden sm:inline">Giao hàng</span>
                        </div>
                        <div className="flex-1 h-1 bg-gray-200 rounded">
                            <div className={`h-1 rounded transition-all duration-500 ${step >= 2 ? 'bg-blue-600 w-full' : 'w-0'}`} />
                        </div>
                        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'
                                    }`}
                            >
                                2
                            </div>
                            <span className="font-semibold hidden sm:inline">Thanh toán</span>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit}>
                            {step === 1 && (
                                <div className="bg-white rounded-3xl shadow-2xl p-8 backdrop-blur-sm bg-opacity-95 border border-gray-100">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                        <i className="fa-solid fa-truck w-6 h-6 text-blue-600" />
                                        Thông tin giao hàng
                                    </h2>

                                    <div className="space-y-5">
                                        <div className="grid md:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    <i className="fa-solid fa-envelope text-blue-600 mr-2" />
                                                    Email
                                                </label>
                                                <input
                                                    type="email"
                                                    value={shippingInfo.email}
                                                    onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                                                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                    placeholder="ten@vidu.com"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    <i className="fa-solid fa-phone text-blue-600 mr-2" />
                                                    Số điện thoại
                                                </label>
                                                <input
                                                    type="tel"
                                                    value={shippingInfo.phone}
                                                    onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                                                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                    placeholder="09xx xxx xxx"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Họ và Tên</label>
                                            <input
                                                type="text"
                                                value={shippingInfo.name}
                                                onChange={(e) => setShippingInfo({ ...shippingInfo, name: e.target.value })}
                                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                placeholder="Nguyễn Văn A"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                <i className="fa-solid fa-location-dot text-blue-600 mr-2" />
                                                Địa chỉ
                                            </label>
                                            <input
                                                type="text"
                                                value={shippingInfo.address}
                                                onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                placeholder="Số nhà, đường..."
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Ghi chú</label>
                                            <input
                                                type="text"
                                                value={shippingInfo.note}
                                                onChange={(e) => setShippingInfo({ ...shippingInfo, note: e.target.value })}
                                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                placeholder="Ghi chú đơn hàng"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                                    >
                                        Tiếp tục thanh toán
                                        <i className="fa-solid fa-arrow-right w-5 h-5" />
                                    </button>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-6">
                                    <div className="bg-white rounded-3xl shadow-2xl p-8 backdrop-blur-sm bg-opacity-95 border border-gray-100">
                                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                            <i className="fa-solid fa-credit-card w-6 h-6 text-blue-600" />
                                            Phương thức thanh toán
                                        </h2>

                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <button
                                                type="button"
                                                onClick={() => setPaymentMethod('card')}
                                                className={`p-4 rounded-xl border-2 transition-all ${paymentMethod === 'card' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                <i
                                                    className={`fa-solid fa-credit-card w-8 h-8 mx-auto mb-2 ${paymentMethod === 'card' ? 'text-blue-600' : 'text-gray-400'
                                                        }`}
                                                />
                                                <p className="text-sm font-semibold text-center">Thẻ</p>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => setPaymentMethod('momo')}
                                                className={`p-4 rounded-xl border-2 transition-all ${paymentMethod === 'momo' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                <i
                                                    className={`fa-solid fa-wallet w-8 h-8 mx-auto mb-2 ${paymentMethod === 'momo' ? 'text-blue-600' : 'text-gray-400'
                                                        }`}
                                                />
                                                <p className="text-sm font-semibold text-center">MoMo</p>
                                            </button>
                                        </div>

                                        {paymentMethod === 'card' && (
                                            <div className="space-y-5">
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Số thẻ</label>
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            value={cardNumber}
                                                            onChange={(e) => formatCardNumber(e.target.value)}
                                                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 pl-11 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                            placeholder="1234 5678 9012 3456"
                                                            required
                                                        />
                                                        <i className="fa-solid fa-credit-card absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Tên chủ thẻ</label>
                                                    <input
                                                        type="text"
                                                        value={cardName}
                                                        onChange={(e) => setCardName(e.target.value)}
                                                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                        placeholder="NGUYEN VAN A"
                                                        required
                                                    />
                                                </div>

                                                <div className="grid grid-cols-2 gap-5">
                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                            <i className="fa-regular fa-calendar text-blue-600 mr-2" />
                                                            Hết hạn
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={expiry}
                                                            onChange={(e) => formatExpiry(e.target.value)}
                                                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                            placeholder="MM/YY"
                                                            maxLength="5"
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                            <i className="fa-solid fa-lock text-blue-600 mr-2" />
                                                            CVV
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={cvv}
                                                            onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0, 4))}
                                                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                            placeholder="123"
                                                            maxLength="4"
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3 pt-2">
                                                    <input
                                                        type="checkbox"
                                                        id="saveCard"
                                                        checked={saveCard}
                                                        onChange={(e) => setSaveCard(e.target.checked)}
                                                        className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                                    />
                                                    <label htmlFor="saveCard" className="text-sm font-medium text-gray-700 cursor-pointer">
                                                        Lưu thẻ cho lần sau
                                                    </label>
                                                </div>
                                            </div>
                                        )}

                                        {paymentMethod === 'momo' && (
                                            <div className="text-center py-8">
                                                <i className="fa-solid fa-wallet text-blue-600 text-5xl mb-4" />
                                                <p className="text-gray-600 mb-4">
                                                    Bạn sẽ được chuyển sang <b>MoMo</b> để hoàn tất thanh toán.
                                                </p>
                                                <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-800">
                                                    Nhấn “Hoàn tất thanh toán” để tiếp tục đến MoMo
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setStep(1)}
                                            className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl font-bold text-lg hover:bg-gray-200 transition-all duration-300"
                                            disabled={loading}
                                        >
                                            Quay lại
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-70"
                                            disabled={loading}
                                        >
                                            <i className="fa-solid fa-lock w-5 h-5" />
                                            {loading ? 'Đang xử lý...' : 'Hoàn tất thanh toán'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl shadow-2xl p-8 sticky top-8 backdrop-blur-sm bg-opacity-95 border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Tóm tắt đơn hàng</h2>

                            <div className="space-y-3 mb-6 pb-6 border-b-2 border-gray-200">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Tổng tiền sản phẩm</span>
                                    <span className="font-semibold text-gray-900">{fmtVND(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Vận chuyển</span>
                                    <span className="font-semibold text-green-600">
                                        {shippingFee === 0 ? 'Miễn phí' : fmtVND(shippingFee)}
                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mb-6">
                                <span className="text-xl font-bold text-gray-900">Tổng cộng</span>
                                <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                    {fmtVND(total)}
                                </span>
                            </div>

                            <div className="space-y-3 pt-6 border-t-2 border-gray-200">
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <div className="bg-green-100 p-2 rounded-lg">
                                        <i className="fa-solid fa-shield-halved text-green-600" />
                                    </div>
                                    <span>Thanh toán bảo mật SSL 256-bit</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <div className="bg-blue-100 p-2 rounded-lg">
                                        <i className="fa-solid fa-lock text-blue-600" />
                                    </div>
                                    <span>Tuân thủ PCI DSS</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <div className="bg-purple-100 p-2 rounded-lg">
                                        <i className="fa-solid fa-truck-fast text-purple-600" />
                                    </div>
                                    <span>Đổi trả miễn phí trong 30 ngày</span>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t-2 border-gray-200">
                                <p className="text-xs text-gray-500 text-center mb-3">Chấp nhận</p>
                                <div className="flex justify-center gap-3 flex-wrap">
                                    <div className="bg-gray-100 px-3 py-2 rounded text-xs font-semibold">VISA</div>
                                    <div className="bg-gray-100 px-3 py-2 rounded text-xs font-semibold">Mastercard</div>
                                    <div className="bg-gray-100 px-3 py-2 rounded text-xs font-semibold">JCB</div>
                                    <div className="bg-gray-100 px-3 py-2 rounded text-xs font-semibold">MoMo</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
