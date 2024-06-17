<?php

namespace Yuvayana\Acadlix\Models;

use Illuminate\Database\Eloquent\Model;

if(!class_exists('AnswerOption')){
    class AnswerOption extends Model
    {
        protected $table = "answer_option";

        protected $fillable = [
            "quiz_id",
            "question_id",
            "user_id",
            "report_text",
            "solution_helpful",
            "bookmark",
        ];

    }
}