<?php

namespace App\Http\Controllers;

use App\Models\SocialIcon;
use Illuminate\Http\Request;

class SocialIconController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $social_icons = SocialIcon::all();
        if (!$social_icons) {
            return response()->json(null, 404);
        }
        return response()->json($social_icons, 200);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $social_icon = new SocialIcon();
        $social_icon->name = $request->name;
        $social_icon->link = $request->link;
        $social_icon->icon = $request->icon;

        $social_icon->save();
        return response()->json($social_icon, 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $social_icon = SocialIcon::find($id);
        if (!$social_icon) {
            return response()->json(null, 404);
        }
        return response()->json($social_icon, 200);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $social_icon = SocialIcon::find($id);
        if (!$social_icon) {
            return response()->json(null, 404);
        }
        $social_icon->name = $request->name;
        $social_icon->link = $request->link;
        $social_icon->icon = $request->icon;

        $social_icon->save();
        return response()->json($social_icon, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $social_icon = SocialIcon::find($id);
        if (!$social_icon) {
            return response()->json(null, 404);
        }
        $social_icon->delete();
        return response()->json($social_icon, 200);
    }
}
