<?php

namespace Yuvayana\Acadlix\Common\Models;

use Illuminate\Database\Eloquent\Model;

defined('ABSPATH') || exit();

if (!class_exists(class: 'CourseStatistic')) {
    class CourseStatistic extends Model
    {
        protected $table;

        protected $fillable = [
            'order_item_id',
            'course_section_content_id',
            'user_id',
            'is_active',
            'is_completed',
            'meta_type',
            'meta_value',
        ];

        public function __construct(array $attributes = [])
        {
            parent::__construct($attributes);

            $this->table = acadlix()->helper()->acadlix_table_prefix('course_statistics');
        }

        public function setMetaValueAttribute($value)
        {
            $this->attributes['meta_value'] = maybe_serialize($value);
        }

        public function getMetaValueAttribute($value)
        {
            return maybe_unserialize($value);
        }

        public function content(){
            return $this->belongsTo(acadlix()->model()->courseSectionContent(), 'course_section_content_id', 'ID');
        }

        public function order_item()
        {
            return $this->belongsTo(acadlix()->model()->orderItem(), 'order_item_id', 'id');
        }

        public function user()
        {
            return $this->belongsTo(acadlix()->model()->wpUsers(), 'user_id', 'ID');
        }
    }
}