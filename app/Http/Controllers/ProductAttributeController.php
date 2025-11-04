<?php

namespace App\Http\Controllers;

use App\Models\ProductAttribute;
use Illuminate\Http\Request;

class ProductAttributeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $product_attributes = ProductAttribute::all();
        if (!$product_attributes) {
            return response()->json(null, 404);
        }
        return response()->json($product_attributes, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $product_attribute = new ProductAttribute();
        $product_attribute->product_id = $request->product_id;
        $product_attribute->attribute_id = $request->attribute_id;
        $product_attribute->value = $request->value;

        $product_attribute->save();
        return response()->json($product_attribute, 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $product_attribute = ProductAttribute::find($id);
        if (!$product_attribute) {
            return response()->json(null, 404);
        }
        return response()->json($product_attribute, 200);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $product_attribute = ProductAttribute::find($id);
        if (!$product_attribute) {
            return response()->json(null, 404);
        }
        $product_attribute->product_id = $request->product_id;
        $product_attribute->attribute_id = $request->attribute_id;
        $product_attribute->value = $request->value;

        $product_attribute->save();
        return response()->json($product_attribute, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $product_attribute = ProductAttribute::find($id);
        if (!$product_attribute) {
            return response()->json(null, 404);
        }
        $product_attribute->delete();
        return response()->json($product_attribute, 200);
    }
}
