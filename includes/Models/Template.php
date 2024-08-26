<?php

namespace Yuvayana\Acadlix\Models;

use Illuminate\Database\Eloquent\Model;

defined( 'ABSPATH' ) || exit();

if(!class_exists('Template')){
    class Template extends Model
    {
        protected $table = "template";

        protected $fillable = [
            "name",
            "type",
            "data"
        ];

    }
}