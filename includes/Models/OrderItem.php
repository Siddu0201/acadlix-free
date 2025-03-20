<?php

namespace Yuvayana\Acadlix\Models;

use Illuminate\Database\Eloquent\Model;

defined('ABSPATH') || exit();

if (!class_exists('OrderItem')) {
    class OrderItem extends Model
    {
        protected $table = "acadlix_order_items";

        protected $fillable = [
            'course_id',
            'order_id',
            'course_title',
            'quantity',
            'price',
            'discount',
            'price_after_discount',
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
            'price_after_tax'=> 'double',
        ];

        protected $with = ["course"];

        protected $appends = [
            "course_completion_percentage"
        ];

        public function course()
        {
            return $this->belongsTo(Course::class, 'course_id', 'ID')->ofCourse();
        }

        public function order()
        {
            return $this->belongsTo(Order::class, 'order_id', 'id');
        }

        public function course_statistics()
        {
            return $this->hasMany(CourseStatistic::class, 'order_item_id', 'id');
        }

        public function getCourseCompletionPercentageAttribute()
        {
            $course = $this->course;
            $total_count = 0;
            $completed_count = 0;
            $statistics = $this->course_statistics;
            if ($course) {
                $sections = $course->sections;
                foreach($sections as $section){
                    if($section->contents){
                        $total_count += $section->contents->count();
                    }
                }
                foreach($statistics as $statistic){
                    if($statistic->is_completed){
                        $completed_count += 1;
                    }
                }
            }
            if($total_count == 0 || $completed_count == 0){
                return 0;
            }
            return round($completed_count / $total_count * 100, 2);
        }

        public static function softDeleteByCourseId(int $courseId)
        {
            return OrderItem::where('course_id', $courseId)->update(['course_id' => null]);
        }
    }
}