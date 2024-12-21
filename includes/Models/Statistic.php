<?php

namespace Yuvayana\Acadlix\Models;

use Illuminate\Database\Eloquent\Model;
use Yuvayana\Acadlix\Helper\Helper;

defined( 'ABSPATH' ) || exit();

if(!class_exists('Statistic')){
    class Statistic extends Model
    {
        protected $helper;
        protected $table = "statistic";

        protected $fillable = [
            "statistic_ref_id",
            "question_id",
            "correct_count",
            "incorrect_count",
            "hint_count",
            "solved_count",
            "points",
            "negative_points",
            "question_time",
            "answer_data"
        ];

        protected $appends = ['rendered_answer_data'];

        public function __construct()
        {
            $this->helper = new Helper();
        }

        public function statistic_ref(){
            return $this->belongsTo(StatisticRef::class, 'statistic_ref_id', 'id');
        }

        public function question(){
            return $this->belongsTo(Question::class, 'question_id', 'id');
        }

        public function getRenderedAnswerDataAttribute()
        {
            $value = $this->answer_data;
            $answer_type = $this->question()->first()->answer_type;
            if (in_array($answer_type, ['singleChoice', 'multipleChoice', 'sortingChoice'])) {
                $answer_data = json_decode($value, true);
                foreach ($answer_data as $okey => $opt) {
                    $opt['option'] = $this->helper->renderShortCode($opt["option"]);
                    $answer_data[$okey] = $opt;
                }
                return wp_json_encode($answer_data);

            }
            return $value;
        }

    }
}