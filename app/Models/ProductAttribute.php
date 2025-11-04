<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductAttribute extends Model
{
    protected $table = 'product_attribute';

    protected $fillable = [
        'product_id',
        'attribute_id',
        'value',
    ];
    public $timestamps = false;
    //Quan hệ: Một product_attribute thuộc về một product
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id', 'id');
    }

    //Quan hệ: Một product_attribute thuộc về một attribute
    public function attribute()
    {
        return $this->belongsTo(Attribute::class, 'attribute_id', 'id');
    }
}
