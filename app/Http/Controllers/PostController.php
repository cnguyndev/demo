<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $posts = Post::get();
        if (!$posts) {
            return response()->json(null, 404);
        }
        return response()->json($posts, 200);
    }

    public function getAllPost(Request $request)
    {
        $topic_id = $request->topic_id;
        $orderBy = $request->orderBy;
        $posts = Post::select("id", "topic_id", "title", "slug", "image", "content", "description", "status", "created_at", "created_by")
            ->where('status', 1)
            ->orderByDesc("created_at")
            ->with(["topic" => function ($query) {
                $query->select("id", "name", "slug");
            }])
            ->with(["user_create" => function ($query) {
                $query->select("id", "name", "avatar");
            }]);

        if ($topic_id) {
            $posts->where('topic_id', $topic_id);
        }
        if ($orderBy) {
            $posts->orderBy($orderBy);
        }
        $posts = $posts->paginate(9);
        if (!$posts) {
            return response()->json(null, 404);
        }
        return response()->json($posts, 200);
    }

    public function getNewPost()
    {
        $posts = Post::select("id", "topic_id", "title", "slug", "image", "content", "description", "status", "created_at", "created_by")
            ->where("created_at", ">=", now()->subDays(10))
            ->orderByDesc("created_at")
            ->with(["topic" => function ($query) {
                $query->select("id", "name", "slug");
            }])
            ->with(["user_create" => function ($query) {
                $query->select("id", "name", "avatar");
            }])
            ->limit(5)
            ->get();
        if (!$posts) {
            return response()->json(null, 404);
        }
        return response()->json($posts, 200);
    }

    public function getPostByTopic(string $id)
    {
        $posts = Post::select("id", "topic_id", "title", "slug", "image", "content", "description", "status", "created_at", "created_by")
            ->where("created_at", ">=", now()->subDays(10))
            ->where("topic_id", $id)
            ->orderByDesc("created_at")
            ->with(["topic" => function ($query) {
                $query->select("id", "name", "slug");
            }])
            ->with(["user_create" => function ($query) {
                $query->select("id", "name", "avatar");
            }])
            ->get();
        if (!$posts) {
            return response()->json(null, 404);
        }
        return response()->json($posts, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $post = new Post();
        $post->topic_id = $request->topic_id;
        $post->title = $request->title;
        $post->slug = $request->slug;
        $post->image = $request->image;
        $post->content = $request->content;
        $post->description = $request->description;
        $post->status = $request->status;
        $post->created_at = now();
        $post->created_by = $request->created_by;

        $post->save();
        return response()->json($post, 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $slug)
    {
        $post = Post::query()
            ->where('slug', $slug)
            ->select("id", "topic_id", "title", "slug", "image", "content", "description", "status", "created_at", "created_by")
            ->with(["topic" => function ($query) {
                $query->select("id", "name", "slug");
            }])
            ->with(["user_create" => function ($query) {
                $query->select("id", "name", "avatar");
            }])
            ->first();
        if (!$post) {
            return response()->json(null, 404);
        }
        return response()->json($post, 200);
    }

    public function getPostbyId(int $id)
    {
        $post = Post::query()
            ->where('id', $id)
            ->select("id", "topic_id", "title", "slug", "image", "content", "description", "status", "created_at", "created_by")
            ->with(["topic" => function ($query) {
                $query->select("id", "name", "slug");
            }])
            ->with(["user_create" => function ($query) {
                $query->select("id", "name", "avatar");
            }])
            ->first();
        if (!$post) {
            return response()->json(null, 404);
        }
        return response()->json($post, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $post = Post::find($id);
        if (!$post) {
            return response()->json(null, 404);
        }
        $post->topic_id = $request->topic_id;
        $post->title = $request->title;
        $post->slug = $request->slug;
        $post->image = $request->image;
        $post->content = $request->content;
        $post->description = $request->description;
        $post->status = $request->status;
        $post->updated_at = now();
        $post->updated_by = $request->updated_by;

        $post->save();
        return response()->json($post, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $post = Post::find($id);
        if (!$post) {
            return response()->json(null, 404);
        }
        $post->delete();
        return response()->json($post, 200);
    }
}
