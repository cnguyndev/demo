<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        $categories = Category::select("id", "name", "slug", "image", "parent_id", "sort_order", "description", "status")
            ->with(['parent' => function ($query) {
                $query->select("id", "name", "slug", "image", "parent_id", "sort_order", "description", "status");
            }])->get();
        if (!$categories) {
            return response()->json(null, 404);
        }
        return response()->json($categories, 200);
    }

    public function getParent()
    {
        $categories = Category::query()
            ->where('parent_id', '==', 0)
            ->with(['parent' => function ($query) {
                $query->select("id", "name", "slug", "image", "parent_id", "sort_order", "description", "status");
            }])
            ->select('id', 'name', 'slug', 'image', 'parent_id', 'sort_order', 'description', 'status')
            ->get();
        if (!$categories) {
            return response()->json(null, 404);
        }
        return response()->json($categories, 200);
    }

    public function getChildren()
    {
        $categories = Category::query()
            ->where('parent_id', '!=', 0)
            ->select('id', 'name', 'slug', 'image', 'parent_id', 'sort_order', 'description', 'status')
            ->get();
        if (!$categories) {
            return response()->json(null, 404);
        }
        return response()->json($categories, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $category = new Category();
        $category->name = $request->name;
        $category->slug = $request->slug;
        $category->image = $request->image;
        $category->parent_id = $request->parent_id;
        $category->sort_order = $request->sort_order;
        $category->description = $request->description;
        $category->status = $request->status;
        $category->created_at = now();
        $category->created_by = $request->created_by;

        $category->save();
        return response()->json($category, 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $category = Category::query()
            ->where('id', $id)
            ->with(['parent' => function ($query) {
                $query->select("id", "name", "slug", "image", "parent_id", "sort_order", "description", "status");
            }])
            ->first();
        if (!$category) {
            return response()->json(null, 404);
        }
        return response()->json($category, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $category = Category::find($id);
        if (!$category) {
            return response()->json(null, 404);
        }
        $category->name = $request->name;
        $category->slug = $request->slug;
        $category->image = $request->image;
        $category->parent_id = $request->parent_id;
        $category->sort_order = $request->sort_order;
        $category->description = $request->description;
        $category->status = $request->status;
        $category->updated_at = now();
        $category->updated_by = $request->updated_by;

        $category->save();
        return response()->json($category, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $category = Category::find($id);
        if (!$category) {
            return response()->json(null, 404);
        }
        $category->delete();
        return response()->json($category, 200);
    }

    public function getCategories()
    {
        $categories = Category::query()
            ->withCount(['product' => function ($q) {
                $q->where('status', 1);
            }])
            ->orderBy('name')
            ->get();

        return response()->json($categories);
    }
}
