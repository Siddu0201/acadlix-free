<?php

namespace Yuvayana\Acadlix\Models;

use Illuminate\Database\Eloquent\Model;

defined( 'ABSPATH' ) || exit();

if(!class_exists('SubjectTime')){
    class SubjectTime extends Model
    {
        protected $table = "acadlix_subject_time";

        protected $fillable = [
            "quiz_id",
            "subject_id",
            "time",
            "specific_number_of_questions",
            "optional",
        ];

        protected $casts = [
            "quiz_id" => "integer",
            "subject_id" => "integer",
            "time" => "integer",
            "specific_number_of_questions" => "integer",
            "optional" => "integer",
        ];

        // public function quiz(){
        //     return $this->belongsTo(Quiz::class, 'quiz_id', 'id');
        // }

        public function subject(){
            return $this->belongsTo(Subject::class, 'subject_id', 'id');
        }

    }
}