<?php

namespace Yuvayana\Acadlix\Models;

use Illuminate\Database\Eloquent\Model;

defined('ABSPATH') || exit();

if (!class_exists(class: 'CourseOutcome')) {
    class CourseOutcome extends Model
    {
        protected $table = "course_outcomes";

        protected $fillable = [
            'course_id',
            'outcome',
        ];

    }
}