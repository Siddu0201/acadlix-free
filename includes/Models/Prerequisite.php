<?php

namespace Yuvayana\Acadlix\Models;

use Illuminate\Database\Eloquent\Model;

defined('ABSPATH') || exit();

if (!class_exists('Prerequisite')) {
    class Prerequisite extends Model
    {
        protected $table = "acadlix_prerequisite";

        protected $fillable = [
            "type",
            "type_id",
            "prerequisite_type",
            "prerequisite_id",
            "meta"
        ];

        protected $casts = [
            "type_id" => "integer",
            "prerequisite_id" => "integer",
        ];

        public function scopeOfTypeQuiz($query)
        {
            return $query->where("type", "quiz");
        }

        public function scopeOfPrerequisiteTypeQuiz($query)
        {
            return $query->where("prerequisite_type", "quiz");
        }

        public function getQuizTitleAttribute()
        {
            if ($this->type == "quiz" && $this->prerequisite_type == "quiz") {
                $quiz = Quiz::ofQuiz()->find($this->prerequisite_id);
                return $quiz->post_title;
            }
        }
    }
}