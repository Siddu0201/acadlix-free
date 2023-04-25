<?php

namespace Yuvayana\Acadlix\Models;

use Illuminate\Database\Eloquent\Model;

if(!class_exists('QuizQuestion')){
    class QuizQuestion extends Model
    {
        protected $table = "quiz_question";

        protected $fillable = [
            "quiz_id",
            "question_id",
            "sort"
        ];

        public function quiz(){
            return $this->belongsTo(Quiz::class, 'quiz_id', 'id');
        }

        public function question(){
            return $this->belongsTo(Question::class, 'question_id', 'id');
        }

    }
}