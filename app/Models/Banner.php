<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Banner extends Model
{
    protected $table = 'banner';

    protected $fillable = [
        'name',
        'image',
        'link',
        'position',
        'sort_order',
        'description',
        'status',
        'created_at',
        'updated_at',
        'created_by',
        'updated_by',
    ];

    //Quan hệ: Một banner do một user tạo
    public function user_create()
    {
        return $this->belongsTo(User::class, 'created_by', 'id');
    }

    //Quan hệ: Một banner do một user sửa
    public function user_update()
    {
        return $this->belongsTo(User::class, 'updated_by', 'id');
    }
}
