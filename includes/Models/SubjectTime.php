<?php

namespace Yuvayana\Acadlix\Models;

use Illuminate\Database\Eloquent\Model;

if(!class_exists('Statistic')){
    class Statistic extends Model
    {
        protected $table = "statistic";

        protected $fillable = [
            "quiz_id",
            "subject_id",
            "time"
        ];

        public function quiz(){
            return $this->belongsTo(Quiz::class, 'quiz_id', 'id');
        }

        public function subject(){
            return $this->belongsTo(Subject::class, 'subject_id', 'id');
        }

    }
}