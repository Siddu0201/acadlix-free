<?php

namespace Yuvayana\Acadlix\Common\Models;

use Illuminate\Database\Eloquent\Model;

defined('ABSPATH') || exit();

if (!class_exists('OrderMeta')) {
    class OrderMeta extends Model
    {
        protected $table;

        protected $fillable = [
            'order_id',
            'meta_key',
            'meta_value',
        ];

        protected $casts = [
            'order_id' => 'integer',
        ];

        public function __construct(array $attributes = [])
        {
            parent::__construct($attributes);

            $this->table = acadlix()->helper()->acadlix_table_prefix('order_meta');
        }

        public function setMetaValueAttribute($value)
        {
            $this->attributes['meta_value'] = maybe_serialize($value);  // phpcs:ignore
        }

        public function getMetaValueAttribute($value)
        {
            // Case 1: Serialized data
            if (is_serialized($value)) {
                return maybe_unserialize($value);
            }

            // Case 2: JSON data
            if (acadlix()->helper()->acadlix_is_json($value)) {
                return json_decode($value, true);
            }

            // Case 3: Plain string
            return $value;
        }

        public function order()
        {
            return $this->belongsTo(acadlix()->model()->order(), 'order_id', 'id');
        }
    }
}
