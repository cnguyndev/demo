'use client'
import React, { useEffect, useState, useMemo } from 'react'
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

const formatCurrency = (value) => {
    if (isNaN(parseFloat(value))) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const getOrderStatus = (status) => {
    switch (status) {
        case 0: return {
            text: 'Đã hủy',
            className: 'bg-red-50 text-red-700 border-red-200',
        };
        case 1: return {
            text: 'Chờ xử lý',
            className: 'bg-amber-50 text-amber-700 border-amber-200',
        };
        case 2: return {
            text: 'Đang giao hàng',
            className: 'bg-blue-50 text-blue-700 border-blue-200',
        };
        case 3: return {
            text: 'Đã giao',
            className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        };
        default: return {
            text: 'Không xác định',
            className: 'bg-gray-50 text-gray-700 border-gray-200',
        };
    }
};

const Page = () => {
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const userString = localStorage.getItem('user');

        if (userString) {
            const userData = JSON.parse(userString);
            setUser(userData);
        }
    }, [router]);
    const { id } = useParams();

    const [orderData, setOrderData] = useState(null);
    const [currentStatus, setCurrentStatus] = useState('');
    const [state, setState] = useState({ loading: true, submitting: false, error: null });

    const fetchOrderData = async () => {
        if (!id || isNaN(Number(id))) {
            alert("ID đơn hàng không hợp lệ!");
            router.push("/admin/order");
            return;
        }

        setState(s => ({ ...s, loading: true, error: null }));
        try {
            const res = await fetch(`${API_BASE}/order/${id}`);
            if (res.status === 404) throw new Error("Không tìm thấy đơn hàng!");
            if (!res.ok) throw new Error(`Order HTTP ${res.status}`);

            const json = await res.json();
            setOrderData(json);
            setCurrentStatus(json.status.toString());
        } catch (e) {
            setState(s => ({ ...s, error: e.message, loading: false }));
        } finally {
            setState(s => ({ ...s, loading: false }));
        }
    };

    useEffect(() => {
        fetchOrderData();
    }, [id, router]);

    console.log(orderData);

    const orderTotals = useMemo(() => {
        if (!orderData) return { subtotal: 0, totalDiscount: 0, grandTotal: 0 };

        let subtotal = 0;
        let grandTotal = 0;

        orderData.order_detail?.forEach(item => {
            const itemSubtotal = parseFloat(item.price) * item.qty;
            subtotal += itemSubtotal;
            grandTotal += parseFloat(item.amount);
        });

        const totalDiscount = subtotal - grandTotal;
        return { subtotal, totalDiscount, grandTotal };
    }, [orderData]);

    const handleStatusUpdate = async () => {
        setState(s => ({ ...s, submitting: true }));
        try {
            const payload = {
                status: Number(currentStatus),
                updated_at: new Date().toISOString(),
                updated_by: user?.id || 0,
            };
            const res = await fetch(`${API_BASE}/updateStatusOrder/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Cập nhật thất bại');
            }
            alert('Cập nhật trạng thái thành công!');
            fetchOrderData();
        } catch (err) {
            alert(`Lỗi: ${err.message}`);
        } finally {
            setState(s => ({ ...s, submitting: false }));
        }
    }

    if (state.loading) return <p className="p-8 text-center">Đang tải dữ liệu...</p>;
    if (state.error) return <p className="p-8 text-center text-red-500">Lỗi: {state.error}</p>;
    if (!orderData) return null;

    const statusInfo = getOrderStatus(orderData.status);

    return (
        <>
            <div className="bg-white shadow-xl rounded-2xl border border-gray-200">
                <div className="p-6 md:p-8 border-b border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div>
                            <h6 className="text-2xl text-gray-800 font-bold mb-2">Chi tiết Đơn hàng #{orderData.id}</h6>
                            <p className="text-sm text-gray-600">
                                Đặt lúc: {new Date(orderData.created_at).toLocaleString('vi-VN')}
                            </p>
                        </div>
                        <div className="mt-4 md:mt-0">
                            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border ${statusInfo.className}`}>
                                {statusInfo.text}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="p-6 md:p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <div className="rounded-xl p-6 border border-gray-200">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                Thông tin khách hàng
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-blue-100 rounded-full p-2">
                                        <span className="text-blue-600">👤</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">{orderData.name}</p>
                                        <p className="text-sm text-gray-600">{orderData.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="bg-green-100 rounded-full p-2">
                                        <span className="text-green-600">📞</span>
                                    </div>
                                    <p className="text-gray-900 font-medium">{orderData.phone}</p>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="bg-orange-100 rounded-full p-2 mt-0.5">
                                        <span className="text-orange-600">📍</span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 mb-1">Địa chỉ giao hàng:</p>
                                        <p className="text-gray-600">{orderData.address}</p>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                                        <div className="flex items-start">
                                            <span className="text-yellow-600 mr-2">📝</span>
                                            <div>
                                                <p className="font-medium text-gray-900 mb-1">Ghi chú:</p>
                                                <p className="text-sm text-gray-700 italic">"{orderData.note || "Không có ghi chú"}"</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl p-6 border border-gray-200">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                Cập nhật trạng thái đơn hàng
                            </h3>
                            <div className="space-y-4">
                                <p className="text-sm font-medium text-gray-700 mb-2">Trạng thái hiện tại: <span className='font-semibold text-gray-900'>{statusInfo.text}</span></p>

                                <div>
                                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                                        Thay đổi trạng thái:
                                    </label>
                                    <select
                                        id="status"
                                        name="status"
                                        value={currentStatus}
                                        onChange={e => setCurrentStatus(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white"
                                    >
                                        <option value="1">Chờ xử lý</option>
                                        <option value="2">Đang giao hàng</option>
                                        <option value="3">Đã giao</option>
                                        <option value="0">Đã hủy</option>
                                    </select>
                                </div>

                                <button
                                    onClick={handleStatusUpdate}
                                    disabled={state.submitting || currentStatus == orderData.status}
                                    className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                >
                                    {state.submitting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            <span>Đang lưu...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Lưu thay đổi</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>


                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center">
                                Các sản phẩm trong đơn
                                <span className="ml-2 text-sm font-normal text-gray-500">
                                    ({orderData.order_detail.length} sản phẩm)
                                </span>
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm align-top text-slate-600">
                                <thead className="align-bottom">
                                    <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b border-gray-200">
                                        <th className="px-6 py-3 w-[50%]">Sản phẩm</th>
                                        <th className="px-6 py-3 w-[15%]">Đơn giá</th>
                                        <th className="px-6 py-3 w-[15%]">Số lượng</th>
                                        <th className="px-6 py-3 w-[20%] text-right">Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    {orderData.order_detail.map(item => (
                                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-16 w-16">
                                                        <Image
                                                            src={item.product.thumbnail}
                                                            alt={item.product.name}
                                                            width={64}
                                                            height={64}
                                                            className="h-16 w-16 rounded-lg object-cover shadow-sm border border-gray-200"
                                                            unoptimized
                                                        />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{item.product.name}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">{formatCurrency(item.price)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                                    {item.qty}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-gray-900">{formatCurrency(item.amount)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-6 border-t border-gray-200">
                            <div className="flex justify-end">
                                <div className="w-full max-w-xs">
                                    <dl className="space-y-3">
                                        <div className="flex justify-between text-base">
                                            <dt className="text-gray-600">Tạm tính:</dt>
                                            <dd className="font-medium text-gray-900">{formatCurrency(orderTotals.subtotal)}</dd>
                                        </div>
                                        {orderTotals.totalDiscount > 0 && (
                                            <div className="flex justify-between text-base">
                                                <dt className="text-gray-600">Giảm giá:</dt>
                                                <dd className="font-medium text-red-600">-{formatCurrency(orderTotals.totalDiscount)}</dd>
                                            </div>
                                        )}
                                        <div className="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t border-gray-300">
                                            <dt>Tổng cộng:</dt>
                                            <dd className="text-indigo-600">{formatCurrency(orderTotals.grandTotal)}</dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-x-4 mt-8 pt-6 border-t border-gray-200">
                        <Link href={"/admin/order"}
                            className="px-6 py-3 bg-gradient-to-r bg-gray-400 hover:bg-gray-500 text-white text-sm font-medium rounded-lg transition-all duration-200 flex items-center space-x-2">
                            <span>←</span>
                            <span>Quay lại danh sách</span>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Page;