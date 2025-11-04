<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $table = 'setting';

    protected $fillable = [
        'site_name',
        'slogan',
        'email',
        'phone',
        'hotline',
        'address',
        'logo',
        'favicon',
        'created_at',
        'updated_at',
        'created_by',
        'updated_by',
    ];

    //Quan hệ: Một setting do một user tạo
    public function user_create()
    {
        return $this->belongsTo(User::class, 'created_by', 'id');
    }

    //Quan hệ: Một setting do một user sửa
    public function user_update()
    {
        return $this->belongsTo(User::class, 'updated_by', 'id');
    }
}
