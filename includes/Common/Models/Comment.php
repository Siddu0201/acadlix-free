<?php

namespace Yuvayana\Acadlix\Common\Models;

use Illuminate\Database\Eloquent\Model;
defined('ABSPATH') || exit();

class Comment extends Model
{
  protected $table;
  protected $primaryKey = 'commnent_ID';
  public $timestamps = false;

  public function __construct(array $attributes = [])
  {
    parent::__construct($attributes);

    $this->table = acadlix()->helper()->acadlix_wp_prefix('comments');
  }

}