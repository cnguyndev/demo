<?php

namespace App\Http\Controllers;

use App\Models\ProductStore;
use Illuminate\Http\Request;

class ProductStoreController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $product_stores = ProductStore::all();
        if (!$product_stores) {
            return response()->json(null, 404);
        }
        return response()->json($product_stores, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $product_store = new ProductStore();
        $product_store->product_id = $request->product_id;
        $product_store->price_root = $request->price_root;
        $product_store->qty = $request->qty;
        $product_store->status = $request->status;
        $product_store->created_at = now();
        $product_store->created_by = $request->created_by;

        $product_store->save();
        return response()->json($product_store, 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $product_store = ProductStore::find($id);
        if (!$product_store) {
            return response()->json(null, 404);
        }
        return response()->json($product_store, 200);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $product_store = ProductStore::find($id);
        if (!$product_store) {
            return response()->json(null, 404);
        }
        $product_store->product_id = $request->product_id;
        $product_store->price_root = $request->price_root;
        $product_store->qty = $request->qty;
        $product_store->status = $request->status;
        $product_store->updated_at = $request->updated_at;
        $product_store->updated_by = $request->updated_by;
        $product_store->save();
        return response()->json($product_store, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $product_store = ProductStore::find($id);
        if (!$product_store) {
            return response()->json(null, 404);
        }
        $product_store->delete();
        return response()->json($product_store, 200);
    }
}
