<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $table = 'product';

    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'thumbnail',
        'content',
        'description',
        'price_buy',
        'status',
        'created_at',
        'updated_at',
        'created_by',
        'updated_by',
    ];

    //Quan hệ: Một product thuộc về một category
    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id', 'id');
    }

    //Quan hệ: Một product có nhiều product_image
    public function product_image()
    {
        return $this->hasMany(ProductImage::class, 'product_id', 'id');
    }

    //Quan hệ: Một product có nhiều product_attribute
    public function product_attribute()
    {
        return $this->hasMany(ProductAttribute::class, 'product_id', 'id');
    }

    //Quan hệ: Một product có một product_store
    public function product_store()
    {
        return $this->belongsTo(ProductStore::class, 'id', 'product_id');
    }

    //Quan hệ: Một product có một product_sale
    public function product_sale()
    {
        return $this->hasMany(ProductSale::class, 'product_id', 'id');
    }

    //Quan hệ: Một product có nhiều order_detail
    public function order_detail()
    {
        return $this->hasMany(OrderDetail::class, 'product_id', 'id');
    }


    //Quan hệ: Một product do một user tạo
    public function user_create()
    {
        return $this->belongsTo(User::class, 'created_by', 'id');
    }

    //Quan hệ: Một product do một user sửa
    public function user_update()
    {
        return $this->belongsTo(User::class, 'updated_by', 'id');
    }
}
