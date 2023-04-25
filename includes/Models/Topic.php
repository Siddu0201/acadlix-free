<?php

namespace Yuvayana\Acadlix\Models;

use Illuminate\Database\Eloquent\Model;

if(!class_exists('Topic')){
    class Topic extends Model
    {
        protected $table = "topic";

        protected $fillable = ["subject_id", "topic_name"];

        public function subject(){
            return $this->belongsTo(Subject::class, 'subject_id', 'id');
        }
    }
}