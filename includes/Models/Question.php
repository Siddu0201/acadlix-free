<?php

namespace Yuvayana\Acadlix\Models;

use Illuminate\Database\Eloquent\Model;

if(!class_exists('Question')){
    class Question extends Model
    {
        protected $table = "question";

        protected $fillable = [
            "subject_id",
            "topic_id",
            "online",
            "points",
            "negative_points",
            "correct_same_text",
            "tip_enabled",
            "answer_type",
            "matrix_sort_answer_criteria"
        ];

        public function subject(){
            return $this->belongsTo(Subject::class, 'subject_id', 'id');
        }

        public function topic(){
            return $this->belongsTo(Topic::class, 'topic_id', 'id');
        }

    }
}