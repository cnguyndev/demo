<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::query()
            ->with("order.detail")
            ->get();
        if (!$users) {
            return response()->json(null, 404);
        }
        return response()->json($users, 200);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = new User();
        $user->name = $request->name;
        $user->email = $request->email;
        $user->phone = $request->phone;
        $user->username = $request->username;
        $user->password = md5($request->password);
        $user->role = $request->role;
        $user->avatar = $request->avatar;
        $user->status = $request->status;
        $user->created_at = now();
        $user->created_by = $request->created_by;

        $user->save();
        return response()->json($user, 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = User::query()
            ->where('id', $id)
            ->with(["order" => function ($query) {
                $query->orderByDesc('order.created_at')
                    ->with("order_detail");
            }])
            ->first();
        if (!$user) {
            return response()->json(null, 404);
        }
        return response()->json($user, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(null, 404);
        }
        $user->name = $request->name;
        $user->email = $request->email;
        $user->phone = $request->phone;
        $user->username = $request->username;
        $user->role = $request->role;
        $user->avatar = $request->avatar;
        $user->status = $request->status;
        $user->updated_at = now();
        $user->updated_by = $request->updated_by;

        $user->save();
        return response()->json($user, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(null, 404);
        }
        $user->delete();
        return response()->json($user, 200);
    }

    public function updatePassword(Request $request)
    {
        $user = User::find($request->user_id);
        if (!$user) {
            return response()->json(null, 404);
        }
        $user->password = md5($request->password);
        $user->updated_at = now();
        $user->updated_by = $request->updated_by;

        $user->save();
        return response()->json($user, 200);
    }

    public function changePassword(Request $request)
    {
        $user = User::find($request->user_id);
        if (!$user) {
            return response()->json(["message" => "Không tìm thấy người dùng"], 404);
        }
        if (md5($request->current_password) != $user->password) {
            return response()->json(["message" => "Mật khẩu hiện tại không đúng"], 404);
        }
        $user->password = md5($request->new_password);
        $user->updated_at = now();
        $user->updated_by = $request->updated_by;

        $user->save();
        return response()->json($user, 200);
    }
}
