<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $menus = Menu::with("parent")->get();
        if (!$menus) {
            return response()->json(null, 404);
        }
        return response()->json($menus, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $menu = new Menu();
        $menu->name = $request->name;
        $menu->link = $request->link;
        $menu->type = $request->type;
        $menu->parent_id = $request->parent_id;
        $menu->sort_order = $request->sort_order;
        $menu->status = $request->status;
        $menu->created_at = $request->created_at;
        $menu->created_by = $request->created_by;

        $menu->save();
        return response()->json($menu, 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $menu = Menu::query()
            ->where('id', $id)
            ->select("id", "name", "link", "type", "parent_id", "status")
            ->with("parent")
            ->first();
        if (!$menu) {
            return response()->json(null, 404);
        }
        return response()->json($menu, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $menu = Menu::find($id);
        if (!$menu) {
            return response()->json(null, 404);
        }
        $menu->name       = $request->input('name', $menu->name);
        $menu->link       = $request->input('link', $menu->link);
        $menu->type       = $request->input('type', $menu->type);
        $menu->parent_id  = $request->input('parent_id', $menu->parent_id);
        $menu->sort_order = $request->input('sort_order', $menu->sort_order);
        $menu->status     = $request->input('status', $menu->status);

        $menu->updated_at = $request->updated_at;
        $menu->updated_by = $request->updated_by;
        $menu->save();
        return response()->json($menu, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $menu = Menu::find($id);
        if (!$menu) {
            return response()->json(null, 404);
        }
        $menu->delete();
        return response()->json($menu, 200);
    }
}
