<?php

namespace App\Http\Controllers;

use App\Mail\AccountVerifiedMail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class VerifyController extends Controller
{
    public function verify(Request $request, $id)
    {
        // Kiểm tra chữ ký hợp lệ
        if (! $request->hasValidSignature()) {
            return response()->json(['message' => 'Link xác thực không hợp lệ hoặc đã hết hạn'], 400);
        }

        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'Không tìm thấy người dùng'], 404);
        }

        // Cập nhật status = 1
        $user->status = 1;
        $user->save();

        try {
            Mail::to($user->email)->send(new AccountVerifiedMail($user));
        } catch (\Throwable $e) {
        }

        // Redirect về FE
        $frontend = rtrim(env('FRONTEND_BASE_URL'), '/');
        return redirect()->away($frontend . '/xac-thuc-thanh-cong');
    }
}
