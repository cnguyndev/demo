<?php

namespace App\Http\Controllers;

use App\Models\ProductSale;
use Illuminate\Http\Request;

class ProductSaleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $product_sales = ProductSale::all();
        if (!$product_sales) {
            return response()->json(null, 404);
        }
        return response()->json($product_sales, 200);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $product_sale = new ProductSale();
        $product_sale->name = $request->name;
        $product_sale->product_id = $request->product_id;
        $product_sale->price_sale = $request->price_sale;
        $product_sale->date_begin = $request->date_begin;
        $product_sale->date_end = $request->date_end;
        $product_sale->status = $request->status;
        $product_sale->created_at = $request->created_at;
        $product_sale->created_by = $request->created_by;

        $product_sale->save();
        return response()->json($product_sale, 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $products = ProductSale::query()
            ->where("id", $id)
            ->select("id", "product_id", "name", "price_sale", "date_begin", "date_end", "status")
            ->with([
                "product" => function ($query) {
                    $query->select("id", "name", "slug", "thumbnail", "price_buy");
                }
            ])
            ->first();

        if (!$products) {
            return response()->json(null, 404);
        }

        return response()->json($products, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $product_sale = ProductSale::find($id);
        if (!$product_sale) {
            return response()->json(null, 404);
        }
        $product_sale->name = $request->name;
        $product_sale->product_id = $request->product_id;
        $product_sale->price_sale = $request->price_sale;
        $product_sale->date_begin = $request->date_begin;
        $product_sale->date_end = $request->date_end;
        $product_sale->status = $request->status;
        $product_sale->updated_at = $request->updated_at;
        $product_sale->updated_by = $request->updated_by;

        $product_sale->save();
        return response()->json($product_sale, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $product_sale = ProductSale::find($id);
        if (!$product_sale) {
            return response()->json(null, 404);
        }
        $product_sale->delete();
        return response()->json($product_sale, 200);
    }
}
