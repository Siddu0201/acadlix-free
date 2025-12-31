<?php

namespace Yuvayana\Acadlix\Common\Models;

use Illuminate\Database\Eloquent\Model;
defined('ABSPATH') || exit();

class CommentMeta extends Model
{
    protected $table;
    protected $primaryKey = 'meta_id';
    protected $fillable = [
        'comment_id',
        'meta_key',
        'meta_value',
    ];
    public $timestamps = false;

    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);

        $this->table = acadlix()->helper()->acadlix_wp_prefix('commentmeta');
    }

    public function getMetaValueAttribute($value)
    {
        return maybe_unserialize($value);  // Unserialize if needed
    }
}