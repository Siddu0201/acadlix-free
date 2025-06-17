<?php

namespace Yuvayana\Acadlix\Common\Models;

use Illuminate\Database\Eloquent\Model;
defined( 'ABSPATH' ) || exit();

if (!class_exists('WpUsers')) {

    class WpUsers extends Model
    {
        protected $table = 'users';
        protected $primaryKey = 'ID';

        public function user_metas()
        {
            return $this->hasMany(acadlix()->model()->wpUserMeta(), 'user_id', 'ID');
        }
    }
}