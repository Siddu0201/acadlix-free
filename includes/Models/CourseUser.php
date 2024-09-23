<?php

namespace Yuvayana\Acadlix\Models;

use Illuminate\Database\Eloquent\Model;

defined('ABSPATH') || exit();

if (!class_exists(class: 'CourseUser')) {
    class CourseUser extends Model
    {
        protected $table = "course_users";

        protected $fillable = [
            'course_id',
            'user_id',
        ];

    }
}