<?php

namespace Yuvayana\Acadlix\Common\Models;

use Illuminate\Database\Eloquent\Model;

defined( 'ABSPATH' ) || exit();

if(!class_exists('Subject')){
    class Subject extends Model
    {
        protected $table;

        protected $fillable = ["subject_name", "default"];

        public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);

        $this->table = acadlix()->helper()->acadlix_table_prefix('subject');
    }

    }
}