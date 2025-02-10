<?php

namespace Yuvayana\Acadlix\Models;

use Illuminate\Database\Eloquent\Model;
use Yuvayana\Acadlix\Helper\Helper;

defined('ABSPATH') || exit();

if (!class_exists('Statistic')) {
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

        public function __construct()
        {
            $this->helper = new Helper();
        }

        public function statistic_ref()
        {
            return $this->belongsTo(StatisticRef::class, 'statistic_ref_id', 'id');
        }

        public function question()
        {
            return $this->belongsTo(Question::class, 'question_id', 'id');
        }

        public function setAnswerDataAttribute($value)
        {
            $this->attributes['answer_data'] = maybe_serialize($value);
        }

        public function getAnswerDataAttribute($value)
        {
            return maybe_unserialize($value);
        }
    }
}