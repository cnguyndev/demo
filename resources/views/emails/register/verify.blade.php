<!DOCTYPE html>
<html lang="vi">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Xác thực tài khoản</title>
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
                            style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 50px 30px; text-align: center;">
                            <div
                                style="width: 80px; height: 80px; margin: 0 auto 20px; background-color: rgba(255,255,255,0.15); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">
                                <span style="font-size: 42px;">✉️</span>
                            </div>
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                                Xác thực tài khoản
                            </h1>
                            <p style="margin: 12px 0 0 0; color: #e0e7ff; font-size: 15px;">
                                Chỉ còn một bước nữa để hoàn tất đăng ký
                            </p>
                        </td>
                    </tr>

                    <!-- Nội dung chính -->
                    <tr>
                        <td style="padding: 40px 35px;">
                            <p style="margin: 0 0 20px 0; font-size: 16px; color: #333333; line-height: 1.6;">
                                Xin chào <strong style="color: #4f46e5;">{{ $user->name }}</strong>,
                            </p>
                            <p style="margin: 0 0 15px 0; font-size: 15px; color: #666666; line-height: 1.7;">
                                Cảm ơn bạn đã đăng ký tài khoản tại <strong>{{ config('app.name') }}</strong>.
                            </p>
                            <p style="margin: 0 0 30px 0; font-size: 15px; color: #666666; line-height: 1.7;">
                                Để đảm bảo an toàn và hoàn tất quá trình đăng ký, vui lòng xác thực địa chỉ email của
                                bạn bằng cách nhấn vào nút bên dưới:
                            </p>

                            <!-- CTA Button -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 35px 0;">
                                <tr>
                                    <td align="center">
                                        <a href="{{ $verifyUrl }}"
                                            style="display: inline-block; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: #ffffff; text-decoration: none; padding: 16px 50px; border-radius: 10px; font-size: 16px; font-weight: 600; box-shadow: 0 6px 20px rgba(79, 70, 229, 0.4); transition: all 0.3s;">
                                            🔐 Xác thực tài khoản ngay
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <!-- Hoặc copy link -->
                            <div
                                style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 30px 0; border: 1px solid #e5e7eb;">
                                <p style="margin: 0 0 12px 0; color: #333333; font-size: 14px; font-weight: 600;">
                                    Hoặc copy link sau vào trình duyệt:
                                </p>
                                <p
                                    style="margin: 0; word-break: break-all; font-size: 13px; color: #4f46e5; line-height: 1.6;">
                                    {{ $verifyUrl }}
                                </p>
                            </div>

                            <!-- Thông tin quan trọng -->
                            <div
                                style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 18px; border-radius: 6px; margin: 25px 0;">
                                <table width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td style="width: 30px; vertical-align: top; padding-top: 2px;">
                                            <span style="font-size: 20px;">⏰</span>
                                        </td>
                                        <td>
                                            <p
                                                style="margin: 0 0 8px 0; color: #92400e; font-size: 14px; font-weight: 600;">
                                                Lưu ý quan trọng
                                            </p>
                                            <p style="margin: 0; color: #92400e; font-size: 13px; line-height: 1.6;">
                                                Link xác thực này sẽ <strong>hết hạn sau 60 phút</strong>. Nếu link hết
                                                hạn, bạn có thể yêu cầu gửi lại email xác thực.
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </div>

                            <!-- Bảo mật -->
                            <div
                                style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 18px; border-radius: 6px; margin: 25px 0;">
                                <table width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td style="width: 30px; vertical-align: top; padding-top: 2px;">
                                            <span style="font-size: 20px;">🔒</span>
                                        </td>
                                        <td>
                                            <p
                                                style="margin: 0 0 8px 0; color: #1e40af; font-size: 14px; font-weight: 600;">
                                                Bảo mật & An toàn
                                            </p>
                                            <p style="margin: 0; color: #1e3a8a; font-size: 13px; line-height: 1.6;">
                                                Nếu bạn <strong>không thực hiện đăng ký</strong> này, vui lòng bỏ qua
                                                email này. Tài khoản sẽ không được kích hoạt nếu không xác thực.
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </div>

                            <!-- Tại sao cần xác thực -->
                            <div style="margin-top: 35px; padding-top: 25px; border-top: 1px solid #e5e7eb;">
                                <h3 style="margin: 0 0 15px 0; color: #333333; font-size: 16px; font-weight: 600;">
                                    💡 Tại sao cần xác thực email?
                                </h3>
                                <table width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td style="padding: 8px 0;">
                                            <table width="100%" cellpadding="0" cellspacing="0">
                                                <tr>
                                                    <td style="width: 24px; vertical-align: top; padding-top: 2px;">
                                                        <span style="color: #10b981; font-size: 16px;">✓</span>
                                                    </td>
                                                    <td>
                                                        <p
                                                            style="margin: 0; color: #666666; font-size: 14px; line-height: 1.6;">
                                                            Bảo vệ tài khoản của bạn khỏi truy cập trái phép
                                                        </p>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0;">
                                            <table width="100%" cellpadding="0" cellspacing="0">
                                                <tr>
                                                    <td style="width: 24px; vertical-align: top; padding-top: 2px;">
                                                        <span style="color: #10b981; font-size: 16px;">✓</span>
                                                    </td>
                                                    <td>
                                                        <p
                                                            style="margin: 0; color: #666666; font-size: 14px; line-height: 1.6;">
                                                            Đảm bảo bạn nhận được thông báo quan trọng
                                                        </p>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0;">
                                            <table width="100%" cellpadding="0" cellspacing="0">
                                                <tr>
                                                    <td style="width: 24px; vertical-align: top; padding-top: 2px;">
                                                        <span style="color: #10b981; font-size: 16px;">✓</span>
                                                    </td>
                                                    <td>
                                                        <p
                                                            style="margin: 0; color: #666666; font-size: 14px; line-height: 1.6;">
                                                            Khôi phục tài khoản dễ dàng khi cần thiết
                                                        </p>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </div>

                        </td>
                    </tr>

                    <!-- Hỗ trợ -->
                    <tr>
                        <td style="background-color: #f9fafb; padding: 25px 35px; border-top: 1px solid #e5e7eb;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="text-align: center;">
                                        <p
                                            style="margin: 0 0 10px 0; color: #333333; font-size: 15px; font-weight: 600;">
                                            Gặp vấn đề khi xác thực?
                                        </p>
                                        <p
                                            style="margin: 0 0 15px 0; color: #666666; font-size: 14px; line-height: 1.6;">
                                            Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp bạn
                                        </p>
                                        <a href="mailto:support@example.com"
                                            style="color: #4f46e5; text-decoration: none; font-size: 14px; font-weight: 600;">
                                            📧 Liên hệ hỗ trợ
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #111827; padding: 30px; text-align: center;">
                            <p style="margin: 0 0 8px 0; color: #ffffff; font-size: 16px; font-weight: 600;">
                                {{ config('app.name') }}
                            </p>
                            <p style="margin: 0 0 15px 0; color: #9ca3af; font-size: 13px;">
                                Nền tảng mua sắm trực tuyến tin cậy
                            </p>
                            <div style="margin: 15px 0;">
                                <a href="#"
                                    style="display: inline-block; margin: 0 8px; color: #4f46e5; text-decoration: none; font-size: 13px; font-weight: 500;">Website</a>
                                <span style="color: #4b5563;">•</span>
                                <a href="#"
                                    style="display: inline-block; margin: 0 8px; color: #4f46e5; text-decoration: none; font-size: 13px; font-weight: 500;">Điều
                                    khoản</a>
                                <span style="color: #4b5563;">•</span>
                                <a href="#"
                                    style="display: inline-block; margin: 0 8px; color: #4f46e5; text-decoration: none; font-size: 13px; font-weight: 500;">Chính
                                    sách</a>
                            </div>
                            <p style="margin: 15px 0 0 0; color: #6b7280; font-size: 12px;">
                                © {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
                            </p>
                            <p style="margin: 8px 0 0 0; color: #6b7280; font-size: 11px;">
                                Email này được gửi tự động, vui lòng không trả lời
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>

</html>
