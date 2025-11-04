<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SocialIcon extends Model
{
    protected $table = 'social_icon';

    protected $fillable = [
        'name',
        'link',
        'icon',
    ];
    public $timestamps = false;
    //Quan hệ: Một social_icon có nhiều social
    public function social()
    {
        return $this->hasMany(Social::class, 'social_id', 'id');
    }
}
