<?php

namespace Yuvayana\Acadlix\Models;

use Illuminate\Database\Eloquent\Model;

if(!class_exists('Quiz')){
    class Quiz extends Model
    {
        protected $table = "quiz";

        protected $fillable = [
            "name",
            "description",
            "calculator",
            "time_type",
            "time",
            "question_random",
            "answer_random",
            "sort_category",
            "hide_quiz_title",
            "hide_restart_button",
            "hide_view_answer_button"
        ];

    }
}