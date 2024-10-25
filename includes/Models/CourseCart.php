<?php

namespace Yuvayana\Acadlix\Models;

use Illuminate\Database\Eloquent\Model;

defined('ABSPATH') || exit();

if (!class_exists('CourseCart')) {
    class CourseCart extends Model
    {
        protected $table = "course_cart";

        protected $fillable = [
            'cart_token',
            'course_id',
            'user_id',
            'quantity',
            'token_expiry',
        ];
      
        public function course()
        {
            return $this->belongsTo(Course::class, 'course_id', 'id');
        }

        public function user()
        {
            return $this->belongsTo(WpUsers::class, 'user_id', 'ID');
        }
    }
}