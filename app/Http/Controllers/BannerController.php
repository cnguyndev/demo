<?php

namespace App\Http\Controllers;

use App\Models\Banner;
use Illuminate\Http\Request;

class BannerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $banners = Banner::all();
        if (!$banners) {
            return response()->json(null, 404);
        }
        return response()->json($banners, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $banner = new Banner();
        $banner->name = $request->name;
        $banner->image = $request->image;
        $banner->link = $request->link;
        $banner->position = $request->position;
        $banner->sort_order = $request->sort_order;
        $banner->description = $request->description;
        $banner->status = $request->status;
        $banner->created_at = now();
        $banner->created_by = $request->created_by;

        $banner->save();
        return response()->json($banner, 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $banner = Banner::query()
            ->where('id', $id)
            ->select('id', 'name', 'image', 'link', 'position', 'sort_order', 'description', 'status')
            ->first();
        if (!$banner) {
            return response()->json(null, 404);
        }
        return response()->json($banner, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $banner = Banner::find($id);
        if (!$banner) {
            return response()->json(null, 404);
        }
        $banner->name = $request->name;
        $banner->image = $request->image;
        $banner->link = $request->link;
        $banner->position = $request->position;
        $banner->sort_order = $request->sort_order;
        $banner->description = $request->description;
        $banner->status = $request->status;
        $banner->updated_at = now();
        $banner->updated_by = $request->updated_by;

        $banner->save();
        return response()->json($banner, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $banner = Banner::find($id);
        if (!$banner) {
            return response()->json(null, 404);
        }
        $banner->delete();
        return response()->json($banner, 200);
    }
}
