<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductImage extends Model
{
    protected $table = 'product_image';

    protected $fillable = [
        'product_id',
        'image',
        'alt',
        'title'
    ];
    public $timestamps = false;
    //Quan hệ: Một product_image thuộc về một product
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id', 'id');
    }
}
