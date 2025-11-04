<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $table = 'category';

    protected $fillable = [
        'name',
        'slug',
        'image',
        'parent_id',
        'sort_order',
        'description',
        'status',
        'created_at',
        'updated_at',
        'created_by',
        'updated_by',
    ];

    // Quan hệ: Một category có nhiều category con
    public function children()
    {
        return $this->hasMany(Category::class, 'parent_id', 'id');
    }

    // Quan hệ: Một category con thuộc về một category cha
    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_id', 'id');
    }

    //Quan hệ: Một category có nhiều product
    public function product()
    {
        return $this->hasMany(Product::class, 'category_id', 'id');
    }

    //Quan hệ: Một category do một user tạo
    public function user_create()
    {
        return $this->belongsTo(User::class, 'created_by', 'id');
    }

    //Quan hệ: Một category do một user sửa
    public function user_update()
    {
        return $this->belongsTo(User::class, 'updated_by', 'id');
    }
}
