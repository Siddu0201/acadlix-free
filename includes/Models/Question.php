<?php

namespace Yuvayana\Acadlix\Models;

use Illuminate\Database\Eloquent\Model;

if(!class_exists('Question')){
    class Question extends Model
    {
        protected $table = "question";

        protected $fillable = [
            "quiz_id",
            "subject_id",
            "online",
            "sort",
            "title",
            "points",
            "negative_points",
            "different_points_for_each_answer",
            "different_incorrect_msg",
            "hint_enabled",
            "answer_type",
        ];

        protected $with = ['question_languages', 'subject'];

        public function quiz(){
            return $this->belongsTo(Quiz::class, 'quiz_id', 'id');
        }

        public function subject(){
            return $this->belongsTo(Subject::class, 'subject_id', 'id');
        }

        public function question_languages(){
            return $this->hasMany(QuestionLang::class, 'question_id', 'id');
        }

    }
}