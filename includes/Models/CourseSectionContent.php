<?php

namespace Yuvayana\Acadlix\Models;

use Illuminate\Database\Eloquent\Model;

defined('ABSPATH') || exit();

if (!class_exists(class: 'CourseSectionContent')) {
    class CourseSectionContent extends Model
    {
        protected $table = "course_section_contents";

        protected $fillable = [
            'course_id',
            'course_section_id',
            'contentable_type',
            'contentable_id',
            'sort',
        ];

        protected $with = ['contentable'];

        public function contentable()
        {
            return $this->morphTo();
        }

        public function course_statistics()
        {
            return $this->hasMany(CourseStatistic::class, 'course_section_content_id', 'id');
        }

    }
}