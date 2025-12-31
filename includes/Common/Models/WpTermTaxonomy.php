<?php

namespace Yuvayana\Acadlix\Common\Models;

use Illuminate\Database\Eloquent\Model;

defined('ABSPATH') || exit();

class WpTermTaxonomy extends Model
{
    protected $table;
    protected $primaryKey = 'term_taxonomy_id';
    public $timestamps = false;

    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);
        $this->table = acadlix()->helper()->acadlix_wp_prefix('term_taxonomy');
    }

    public function term()
    {
        return $this->belongsTo(WpTerm::class, 'term_id', 'term_id');
    }
} 