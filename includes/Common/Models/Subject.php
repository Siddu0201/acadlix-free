<?php

namespace Yuvayana\Acadlix\Common\Models;

use Illuminate\Database\Eloquent\Model;

defined( 'ABSPATH' ) || exit();

if(!class_exists('Subject')){
    class Subject extends Model
    {
        protected $table = "acadlix_subject";

        protected $fillable = ["subject_name", "default"];

    }
}