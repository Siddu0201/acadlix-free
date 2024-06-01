<?php

namespace Yuvayana\Acadlix\Models;

use Illuminate\Database\Eloquent\Model;

if(!class_exists('StatisticRef')){
    class StatisticRef extends Model
    {
        protected $table = "statistic_ref";

        protected $fillable = [
            "quiz_id",
            "user_id",
            "points",
            "result",
            "quiz_time"
        ];

        public function quiz(){
            return $this->belongsTo(Quiz::class, 'quiz_id', 'id');
        }

    }
}