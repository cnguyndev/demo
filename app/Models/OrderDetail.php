<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderDetail extends Model
{
    protected $table = 'order_detail';

    protected $fillable = [
        'order_id',
        'product_id',
        'price',
        'qty',
        'amount',
        'discount',
        'status'
    ];
    public $timestamps = false;
    //Quan hệ: Một order_detail thuộc về một order
    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id', 'id');
    }

    //Quan hệ: Một order_detail thuộc về một product
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id', 'id');
    }
}
