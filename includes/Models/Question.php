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
            "multi_language",
            "title",
            "points",
            "negative_points",
            "different_points_for_each_answer",
            "different_incorrect_msg",
            "hint_enabled",
            "answer_type",
            "default_language_id",
            "selected_language_id"
        ];

        public function quiz(){
            return $this->belongsTo(Quiz::class, 'quiz_id', 'id');
        }

        public function subject(){
            return $this->belongsTo(Subject::class, 'subject_id', 'id');
        }

        public function default_language()
        {
            return $this->belongsTo(Language::class, 'default_language_id', 'id');
        }

        public function selected_language()
        {
            return $this->belongsTo(Language::class, 'selected_language_id', 'id');
        }

    }
}