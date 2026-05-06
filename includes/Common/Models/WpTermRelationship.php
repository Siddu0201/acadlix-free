<?php

namespace Yuvayana\Acadlix\Common\Models;

use Illuminate\Database\Eloquent\Model;

defined('ABSPATH') || exit();

class WpTermRelationship extends Model
{
  protected $table;
  public $timestamps = false;

  public function __construct(array $attributes = [])
  {
    parent::__construct($attributes);
    $this->table = acadlix()->helper()->acadlix_wp_prefix('term_relationships');
  }

  public function termTaxonomy()
  {
    return $this->belongsTo(WpTermTaxonomy::class, 'term_taxonomy_id', 'term_taxonomy_id');
  }

  public function post()
  {
    return $this->belongsTo(WpPosts::class, 'object_id', 'ID');
  }
}