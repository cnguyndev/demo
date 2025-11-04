<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductStore extends Model
{
    protected $table = 'product_store';

    protected $fillable = [
        'product_id',
        'price_root',
        'qty',
        'status',
        'created_at',
        'updated_at',
        'created_by',
        'updated_by',
    ];

    //Quan hệ: Một product_store thuộc về một product
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id', 'id');
    }

    //Quan hệ: Một product_store do một user tạo
    public function user_create()
    {
        return $this->belongsTo(User::class, 'created_by', 'id');
    }

    //Quan hệ: Một product_store do một user sửa
    public function user_update()
    {
        return $this->belongsTo(User::class, 'updated_by', 'id');
    }
}
