<?php

namespace Yuvayana\Acadlix\Models;

use Illuminate\Database\Eloquent\Model;

if(!class_exists('Prerequisite')){
    class Prerequisite extends Model
    {
        protected $table = "prerequisite";

        protected $fillable = [
            "quiz_id",
            "prerequisite_quiz_id",
            "min_percentage"
        ];

        public function quiz(){
            return $this->belongsTo(Quiz::class, 'quiz_id', 'id');
        }

        public function prerequisite_quiz(){
            return $this->belongsTo(Quiz::class, 'prerequisite_quiz_id', 'id');
        }

    }
}