<?php

namespace Yuvayana\Acadlix\Common\Models;

use Illuminate\Database\Eloquent\Model;

defined( 'ABSPATH' ) || exit();

if(!class_exists('Template')){
    class Template extends Model
    {
        protected $table;

        protected $fillable = [
            "name",
            "type",
            "data"
        ];

        public function __construct(array $attributes = [])
        {
            parent::__construct($attributes);

            $this->table = acadlix()->helper()->acadlix_table_prefix('template');
        }

        public function scopeOfQuiz($query){
            return $query->where('type', 'quiz');
        }

        public function setDataAttribute($value){
            $this->attributes['data'] = maybe_serialize($value);
        }

        public function getDataAttribute($value){
            return maybe_unserialize($value);
        }

    }
}