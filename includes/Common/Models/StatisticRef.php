<?php

namespace Yuvayana\Acadlix\Common\Models;

use Illuminate\Database\Eloquent\Model;

defined( 'ABSPATH' ) || exit();

if(!class_exists('StatisticRef')){
    class StatisticRef extends Model
    {
        protected $table;

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

        protected $casts = [
            "quiz_id" => "integer",
            "user_id" => "integer",
            "quiz_time" => "integer",
            "points" => "double",
            "result" => "double",
            "accuracy" => "double",
        ];

        public function __construct(array $attributes = [])
        {
            parent::__construct($attributes);

            $this->table = acadlix()->helper()->acadlix_table_prefix('statistic_ref');
        }

        public function setUserIdAttribute($value){
            $this->attributes['user_id'] = $value == 0 ? NULL : $value ;
        }

        public function setUserTokenAttribute($value){
            $this->attributes['user_token'] = empty($value) ? NULL : $value ;
        }

        public function getQuizAttribute(){
            return acadlix()->model()->quiz()->ofQuiz()->find($this->quiz_id);
        }

        public function statistics(){
            return $this->hasMany(acadlix()->model()->statistic(), "statistic_ref_id", "id");
        }

        public function user(){
            return $this->belongsTo(acadlix()->model()->wpUsers(), 'user_id', 'ID');
        }

    }
}