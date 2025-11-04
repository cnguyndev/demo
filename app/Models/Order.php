<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $table = 'order';

    protected $fillable = [
        'user_id',
        'name',
        'email',
        'phone',
        'address',
        'note',
        'status',
        'created_at',
        'updated_at',
        'created_by',
        'updated_by',
    ];

    //Quan hệ: Một order có nhiều order_detail
    public function order_detail()
    {
        return $this->hasMany(OrderDetail::class, 'order_id', 'id');
    }

    //Quan hệ: Một order thuộc về một user
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    //Quan hệ: Một order do một user tạo
    public function user_create()
    {
        return $this->belongsTo(User::class, 'created_by', 'id');
    }


    //Quan hệ: Một order do một user sửa
    public function user_update()
    {
        return $this->belongsTo(User::class, 'updated_by', 'id');
    }
}
