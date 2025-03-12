<?php

namespace Yuvayana\Acadlix\Models;

use Illuminate\Database\Eloquent\Model;

defined('ABSPATH') || exit();

if (!class_exists('OrderMeta')) {
    class OrderMeta extends Model
    {
        protected $table = "acadlix_order_meta";

        protected $fillable = [
            'order_id',
            'meta_key',
            'meta_value',
        ];

        protected $casts = [
            "order_id" => "integer",
        ];


        public function order()
        {
            return $this->belongsTo(Order::class, 'order_id', 'id');
        }

    }
}