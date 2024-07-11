<?php

namespace Yuvayana\Acadlix\Models;

use Illuminate\Database\Eloquent\Model;

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
} 

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

        protected $with = ['statistics', 'user'];

        public function quiz(){
            return $this->belongsTo(Quiz::class, 'quiz_id', 'id');
        }

        public function statistics(){
            return $this->hasMany(Statistic::class, "statistic_ref_id", "id");
        }

        public function user(){
            return $this->belongsTo(WpUsers::class, 'user_id', 'ID');
        }

    }
}