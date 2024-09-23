<?php

namespace Yuvayana\Acadlix\Models;

use Illuminate\Database\Eloquent\Model;

defined('ABSPATH') || exit();

if (!class_exists(class: 'CourseFaq')) {
    class CourseFaq extends Model
    {
        protected $table = "course_faqs";

        protected $fillable = [
            'course_id',
            'question',
            'answer',
        ];

    }
}