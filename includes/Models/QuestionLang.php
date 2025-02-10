<?php

namespace Yuvayana\Acadlix\Models;

use Illuminate\Database\Eloquent\Model;
use Yuvayana\Acadlix\Helper\Helper;

defined('ABSPATH') || exit();

if (!class_exists('QuestionLang')) {
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
            "answer_data",
            "meta",
        ];

        protected $appends = [
            'language',
            'rendered_question',
            'rendered_correct_msg',
            'rendered_incorrect_msg',
            'rendered_hint_msg',
            'rendered_answer_data',
        ];

        public function __construct()
        {
            $this->helper = new Helper();
        }

        public function question()
        {
            return $this->belongsTo(Question::class, 'question_id', 'id');
        }

        public function getLanguageAttribute()
        {
            if(!is_null($this->language_id)){
                return Language::find($this->language_id);
            }
            return [];
        }

        public function getRenderedQuestionAttribute()
        {
            return $this->helper->renderShortCode($this->question);
        }

        public function getRenderedCorrectMsgAttribute()
        {
            return $this->helper->renderShortCode($this->correct_msg);
        }

        public function getRenderedIncorrectMsgAttribute()
        {
            return $this->helper->renderShortCode($this->incorrect_msg);
        }

        public function getRenderedHintMsgAttribute()
        {
            return $this->helper->renderShortCode($this->hint_msg);
        }

        public function setAnswerDataAttribute($value){
            $this->attributes['answer_data'] = maybe_serialize($value);
        }

        public function getAnswerDataAttribute($value){
            return maybe_unserialize( $value );
        }

        public function getRenderedAnswerDataAttribute()
        {
            $value = $this->answer_data;
            $answer_type = $this->question()->first()->answer_type;
            if (in_array($answer_type, ['singleChoice', 'multipleChoice', 'sortingChoice'])) {
                foreach ($value[$answer_type] as $okey => $opt) {
                    $opt['option'] = $this->helper->renderShortCode($opt["option"]);
                    $value[$answer_type][$okey] = $opt;
                }
                return $value;
            }
            return $value;
        }

        public function emptyAnswerData()
        {
            $value = $this->answer_data;
            $answer_type = $this->question()->first()->answer_type;
            if (in_array($answer_type, ['singleChoice', 'multipleChoice', 'sortingChoice'])) {
                foreach ($value[$answer_type] as $okey => $opt) {
                    $opt['option'] = "";
                    $value[$answer_type][$okey] = $opt;
                }
                return $value;
            }
            return $value;
        }

    }
}