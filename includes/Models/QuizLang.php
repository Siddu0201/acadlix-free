<?php

namespace Yuvayana\Acadlix\Models;

use Illuminate\Database\Eloquent\Model;
use Yuvayana\Acadlix\Helper\Helper;

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
} 

if(!class_exists('QuizLang')){
    class QuizLang extends Model
    {
        protected $helper;

        protected $table = "quiz_lang";

        protected $fillable = [
            "quiz_id",
            "language_id",
            "default",
            "instruction1",
            "instruction2",
            "term_and_condition_text",
            "term_and_condition_warning_text",
        ];

        protected $with = ['language'];

        public function __construct(){
            $this->helper = new Helper();
        }

        public function quiz(){
            return $this->belongsTo(Quiz::class, 'quiz_id', 'id');
        }

        public function language()
        {
            return $this->belongsTo(Language::class, 'language_id', 'id');
        }

        public function getInstruction1Attribute($value){
            return $this->helper->renderShortCode($value);
        }

        public function getInstruction2Attribute($value){
            return $this->helper->renderShortCode($value);
        }

    }
}