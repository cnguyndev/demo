<?php

namespace App\Http\Controllers;

use App\Models\OrderDetail;
use Illuminate\Http\Request;

class OrderDetailController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $order_details = OrderDetail::with('order')
            ->with('product')
            ->get();
        if (!$order_details) {
            return response()->json(null, 404);
        }
        return response()->json($order_details, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $order_detail = new OrderDetail();
        $order_detail->order_id = $request->order_id;
        $order_detail->product_id = $request->product_id;
        $order_detail->price = $request->price;
        $order_detail->qty = $request->qty;
        $order_detail->amount = $request->amount;
        $order_detail->discount = $request->discount;

        $order_detail->save();
        return response()->json($order_detail, 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $order_detail = OrderDetail::find($id);
        if (!$order_detail) {
            return response()->json(null, 404);
        }
        return response()->json($order_detail, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $order_detail = OrderDetail::find($id);
        if (!$order_detail) {
            return response()->json(null, 404);
        }
        $order_detail->order_id = $request->order_id;
        $order_detail->product_id = $request->product_id;
        $order_detail->price = $request->price;
        $order_detail->qty = $request->qty;
        $order_detail->amount = $request->amount;
        $order_detail->discount = $request->discount;

        $order_detail->save();
        return response()->json($order_detail, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $order_detail = OrderDetail::find($id);
        if (!$order_detail) {
            return response()->json(null, 404);
        }
        $order_detail->delete();
        return response()->json($order_detail, 200);
    }
}
