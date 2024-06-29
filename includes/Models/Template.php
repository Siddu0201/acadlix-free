<?php

namespace Yuvayana\Acadlix\Models;

use Illuminate\Database\Eloquent\Model;

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
} 

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