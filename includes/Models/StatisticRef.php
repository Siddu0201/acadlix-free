<?php

namespace Yuvayana\Acadlix\Models;

use Illuminate\Database\Eloquent\Model;

defined( 'ABSPATH' ) || exit();

if(!class_exists('StatisticRef')){
    class StatisticRef extends Model
    {
        protected $table = "acadlix_statistic_ref";

        protected $fillable = [
            "quiz_id",
            "user_token",
            "user_id",
            "points",
            "result",
            "quiz_time",
            "accuracy",
            "status",
        ];

        protected $with = ['statistics', 'user'];
        
        public function getPointsAttribute($value)
        {
            return floatval($value);
        }
    
        public function getResultAttribute($value)
        {
            return floatval($value);
        }

        public function setUserIdAttribute($value){
            $this->attributes['user_id'] = $value == 0 ? NULL : $value ;
        }

        public function setUserTokenAttribute($value){
            $this->attributes['user_token'] = empty($value) ? NULL : $value ;
        }

        public function getQuizAttribute(){
            return Quiz::ofQuiz()->find($this->quiz_id);
        }

        public function statistics(){
            return $this->hasMany(Statistic::class, "statistic_ref_id", "id");
        }

        public function user(){
            return $this->belongsTo(WpUsers::class, 'user_id', 'ID');
        }

    }
}