<?php

namespace Yuvayana\Acadlix\Common\Models;

use Illuminate\Database\Eloquent\Model;

defined('ABSPATH') || exit();

if (!class_exists('Statistic')) {
    class Statistic extends Model
    {
        protected $table;

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
            "answer_data",
            "attempted_at"
        ];
        
        protected $casts = [
            "statistic_ref_id" => "integer",
            "question_id" => "integer",
            "correct_count" => "integer", // ✅ Ensures integer type
            "incorrect_count" => "integer",
            "hint_count" => "integer",
            "solved_count" => "integer",
            "points" => "double",
            "negative_points" => "double",
            "question_time" => "integer",
            "attempted_at" => "string"
        ];

        public function __construct(array $attributes = [])
        {
            parent::__construct($attributes);

            $this->table = acadlix()->helper()->acadlix_table_prefix('statistic');
        }

        public function statistic_ref()
        {
            return $this->belongsTo(acadlix()->model()->statisticRef(), 'statistic_ref_id', 'id');
        }

        public function question()
        {
            return $this->belongsTo(acadlix()->model()->question(), 'question_id', 'id');
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