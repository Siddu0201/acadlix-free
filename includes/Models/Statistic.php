<?php

namespace Yuvayana\Acadlix\Models;

use Illuminate\Database\Eloquent\Model;

if(!class_exists('Statistic')){
    class Statistic extends Model
    {
        protected $table = "statistic";

        protected $fillable = [
            "statistic_ref_id",
            "question_id",
            "correct_count",
            "incorrect_count",
            "hint_count",
            "solved_count",
            "points",
            "negative_points",
            "question_time",
            "answer_data"
        ];

        public function statistic_ref(){
            return $this->belongsTo(StatisticRef::class, 'statistic_ref_id', 'id');
        }

        public function question(){
            return $this->belongsTo(Question::class, 'question_id', 'id');
        }

    }
}