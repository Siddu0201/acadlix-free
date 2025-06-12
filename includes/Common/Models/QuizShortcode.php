<?php

namespace Yuvayana\Acadlix\Common\Models;

use Illuminate\Database\Capsule\Manager as DB;
use Illuminate\Database\Eloquent\Model;

defined('ABSPATH') || exit();

if (!class_exists('QuizShortcode')) {
    class QuizShortcode extends Model
    {
        protected $connection = 'default';
        protected $table = "acadlix_quiz_shortcode";

        protected $fillable = [
            "quiz_id",
        ];

        protected $casts = [
            "quiz_id" => "integer",
        ];

        public $timestamps = false;

        public function quiz()
        {
            return $this->belongsTo(Quiz::class, "quiz_id", "ID");
        }
    }
}