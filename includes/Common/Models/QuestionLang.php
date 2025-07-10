<?php

namespace Yuvayana\Acadlix\Common\Models;

use Illuminate\Database\Eloquent\Model;

defined('ABSPATH') || exit();

if (!class_exists('QuestionLang')) {
    class QuestionLang extends Model
    {
        protected $table;

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

        protected $casts = [
            "question_id" => "integer",
            "language_id" => "integer",
            "default" => "integer",
        ];

        protected $appends = [
            'language',
            'rendered_question',
            'rendered_correct_msg',
            'rendered_incorrect_msg',
            'rendered_hint_msg',
            'rendered_answer_data',
        ];

        public function __construct(array $attributes = [])
        {
            parent::__construct($attributes);

            $this->table = acadlix()->helper()->acadlix_table_prefix('question_lang');
        }

        public function question()
        {
            return $this->belongsTo(acadlix()->model()->question(), 'question_id', 'id');
        }

        public function getLanguageAttribute()
        {
            if(!is_null($this->language_id)){
                return acadlix()->model()->language()->find($this->language_id);
            }
            return [];
        }

        public function getRenderedQuestionAttribute()
        {
            return acadlix()->helper()->renderShortCode($this->question);
        }

        public function getRenderedCorrectMsgAttribute()
        {
            return acadlix()->helper()->renderShortCode($this->correct_msg);
        }

        public function getRenderedIncorrectMsgAttribute()
        {
            return acadlix()->helper()->renderShortCode($this->incorrect_msg);
        }

        public function getRenderedHintMsgAttribute()
        {
            return acadlix()->helper()->renderShortCode($this->hint_msg);
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
                    $opt['option'] = acadlix()->helper()->renderShortCode($opt["option"]);
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