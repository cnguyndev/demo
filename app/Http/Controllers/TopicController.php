<?php

namespace App\Http\Controllers;

use App\Models\Topic;
use Illuminate\Http\Request;

class TopicController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $topics = Topic::all();
        if (!$topics) {
            return response()->json(null, 404);
        }
        return response()->json($topics, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $topic = new Topic();
        $topic->name = $request->name;
        $topic->slug = $request->slug;
        $topic->sort_order = $request->sort_order;
        $topic->description = $request->description;
        $topic->status = $request->status;
        $topic->created_at = now();
        $topic->created_by = $request->created_by;

        $topic->save();
        return response()->json($topic, 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $topic = Topic::find($id);
        if (!$topic) {
            return response()->json(null, 404);
        }
        return response()->json($topic, 200);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $topic = Topic::find($id);
        if (!$topic) {
            return response()->json(null, 404);
        }
        $topic->name = $request->name;
        $topic->slug = $request->slug;
        $topic->sort_order = $request->sort_order;
        $topic->description = $request->description;
        $topic->status = $request->status;
        $topic->updated_at = now();
        $topic->updated_by = $request->updated_by;

        $topic->save();
        return response()->json($topic, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $topic = Topic::find($id);
        if (!$topic) {
            return response()->json(null, 404);
        }
        $topic->delete();
        return response()->json($topic, 200);
    }
}
