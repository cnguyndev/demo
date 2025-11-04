<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderDetail;
use App\Mail\OrderConfirmationMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;


class MomoController extends Controller
{
    public function create(Request $request)
    {
        $validated = $request->validate([
            'orderId'   => ['required', 'integer'],
            'amount'    => ['required', 'integer', 'min:1000'],
        ]);

        $order = Order::find($validated['orderId']);
        if (!$order) {
            return response()->json(['message' => 'Không tìm thấy đơn hàng.'], 404);
        }


        $endpoint    = env('MOMO_ENDPOINT_CREATE') ?? 'https://payment.momo.vn/v2/gateway/api/create';
        $partnerCode = env('MOMO_PARTNER_CODE') ?? 'MOMOCZ5M20240223';
        $accessKey   = env('MOMO_ACCESS_KEY') ?? '24SdpqMz8u77jyna';
        $secretKey   = env('MOMO_SECRET_KEY') ?? 'W5Nu09NtSRMsUQaG0vbAPy0vKsI78xh8';

        $frontendUrl = rtrim(env('FRONTEND_BASE_URL'));
        $backendUrl  = rtrim(env('APP_URL')) ;

        $returnUrl = "{$frontendUrl}/ket-qua-thanh-toan?orderId={$order->id}";
        $notifyUrl = "{$backendUrl}/payments/momo/ipn";

        $orderId    = $order->id . '_' . time();
        $requestId  = time() . rand(1000, 9999);
        $orderInfo  = "Thanh toán đơn hàng #{$order->id}";
        $amount     = (int) $validated['amount'];
        $extraData  = '';
        $requestType = 'captureWallet';

        $rawHash = "accessKey={$accessKey}"
            . "&amount={$amount}"
            . "&extraData={$extraData}"
            . "&ipnUrl={$notifyUrl}"
            . "&orderId={$orderId}"
            . "&orderInfo={$orderInfo}"
            . "&partnerCode={$partnerCode}"
            . "&redirectUrl={$returnUrl}"
            . "&requestId={$requestId}"
            . "&requestType={$requestType}";

        $signature = hash_hmac('sha256', $rawHash, $secretKey);

        $payload = [
            "partnerCode" => $partnerCode,
            "accessKey"   => $accessKey,
            "requestId"   => $requestId,
            "amount"      => $amount,
            "orderId"     => $orderId,
            "orderInfo"   => $orderInfo,
            "redirectUrl" => $returnUrl,
            "ipnUrl"      => $notifyUrl,
            "extraData"   => $extraData,
            "lang"        => "vi",
            "requestType" => $requestType,
            "signature"   => $signature,
        ];


        try {
            $response = Http::timeout(20)->post($endpoint, $payload);
            if (!$response->ok()) {
                return response()->json(['message' => 'Không thể tạo giao dịch MoMo', 'raw' => $response->body()], 500);
            }

            $data = $response->json();

            return response()->json([
                'payUrl' => $data['payUrl'] ?? null,
                'deeplink' => $data['deeplink'] ?? null,
                'resultCode' => $data['resultCode'] ?? null,
                'message' => $data['message'] ?? '',
                'redirectUrlUsed' => $returnUrl,
                'notifyUrlUsed' => $notifyUrl,
                '$signature' => $signature
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Lỗi kết nối MoMo', 'error' => $e->getMessage()], 500);
        }
    }

    public function ipn(Request $request)
    {
        $data = $request->all();
        $secretKey  = env('MOMO_SECRET_KEY') ?? 'W5Nu09NtSRMsUQaG0vbAPy0vKsI78xh8';
        $accessKey  = env('MOMO_ACCESS_KEY') ?? '24SdpqMz8u77jyna';

        $fields = [
            'accessKey'    => $accessKey,
            'amount'       => (string)($data['amount'] ?? ''),
            'extraData'    => (string)($data['extraData'] ?? ''),
            'message'      => (string)($data['message'] ?? ''),
            'orderId'      => (string)($data['orderId'] ?? ''),
            'orderInfo'    => (string)($data['orderInfo'] ?? ''),
            'orderType'    => (string)($data['orderType'] ?? ''),
            'partnerCode'  => (string)($data['partnerCode'] ?? ''),
            'payType'      => (string)($data['payType'] ?? ''),
            'requestId'    => (string)($data['requestId'] ?? ''),
            'responseTime' => (string)($data['responseTime'] ?? ''),
            'resultCode'   => (string)($data['resultCode'] ?? ''),
            'transId'      => (string)($data['transId'] ?? ''),
        ];

        $rawHash = collect($fields)->map(fn($v, $k) => "{$k}={$v}")->join('&');

        $calculatedSignature = hash_hmac('sha256', $rawHash, $secretKey);
        $momoSignature = (string)($data['signature'] ?? '');

        if (!hash_equals($calculatedSignature, $momoSignature)) {
            return response()->json([
                'resultCode' => 5,
                'message'    => 'Invalid signature',
            ], 403);
        }

        $orderIdParts = explode('_', (string)($data['orderId'] ?? ''));
        $orderId = $orderIdParts[0] ?? null;

        if (!$orderId) {
            return response()->json(['resultCode' => 1001, 'message' => 'Thiếu orderId'], 400);
        }

        $order = Order::find($orderId);
        if (!$order) {
            return response()->json(['resultCode' => 1002, 'message' => 'Không tìm thấy đơn hàng'], 404);
        }

        $expectedAmount = OrderDetail::where('order_id', $order->id)->sum('amount');
        $paidAmount = (int)($data['amount'] ?? 0);

        if ($expectedAmount > 0 && (int) $expectedAmount !== $paidAmount) {

            return response()->json([
                'resultCode' => 1003,
                'message' => 'Số tiền thanh toán không đúng',
            ], 200);
        }

        $resultCode = (int)($data['resultCode'] ?? -1);

        $order->status = ($resultCode === 0) ? 1 : 0;
        $order->updated_at = now();
        $order->save();

        OrderDetail::where('order_id', $order->id)->update([
            'status'     => 1,
        ]);


        if ($resultCode === 0 && filter_var($order->email, FILTER_VALIDATE_EMAIL)) {
            try {
                 $details = OrderDetail::where('order_id', $order->id)->with('product')->get();
                Mail::to($order->email)->send(new OrderConfirmationMail($order, $details));
            } catch (\Throwable $e) {
            }
        }

        return response()->json([
            'resultCode' => 0,
            'message'    => 'IPN received successfully',
        ], 200);
    }
}
