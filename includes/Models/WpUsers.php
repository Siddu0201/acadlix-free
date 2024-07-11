<?php

namespace Yuvayana\Acadlix\Models;

use Illuminate\Database\Eloquent\Model;

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

if (!class_exists('WpUsers')) {

    class WpUsers extends Model
    {
        protected $connection = 'wordpress';
        protected $table = 'users';
        protected $primaryKey = 'ID';
    }
}