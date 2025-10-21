'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || '';

/* Utils */
const fmtVND = (n) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
        Number.isFinite(+n) ? +n : 0
    );

const fmtDate = (s) => {
    if (!s) return '—';
    const d = new Date(String(s).replace(' ', 'T'));
    return isNaN(+d) ? '—' : d.toLocaleString('vi-VN');
};

const sumAll = (details = []) =>
    details.reduce((s, d) => s + Number(d?.amount || 0), 0);

const sumUnpaid = (details = []) =>
    details.filter((d) => +d.status !== 1).reduce((s, d) => s + Number(d?.amount || 0), 0);

export default function OrderDetailPage() {
    const params = useParams();
    const id = params?.id;

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState('');

    useEffect(() => {
        if (!id) return;
        (async () => {
            try {
                setLoading(true);
                const r = await fetch(`${API_BASE}/order/${id}`);
                if (!r.ok) throw new Error(`HTTP ${r.status}`);
                const j = await r.json();
                setOrder(j);
                setErr('');
            } catch (e) {
                console.error(e);
                setErr('Không tải được đơn hàng.');
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    const total = useMemo(() => sumAll(order?.order_detail || []), [order?.order_detail]);
    const unpaid = useMemo(() => sumUnpaid(order?.order_detail || []), [order?.order_detail]);

    const onPayAgain = async () => {
        if (!order?.id) return;
        if (unpaid <= 0) {
            alert('Đơn hàng này không còn khoản nào cần thanh toán.');
            return;
        }
        try {
            const r = await fetch(`${API_BASE}/payments/momo/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId: order.id, amount: unpaid }),
            });
            if (!r.ok) throw new Error(`MoMo create HTTP ${r.status}`);
            const j = await r.json();
            const payUrl = j?.payUrl || j?.data?.payUrl;
            if (!payUrl) throw new Error('Không nhận được payUrl từ backend.');
            window.location.href = payUrl;
        } catch (e) {
            console.error(e);
            alert(e.message || 'Không thể khởi tạo thanh toán.');
        }
    };

    if (loading) return <div className="max-w-4xl mx-auto p-8">Đang tải…</div>;
    if (err || !order) return <div className="max-w-4xl mx-auto p-8 text-red-600">{err || 'Không tìm thấy đơn hàng.'}</div>;

    return (
        <div className="max-w-5xl mx-auto p-6 sm:p-10 mt-30">
            <div className="mb-6">
                <a href="/tai-khoan" className="text-gray-600 hover:text-gray-900 font-semibold inline-flex items-center gap-2">
                    <i className="fa-solid fa-arrow-left" />
                    Quay lại tài khoản
                </a>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-white flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold">Đơn hàng #{order.id}</h1>
                        <p className="text-blue-100 mt-1">Tạo lúc: {fmtDate(order.created_at)}</p>
                    </div>
                    <div className="text-right">
                        <div
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold ${+order.status === 1
                                ? 'bg-green-500/20 text-green-200 border border-green-300/40'
                                : 'bg-amber-500/20 text-amber-200 border border-amber-300/40'
                                }`}
                        >
                            <i className={`fa-solid ${+order.status === 1 ? 'fa-circle-check' : 'fa-clock'}`} />
                            {+order.status === 1 ? 'Thành công' : 'Chờ xử lý'}
                        </div>
                    </div>
                </div>

                <div className="p-6 sm:p-8">
                    {/* Thông tin giao hàng */}
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <div className="rounded-xl border-2 border-gray-100 p-5">
                            <h3 className="font-bold text-gray-900 mb-3">Người nhận</h3>
                            <div className="space-y-1 text-sm text-gray-700">
                                <div><span className="font-medium">Họ tên:</span> {order.name}</div>
                                <div><span className="font-medium">Email:</span> {order.email}</div>
                                <div><span className="font-medium">Điện thoại:</span> {order.phone}</div>
                                <div><span className="font-medium">Địa chỉ:</span> {order.address}</div>
                                {order.note && <div><span className="font-medium">Ghi chú:</span> {order.note}</div>}
                            </div>
                        </div>
                        <div className="rounded-xl border-2 border-gray-100 p-5">
                            <h3 className="font-bold text-gray-900 mb-3">Tổng quan</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Tổng giá trị đơn</span>
                                    <span className="font-semibold">{fmtVND(total)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Đã thanh toán</span>
                                    <span className="font-semibold">
                                        {fmtVND(total - sumUnpaid(order.order_detail || []))}
                                    </span>
                                </div>
                                <div className="flex justify-between text-base mt-2">
                                    <span className="font-bold text-gray-900">Còn phải trả</span>
                                    <span className="text-2xl font-extrabold text-blue-600">{fmtVND(unpaid)}</span>
                                </div>
                                {unpaid > 0 && (
                                    <button
                                        onClick={onPayAgain}
                                        className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-bold hover:shadow-xl transition-all"
                                    >
                                        <i className="fa-solid fa-wallet mr-2" />
                                        Thanh toán lại {fmtVND(unpaid)}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Bảng chi tiết */}
                    <div className="rounded-2xl border-2 border-gray-100 overflow-hidden">
                        <div className="bg-gray-50 px-5 py-4 font-bold text-gray-900">Chi tiết sản phẩm</div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-600">
                                        <th className="text-left px-5 py-3">#</th>
                                        <th className="text-left px-5 py-3">Sản phẩm</th>
                                        <th className="text-right px-5 py-3">Đơn giá</th>
                                        <th className="text-center px-5 py-3">SL</th>
                                        <th className="text-right px-5 py-3">Thành tiền</th>
                                        <th className="text-center px-5 py-3">Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(order?.order_detail || []).map((d, idx) => (
                                        <tr key={d.id} className="border-t border-gray-100">
                                            <td className="px-5 py-3">{idx + 1}</td>
                                            <td className="px-5 py-3">Sản phẩm #{d.product_id}</td>
                                            <td className="px-5 py-3 text-right">{fmtVND(d.price)}</td>
                                            <td className="px-5 py-3 text-center">{d.qty}</td>
                                            <td className="px-5 py-3 text-right font-semibold">{fmtVND(d.amount)}</td>
                                            <td className="px-5 py-3 text-center">
                                                {+d.status === 1 ? (
                                                    <span className="text-green-700 bg-green-50 border border-green-200 px-2 py-1 rounded-full text-xs font-bold">
                                                        Đã thanh toán
                                                    </span>
                                                ) : (
                                                    <span className="text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded-full text-xs font-bold">
                                                        Chưa thanh toán
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    <tr className="bg-gray-50 border-t-2 border-gray-100">
                                        <td colSpan={4} className="px-5 py-4 text-right font-bold">Tổng cộng</td>
                                        <td className="px-5 py-4 text-right text-blue-600 font-extrabold text-lg">
                                            {fmtVND(total)}
                                        </td>
                                        <td />
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Footer actions */}
                    <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                        <a
                            href="/tai-khoan"
                            className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 font-semibold text-gray-700 transition-all"
                        >
                            Về tài khoản
                        </a>
                        {unpaid > 0 && (
                            <button
                                onClick={onPayAgain}
                                className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold hover:shadow-xl transition-all"
                            >
                                Thanh toán lại {fmtVND(unpaid)}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
