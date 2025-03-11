<?php

namespace Yuvayana\Acadlix\Models;

use Illuminate\Database\Eloquent\Model;

defined( 'ABSPATH' ) || exit();

if(!class_exists('Template')){
    class Template extends Model
    {
        protected $table = "acadlix_template";

        protected $fillable = [
            "name",
            "type",
            "data"
        ];

        public function scopeOfQuiz($query){
            return $query->where('type', 'quiz');
        }

        public function setDataAttribute($value){
            $this->attributes['data'] = maybe_serialize($value);
        }

        public function getDataAttribute($value){
            return maybe_unserialize($value);
        }

    }
}