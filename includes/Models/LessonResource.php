<?php

namespace Yuvayana\Acadlix\Models;

use Illuminate\Database\Eloquent\Model;

defined( 'ABSPATH' ) || exit();

if(!class_exists('LessonResource')){
    class LessonResource extends Model
    {
        protected $table = "lesson_resources";

        protected $fillable = [
            "lesson_id",
            "title",
            "type",
            "filename",
            "file_url",
            "link",
        ]; 

        public function lesson(){
            return $this->belongsTo(Lesson::class, 'lesson_id', 'id');
        }
        
    }
}