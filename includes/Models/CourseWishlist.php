<?php

namespace Yuvayana\Acadlix\Models;

use Illuminate\Database\Eloquent\Model;

defined('ABSPATH') || exit();

if (!class_exists('CourseWishlist')) {
    class CourseWishlist extends Model
    {
        protected $table = "course_wishlist";

        protected $fillable = [
            'course_id',
            'user_id'
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