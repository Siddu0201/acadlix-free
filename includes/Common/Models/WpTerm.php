<?php

namespace Yuvayana\Acadlix\Common\Models;

use Illuminate\Database\Eloquent\Model;

defined('ABSPATH') || exit();

class WpTerm extends Model
{
  protected $table;
  protected $primaryKey = 'term_id';
  public $timestamps = false;

  public function __construct(array $attributes = [])
  {
    parent::__construct($attributes);
    $this->table = acadlix()->helper()->acadlix_wp_prefix('terms');
  }
}