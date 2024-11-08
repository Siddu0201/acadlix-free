<?php

namespace Yuvayana\Acadlix\Models;

use Illuminate\Database\Eloquent\Model;

defined('ABSPATH') || exit();

if (!class_exists('OrderItem')) {
    class OrderItem extends Model
    {
        protected $table = "order_items";

        protected $fillable = [
            'course_id',
            'order_id',
            'quantity',
            'price',
            'discount',
            'price_after_discount',
            'tax',
            'price_after_tax'
        ];

        public function course()
        {
            return $this->belongsTo(Course::class, 'course_id', 'id');
        }

        public function order()
        {
            return $this->belongsTo(Order::class, 'order_id', 'id');
        }

        public function course_statistics()
        {
            return $this->hasMany(CourseStatistic::class, 'order_item_id', 'id');
        }

    }
}