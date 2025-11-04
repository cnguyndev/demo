<?php

namespace App\Http\Controllers;

use App\Mail\VerifyUserMail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\DB;

use Illuminate\Support\Facades\Crypt;

class AuthController extends Controller
{
    
    public function register(Request $request)
{
    // Kiểm tra trùng lặp
    if (User::where('email', $request->email)->exists()) {
        return response()->json(['message' => 'Email đã tồn tại!'], 409);
    }

    if (User::where('username', $request->username)->exists()) {
        return response()->json(['message' => 'Tên người dùng đã tồn tại!'], 409);
    }

    if (User::where('phone', $request->phone)->exists()) {
        return response()->json(['message' => 'Số điện thoại đã tồn tại!'], 409);
    }

    DB::beginTransaction();

    try {
        // Tạo user
        $user = new User();
        $user->name = $request->input('name');
        $user->email = $request->input('email');
        $user->phone = $request->input('phone');
        $user->username = $request->input('username');
        $user->password = md5($request->input('password')); // Nên thay bằng bcrypt()
        $user->role = 'customer';
        $user->status = 0;
        $user->created_at = now();
        $user->created_by = 0;
        $user->save();

        // Tạo link xác thực
        $verifyUrl = URL::temporarySignedRoute(
            'verify.email',
            now()->addMinutes(60),
            ['id' => $user->id]
        );

        // Gửi email
        Mail::to($user->email)->send(new VerifyUserMail($user, $verifyUrl));

        DB::commit();

        return response()->json([
            'message' => 'Đăng ký thành công. Vui lòng kiểm tra email để xác thực.',
        ], 201);
    } catch (Exception $e) {
        DB::rollBack();

        return response()->json([
            'message' => 'Có lỗi xảy ra trong quá trình đăng ký. Vui lòng thử lại sau.',
            'error'   => $e->getMessage(),
        ], 500);
    }
}
    // public function login(Request $request)
    // {
    //     $user = User::query()
    //         ->where('username', $request->input('username'))
    //         ->where('password', md5($request->input('password')))
    //         ->first();

    //     if (!$user) {
    //         return response()->json(null, 404);
    //     }

    //     if ($user->status == 0) {
    //         return response()->json(['message' => 'Tài khoản đã bị khoá!'], 409);
    //     }

    //     return response()->json($user, 200);
    // }

    public function login(Request $request)
    {
        $user = User::query()
            ->where('username', $request->input('username'))
            ->select('id', 'name', 'email', 'phone', 'username', 'password', 'status')
            ->first();

        if (!$user) {
            return response()->json(['message' => 'Tên người dùng không tồn tại!'], 409);
        }

        if ($user->password != md5($request->input('password'))) {
            return response()->json(['message' => 'Mật khẩu không đúng!'], 409);
        }


        if ($user->status == 0) {
            return response()->json(['message' => 'Tài khoản đã bị khoá!'], 409);
        }

        $payload = [
            'id' => $user->id,
            'created_at' => now()->timestamp,
            'expired' => now()->addDay(7)->timestamp,
        ];
        $encrypted = Crypt::encryptString(
            json_encode($payload)
        );
        return response()->json(
            $encrypted,
            200
        );
    }

    public function verifyUser(Request $request)
    {
        $header = $request->header('Authorization', '');
        $data = json_decode(Crypt::decryptString($header));

        if (!isset($data->expired) || $data->expired < now()->timestamp) {
            return response()->json(['message' => 'Phiên đăng nhập đã hết hạn.'], 401);
        }
        $user = User::query()
            ->where('id', $data->id)
            ->select('id', 'name', 'email', 'phone', 'username', 'password', 'status')
            ->first();

        if (!$user) {
            return response()->json(['message' => 'Không tìm thấy tài khoản.'], 401);
        }

        if ($user->status == 0) {
            return response()->json(['message' => 'Tài khoản đã bị khoá!'], 401);
        }
        return response()->json($user, 200);
    }

    public function verifyAdmin(Request $request)
    {
        $header = $request->header('Authorization', '');
        $data = json_decode(Crypt::decryptString($header));

        if (!isset($data->expired) || $data->expired < now()->timestamp) {
            return response()->json(['message' => 'Phiên đăng nhập đã hết hạn.'], 401);
        }
        $user = User::query()
            ->where('id', $data->id)
            ->select('id', 'name', 'email', 'phone', 'username', 'password', 'role', 'status')
            ->first();

        if (!$user) {
            return response()->json(['message' => 'Không tìm thấy tài khoản.'], 401);
        }


        if ($user->status == 0) {
            return response()->json(['message' => 'Tài khoản đã bị khoá!'], 401);
        }
        if ($user->role != 'admin') {
            return response()->json(['message' => 'Bạn không có quyền truy cập.'], 401);
        }
        return response()->json($user, 200);
    }

    public function resendVerification(Request $request)
    {
        $data = $request->validate([
            'email' => ['required', 'email:rfc,dns'],
        ]);

        $user = User::where('email', $data['email'])->first();

        if (!$user) {
            return response()->json([
                'message' => 'Nếu email tồn tại, chúng tôi đã gửi lại liên kết xác thực.',
            ], 200);
        }

        if ((int) ($user->status ?? 0) === 1) {
            return response()->json([
                'message' => 'Tài khoản đã được xác thực trước đó.',
                'alreadyVerified' => true,
            ], 200);
        }

        $verifyUrl = URL::temporarySignedRoute(
            'verify.email',
            now()->addMinutes(60),
            ['id' => $user->id]
        );

        try {
            Mail::to($user->email)->send(new VerifyUserMail($user, $verifyUrl));
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Không thể gửi email xác thực. Vui lòng thử lại sau.',
            ], 200);
        }


        return response()->json([
            'message' => 'Đã gửi lại email xác thực. Vui lòng kiểm tra hộp thư.',
        ], 200);
    }
}
