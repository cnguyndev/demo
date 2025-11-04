<?php

namespace App\Http\Controllers;

use App\Models\ProductImage;
use Illuminate\Http\Request;

class ProductImageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $product_images = ProductImage::all();
        if (!$product_images) {
            return response()->json(null, 404);
        }
        return response()->json($product_images, 200);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $product_image = new ProductImage();
        $product_image->product_id = $request->product_id;
        $product_image->image = $request->image;
        $product_image->alt = $request->alt;
        $product_image->title = $request->title;

        $product_image->save();
        return response()->json($product_image, 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $product_image = ProductImage::find($id);
        if (!$product_image) {
            return response()->json(null, 404);
        }
        return response()->json($product_image, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $product_image = ProductImage::find($id);
        if (!$product_image) {
            return response()->json(null, 404);
        }
        $product_image->product_id = $request->product_id;
        $product_image->image = $request->image;
        $product_image->alt = $request->alt;
        $product_image->title = $request->title;

        $product_image->save();
        return response()->json($product_image, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $product_image = ProductImage::find($id);
        if (!$product_image) {
            return response()->json(null, 404);
        }
        $product_image->delete();
        return response()->json($product_image, 200);
    }
}
