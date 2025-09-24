<?php

namespace Yuvayana\Acadlix\Common\Models;

use Illuminate\Database\Eloquent\Model;

defined('ABSPATH') || exit();

if (!class_exists('CourseCart')) {
    class CourseCart extends Model
    {
        protected $table;

        protected $fillable = [
            'cart_token',
            'course_id',
            'user_id',
            'subscription_id',
            'quantity',
            'token_expiry',
        ];

        protected $casts = [
            'course_id' => "integer",
            'user_id' => "integer",
            'quantity' => "integer",
        ];

        protected $appends = ['course'];

        public function __construct(array $attributes = [])
        {
            parent::__construct($attributes);

            $this->table = acadlix()->helper()->acadlix_table_prefix('course_cart');
        }

        public function getCourseAttribute()
        {
            return acadlix()->model()->course()->ofCourse()->find($this->course_id);
        }

        public function user()
        {
            return $this->belongsTo(acadlix()->model()->wpUsers(), 'user_id', 'ID');
        }
    }
}