<!DOCTYPE html>
<html lang="vi">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Trả lời liên hệ từ {{ config('app.name') }}</title>
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
                            style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); padding: 50px 30px; text-align: center;">
                            <div
                                style="background-color: rgba(255,255,255,0.2); width: 80px; height: 80px; margin: 0 auto 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                <span style="font-size: 48px;">💬</span>
                            </div>
                            <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700;">
                                Trả lời liên hệ
                            </h1>
                            <p style="margin: 12px 0 0 0; color: #dbeafe; font-size: 16px;">
                                Cảm ơn bạn đã liên hệ với chúng tôi
                            </p>
                        </td>
                    </tr>

                    <!-- Nội dung chính -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <p style="margin: 0 0 20px 0; font-size: 17px; color: #333333; line-height: 1.6;">
                                Xin chào <strong style="color: #3b82f6;">{{ $contact->name }}</strong>,
                            </p>
                            <p style="margin: 0 0 25px 0; font-size: 15px; color: #666666; line-height: 1.8;">
                                Cảm ơn bạn đã liên hệ với <strong>{{ config('app.name') }}</strong>. Chúng tôi đã nhận
                                được tin nhắn của bạn và xin gửi đến bạn câu trả lời như sau:
                            </p>

                            <!-- Box tin nhắn gốc của khách hàng -->
                            <table width="100%" cellpadding="0" cellspacing="0"
                                style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-radius: 12px; margin-bottom: 30px; border-left: 4px solid #3b82f6;">
                                <tr>
                                    <td style="padding: 25px;">
                                        <h3
                                            style="margin: 0 0 15px 0; color: #1e40af; font-size: 16px; font-weight: 600;">
                                            📝 Tin nhắn của bạn
                                        </h3>
                                        <table width="100%" cellpadding="0" cellspacing="0"
                                            style="margin-bottom: 15px;">
                                            <tr>
                                                <td
                                                    style="padding: 6px 0; color: #1e40af; font-size: 13px; width: 30%; font-weight: 500;">
                                                    Ngày gửi:</td>
                                                <td
                                                    style="padding: 6px 0; color: #1e3a8a; font-size: 13px; font-weight: 600;">
                                                    {{ $contact->created_at->format('d/m/Y H:i') }}</td>
                                            </tr>
                                            <tr>
                                                <td
                                                    style="padding: 6px 0; color: #1e40af; font-size: 13px; font-weight: 500;">
                                                    Email:</td>
                                                <td
                                                    style="padding: 6px 0; color: #1e3a8a; font-size: 13px; font-weight: 600;">
                                                    {{ $contact->email }}</td>
                                            </tr>
                                            <tr>
                                                <td
                                                    style="padding: 6px 0; color: #1e40af; font-size: 13px; font-weight: 500;">
                                                    Số điện thoại:</td>
                                                <td
                                                    style="padding: 6px 0; color: #1e3a8a; font-size: 13px; font-weight: 600;">
                                                    {{ $contact->phone }}</td>
                                            </tr>
                                        </table>
                                        <div
                                            style="background-color: #ffffff; padding: 18px; border-radius: 8px; border: 1px solid #bfdbfe;">
                                            <p
                                                style="margin: 0; color: #334155; font-size: 14px; line-height: 1.7; font-style: italic;">
                                                "{{ $contact->content }}"
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            </table>

                            <!-- Phản hồi từ admin -->
                            <table width="100%" cellpadding="0" cellspacing="0"
                                style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-radius: 12px; margin-bottom: 30px; border-left: 4px solid #10b981;">
                                <tr>
                                    <td style="padding: 25px;">
                                        <h3
                                            style="margin: 0 0 18px 0; color: #065f46; font-size: 16px; font-weight: 600;">
                                            ✅ Phản hồi từ {{ config('app.name') }}
                                        </h3>
                                        <div style="color: #1f2937; font-size: 15px; line-height: 1.8;">
                                            {!! nl2br(e($replyMessage)) !!}
                                        </div>
                                    </td>
                                </tr>
                            </table>

                            <!-- Thông tin hỗ trợ thêm -->
                            <h3 style="margin: 0 0 20px 0; color: #333333; font-size: 18px; font-weight: 600;">
                                📞 Liên hệ với chúng tôi
                            </h3>

                            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                                <!-- Hotline -->
                                <tr>
                                    <td style="padding: 12px 0;">
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="width: 40px; vertical-align: top;">
                                                    <div
                                                        style="width: 32px; height: 32px; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px;">
                                                        📞</div>
                                                </td>
                                                <td>
                                                    <h4
                                                        style="margin: 0 0 4px 0; color: #333333; font-size: 15px; font-weight: 600;">
                                                        Hotline hỗ trợ
                                                    </h4>
                                                    <p
                                                        style="margin: 0; color: #666666; font-size: 14px; line-height: 1.6;">
                                                        <a href="tel:{{ $setting->phone }}"
                                                            style="color: #3b82f6; text-decoration: none; font-weight: 500;">{{ $setting->phone }}</a>
                                                        (Miễn phí, 24/7)
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <!-- Email -->
                                <tr>
                                    <td style="padding: 12px 0;">
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="width: 40px; vertical-align: top;">
                                                    <div
                                                        style="width: 32px; height: 32px; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px;">
                                                        📧</div>
                                                </td>
                                                <td>
                                                    <h4
                                                        style="margin: 0 0 4px 0; color: #333333; font-size: 15px; font-weight: 600;">
                                                        Email hỗ trợ
                                                    </h4>
                                                    <p
                                                        style="margin: 0; color: #666666; font-size: 14px; line-height: 1.6;">
                                                        <a href="mailto:{{ $setting->email }}"
                                                            style="color: #3b82f6; text-decoration: none; font-weight: 500;">{{ $setting->email }}</a>
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <!-- Địa chỉ -->
                                <tr>
                                    <td style="padding: 12px 0;">
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="width: 40px; vertical-align: top;">
                                                    <div
                                                        style="width: 32px; height: 32px; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px;">
                                                        📍</div>
                                                </td>
                                                <td>
                                                    <h4
                                                        style="margin: 0 0 4px 0; color: #333333; font-size: 15px; font-weight: 600;">
                                                        Địa chỉ văn phòng
                                                    </h4>
                                                    <p
                                                        style="margin: 0; color: #666666; font-size: 14px; line-height: 1.6;">
                                                        {{ $setting->address }}
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- CTA Button -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                                <tr>
                                    <td align="center">
                                        <a href="{{ url('/') }}"
                                            style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 8px; font-size: 15px; font-weight: 600; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);">
                                            Truy cập Website
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <!-- Lưu ý -->
                            <div
                                style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 18px; border-radius: 6px; margin-top: 30px;">
                                <p style="margin: 0 0 8px 0; color: #92400e; font-size: 14px; font-weight: 600;">
                                    💡 Lưu ý quan trọng
                                </p>
                                <p style="margin: 0; color: #78350f; font-size: 13px; line-height: 1.6;">
                                    Nếu bạn có bất kỳ thắc mắc nào khác, vui lòng trả lời trực tiếp email này hoặc liên
                                    hệ với chúng tôi qua hotline. Chúng tôi luôn sẵn sàng hỗ trợ bạn!
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
                                            Cảm ơn bạn đã tin tưởng {{ config('app.name') }}!
                                        </p>
                                        <p
                                            style="margin: 0 0 15px 0; color: #666666; font-size: 14px; line-height: 1.6;">
                                            Chúng tôi rất trân trọng sự quan tâm và phản hồi của bạn
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>


                </table>
            </td>
        </tr>
    </table>
</body>

</html>
