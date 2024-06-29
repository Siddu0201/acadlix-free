<?php

namespace Yuvayana\Acadlix\Models;

use Illuminate\Database\Eloquent\Model;

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
} 

if(!class_exists('Language')){
    class Language extends Model
    {
        protected $table = "language";

        protected $fillable = ["language_name", "default"];

    }
}