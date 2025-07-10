<?php

namespace Yuvayana\Acadlix\Common\Models;

use Illuminate\Database\Eloquent\Model;
defined( 'ABSPATH' ) || exit();

if (!class_exists('WpUserMeta')) {

    class WpUserMeta extends Model
    {
        protected $table;
        protected $primaryKey = 'umeta_id';
        public $timestamps = false;

        public function __construct(array $attributes = [])
        {
            global $wpdb;
            parent::__construct($attributes);

            $this->table = "{$wpdb->base_prefix}usermeta";
        }

        public function getMetaValueAttribute($value)
        {
            return maybe_unserialize($value);  // Unserialize if needed
        }
    }
}