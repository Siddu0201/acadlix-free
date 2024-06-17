<?php

namespace Yuvayana\Acadlix\Models;

use Illuminate\Database\Eloquent\Model;

if(!class_exists('QuizOption')){
    class QuizOption extends Model
    {
        protected $table = "quiz_option";

        protected $fillable = [
            "quiz_id",
            "user_id",
            "quiz_rating",
            "feedback_text",
        ];

    }
}