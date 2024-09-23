<?php

namespace Yuvayana\Acadlix\Models;

use Illuminate\Database\Eloquent\Model;

defined('ABSPATH') || exit();

if (!class_exists('CourseSection')) {
    class CourseSection extends Model
    {
        protected $table = "course_sections";

        protected $fillable = [
            'course_id',
            'title',
            'description',
            'sort',
        ];

        protected $with = ['contents'];

        public function contents()
        {
            return $this->hasMany(CourseSectionContent::class, 'course_section_id', 'id')->orderBy("sort");
        }

    }
}