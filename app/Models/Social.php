<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Social extends Model
{
    protected $table = 'social';

    protected $fillable = [
        'title',
        'social_id',
        'username',
        'status',
        'created_at',
        'updated_at',
        'created_by',
        'updated_by',
    ];

    //Quan hệ: Một social có một social_icon
    public function social_icon()
    {
        return $this->belongsTo(SocialIcon::class, 'social_id', 'id');
    }

    //Quan hệ: Một social do một user tạo
    public function user_create()
    {
        return $this->belongsTo(User::class, 'created_by', 'id');
    }

    //Quan hệ: Một social do một user sửa
    public function user_update()
    {
        return $this->belongsTo(User::class, 'updated_by', 'id');
    }
}
