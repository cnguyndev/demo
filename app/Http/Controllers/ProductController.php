<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\Product;
use App\Models\ProductAttribute;
use App\Models\ProductImage;
use App\Models\ProductSale;
use App\Models\ProductStore;
use Illuminate\Http\Request;
use Carbon\Carbon;

use Illuminate\Support\Facades\Schema;
use Throwable;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function getAllProduct()
    {
        $storeMap = ProductStore::query()
            ->select('product_id', DB::raw('SUM(qty) AS qty_store'))
            ->groupBy('product_id');

        $soldMap = OrderDetail::query()
            ->select('product_id', DB::raw('SUM(qty) AS qty_sold'))
            ->groupBy('product_id');

        $products = Product::query()
            ->leftJoinSub($storeMap, 'product_store', 'product_store.product_id', 'product.id')
            ->leftJoinSub($soldMap, 'product_sold', 'product_sold.product_id', 'product.id')
            ->with('product_attribute.attribute')
            ->with('product_image')
            ->with('product_sale')
            ->with('category')
            ->with('product_store')
            ->get();
        if (!$products) {
            return response()->json(null, 404);
        }
        return response()->json($products, 200);
    }

    public function index()
    {
        $storeMap = ProductStore::query()
            ->select('product_id', DB::raw('SUM(qty) AS qty_store'))
            ->groupBy('product_id');

        $soldMap = OrderDetail::query()
            ->select('product_id', DB::raw('SUM(qty) AS qty_sold'))
            ->groupBy('product_id');

        $products = Product::query()
            ->where('product.status', 1)
            ->leftJoinSub($storeMap, 'product_store', 'product_store.product_id', 'product.id')
            ->leftJoinSub($soldMap, 'product_sold', 'product_sold.product_id', 'product.id')
            ->leftJoin('category', 'product.category_id', 'category.id')
            ->with('product_attribute.attribute')
            ->with('product_image')
            ->with(['product_sale' => function ($query) {
                $query->where('date_begin', '<=', now());
                $query->where('date_end', '>=', now());
                $query->select('product_id', 'price_sale', 'date_begin', 'date_end');
            }])
            ->where('product_store.qty_store', '>', 0)
            ->where('product_store.qty_store', '>', 'product_sold.qty_sold')
            ->orderByDesc('product.created_at')
            ->select(
                'product.id',
                'product.name as product_name',
                'product.slug as product_slug',
                'product.content as product_content',
                'product.description as product_description',
                'product.price_buy as product_price_buy',
                'product.thumbnail as product_thumbnail',
                'product_store.qty_store as product_qty_store',
                'product_sold.qty_sold as product_qty_sold',
                'product.status as product_status',
                'product.created_at as product_created_at',
                'category.name as category_name',
                'category.slug as category_slug',

            )
            ->get();


        if (!$products) {
            return response()->json(null, 404);
        }

        return response()->json($products, 200);
    }

    // public function getListProduct(Request $request)
    // {
    //     $categoryId   = $request->integer('category_id');
    //     $minPrice     = (float)$request->input('min_price');
    //     $maxPrice     = (float)$request->input('max_price');
    //     $attrs        = $request->input('attrs');
    //     $sort         = $request->input('sort', 'latest');

    //     $storeMap = ProductStore::query()
    //         ->select('product_id', DB::raw('SUM(qty) AS qty_store'))
    //         ->groupBy('product_id');

    //     $soldMap = OrderDetail::query()
    //         ->select('product_id', DB::raw('SUM(qty) AS qty_sold'))
    //         ->groupBy('product_id');

    //     $products = Product::query()
    //         ->where('product.status', 1)
    //         ->leftJoinSub($storeMap, 'product_store', 'product_store.product_id', 'product.id')
    //         ->leftJoinSub($soldMap, 'product_sold', 'product_sold.product_id', 'product.id')
    //         ->with(['product_sale' => function ($query) {
    //             $query->where('date_begin', '<=', now());
    //             $query->where('date_end', '>=', now());
    //             $query->select('product_id', 'price_sale', 'date_begin', 'date_end');
    //         }])
    //         ->with('category')
    //         ->with('product_attribute.attribute')
    //         ->with('product_image')

    //         ->where('product_store.qty_store', '>', 0)
    //         // ->where('product_store.qty_store', '>', 'product_sold.qty_sold')
    //         ->where(
    //             'product_store.qty_store',
    //             '>',
    //             'product_sold.qty_sold'
    //         )
    //         ->orderByDesc('product.created_at')
    //         ->select(
    //             'product.id',
    //             'product.category_id',
    //             'product.name as product_name',
    //             'product.slug as product_slug',
    //             'product.content as product_content',
    //             'product.description as product_description',
    //             'product.price_buy as product_price_buy',
    //             'product.thumbnail as product_thumbnail',
    //             'product_store.qty_store as product_qty_store',
    //             'product_sold.qty_sold as product_qty_sold',
    //             'product.status as product_status',
    //             'product.created_at as product_created_at',

    //         );

    //     if ($categoryId) {
    //         $products->where('product.category_id', $categoryId);
    //     }
    //     if ($minPrice) {
    //         $products->where('product.price_buy', '>=', $minPrice);
    //     }
    //     if ($maxPrice) {
    //         $products->where('product.price_buy', '<=', $maxPrice);
    //     }
    //     if (is_array($attrs) && !empty($attrs)) {
    //         foreach ($attrs as $block) {
    //             $attrId = data_get($block, 'id');
    //             $values = (array) data_get($block, 'values', []);
    //             if ($attrId && !empty($values)) {
    //                 $products->whereHas('product_attribute', function ($sub) use ($attrId, $values) {
    //                     $sub->where('attribute_id', $attrId)
    //                         ->whereIn('value', $values);
    //                 });
    //             }
    //         }
    //     }

    //     if ($request->filled('filters')) {
    //         $filters = json_decode($request->filters, true);
    //         if (is_array($filters)) {
    //             foreach ($filters as $attributeName => $attributeValue) {
    //                 $products->whereHas('product_attribute', function ($q) use ($attributeName, $attributeValue) {
    //                     $q->where('value', $attributeValue)
    //                         ->whereHas('attribute', function ($q2) use ($attributeName) {
    //                             $q2->where('name', $attributeName);
    //                         });
    //                 });
    //             }
    //         }
    //     }

    //     switch ($sort) {
    //         case 'price_asc':
    //             $products->orderBy('product.price_buy', 'asc');
    //             break;
    //         case 'price_desc':
    //             $products->orderBy('product.price_buy', 'desc');
    //             break;
    //         case 'latest':
    //         default:
    //             $products->orderBy('product.created_at', 'desc');
    //             break;
    //     }
    //     $products = $products->paginate(9);
    //     if (!$products) {
    //         return response()->json(null, 404);
    //     }

    //     return response()->json($products, 200);
    // }

    public function getExistStore(string $id)
    {
        $storeMap = ProductStore::query()
            ->where('product_id', $id)
            ->where('status', 1)
            ->select('product_id', DB::raw('SUM(qty) AS qty_store'))
            ->groupBy('product_id');
        $soldMap = OrderDetail::query()
            ->where('product_id', $id)
            ->where('status', 1)
            ->select('product_id', DB::raw('SUM(qty) AS qty_sold'))
            ->groupBy('product_id');
        $stockMap = Product::query()
            ->where('product.id', $id)
            ->leftJoinSub($storeMap, 'product_store', 'product_store.product_id', 'product.id')
            ->leftJoinSub($soldMap, 'product_sold', 'product_sold.product_id', 'product.id')
            ->select(
                'product.id as product_id',
                'product_store.qty_store as product_qty_store',
                'product_sold.qty_sold as product_qty_sold',
            )->first();
        if (!$stockMap) {
            return response()->json(null, 404);
        }

        return response()->json($stockMap, 200);
    }

    public function getListProduct(Request $request)
    {
        $categoryId  = $request->integer('category_id');
        $minPrice    = $request->has('min_price') ? (float)$request->input('min_price') : null;
        $maxPrice    = $request->has('max_price') ? (float)$request->input('max_price') : null;
        $sort        = $request->input('sort', 'latest');

        $onlySale    = $request->boolean('only_sale');
        $isNew       = $request->boolean('is_new');

        $attrs = $request->input('attrs', []);
        if (is_string($attrs)) {
            $decoded = json_decode($attrs, true);
            if (json_last_error() === JSON_ERROR_NONE) {
                $attrs = $decoded;
            } else {
                $attrs = [];
            }
        }
        $filters = $request->input('filters');
        if (is_string($filters)) {
            $decoded = json_decode($filters, true);
            $filters = json_last_error() === JSON_ERROR_NONE ? $decoded : [];
        } elseif (!is_array($filters)) {
            $filters = [];
        }

        $prefix = DB::getTablePrefix();

        $storeMap = ProductStore::query()
            ->select('product_id', DB::raw('SUM(qty) AS qty_store'))
            ->where('status', 1)
            ->groupBy('product_id');

        $soldMap = OrderDetail::query()
            ->select('product_id', DB::raw('SUM(qty) AS qty_sold'))
            ->where('status', 1)
            ->groupBy('product_id');

        $products = Product::query()
            ->from('product')
            ->where('product.status', 1)
            ->leftJoinSub($storeMap, 'product_store', 'product_store.product_id', '=', 'product.id')
            ->leftJoinSub($soldMap, 'product_sold', 'product_sold.product_id', '=', 'product.id')
            ->with([
                'product_sale' => function ($q) {
                    $q->where('date_begin', '<=', now())
                        ->where('date_end',   '>=', now())
                        ->select('product_id', 'price_sale', 'date_begin', 'date_end');
                },
                'category',
                'product_attribute.attribute',
                'product_image',
            ])
            ->whereRaw("COALESCE({$prefix}product_store.qty_store, 0) > COALESCE({$prefix}product_sold.qty_sold, 0)")
            ->select([
                'product.id',
                'product.category_id',
                'product.name as product_name',
                'product.slug as product_slug',
                'product.content as product_content',
                'product.description as product_description',
                'product.price_buy as product_price_buy',
                'product.thumbnail as product_thumbnail',
                'product_store.qty_store as product_qty_store',
                'product_sold.qty_sold as product_qty_sold',
                'product.status as product_status',
                'product.created_at as product_created_at',
            ]);

        if ($categoryId) {
            $products->where('product.category_id', $categoryId);
        }
        if ($minPrice !== null) {
            $products->where('product.price_buy', '>=', $minPrice);
        }
        if ($maxPrice !== null) {
            $products->where('product.price_buy', '<=', $maxPrice);
        }

        if (is_array($attrs) && !empty($attrs)) {
            foreach ($attrs as $block) {
                $attrId = data_get($block, 'id');
                $values = (array) data_get($block, 'values', []);
                if ($attrId && !empty($values)) {
                    $products->whereHas('product_attribute', function ($sub) use ($attrId, $values) {
                        $sub->where('attribute_id', $attrId)
                            ->whereIn('value', $values);
                    });
                }
            }
        }

        if (!empty($filters) && is_array($filters)) {
            foreach ($filters as $attributeName => $attributeValue) {
                if ($attributeName === '' || $attributeValue === '' || $attributeValue === null) continue;

                $products->whereHas('product_attribute', function ($q) use ($attributeName, $attributeValue) {
                    $q->where('value', $attributeValue)
                        ->whereHas('attribute', function ($q2) use ($attributeName) {
                            $q2->where('name', $attributeName);
                        });
                });
            }
        }

        if ($onlySale) {
            $products->whereHas('product_sale', function ($q) {
                $q->where('date_begin', '<=', now())
                    ->where('date_end',   '>=', now());
            });
        }

        if ($isNew) {
            $products->where('product.created_at', '>=', now()->subDays(6));
        }

        switch ($sort) {
            case 'price_asc':
                $products->orderBy('product.price_buy', 'asc');
                break;
            case 'price_desc':
                $products->orderBy('product.price_buy', 'desc');
                break;
            case 'latest':
            default:
                $products->orderBy('product.created_at', 'desc');
                break;
        }

        $paginated = $products->paginate(9);
        if (!$paginated) {
            return response()->json(null, 404);
        }

        return response()->json($paginated, 200);
    }

    // public function getListProduct(Request $request)
    // {
    //     $categoryId   = $request->integer('category_id');
    //     $minPrice     = (float)$request->input('min_price');
    //     $maxPrice     = (float)$request->input('max_price');
    //     $attrs        = $request->input('attrs');
    //     $sort         = $request->input('sort', 'latest');

    //     $prefix = DB::getTablePrefix();

    //     $storeMap = ProductStore::query()
    //         ->select('product_id', DB::raw('SUM(qty) AS qty_store'))
    //         ->where('status', 1)
    //         ->groupBy('product_id');

    //     $soldMap = OrderDetail::query()
    //         ->select('product_id', DB::raw('SUM(qty) AS qty_sold'))
    //         ->where('status', 1)
    //         ->groupBy('product_id');

    //     $products = Product::query()
    //         ->where('product.status', 1)
    //         ->leftJoinSub($storeMap, 'product_store', 'product_store.product_id', 'product.id')
    //         ->leftJoinSub($soldMap, 'product_sold', 'product_sold.product_id', 'product.id')
    //         ->with(['product_sale' => function ($query) {
    //             $query->where('date_begin', '<=', now());
    //             $query->where('date_end', '>=', now());
    //             $query->select('product_id', 'price_sale', 'date_begin', 'date_end');
    //         }])
    //         ->with('category')
    //         ->with('product_attribute.attribute')
    //         ->with('product_image')

    //         ->where('product_store.qty_store', '>', 0)
    //         ->whereRaw("COALESCE({$prefix}product_store.qty_store, 0) > COALESCE({$prefix}product_sold.qty_sold, 0)")
    //         ->orderByDesc('product.created_at')
    //         ->select(
    //             'product.id',
    //             'product.category_id',
    //             'product.name as product_name',
    //             'product.slug as product_slug',
    //             'product.content as product_content',
    //             'product.description as product_description',
    //             'product.price_buy as product_price_buy',
    //             'product.thumbnail as product_thumbnail',
    //             'product_store.qty_store as product_qty_store',
    //             'product_sold.qty_sold as product_qty_sold',
    //             'product.status as product_status',
    //             'product.created_at as product_created_at',

    //         );

    //     if ($categoryId) {
    //         $products->where('product.category_id', $categoryId);
    //     }
    //     if ($minPrice) {
    //         $products->where('product.price_buy', '>=', $minPrice);
    //     }
    //     if ($maxPrice) {
    //         $products->where('product.price_buy', '<=', $maxPrice);
    //     }
    //     if (is_array($attrs) && !empty($attrs)) {
    //         foreach ($attrs as $block) {
    //             $attrId = data_get($block, 'id');
    //             $values = (array) data_get($block, 'values', []);
    //             if ($attrId && !empty($values)) {
    //                 $products->whereHas('product_attribute', function ($sub) use ($attrId, $values) {
    //                     $sub->where('attribute_id', $attrId)
    //                         ->whereIn('value', $values);
    //                 });
    //             }
    //         }
    //     }

    //     if ($request->filled('filters')) {
    //         $filters = json_decode($request->filters, true);
    //         if (is_array($filters)) {
    //             foreach ($filters as $attributeName => $attributeValue) {
    //                 $products->whereHas('product_attribute', function ($q) use ($attributeName, $attributeValue) {
    //                     $q->where('value', $attributeValue)
    //                         ->whereHas('attribute', function ($q2) use ($attributeName) {
    //                             $q2->where('name', $attributeName);
    //                         });
    //                 });
    //             }
    //         }
    //     }

    //     switch ($sort) {
    //         case 'price_asc':
    //             $products->orderBy('product.price_buy', 'asc');
    //             break;
    //         case 'price_desc':
    //             $products->orderBy('product.price_buy', 'desc');
    //             break;
    //         case 'latest':
    //         default:
    //             $products->orderBy('product.created_at', 'desc');
    //             break;
    //     }
    //     $products = $products->paginate(9);
    //     if (!$products) {
    //         return response()->json(null, 404);
    //     }

    //     return response()->json($products, 200);
    // }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $now       = Carbon::now();
        $createdBy = $validated['created_by'] ?? ($request->user()->id ?? 1);

        DB::beginTransaction();
        try {
            // 4) Tạo Product
            $product              = new Product();
            $product->category_id = $request->input('category_id');
            $product->name        = $request->input('name');
            $product->slug        = $request->input('slug');
            $product->thumbnail   = $request->input('thumbnail');
            $product->content     = $request->input('content');
            $product->description = $request->input('description');
            $product->price_buy   = $request->input('price_buy');
            $product->status      = $request->input('status', 1);
            $product->created_at  = $now;
            $product->created_by  = $createdBy;
            $product->save();

            if ($request->has('store')) {
                $productStore              = new ProductStore();
                $productStore->product_id  = $product->id;
                $productStore->qty         = $request->input('store.qty');
                $productStore->price_root  = $request->input('store.price_root');
                $productStore->status      = $request->input('store.status', 1);
                $productStore->created_at  = $now;
                $productStore->created_by  = $createdBy;
                $productStore->save();
            }


            $gallery = $request->input('gallery_images', []);

            if (is_array($gallery)) {
                foreach ($gallery as $img) {
                    $url = $img['image'] ?? null;
                    if (!$url) continue;

                    $productImage             = new ProductImage();
                    $productImage->product_id = $product->id;
                    $productImage->image      = $url;
                    $productImage->alt        = $product->name;
                    $productImage->title      = $product->name;
                    $productImage->save();
                }
            }

            $attrs = (array) $request->input('product_attribute', []);
            foreach ($attrs as $attribute) {
                $attrId = data_get($attribute, 'attribute_id');
                $value  = data_get($attribute, 'value');

                if (!$attrId || ($value === null)) continue;

                $productAttribute               = new ProductAttribute();
                $productAttribute->product_id   = $product->id;
                $productAttribute->attribute_id = $attrId;
                $productAttribute->value        = $value;
                $productAttribute->save();
            }

            DB::commit();

            return response()->json([
                'message' => 'Tạo sản phẩm thành công',
                'data'    =>  $product,
            ], 201);
        } catch (Throwable $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function getLastestProduct()
    {
        $products = Product::query()
            ->orderBy("created_at", "desc")
            ->first();
        if (!$products) {
            return response()->json(null, 404);
        }
        return response()->json($products, 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $slug)
    {
        $storeMap = ProductStore::query()
            ->select('product_id', DB::raw('SUM(qty) AS qty_store'))
            ->where('status', 1)
            ->groupBy('product_id');

        $soldMap = OrderDetail::query()
            ->select('product_id', DB::raw('SUM(qty) AS qty_sold'))
            ->where('status', 1)
            ->groupBy('product_id');

        $products = Product::query()
            ->where('product.slug', $slug)
            ->where('product.status', 1)
            ->leftJoinSub($storeMap, 'product_store', 'product_store.product_id', 'product.id')
            ->leftJoinSub($soldMap, 'product_sold', 'product_sold.product_id', 'product.id')
            ->leftJoin('category', 'product.category_id', 'category.id')
            ->with('product_attribute.attribute')
            ->with('product_image')
            ->with(['product_sale' => function ($query) {
                $query->where('date_begin', '<=', now());
                $query->where('date_end', '>=', now());
                $query->select('product_id', 'price_sale', 'date_begin', 'date_end');
            }])
            ->where('product_store.qty_store', '>', 0)
            ->where('product_store.qty_store', '>', 'product_sold.qty_sold')
            ->orderByDesc('product.created_at')
            ->select(
                'product.id',
                'product.category_id',
                'product.name as product_name',
                'product.slug as product_slug',
                'product.content as product_content',
                'product.description as product_description',
                'product.price_buy as product_price_buy',
                'product.thumbnail as product_thumbnail',
                'product_store.qty_store as product_qty_store',
                'product_sold.qty_sold as product_qty_sold',
                'product.status as product_status',
                'product.created_at as product_created_at',
                'category.name as category_name',
                'category.slug as category_slug',

            )
            ->first();


        if (!$products) {
            return response()->json(null, 404);
        }

        return response()->json($products, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {

        DB::beginTransaction();
        try {
            $product = Product::with(['product_attribute', 'product_image'])->findOrFail($id);

            $product->category_id = $request->input('category_id');
            $product->name        = $request->input('name');
            $product->slug        = $request->input('slug');
            $product->thumbnail   = $request->input('thumbnail');
            $product->content     = $request->input('content');
            $product->description = $request->input('description');
            $product->price_buy   = $request->input('price_buy');
            $product->status      = $request->input('status', 1);
            $product->updated_at  = $request->input('updated_at', now());
            $product->updated_by  = $request->input('updated_by', 1);
            $product->save();

            $deleteIds = $request->input('product_image_ids_delete', []);
            if (is_array($deleteIds) && count($deleteIds)) {
                ProductImage::where('product_id', $product->id)
                    ->whereIn('id', $deleteIds)
                    ->delete();
            }

            $addImgs = $request->input('gallery_images', []);
            if (is_array($addImgs) && count($addImgs)) {
                foreach ($addImgs as $img) {
                    ProductImage::create([
                        'product_id' => $product->id,
                        'image'      => data_get($img, 'image'),
                        'alt'        => $product->name,
                        'title'      => $product->name,
                        'status'     => data_get($img, 'status', 1),
                    ]);
                }
            }

            $attrs = $request->input('product_attribute', []);
            ProductAttribute::where('product_id', $product->id)->delete();
            if (is_array($attrs) && count($attrs)) {
                foreach ($attrs as $a) {
                    ProductAttribute::create([
                        'product_id'   => $product->id,
                        'attribute_id' => data_get($a, 'attribute_id'),
                        'value'        => data_get($a, 'value'),
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Cập nhật sản phẩm thành công',
                'data'    => $product,
            ], 200);
        } catch (Throwable $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $order = OrderDetail::query()
            ->where("product_id", $id);

        if ($order) {
            return response()->json(['message' => 'Sản phẩm đã có đơn hàng, không thể xoá!'], 200);
        }
        DB::beginTransaction();
        try {
            $product = Product::with(['product_attribute', 'product_image', 'product_store'])->findOrFail($id);

            ProductStore::where('product_id', $product->id)->delete();
            ProductAttribute::where('product_id', $product->id)->delete();
            ProductSale::where('product_id', $product->id)->delete();
            ProductImage::where('product_id', $product->id)->delete();

            $product->delete();

            DB::commit();
            return response()->json(['message' => 'Đã xoá sản phẩm và dữ liệu liên quan.'], 200);
        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function checkStore()
    {
        $storeProduct = ProductStore::query()
            ->select('product_id', DB::raw('SUM(qty) as qty_store'))
            ->groupBy('product_id')
            ->pluck('qty_store', 'product_id');

        $soldProduct = OrderDetail::query()
            ->select('product_id', DB::raw('SUM(qty) as qty_sold'))
            ->groupBy('product_id')
            ->where('status', 1)
            ->pluck('qty_sold', 'product_id');

        $allIds = $storeProduct->keys()->union($soldProduct->keys());

        $stockProduct = $allIds->map(function ($id) use ($storeProduct, $soldProduct) {
            $qtyStore = (int) ($storeProduct[$id] ?? 0);
            $qtySold  = (int) ($soldProduct[$id]  ?? 0);

            return (object) [
                'product_id'  => (int) $id,
                'qty_store'   => $qtyStore,
                'qty_sold'    => $qtySold,
                'qty_stock'  => $qtyStore - $qtySold,
            ];
        })->values();

        return response()->json($stockProduct);
    }

    public function getNewProduct()
    {
        $storeMap = ProductStore::query()
            ->select('product_id', DB::raw('SUM(qty) AS qty_store'))
            ->where('status', 1)
            ->groupBy('product_id');

        $soldMap = OrderDetail::query()
            ->select('product_id', DB::raw('SUM(qty) AS qty_sold'))
            ->where('status', 1)
            ->groupBy('product_id');

        $prefix = DB::getTablePrefix();

        $products = Product::query()
            ->where('product.status', 1)
            ->leftJoinSub($storeMap, 'product_store', 'product_store.product_id', 'product.id')
            ->leftJoinSub($soldMap, 'product_sold', 'product_sold.product_id', 'product.id')
            ->leftJoin('category', 'product.category_id', 'category.id')
            ->with('product_attribute.attribute')
            ->with('product_image')
            ->with(['product_sale' => function ($query) {
                $query->where('date_begin', '<=', now());
                $query->where('date_end', '>=', now());
                $query->select('product_id', 'price_sale', 'date_begin', 'date_end');
            }])
            ->where('product_store.qty_store', '>', 0)
            ->whereRaw("COALESCE({$prefix}product_store.qty_store, 0) > COALESCE({$prefix}product_sold.qty_sold, 0)")
            ->orderByDesc('product.created_at')
            ->select(
                'product.id',
                'product.name as product_name',
                'product.slug as product_slug',
                'product.content as product_content',
                'product.description as product_description',
                'product.price_buy as product_price_buy',
                'product.thumbnail as product_thumbnail',
                'product_store.qty_store as product_qty_store',
                'product_sold.qty_sold as product_qty_sold',
                'product.status as product_status',
                'product.created_at as product_created_at',
                'category.name as category_name',
                'category.slug as category_slug',

            )
            ->limit(6)
            ->get();


        if (!$products) {
            return response()->json(null, 404);
        }

        return response()->json($products, 200);
    }

    public function getSaleProduct()
    {
        $storeMap = ProductStore::query()
            ->select('product_id', DB::raw('SUM(qty) AS qty_store'))
            ->where('status', 1)
            ->groupBy('product_id');

        $soldMap = OrderDetail::query()
            ->select('product_id', DB::raw('SUM(qty) AS qty_sold'))
            ->where('status', 1)
            ->groupBy('product_id');

        $prefix = DB::getTablePrefix();
        $saleMap = ProductSale::query()
            ->select('product_id', 'price_sale', 'date_begin', 'date_end')
            ->where('date_begin', '<=', now())
            ->where('date_end', '>=', now());

        $products = Product::query()
            ->where('product.status', 1)
            ->leftJoinSub($storeMap, 'product_store', 'product_store.product_id', 'product.id')
            ->leftJoinSub($soldMap, 'product_sold', 'product_sold.product_id', 'product.id')
            ->joinSub($saleMap, 'product_sale', 'product_sale.product_id', 'product.id')
            ->leftJoin('category', 'product.category_id', 'category.id')
            ->with('product_attribute.attribute')
            ->with(
                [
                    'product_sale' => function ($query) {
                        $query
                            ->where('date_begin', '<=', now())
                            ->where('date_end', '>=', now())
                            ->select('product_id', 'price_sale', 'date_begin', 'date_end');
                    }
                ]
            )
            ->with('product_image')
            ->where('product_store.qty_store', '>', 0)
            ->whereRaw("COALESCE({$prefix}product_store.qty_store, 0) > COALESCE({$prefix}product_sold.qty_sold, 0)")
            ->orderByDesc('product.created_at')
            ->select(
                'product.id',
                'product.name as product_name',
                'product.slug as product_slug',
                'product.content as product_content',
                'product.description as product_description',
                'product.price_buy as product_price_buy',
                'product.thumbnail as product_thumbnail',
                'product_store.qty_store as product_qty_store',
                'product_sold.qty_sold as product_qty_sold',
                'product_sale.price_sale as product_price_sale',
                'product_sale.date_begin as product_date_begin',
                'product_sale.date_end as product_date_end',
                'product.status as product_status',
                'product.created_at as product_created_at',
                'category.name as category_name',
                'category.slug as category_slug',

            )
            ->limit(6)
            ->get();


        if (!$products) {
            return response()->json(null, 404);
        }

        return response()->json($products, 200);
    }

    public function getHotProduct()
    {
        $storeMap = ProductStore::query()
            ->select('product_id', DB::raw('SUM(qty) AS qty_store'))
            ->groupBy('product_id');

        $soldMap = OrderDetail::query()
            ->select('product_id', DB::raw('SUM(qty) AS qty_sold'))
            ->where('status', 1)
            ->groupBy('product_id');

        $prefix = DB::getTablePrefix();

        $products = Product::query()
            ->where('product.status', 1)
            ->leftJoinSub($storeMap, 'product_store', 'product_store.product_id', 'product.id')
            ->leftJoinSub($soldMap, 'product_sold', 'product_sold.product_id', 'product.id')
            ->leftJoin('category', 'product.category_id', 'category.id')
            ->with('product_attribute.attribute')
            ->with('product_image')
            ->with(['product_sale' => function ($query) {
                $query->where('date_begin', '<=', now());
                $query->where('date_end', '>=', now());
                $query->select('product_id', 'price_sale', 'date_begin', 'date_end');
            }])
            ->where('product_store.qty_store', '>', 0)
            ->where('product_sold.qty_sold', '>', 0)
            ->whereRaw("COALESCE({$prefix}product_store.qty_store, 0) > COALESCE({$prefix}product_sold.qty_sold, 0)")
            ->orderByDesc('product_sold.qty_sold')
            ->select(
                'product.id',
                'product.name as product_name',
                'product.slug as product_slug',
                'product.content as product_content',
                'product.description as product_description',
                'product.price_buy as product_price_buy',
                'product.thumbnail as product_thumbnail',
                'product_store.qty_store as product_qty_store',
                'product_sold.qty_sold as product_qty_sold',
                'product.status as product_status',
                'product.created_at as product_created_at',
                'category.name as category_name',
                'category.slug as category_slug',

            )
            ->limit(3)
            ->get();


        if (!$products) {
            return response()->json(null, 404);
        }

        return response()->json($products, 200);
    }

    public function getProductByCategory(string $id)
    {
        $storeMap = ProductStore::query()
            ->select('product_id', DB::raw('SUM(qty) AS qty_store'))
            ->groupBy('product_id');

        $soldMap = OrderDetail::query()
            ->select('product_id', DB::raw('SUM(qty) AS qty_sold'))
            ->where('status', 1)
            ->groupBy('product_id');

        $prefix = DB::getTablePrefix();
        $products = Product::query()
            ->where('product.status', 1)

            ->leftJoinSub($storeMap, 'product_store', 'product_store.product_id', 'product.id')
            ->leftJoinSub($soldMap, 'product_sold', 'product_sold.product_id', 'product.id')
            ->leftJoin('category', 'product.category_id', 'category.id')
            ->with('product_attribute.attribute')
            ->with('product_image')
            ->with(['product_sale' => function ($query) {
                $query->where('date_begin', '<=', now());
                $query->where('date_end', '>=', now());
                $query->select('product_id', 'price_sale', 'date_begin', 'date_end');
            }])
            ->where('product.category_id', $id)
            ->where('product_store.qty_store', '>', 0)
            ->whereRaw("COALESCE({$prefix}product_store.qty_store, 0) > COALESCE({$prefix}product_sold.qty_sold, 0)")
            ->orderByDesc('product.created_at')
            ->select(
                'product.id',
                'product.name as product_name',
                'product.slug as product_slug',
                'product.content as product_content',
                'product.description as product_description',
                'product.price_buy as product_price_buy',
                'product.thumbnail as product_thumbnail',
                'product_store.qty_store as product_qty_store',
                'product_sold.qty_sold as product_qty_sold',
                'product.status as product_status',
                'product.created_at as product_created_at',
                'category.name as category_name',
                'category.slug as category_slug',

            )
            ->get();


        if (!$products) {
            return response()->json(null, 404);
        }

        return response()->json($products, 200);
    }
    public function getProductCategory(Request $request, string $slug)
    {
        $sort    = $request->input('sort', 'latest');

        $category = Category::query()
            ->select(['id', 'name', 'slug'])
            ->where('slug', $slug)
            ->first();

        $prefix = DB::getTablePrefix();

        $storeMap = ProductStore::query()
            ->select('product_id', DB::raw('SUM(qty) AS qty_store'))
            ->where('status', 1)
            ->groupBy('product_id');

        $soldMap = OrderDetail::query()
            ->select('product_id', DB::raw('SUM(qty) AS qty_sold'))
            ->where('status', 1)
            ->groupBy('product_id');

        $products = Product::query()
            ->where('product.status', 1)
            ->where('product.category_id', $category->id)
            ->leftJoinSub($storeMap, 'product_store', 'product_store.product_id', 'product.id')
            ->leftJoinSub($soldMap, 'product_sold', 'product_sold.product_id', 'product.id')
            ->leftJoin('category', 'product.category_id', 'category.id')
            ->with('product_attribute.attribute')
            ->with('product_image')
            ->with(['product_sale' => function ($query) {
                $query->where('date_begin', '<=', now());
                $query->where('date_end', '>=', now());
                $query->select('product_id', 'price_sale', 'date_begin', 'date_end');
            }])
            ->where('product_store.qty_store', '>', 0)
            ->whereRaw("COALESCE({$prefix}product_store.qty_store, 0) > COALESCE({$prefix}product_sold.qty_sold, 0)")
            ->select([
                'product.id',
                'product.name as product_name',
                'product.slug as product_slug',
                'product.content as product_content',
                'product.description as product_description',
                'product.price_buy as product_price_buy',
                'product.thumbnail as product_thumbnail',
                'product_store.qty_store as product_qty_store',
                'product_sold.qty_sold as product_qty_sold',
                'product.status as product_status',
                'product.created_at as product_created_at',
                'category.name as category_name',
                'category.slug as category_slug',
            ]);

        // Sort
        switch ($sort) {
            case 'price_asc':
                $products->orderBy('product.price_buy', 'asc');
                break;
            case 'price_desc':
                $products->orderBy('product.price_buy', 'desc');
                break;
            case 'latest':
            default:
                $products->orderBy('product.created_at', 'desc');
                break;
        }

        $products = $products->paginate(9);


        if (!$products) {
            return response()->json(null, 404);
        }

        return response()->json($products, 200);
    }
    public function getProductSearch(Request $request, string $query)
    {
        $sort    = $request->input('sort', 'latest');
        $prefix = DB::getTablePrefix();

        $storeMap = ProductStore::query()
            ->select('product_id', DB::raw('SUM(qty) AS qty_store'))
            ->where('status', 1)
            ->groupBy('product_id');

        $soldMap = OrderDetail::query()
            ->select('product_id', DB::raw('SUM(qty) AS qty_sold'))
            ->where('status', 1)
            ->groupBy('product_id');

        $products = Product::query()
            ->where('product.status', 1)
            ->where('product.name', 'like', '%' . $query . '%')
            ->leftJoinSub($storeMap, 'product_store', 'product_store.product_id', 'product.id')
            ->leftJoinSub($soldMap, 'product_sold', 'product_sold.product_id', 'product.id')
            ->leftJoin('category', 'product.category_id', 'category.id')
            ->with('product_attribute.attribute')
            ->with('product_image')
            ->with(['product_sale' => function ($query) {
                $query->where('date_begin', '<=', now());
                $query->where('date_end', '>=', now());
                $query->select('product_id', 'price_sale', 'date_begin', 'date_end');
            }])
            ->where('product_store.qty_store', '>', 0)
            ->whereRaw("COALESCE({$prefix}product_store.qty_store, 0) > COALESCE({$prefix}product_sold.qty_sold, 0)")
            ->select([
                'product.id',
                'product.name as product_name',
                'product.slug as product_slug',
                'product.content as product_content',
                'product.description as product_description',
                'product.price_buy as product_price_buy',
                'product.thumbnail as product_thumbnail',
                'product_store.qty_store as product_qty_store',
                'product_sold.qty_sold as product_qty_sold',
                'product.status as product_status',
                'product.created_at as product_created_at',
                'category.name as category_name',
                'category.slug as category_slug',
            ]);

        // Sort
        switch ($sort) {
            case 'price_asc':
                $products->orderBy('product.price_buy', 'asc');
                break;
            case 'price_desc':
                $products->orderBy('product.price_buy', 'desc');
                break;
            case 'latest':
            default:
                $products->orderBy('product.created_at', 'desc');
                break;
        }

        $products = $products->paginate(9);


        if (!$products) {
            return response()->json(null, 404);
        }

        return response()->json($products, 200);
    }
}
