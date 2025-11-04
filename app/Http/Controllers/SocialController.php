<?php

namespace App\Http\Controllers;

use App\Models\Social;
use Illuminate\Http\Request;

class SocialController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $socials = Social::with("social_icon")->get();
        if (!$socials) {
            return response()->json(null, 404);
        }
        return response()->json($socials, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $social = new Social();
        $social->title = $request->title;
        $social->social_id = $request->social_id;
        $social->username = $request->username;
        $social->status = $request->status;
        $social->created_at = now();
        $social->created_by = $request->created_by;

        $social->save();
        return response()->json($social, 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $social = Social::find($id);
        if (!$social) {
            return response()->json(null, 404);
        }
        return response()->json($social, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $social = Social::find($id);
        if (!$social) {
            return response()->json(null, 404);
        }
        return response()->json($social, 200);
        $social->title = $request->title;
        $social->social_id = $request->social_id;
        $social->username = $request->username;
        $social->status = $request->status;
        $social->updated_at = now();
        $social->updated_by = $request->updated_by;

        $social->save();
        return response()->json($social, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $social = Social::find($id);
        if (!$social) {
            return response()->json(null, 404);
        }
        $social->delete();
        return response()->json($social, 200);
    }
}
