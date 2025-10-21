'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

const fmtVND = (n) => {
    if (n === null || n === undefined || n === '') return '—';
    const num = Number(n);
    if (Number.isNaN(num)) return String(n);
    return num.toLocaleString('vi-VN') + '₫';
};

export default function ProductShowPage() {
    const { id } = useParams();
    const router = useRouter();

    const [state, setState] = useState({ loading: true, error: null });
    const [data, setData] = useState(null);

    useEffect(() => {
        if (!id) return;
        (async () => {
            setState({ loading: true, error: null });
            try {
                const res = await fetch(`${API_BASE}/getAdminProductDetail/${id}`);
                if (!res.ok) throw new Error('Không tải được dữ liệu sản phẩm.');
                const json = await res.json();
                setData(json?.data || json);
            } catch (e) {
                setState({ loading: false, error: e.message });
                return;
            }
            setState({ loading: false, error: null });
        })();
    }, [id]);

    if (state.loading) {
        return <div className="p-8 text-center animate-pulse">Đang tải thông tin sản phẩm...</div>;
    }
    if (state.error) {
        return (
            <div className="p-8 text-center">
                <p className="text-red-600 mb-4">Lỗi: {state.error}</p>
                <Link href="/admin/product" className="text-indigo-600 hover:underline">
                    ← Quay lại danh sách
                </Link>
            </div>
        );
    }
    if (!data) return null;

    const {
        name,
        slug,
        thumbnail,
        description,
        content,
        price_buy,
        status,
        category,
        product_store,
        product_attribute,
        product_image,
        created_at,
        updated_at,
    } = data;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Chi tiết sản phẩm</h1>
                    <p className="text-sm text-gray-500 mt-1">ID: {id} • Slug: {slug}</p>
                    <p className="text-xs text-gray-400 mt-1">
                        Tạo: {new Date(created_at).toLocaleString('vi-VN')} {updated_at ? `• Cập nhật: ${new Date(updated_at).toLocaleString('vi-VN')}` : ''}
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link
                        href="/admin/product"
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium rounded-lg"
                    >
                        ← Danh sách
                    </Link>
                    <Link
                        href={`/admin/product/${id}/edit`}
                        className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg"
                    >
                        Sửa sản phẩm
                    </Link>
                </div>
            </div>

            {/* Name + Status */}
            <div className="bg-white p-6 shadow-sm rounded-lg border">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">{name}</h2>
                    <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${Number(status) === 1 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
                            }`}
                    >
                        {Number(status) === 1 ? 'Đang bán' : 'Ngừng bán'}
                    </span>
                </div>
                {category && (
                    <p className="text-sm text-gray-600 mt-2">
                        Danh mục:&nbsp;
                        <span className="font-medium">{category?.name}</span>
                        {category?.parent_id ? (
                            <span className="text-gray-400"> (parent #{category.parent_id})</span>
                        ) : null}
                    </p>
                )}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: 2 cols */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Thumbnail + Gallery */}
                    <div className="bg-white p-6 shadow-sm rounded-lg border">
                        <h3 className="text-lg font-semibold mb-4">Hình ảnh</h3>
                        <div className="flex items-start gap-6">
                            <div className="min-w-[140px]">
                                <p className="text-sm text-gray-500 mb-2">Ảnh đại diện</p>
                                {thumbnail ? (
                                    <Image
                                        src={thumbnail}
                                        alt={name}
                                        width={160}
                                        height={160}
                                        className="rounded-lg border object-cover aspect-square"
                                    />
                                ) : (
                                    <div className="w-40 h-40 grid place-content-center border rounded-lg text-gray-400 text-sm">
                                        Không có ảnh
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-500 mb-2">Album ({product_image?.length || 0})</p>
                                {Array.isArray(product_image) && product_image.length > 0 ? (
                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                                        {product_image.map((img) => (
                                            <div key={img.id} className="relative">
                                                <Image
                                                    src={img.image}
                                                    alt={img.title || name}
                                                    width={110}
                                                    height={110}
                                                    className="rounded-lg border object-cover aspect-square"
                                                />
                                                <div className="absolute bottom-1 left-1 bg-black/50 text-white text-[10px] px-1 rounded">
                                                    #{img.id}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-sm">Chưa có ảnh album.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Mô tả / Nội dung */}
                    <div className="bg-white p-6 shadow-sm rounded-lg border space-y-4">
                        <h3 className="text-lg font-semibold">Mô tả & Nội dung</h3>
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Mô tả ngắn</p>
                            <div className="text-gray-800 whitespace-pre-line">{description || '—'}</div>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Nội dung chi tiết</p>
                            <div className="text-gray-800 whitespace-pre-line">{content || '—'}</div>
                        </div>
                    </div>

                    {/* Thuộc tính */}
                    <div className="bg-white p-6 shadow-sm rounded-lg border">
                        <h3 className="text-lg font-semibold mb-4">Thuộc tính sản phẩm</h3>
                        {Array.isArray(product_attribute) && product_attribute.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {product_attribute.map((a) => (
                                    <div key={a.id} className="flex items-center justify-between border rounded-lg px-3 py-2">
                                        <div className="text-sm text-gray-500">{a?.attribute?.name || `#${a.attribute_id}`}</div>
                                        <div className="text-sm font-medium">{a.value}</div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm">Chưa có thuộc tính.</p>
                        )}
                    </div>
                </div>

                {/* Right: 1 col */}
                <div className="lg:col-span-1 space-y-8">
                    {/* Giá & Kho */}
                    <div className="bg-white p-6 shadow-sm rounded-lg border">
                        <h3 className="text-lg font-semibold mb-4">Giá & Kho</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">Giá bán</span>
                                <span className="text-base font-semibold">{fmtVND(price_buy)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">Giá gốc</span>
                                <span className="text-sm font-medium">
                                    {fmtVND(product_store?.price_root ?? '—')}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">Số lượng tồn kho</span>
                                <span className="text-sm font-medium">
                                    {product_store?.qty ?? '—'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Danh mục */}
                    <div className="bg-white p-6 shadow-sm rounded-lg border">
                        <h3 className="text-lg font-semibold mb-4">Danh mục</h3>
                        {category ? (
                            <div className="space-y-1">
                                <div className="text-sm"><span className="text-gray-500">Tên:</span> <span className="font-medium">{category.name}</span></div>
                                <div className="text-sm"><span className="text-gray-500">Slug:</span> <span>{category.slug}</span></div>
                                <div className="text-sm"><span className="text-gray-500">Parent ID:</span> <span>{category.parent_id ?? '—'}</span></div>
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm">—</p>
                        )}
                    </div>

                    {/* Hành động nhanh */}
                    <div className="bg-white p-6 shadow-sm rounded-lg border">
                        <h3 className="text-lg font-semibold mb-4">Hành động</h3>
                        <div className="flex flex-col gap-3">
                            <Link
                                href={`/admin/product/edit/${id}`}
                                className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm"
                            >
                                Sửa sản phẩm
                            </Link>
                            <button
                                onClick={() => router.push('/admin/product')}
                                className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gray-200 text-gray-800 text-sm hover:bg-gray-300"
                            >
                                Quay lại danh sách
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
