<?php

namespace Yuvayana\Acadlix\Models;

use Illuminate\Database\Eloquent\Model;

defined('ABSPATH') || exit();

if (!class_exists(class: 'CourseStatistic')) {
    class CourseStatistic extends Model
    {
        protected $table = "acadlix_course_statistics";

        protected $fillable = [
            'order_item_id',
            'course_section_content_id',
            'user_id',
            'is_active',
            'is_completed',
            'meta_type',
            'meta_value',
        ];

        public function setMetaValueAttribute($value)
        {
            $this->attributes['meta_value'] = maybe_serialize($value);
        }

        public function getMetaValueAttribute($value)
        {
            return maybe_unserialize($value);
        }
        
        public function getCourseSectionContentAttribute()
        {
            return CourseSectionContent::ofCourseSectionContent()->find($this->course_section_content_id);
        }

        public function order_item()
        {
            return $this->belongsTo(OrderItem::class, 'order_item_id', 'id');
        }

        public function user()
        {
            return $this->belongsTo(WpUsers::class, 'user_id', 'ID');
        }
    }
}