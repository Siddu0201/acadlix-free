<?php

namespace Yuvayana\Acadlix\Common\Models;

use Illuminate\Database\Eloquent\Model;

defined('ABSPATH') || exit();

if (!class_exists('OrderItem')) {
    class OrderItem extends Model
    {
        protected $table;

        protected $fillable = [
            'course_id',
            'order_id',
            'subscription_id',
            'course_title',
            'quantity',
            'price',
            'discount',
            'price_after_discount',
            'additional_fee',
            'tax',
            'price_after_tax'
        ];

        protected $casts = [
            'course_id' => 'integer',
            'order_id' => 'integer',
            'quantity' => 'integer',
            'price' => 'double',
            'discount' => 'double',
            'price_after_discount' => 'double',
            'tax' => 'double',
            'price_after_tax' => 'double',
        ];

        // protected $with = ["course"];

        public function __construct(array $attributes = [])
        {
            parent::__construct($attributes);

            $this->table = acadlix()->helper()->acadlix_table_prefix('order_items');
        }

        public function course()
        {
            return $this->belongsTo(acadlix()->model()->course(), 'course_id', 'ID')->ofCourse();
        }

        public function order()
        {
            return $this->belongsTo(acadlix()->model()->order(), 'order_id', 'id');
        }

        public function course_statistics()
        {
            return $this->hasMany(acadlix()->model()->courseStatistic(), 'order_item_id', 'id');
        }

        public function getCourseCompletionPercentageAttribute()
        {
            $course = $this->course;
            $statistics = $this->course_statistics;

            if (!$course || $statistics->isEmpty()) {
                return 0;
            }

            $total_count = $course->sections->flatMap->contents->count();
            if ($total_count === 0) {
                return 0;
            }

            $completed_count = $statistics->where('is_completed', true)->count();

            return round(($completed_count / $total_count) * 100, 0);
        }

        public static function softDeleteByCourseId(int $courseId)
        {
            return acadlix()->model()->orderItem()->where('course_id', $courseId)->update(['course_id' => null]);
        }
    }
}