<?php

namespace Yuvayana\Acadlix\Models;

use Illuminate\Database\Eloquent\Model;

if(!class_exists('QuestionLang')){
    class QuestionLang extends Model
    {
        protected $table = "question_lang";

        protected $fillable = [
            "question_id",
            "language_id",
            "default",
            "question",
            "correct_msg",
            "incorrect_msg",
            "hint_msg",
            "answer_data"
        ];

        protected $with = ['language'];

        public function question(){
            return $this->belongsTo(Question::class, 'question_id', 'id');
        }

        public function language(){
            return $this->belongsTo(Language::class, 'language_id', 'id');
        }

    }
}