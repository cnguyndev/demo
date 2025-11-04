<!DOCTYPE html>
<html lang="vi">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chào mừng bạn đến với {{ config('app.name') }}</title>
</head>

<body
    style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f7fa; padding: 40px 0;">
        <tr>
            <td align="center">
                <!-- Container chính -->
                <table width="600" cellpadding="0" cellspacing="0"
                    style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.08);">

                    <!-- Header với gradient -->
                    <tr>
                        <td
                            style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 50px 30px; text-align: center;">
                            <div
                                style="background-color: rgba(255,255,255,0.2); width: 80px; height: 80px; margin: 0 auto 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                <span style="font-size: 48px;">🎉</span>
                            </div>
                            <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700;">
                                Chào mừng bạn!
                            </h1>
                            <p style="margin: 12px 0 0 0; color: #d1fae5; font-size: 16px;">
                                Tài khoản của bạn đã được tạo thành công
                            </p>
                        </td>
                    </tr>

                    <!-- Nội dung chính -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <p style="margin: 0 0 20px 0; font-size: 17px; color: #333333; line-height: 1.6;">
                                Xin chào <strong style="color: #10b981;">{{ $user->name }}</strong>,
                            </p>
                            <p style="margin: 0 0 25px 0; font-size: 15px; color: #666666; line-height: 1.8;">
                                Cảm ơn bạn đã đăng ký tài khoản tại <strong>{{ config('app.name') }}</strong>. Chúng tôi
                                rất vui mừng được chào đón bạn trở thành thành viên của cộng đồng!
                            </p>

                            <!-- Box thông tin tài khoản -->
                            <table width="100%" cellpadding="0" cellspacing="0"
                                style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border-radius: 12px; margin-bottom: 30px; border: 2px solid #10b981;">
                                <tr>
                                    <td style="padding: 25px;">
                                        <h3
                                            style="margin: 0 0 18px 0; color: #065f46; font-size: 16px; font-weight: 600;">
                                            ✅ Thông tin tài khoản
                                        </h3>
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td
                                                    style="padding: 8px 0; color: #047857; font-size: 14px; width: 35%; font-weight: 500;">
                                                    Họ và tên:</td>
                                                <td
                                                    style="padding: 8px 0; color: #065f46; font-size: 14px; font-weight: 600;">
                                                    {{ $user->name }}</td>
                                            </tr>
                                            <tr>
                                                <td
                                                    style="padding: 8px 0; color: #047857; font-size: 14px; font-weight: 500;">
                                                    Email:</td>
                                                <td
                                                    style="padding: 8px 0; color: #065f46; font-size: 14px; font-weight: 600;">
                                                    {{ $user->email }}</td>
                                            </tr>
                                            <tr>
                                                <td
                                                    style="padding: 8px 0; color: #047857; font-size: 14px; font-weight: 500;">
                                                    Ngày đăng ký:</td>
                                                <td
                                                    style="padding: 8px 0; color: #065f46; font-size: 14px; font-weight: 600;">
                                                    {{ $user->created_at->format('d/m/Y H:i') }}</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- Các bước tiếp theo -->
                            <h3 style="margin: 0 0 20px 0; color: #333333; font-size: 18px; font-weight: 600;">
                                🚀 Bắt đầu với {{ config('app.name') }}
                            </h3>

                            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                                <!-- Bước 1 -->
                                <tr>
                                    <td style="padding: 15px 0;">
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="width: 40px; vertical-align: top;">
                                                    <div
                                                        style="width: 32px; height: 32px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #ffffff; font-weight: 700; font-size: 14px;">
                                                        1</div>
                                                </td>
                                                <td>
                                                    <h4
                                                        style="margin: 0 0 6px 0; color: #333333; font-size: 15px; font-weight: 600;">
                                                        Hoàn thiện hồ sơ của bạn
                                                    </h4>
                                                    <p
                                                        style="margin: 0; color: #666666; font-size: 14px; line-height: 1.6;">
                                                        Cập nhật ảnh đại diện, số điện thoại và địa chỉ để có trải
                                                        nghiệm tốt nhất
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <!-- Bước 2 -->
                                <tr>
                                    <td style="padding: 15px 0;">
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="width: 40px; vertical-align: top;">
                                                    <div
                                                        style="width: 32px; height: 32px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #ffffff; font-weight: 700; font-size: 14px;">
                                                        2</div>
                                                </td>
                                                <td>
                                                    <h4
                                                        style="margin: 0 0 6px 0; color: #333333; font-size: 15px; font-weight: 600;">
                                                        Khám phá sản phẩm
                                                    </h4>
                                                    <p
                                                        style="margin: 0; color: #666666; font-size: 14px; line-height: 1.6;">
                                                        Duyệt qua hàng ngàn sản phẩm chất lượng với giá tốt nhất
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <!-- Bước 3 -->
                                <tr>
                                    <td style="padding: 15px 0;">
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="width: 40px; vertical-align: top;">
                                                    <div
                                                        style="width: 32px; height: 32px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #ffffff; font-weight: 700; font-size: 14px;">
                                                        3</div>
                                                </td>
                                                <td>
                                                    <h4
                                                        style="margin: 0 0 6px 0; color: #333333; font-size: 15px; font-weight: 600;">
                                                        Nhận ưu đãi đặc biệt
                                                    </h4>
                                                    <p
                                                        style="margin: 0; color: #666666; font-size: 14px; line-height: 1.6;">
                                                        Thành viên mới được giảm giá <strong
                                                            style="color: #10b981;">20%</strong> cho đơn hàng đầu tiên
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- Mã giảm giá -->
                            <table width="100%" cellpadding="0" cellspacing="0"
                                style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 12px; margin-bottom: 30px; border: 2px dashed #f59e0b;">
                                <tr>
                                    <td style="padding: 25px; text-align: center;">
                                        <p
                                            style="margin: 0 0 10px 0; color: #92400e; font-size: 14px; font-weight: 600;">
                                            🎁 MÃ GIẢM GIÁ ĐẶC BIỆT
                                        </p>
                                        <div
                                            style="background-color: #ffffff; padding: 15px 25px; border-radius: 8px; display: inline-block; margin-bottom: 10px;">
                                            <span
                                                style="font-size: 24px; font-weight: 700; color: #f59e0b; letter-spacing: 2px;">
                                                WELCOME20
                                            </span>
                                        </div>
                                        <p style="margin: 0; color: #92400e; font-size: 13px;">
                                            Giảm 20% cho đơn hàng đầu tiên • Có hiệu lực trong 30 ngày
                                        </p>
                                    </td>
                                </tr>
                            </table>

                            <!-- CTA Buttons -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                                <tr>
                                    <td align="center">
                                        <table cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="padding: 0 8px;">
                                                    <a href="{{ url('/profile') }}"
                                                        style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; text-decoration: none; padding: 14px 35px; border-radius: 8px; font-size: 15px; font-weight: 600; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);">
                                                        Hoàn thiện hồ sơ
                                                    </a>
                                                </td>
                                                <td style="padding: 0 8px;">
                                                    <a href="{{ url('/products') }}"
                                                        style="display: inline-block; background-color: #ffffff; color: #10b981; text-decoration: none; padding: 14px 35px; border-radius: 8px; font-size: 15px; font-weight: 600; border: 2px solid #10b981;">
                                                        Mua sắm ngay
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- Lưu ý bảo mật -->
                            <div
                                style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 18px; border-radius: 6px; margin-top: 30px;">
                                <p style="margin: 0 0 8px 0; color: #1e40af; font-size: 14px; font-weight: 600;">
                                    🔒 Bảo mật tài khoản
                                </p>
                                <p style="margin: 0; color: #1e3a8a; font-size: 13px; line-height: 1.6;">
                                    Để bảo vệ tài khoản của bạn, đừng chia sẻ mật khẩu với bất kỳ ai. Nếu bạn không thực
                                    hiện đăng ký này, vui lòng liên hệ với chúng tôi ngay lập tức.
                                </p>
                            </div>

                        </td>
                    </tr>

                    <!-- Hỗ trợ -->
                    <tr>
                        <td style="background-color: #f9fafb; padding: 25px 30px; border-top: 1px solid #e5e7eb;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="text-align: center;">
                                        <p
                                            style="margin: 0 0 15px 0; color: #333333; font-size: 15px; font-weight: 600;">
                                            Bạn cần hỗ trợ?
                                        </p>
                                        <p
                                            style="margin: 0 0 15px 0; color: #666666; font-size: 14px; line-height: 1.6;">
                                            Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn 24/7
                                        </p>
                                        <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                                            <tr>
                                                <td style="padding: 0 10px;">
                                                    <a href="mailto:support@example.com"
                                                        style="color: #10b981; text-decoration: none; font-size: 14px; font-weight: 500;">
                                                        📧 Email hỗ trợ
                                                    </a>
                                                </td>
                                                <td style="padding: 0 10px; color: #d1d5db;">|</td>
                                                <td style="padding: 0 10px;">
                                                    <a href="tel:1900xxxx"
                                                        style="color: #10b981; text-decoration: none; font-size: 14px; font-weight: 500;">
                                                        📞 Hotline
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #111827; padding: 30px; text-align: center;">
                            <p style="margin: 0 0 12px 0; color: #ffffff; font-size: 16px; font-weight: 600;">
                                {{ config('app.name') }}
                            </p>
                            <p style="margin: 0 0 18px 0; color: #9ca3af; font-size: 13px; line-height: 1.6;">
                                Nơi mua sắm trực tuyến tin cậy hàng đầu
                            </p>
                            <div style="margin: 18px 0;">
                                <a href="#"
                                    style="display: inline-block; margin: 0 8px; color: #10b981; text-decoration: none; font-size: 13px; font-weight: 500;">Facebook</a>
                                <span style="color: #4b5563;">•</span>
                                <a href="#"
                                    style="display: inline-block; margin: 0 8px; color: #10b981; text-decoration: none; font-size: 13px; font-weight: 500;">Instagram</a>
                                <span style="color: #4b5563;">•</span>
                                <a href="#"
                                    style="display: inline-block; margin: 0 8px; color: #10b981; text-decoration: none; font-size: 13px; font-weight: 500;">Twitter</a>
                            </div>
                            <p style="margin: 20px 0 0 0; color: #6b7280; font-size: 12px;">
                                © {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
                            </p>
                            <p style="margin: 8px 0 0 0; color: #6b7280; font-size: 11px;">
                                Bạn nhận được email này vì đã đăng ký tài khoản tại {{ config('app.name') }}
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>

</html>
