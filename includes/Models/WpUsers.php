<?php

namespace Yuvayana\Acadlix\Models;

use Illuminate\Database\Eloquent\Model;
defined( 'ABSPATH' ) || exit();

if (!class_exists('WpUsers')) {

    class WpUsers extends Model
    {
        protected $connection = 'wordpress';
        protected $table = 'users';
        protected $primaryKey = 'ID';

        protected $with = ['user_metas'];

        public function user_metas()
        {
            return $this->hasMany(WpUserMeta::class, 'user_id', 'ID');
        }
    }
}