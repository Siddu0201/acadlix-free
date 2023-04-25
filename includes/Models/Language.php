<?php

namespace Yuvayana\Acadlix\Models;

use Illuminate\Database\Eloquent\Model;

if(!class_exists('Language')){
    class Language extends Model
    {
        protected $table = "language";

        protected $fillable = ["language_name"];

    }
}