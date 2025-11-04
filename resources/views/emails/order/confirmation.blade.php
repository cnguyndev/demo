<!DOCTYPE html>
<html lang="vi">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Xác nhận đơn hàng</title>
</head>

<body
    style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f7fa; padding: 40px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0"
                    style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.08);">

                    <!-- Header -->
                    <tr>
                        <td
                            style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">✓ Đặt hàng thành
                                công!</h1>
                            <p style="margin: 10px 0 0 0; color: #e0e7ff; font-size: 16px;">Cảm ơn bạn đã tin tưởng
                                {{ config('app.name') }}</p>
                        </td>
                    </tr>

                    <!-- Thông tin khách hàng -->
                    <tr>
                        <td style="padding: 30px;">
                            <p style="margin: 0 0 20px 0; font-size: 16px; color: #333;">Xin chào
                                <strong>{{ $order->name }}</strong>,
                            </p>
                            <p style="margin: 0 0 25px 0; font-size: 15px; color: #666;">Đơn hàng <strong
                                    style="color: #667eea;">#{{ $order->id }}</strong> của bạn đã được xác nhận và
                                thanh toán thành công.</p>

                            <table width="100%" cellpadding="0" cellspacing="0"
                                style="background-color: #f8f9fc; border-radius: 8px; border-left: 4px solid #667eea; margin-bottom: 25px;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <h3 style="margin: 0 0 15px 0; color: #333; font-size: 16px; font-weight: 600;">
                                            📋 Thông tin đơn hàng</h3>
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="padding:6px 0;color:#666;">Mã đơn hàng:</td>
                                                <td style="padding:6px 0;color:#333;font-weight:600;">
                                                    #{{ $order->id }}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding:6px 0;color:#666;">Người nhận:</td>
                                                <td style="padding:6px 0;color:#333;font-weight:600;">
                                                    {{ $order->name }}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding:6px 0;color:#666;">Số điện thoại:</td>
                                                <td style="padding:6px 0;color:#333;font-weight:600;">
                                                    {{ $order->phone }}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding:6px 0;color:#666;">Địa chỉ:</td>
                                                <td style="padding:6px 0;color:#333;font-weight:600;">
                                                    {{ $order->address }}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding:6px 0;color:#666;">Trạng thái:</td>
                                                <td><span
                                                        style="background-color:#10b981;color:#fff;padding:4px 12px;border-radius:12px;font-size:13px;">Đã
                                                        thanh toán</span></td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <h3 style="margin: 0 0 15px 0; color: #333; font-size: 16px; font-weight: 600;">🛒 Chi tiết
                                sản phẩm</h3>
                            <table width="100%" cellpadding="0" cellspacing="0"
                                style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; margin-bottom: 20px;">
                                <tr style="background-color: #f9fafb;">
                                    <th style="padding:12px;text-align:left;color:#666;font-size:13px;">Sản phẩm</th>
                                    <th style="padding:12px;text-align:center;color:#666;font-size:13px;">SL</th>
                                    <th style="padding:12px;text-align:right;color:#666;font-size:13px;">Đơn giá</th>
                                    <th style="padding:12px;text-align:right;color:#666;font-size:13px;">Thành tiền</th>
                                </tr>

                                @foreach ($details as $d)
                                    <tr>
                                        <td style="padding:12px;color:#333;border-bottom:1px solid #f3f4f6;">
                                           {{ $d->product->name }}</td>
                                        <td
                                            style="padding:12px;text-align:center;color:#333;border-bottom:1px solid #f3f4f6;">
                                            {{ (int) $d->qty }}</td>
                                        <td
                                            style="padding:12px;text-align:right;color:#666;border-bottom:1px solid #f3f4f6;">
                                            {{ number_format($d->price, 0, ',', '.') }}₫</td>
                                        <td
                                            style="padding:12px;text-align:right;color:#333;font-weight:600;border-bottom:1px solid #f3f4f6;">
                                            {{ number_format($d->amount, 0, ',', '.') }}₫</td>
                                    </tr>
                                @endforeach

                                <tr style="background-color:#f9fafb;">
                                    <td colspan="3"
                                        style="padding:15px;text-align:right;color:#333;font-weight:600;">Tổng cộng:
                                    </td>
                                    <td
                                        style="padding:15px;text-align:right;color:#667eea;font-size:18px;font-weight:700;">
                                        {{ number_format($details->sum('amount'), 0, ',', '.') }}₫</td>
                                </tr>
                            </table>

                            <div
                                style="background-color:#fef3c7;border-left:4px solid #f59e0b;padding:15px;border-radius:6px;margin-top:25px;">
                                <p style="margin:0;color:#92400e;font-size:14px;"><strong>💡 Lưu ý:</strong> Nếu có bất
                                    kỳ thắc mắc nào, vui lòng trả lời email này để được hỗ trợ.</p>
                            </div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td
                            style="background-color:#f9fafb;padding:30px;text-align:center;border-top:1px solid #e5e7eb;">
                            <p style="margin:0 0 10px 0;color:#333;font-size:15px;font-weight:600;">Cảm ơn bạn đã mua
                                sắm tại {{ config('app.name') }}!</p>
                            <p style="margin:0;color:#666;font-size:13px;">Chúng tôi rất vui được phục vụ bạn</p>
                            <p style="margin:15px 0 0;color:#9ca3af;font-size:12px;">© {{ date('Y') }}
                                {{ config('app.name') }}. All rights reserved.</p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>

</html>
