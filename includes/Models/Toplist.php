<?php

namespace Yuvayana\Acadlix\Models;

use Illuminate\Database\Eloquent\Model;

defined( 'ABSPATH' ) || exit();

if(!class_exists('Toplist')){
    class Toplist extends Model
    {
        protected $table = "toplist";

        protected $fillable = [
            "quiz_id",
            "user_id",
            "name",
            "email",
            "points",
            "result",
            "ip",
            "quiz_time",
            "accuracy",
            "status",
        ];

    }
}