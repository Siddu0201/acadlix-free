<?php

namespace Yuvayana\Acadlix\Common\Models;

use Illuminate\Database\Eloquent\Model;
defined('ABSPATH') || exit();

if (!class_exists('WpPostMeta')) {

  class WpPostMeta extends Model
  {
    protected $table;
    protected $primaryKey = 'meta_id';
    public $timestamps = false;

    public function __construct(array $attributes = [])
    {
      parent::__construct($attributes);

      $this->table = acadlix()->helper()->acadlix_wp_prefix('postmeta');
    }

    public function getMetaValueAttribute($value)
    {
      return maybe_unserialize($value);  // Unserialize if needed
    }


  }
}