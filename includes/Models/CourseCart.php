<?php

namespace Yuvayana\Acadlix\Models;

use Illuminate\Database\Eloquent\Model;

defined('ABSPATH') || exit();

if (!class_exists('CourseCart')) {
    class CourseCart extends Model
    {
        protected $table = "acadlix_course_cart";

        protected $fillable = [
            'cart_token',
            'course_id',
            'user_id',
            'quantity',
            'token_expiry',
        ];

        protected $appends = ['course'];
      
        public function getCourseAttribute()
        {
            return Course::ofCourse()->find($this->course_id);
        }

        public function user()
        {
            return $this->belongsTo(WpUsers::class, 'user_id', 'ID');
        }
    }
}