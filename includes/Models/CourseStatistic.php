<?php

namespace Yuvayana\Acadlix\Models;

use Illuminate\Database\Eloquent\Model;

defined('ABSPATH') || exit();

if (!class_exists(class: 'CourseStatistic')) {
    class CourseStatistic extends Model
    {
        protected $table = "course_statistics";

        protected $fillable = [
            'order_item_id',
            'course_section_content_id',
            'user_id',
            'is_active',
            'is_completed',
        ];

        public function course_section_content()
        {
            return $this->belongsTo(CourseSectionContent::class, 'course_section_content_id', 'id');
        }

        public function order_item()
        {
            return $this->belongsTo(OrderItem::class, 'order_item_id', 'id');
        }


    }
}