<?php

namespace Yuvayana\Acadlix\Models;

use Illuminate\Database\Eloquent\Model;

if(!class_exists('QuizLang')){
    class QuizLang extends Model
    {
        protected $table = "quiz_lang";

        protected $fillable = [
            "quiz_id",
            "language_id",
            "default"
        ];

        protected $with = ['language'];

        public function quiz(){
            return $this->belongsTo(Quiz::class, 'quiz_id', 'id');
        }

        public function language()
        {
            return $this->belongsTo(Language::class, 'language_id', 'id');
        }

    }
}