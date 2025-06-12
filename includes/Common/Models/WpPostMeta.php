<?php

namespace Yuvayana\Acadlix\Common\Models;

use Illuminate\Database\Eloquent\Model;
defined('ABSPATH') || exit();

if (!class_exists('WpPostMeta')) {

    class WpPostMeta extends Model
    {
        protected $table = 'postmeta';
        protected $primaryKey = 'meta_id';
        public $timestamps = false;

        public function getMetaValueAttribute($value)
        {
            return maybe_unserialize($value);  // Unserialize if needed
        }


    }
}