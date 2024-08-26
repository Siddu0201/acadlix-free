<?php

namespace Yuvayana\Acadlix\Models;

use Illuminate\Database\Eloquent\Model;
use Yuvayana\Acadlix\Helper\Helper;

defined( 'ABSPATH' ) || exit();

if(!class_exists('QuestionLang')){
    class QuestionLang extends Model
    {
        protected $helper;
        protected $table = "question_lang";

        protected $fillable = [
            "question_id",
            "language_id",
            "default",
            "question",
            "correct_msg",
            "incorrect_msg",
            "hint_msg",
            "answer_data"
        ];

        protected $with = ['language'];

        public function __construct(){
            $this->helper = new Helper();
        }

        public function question(){
            return $this->belongsTo(Question::class, 'question_id', 'id');
        }

        public function language(){
            return $this->belongsTo(Language::class, 'language_id', 'id');
        }

        public function getQuestionAttribute($value){
           return $this->helper->renderShortCode($value);
        }
        
        public function getCorrectMsgAttribute($value){
            return $this->helper->renderShortCode($value);
        }

        public function getIncorrectMsgAttribute($value){
            return $this->helper->renderShortCode($value);
        }

        public function getHintAttribute($value){
            return $this->helper->renderShortCode($value);
        }

        public function getAnswerDataAttribute($value){
            $answer_type = $this->question()->first()->answer_type;
            if(in_array($answer_type, ['singleChoice', 'multipleChoice', 'sortingChoice'])){
                $answer_data = json_decode($value, true);
                foreach($answer_data[$answer_type] as $okey => $opt){
                    $opt['option'] = $this->helper->renderShortCode($opt["option"]);
                    $answer_data[$answer_type][$okey] = $opt;
                }
                return wp_json_encode($answer_data);

            }
            return $value;
        }

    }
}