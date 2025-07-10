<?php

namespace Yuvayana\Acadlix\Common\Models;

use Illuminate\Database\Eloquent\Model;
defined( 'ABSPATH' ) || exit();

if (!class_exists('WpUsers')) {

    class WpUsers extends Model
    {
        protected $table;
        protected $primaryKey = 'ID';

        public function __construct(array $attributes = [])
        {
            global $wpdb;
            parent::__construct($attributes);
            $this->table = "{$wpdb->base_prefix}users";
        }

        public function user_metas()
        {
            return $this->hasMany(acadlix()->model()->wpUserMeta(), 'user_id', 'ID');
        }
    }
}