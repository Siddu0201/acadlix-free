<?php

namespace Yuvayana\Acadlix\Models;

use Illuminate\Database\Eloquent\Model;
use Yuvayana\Acadlix\Helper\Helper;

defined( 'ABSPATH' ) || exit();

if(!class_exists('Paragraph')){
    class Paragraph extends Model
    {
        protected $helper;

        protected $table = "paragraph";

        protected $fillable = [
            "quiz_id",
            "title",
        ]; 

        protected $with = ['paragraph_languages'];

        public function __construct(){
            $this->helper = new Helper();
        }

        public function quiz(){
            return $this->belongsTo(Quiz::class, 'quiz_id', 'id');
        }
        
        public function paragraph_languages(){
            return $this->hasMany(ParagraphLang::class, 'paragraph_id', 'id');
        }

        public function questions(){
            return $this->hasMany(Question::class, 'paragraph_id', 'id');
        }

        public function getContentAttribute($value){
            return $this->helper->renderShortCode($value);
        }
    }
}