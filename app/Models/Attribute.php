<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Attribute extends Model
{
    protected $table = 'attribute';

    protected $fillable = [
        'name'
    ];
    public $timestamps = false;
    // Quan hệ: Một attribute có nhiều product_attribute
    public function attribute(): HasMany
    {
        return $this->hasMany(ProductAttribute::class, 'attribute_id', 'id');
    }
}
