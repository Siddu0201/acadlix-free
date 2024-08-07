<?php

namespace Yuvayana\Acadlix\Models;

use Illuminate\Database\Eloquent\Model;

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
} 

if(!class_exists('SubjectTime')){
    class SubjectTime extends Model
    {
        protected $table = "subject_time";

        protected $fillable = [
            "quiz_id",
            "subject_id",
            "time",
            "specific_number_of_questions",
        ];

        public function quiz(){
            return $this->belongsTo(Quiz::class, 'quiz_id', 'id');
        }

        public function subject(){
            return $this->belongsTo(Subject::class, 'subject_id', 'id');
        }

    }
}