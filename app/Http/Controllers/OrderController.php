<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $orders = Order::with('order_detail')
            ->with('order_detail.product')
            ->get();
        if (!$orders) {
            return response()->json(null, 404);
        }
        return response()->json($orders, 200);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'user_id'     => ['nullable', 'integer'],
            'name'        => ['required', 'string', 'max:255'],
            'email'       => ['nullable', 'email', 'max:255'],
            'phone'       => ['nullable', 'string', 'max:50'],
            'address'     => ['required', 'string', 'max:500'],
            'note'        => ['nullable', 'string', 'max:1000'],
            'created_by'  => ['nullable', 'integer'],
            'status'      => ['nullable', 'integer'],

            'items'                     => ['required', 'array', 'min:1'],
            'items.*.id'                => ['required', 'integer'],
            'items.*.price'             => ['required', 'numeric', 'min:0'],
            'items.*.qty'               => ['required', 'integer', 'min:1'],
        ]);

        return DB::transaction(function () use ($data) {

            $order = Order::create([
                'user_id'    => $data['user_id'],
                'name'       => $data['name'],
                'email'      => $data['email'],
                'phone'      => $data['phone'],
                'address'    => $data['address'],
                'note'       => $data['note'] ?? null,
                'status'     => 0,
                'created_at' => now(),
                'created_by' => $data['created_by'] ?? null,
            ]);

            foreach ($data['items'] as $it) {
                $price = (float) $it['price'];
                $qty   = (int) $it['qty'];

                OrderDetail::create([
                    'order_id'   => $order->id,
                    'product_id' => (int) $it['id'],
                    'price'      => $price,
                    'qty'        => $qty,
                    'amount'     => $price * $qty,
                    'discount'  => 0,
                    'status'     => 0

                ]);
            }

            return response()->json($order, 200);
        });
    }


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $order = Order::query()
            ->where('id', $id)
            ->select("id", "user_id", "name", "email", "phone", "address", "note", "status", "created_at")
            ->with(["order_detail" => function ($query) {
                $query->select("id", "product_id", "qty", "price");
            }])
            ->with(["order_detail.product" => function ($query) {
                $query->select("id", "name", "slug", "thumbnail",);
            }])
            ->with(["user" => function ($query) {
                $query->select("id", "name", "email");
            }])
            ->first();
        if (!$order) {
            return response()->json(null, 404);
        }
        return response()->json($order, 200);
    }

    public function updateStatusOrder(Request $request, string $id)
    {
        $order = Order::find($id);
        if (!$order) {
            return response()->json(null, 404);
        }
        $order->status = $request->status;
        $order->updated_at = $request->updated_at;
        $order->updated_by = $request->updated_by;
        $order->save();
        return response()->json($order, 200);
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $order = Order::find($id);
        if (!$order) {
            return response()->json(null, 404);
        }
        $order->user_id = $request->user_id;
        $order->name = $request->name;
        $order->email = $request->email;
        $order->phone = $request->phone;
        $order->address = $request->address;
        $order->note = $request->note;
        $order->status = $request->status;
        $order->created_at = $request->created_at;
        $order->updated_at = $request->updated_at;
        $order->created_by = $request->created_by;
        $order->updated_by = $request->updated_by;

        $order->save();
        return response()->json($order, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $order = Order::find($id);
        if (!$order) {
            return response()->json(null, 404);
        }
        $order->delete();
        return response()->json($order, 200);
    }
}
