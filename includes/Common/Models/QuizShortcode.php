<?php

namespace Yuvayana\Acadlix\Common\Models;

use Illuminate\Database\Eloquent\Model;

defined('ABSPATH') || exit();

if (!class_exists('QuizShortcode')) {
    class QuizShortcode extends Model
    {
        protected $table;

        protected $fillable = [
            "quiz_id",
        ];

        protected $casts = [
            "quiz_id" => "integer",
        ];

        public $timestamps = false;

        public function __construct(array $attributes = [])
        {
            parent::__construct($attributes);

            $this->table = acadlix()->helper()->acadlix_table_prefix('quiz_shortcode');
        }

        public function quiz()
        {
            return $this->belongsTo(acadlix()->model()->quiz(), "quiz_id", "ID");
        }
    }
}