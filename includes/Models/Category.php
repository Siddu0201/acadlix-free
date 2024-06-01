<?php

namespace Yuvayana\Acadlix\Models;

use Illuminate\Database\Eloquent\Model;

if(!class_exists('Category')){
    class Category extends Model
    {
        protected $table = "category";

        protected $fillable = ["category_name"];

    }
}