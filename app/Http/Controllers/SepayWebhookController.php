<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Models\Order;
use App\Models\OrderDetail;
use \Exception;
use App\Mail\OrderConfirmationMail;
use Illuminate\Support\Facades\Mail;

class SepayWebhookController extends Controller
{
    public function handle(Request $request)
    {
        $sepayApiKey = config('services.sepay.api_key');
        $authHeader = $request->header('Authorization');

        $receivedApiKey = str_replace('Apikey ', '', $authHeader);

        if (empty($sepayApiKey) || !hash_equals($sepayApiKey, $receivedApiKey)) {
            Log::warning('SePAY Webhook: Unauthorized (Invalid Key).', ['ip' => $request->ip()]);
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        $data = $request->all();
        Log::info('SePAY Webhook: Payload received.', $data);

        if (!isset($data['code']) || !isset($data['transferAmount'])) {
            Log::warning('SePAY Webhook: Invalid payload (Missing fields).', $data);
            return response()->json(['success' => false, 'message' => 'Invalid payload'], 400);
        }

        DB::beginTransaction();
        try {
            $orderCode = str_replace("XIEN", "", $data['code']);
            $order = Order::where('id', $orderCode)->first();

            if (!$order) {
                DB::rollBack();
                Log::warning('SePAY Webhook: Order not found.', $data);
                return response()->json(['success' => false, 'message' => 'Order not found'], 404);
            }

            if ($order->status === 1) {
                Log::info('SePAY Webhook: Order already paid (Idempotency check).', $data);
                return response()->json(['success' => true, 'message' => 'Order already processed'], 200);
            }

            $expectedAmount = OrderDetail::where('order_id', $order->id)->sum('amount');
            $paidAmount = (int)($data['transferAmount'] ?? 0);

            if ($expectedAmount > 0 && (int) $expectedAmount !== $paidAmount) {
                DB::rollBack();
                Log::warning('SePAY Webhook: Invalid amount.', [
                    'data' => $data,
                    'expected' => $expectedAmount,
                    'paid' => $paidAmount
                ]);
                return response()->json(['success' => false, 'message' => 'Invalid amount'], 400);
            }

            $order->status = 1;
            $order->updated_at = now();
            $order->save();

            OrderDetail::where('order_id', $order->id)->update([
                'status' => 1,
            ]);

            DB::commit();
if (filter_var($order->email, FILTER_VALIDATE_EMAIL)) {
            try {
                $details = OrderDetail::where('order_id', $order->id)->with('product')->get();
                Mail::to($order->email)->send(new OrderConfirmationMail($order, $details));
            } catch (\Throwable $e) {
            }
        }
            return response()->json(['success' => true, 'message' => 'Webhook processed'], 201);
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('SePAY Webhook: LỖI NGHIÊM TRỌNG KHI XỬ LÝ.', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['success' => false, 'message' => 'Internal Server Error'], 500);
        }
    }
}
