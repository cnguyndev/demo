<?php

namespace App\Http\Controllers;

use App\Models\Attribute;
use Illuminate\Http\Request;

class AttributeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $attributes = Attribute::all();
        if (!$attributes) {
            return response()->json(null, 404);
        }
        return response()->json($attributes, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $attribute = new Attribute();
        $attribute->name = $request->name;

        $attribute->save();
        return response()->json($attribute, 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $attribute = Attribute::find($id);
        if (!$attribute) {
            return response()->json(null, 404);
        }
        return response()->json($attribute, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $attribute = Attribute::find($id);
        if (!$attribute) {
            return response()->json(null, 404);
        }
        $attribute->name = $request->name;

        $attribute->save();
        return response()->json($attribute, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $attribute = Attribute::find($id);
        if (!$attribute) {
            return response()->json(null, 404);
        }
        $attribute->delete();
        return response()->json($attribute, 200);
    }
}
