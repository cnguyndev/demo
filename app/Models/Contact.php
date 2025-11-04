<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    protected $table = 'contact';

    protected $fillable = [
        'user_id',
        'name',
        'email',
        'phone',
        'content',
        'reply_id',
        'status',
        'created_at',
        'updated_at',
        'created_by',
        'updated_by',
    ];

    // Quan hệ: Một contact con thuộc về một user
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    // Quan hệ: Một contact con thuộc về một contact cha
    public function reply()
    {
        return $this->belongsTo(Contact::class, 'reply_id', 'id');
    }

    // Quan hệ: Một contact con có nhiều contact con
    public function children()
    {
        return $this->hasMany(Contact::class, 'reply_id', 'id');
    }

    // Quan hệ: Một contact do một user tạo
    public function user_create()
    {
        return $this->belongsTo(User::class, 'created_by', 'id');
    }

    // Quan hệ: Một contact do một user sửa
    public function user_update()
    {
        return $this->belongsTo(User::class, 'updated_by', 'id');
    }
}
