<?php

namespace Yuvayana\Acadlix\Models;

use Illuminate\Database\Eloquent\Model;

defined( 'ABSPATH' ) || exit();

if(!class_exists('Subject')){
    class Subject extends Model
    {
        protected $table = "subject";

        protected $fillable = ["subject_name", "default"];

    }
}