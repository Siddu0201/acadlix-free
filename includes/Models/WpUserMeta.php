<?php

namespace Yuvayana\Acadlix\Models;

use Illuminate\Database\Eloquent\Model;
defined( 'ABSPATH' ) || exit();

if (!class_exists('WpUserMeta')) {

    class WpUserMeta extends Model
    {
        protected $table = 'usermeta';
        protected $primaryKey = 'umeta_id';
        public $timestamps = false;

        public function getMetaValueAttribute($value)
        {
            return maybe_unserialize($value);  // Unserialize if needed
        }
    }
}