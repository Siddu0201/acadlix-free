<?php

namespace Yuvayana\Acadlix\Models;

use Illuminate\Database\Eloquent\Model;

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
} 

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
            "paragraph_enabled",
            "paragraph_id",
            "answer_type",
        ];

        protected $with = ['question_languages', 'subject', 'paragraph'];

        public function quiz(){
            return $this->belongsTo(Quiz::class, 'quiz_id', 'id');
        }

        public function subject(){
            return $this->belongsTo(Subject::class, 'subject_id', 'id');
        }

        public function question_languages(){
            return $this->hasMany(QuestionLang::class, 'question_id', 'id');
        }

        public function paragraph(){
            return $this->belongsTo(Paragraph::class, 'paragraph_id', 'id');
        }

    }
}