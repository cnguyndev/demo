<?php

namespace App\Http\Controllers;

use App\Models\Attribute as ModelsAttribute;
use App\Models\Banner;
use App\Models\Category;
use App\Models\Contact;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\Post;
use App\Models\Product;
use App\Models\ProductSale;
use App\Models\ProductStore;
use App\Models\Social;
use App\Models\SocialIcon;
use App\Models\Topic;
use App\Models\User;
use Attribute;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function getAdminProduct(Request $request)
    {
        $search = $request->input('search', '');
        $categoryId = $request->integer('category_id');

        $storeMap = ProductStore::query()
            ->select('product_id', DB::raw('SUM(qty) AS qty_store'))
            ->groupBy('product_id');

        $soldMap = OrderDetail::query()
            ->select('product_id', DB::raw('SUM(qty) AS qty_sold'))
            ->where('status', 1)
            ->groupBy('product_id');

        $products = Product::query()
            ->leftJoinSub($storeMap, 'product_store', 'product_store.product_id', 'product.id')
            ->leftJoinSub($soldMap, 'product_sold', 'product_sold.product_id', 'product.id')
            ->with("product_store")
            ->with("category")
            ->with('product_attribute.attribute')
            ->with('product_image')
            ->orderByDesc('product.created_at');

        if ($search) {
            $products->where('product.name', 'like', '%' . $search . '%');
        }
        if ($categoryId) {
            $products->where('product.category_id', $categoryId);
        }
        $products = $products->paginate(10);


        if (!$products) {
            return response()->json(null, 404);
        }

        return response()->json($products, 200);
    }

    public function getAdminProductDetail(Request $request, string $id)
    {
        $storeMap = ProductStore::query()
            ->select('product_id', DB::raw('SUM(qty) AS qty_store'))
            ->groupBy('product_id');

        $soldMap = OrderDetail::query()
            ->select('product_id', DB::raw('SUM(qty) AS qty_sold'))
            ->where('status', 1)
            ->groupBy('product_id');

        $products = Product::query()
            ->where('product.status', 1)
            ->where('product.id', $id)
            ->leftJoinSub($storeMap, 'product_store', 'product_store.product_id', 'product.id')
            ->leftJoinSub($soldMap, 'product_sold', 'product_sold.product_id', 'product.id')
            ->with("product_store")
            ->with("category")
            ->with('product_attribute.attribute')
            ->with('product_image')
            ->orderByDesc('product.created_at')
            ->first();


        if (!$products) {
            return response()->json(null, 404);
        }

        return response()->json($products, 200);
    }

    public function getAdminTopic(Request $request)
    {
        $topics = Topic::query()
            ->select("id", "name", "slug", "description", "status")
            ->paginate(10);

        if (!$topics) {
            return response()->json(null, 404);
        }

        return response()->json($topics, 200);
    }

    public function getAdminBanner(Request $request)
    {
        $banners = Banner::query()
            ->select("id", "name", "image", "link", "position", "description", "status")
            ->orderByDesc("created_at")
            ->paginate(10);

        if (!$banners) {
            return response()->json(null, 404);
        }

        return response()->json($banners, 200);
    }

    public function getAdminCategory(Request $request)
    {
        $categories = Category::query()
            ->select("id", "name", "slug", "image", "parent_id", "sort_order", "description", "status")
            ->with(['parent' => function ($query) {
                $query->select("id", "name", "slug", "image", "parent_id", "sort_order", "description", "status");
            }])
            ->orderBy("sort_order", "asc")
            ->paginate(10);

        if (!$categories) {
            return response()->json(null, 404);
        }

        return response()->json($categories, 200);
    }

    public function getAdminPost(Request $request)
    {
        $posts = Post::query()
            ->select("id", "topic_id", "title", "slug", "image", "content", "description", "status")
            ->with(["topic" => function ($query) {
                $query->select("id", "name", "slug");
            }])
            ->orderByDesc("created_at")
            ->paginate(10);

        if (!$posts) {
            return response()->json(null, 404);
        }
        return response()->json($posts, 200);
    }

    public function getAdminContact(Request $request)
    {
        $contacts = Contact::query()
            ->select("id", "user_id", "name", "email", "phone", "content", "status", "created_at")
            ->where("reply_id", 0)
            ->with(["reply" => function ($query) {
                $query->select("id", "name", "email", "phone");
            }])
            ->orderByDesc("created_at")
            ->paginate(10);
        if (!$contacts) {
            return response()->json(null, 404);
        }
        return response()->json($contacts, 200);
    }

    public function getAdminOrder(Request $request)
    {
        $orders = Order::query()
            ->select("id", "user_id", "name", "email", "phone", "address", "note", "status", "created_at")
            ->with(["order_detail" => function ($query) {
                $query->select("id", "product_id", "qty", "price");
            }])
            ->with(["order_detail.product" => function ($query) {
                $query->select("id", "name", "slug", "thumbnail");
            }])
            ->with(["user" => function ($query) {
                $query->select("id", "name", "email");
            }])
            ->orderByDesc("created_at")
            ->paginate(10);
        if (!$orders) {
            return response()->json(null, 404);
        }
        return response()->json($orders, 200);
    }

    public function getAdminProductSale(Request $request)
    {
        $products = ProductSale::query()
            ->select("id", "product_id", "name", "price_sale", "date_begin", "date_end", "status")
            ->with([
                "product" => function ($query) {
                    $query->select("id", "name", "slug", "thumbnail", "price_buy");
                }
            ])
            ->orderByDesc("created_at")
            ->paginate(10);

        if (!$products) {
            return response()->json(null, 404);
        }

        return response()->json($products, 200);
    }

    public function getAdminProductStore(Request $request)
    {
        $soldMap = OrderDetail::query()
            ->select('order_detail.product_id', DB::raw('SUM(qty) AS qty_sold'))
            ->groupBy('order_detail.product_id');

        $products = ProductStore::query()
            ->select("product_store.product_id", "price_root", "qty_sold", DB::raw("SUM(qty) AS qty_store"))
            ->with(["product" => function ($product) {
                $product->select("id", "name", "slug", "thumbnail", "price_buy");
            }])
            ->leftJoinSub($soldMap, 'product_sold', 'product_sold.product_id', 'product_store.product_id')
            ->groupBy("product_store.product_id", "price_root", "qty_sold")
            ->orderByDesc("created_at")
            ->paginate(10);

        if (!$products) {
            return response()->json(null, 404);
        }

        return response()->json($products, 200);
    }

    public function getAdminSocial(Request $request)
    {
        $social = Social::query()
            ->select("id", "title", "social_id", "username", "status")
            ->with("social_icon")
            ->paginate(10);

        if (!$social) {
            return response()->json(null, 404);
        }

        return response()->json($social, 200);
    }

    public function getAdminAttribute(Request $request)
    {
        $attributes = ModelsAttribute::query()
            ->paginate(10);

        if (!$attributes) {
            return response()->json(null, 404);
        }

        return response()->json($attributes, 200);
    }

    public function getAdminSocialIcon(Request $request)
    {
        $icons = SocialIcon::query()
            ->paginate(10);

        if (!$icons) {
            return response()->json(null, 404);
        }

        return response()->json($icons, 200);
    }

    public function getAdminUser(Request $request)
    {
        $users = User::query()
            ->select("id", "name", "email", "phone", "username", "role", "avatar", "status")
            ->with("order.order_detail")
            ->paginate(10);
        if (!$users) {
            return response()->json(null, 404);
        }
        return response()->json($users, 200);
    }
}
