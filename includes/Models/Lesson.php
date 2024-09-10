<?php

namespace Yuvayana\Acadlix\Models;

use Illuminate\Database\Eloquent\Model;
use Yuvayana\Acadlix\Helper\Helper;

defined( 'ABSPATH' ) || exit();

if(!class_exists('Lesson')){
    class Lesson extends Model
    {
        protected $helper;

        protected $table = "lessons";

        protected $fillable = [
            "title",
            "content",
            "type",
            "duration",
            "duration_type",
            "preview",
        ]; 

        protected $with = ['lesson_resources'];

        public function __construct(){
            $this->helper = new Helper();
        }

        public function lesson_resources(){
            return $this->hasMany(LessonResource::class, 'lesson_id', 'id');
        }

        public function getContentAttribute($value){
            return $this->helper->renderShortCode($value);
        }
    }
}