<?php

namespace Yuvayana\Acadlix\Models;

use Illuminate\Database\Eloquent\Model;

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
} 

if(!class_exists('QuizAttempt')){
    class QuizAttempt extends Model
    {
        protected $table = "quiz_attempt";

        protected $fillable = [
            "quiz_id",
            "user_id"
        ];

    }
}