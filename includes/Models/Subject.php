<?php

namespace Yuvayana\Acadlix\Models;

use Illuminate\Database\Eloquent\Model;

if(!class_exists('Subject')){
    class Subject extends Model
    {
        protected $table = "subject";

        protected $fillable = ["subject_name"];

        public function topic(){
            return $this->hasMany(Topic::class, 'subject_id', 'id');
        }
    }
}