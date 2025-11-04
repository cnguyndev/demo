<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Menu extends Model
{
    protected $table = 'menu';

    protected $fillable = [
        'name',
        'link',
        'type',
        'parent_id',
        'sort_order',
        'status',
        'created_at',
        'updated_at',
        'created_by',
        'updated_by',
    ];

    // Quan hệ: Một menu có nhiều menu con
    public function children()
    {
        return $this->hasMany(Menu::class, 'parent_id', 'id');
    }

    // Quan hệ: Một menu con thuộc về một menu cha
    public function parent()
    {
        return $this->belongsTo(Menu::class, 'parent_id', 'id');
    }

    //Quan hệ: Một menu do một user tạo
    public function user_create()
    {
        return $this->belongsTo(User::class, 'created_by', 'id');
    }

    //Quan hệ: Một menu do một user sửa
    public function user_update()
    {
        return $this->belongsTo(User::class, 'updated_by', 'id');
    }
}
