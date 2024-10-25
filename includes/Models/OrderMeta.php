<?php

namespace Yuvayana\Acadlix\Models;

use Illuminate\Database\Eloquent\Model;

defined('ABSPATH') || exit();

if (!class_exists('OrderMeta')) {
    class OrderMeta extends Model
    {
        protected $table = "order_meta";

        protected $fillable = [
            'order_id',
            'meta_key',
            'meta_value',
        ];


        public function order()
        {
            return $this->belongsTo(Order::class, 'order_id', 'id');
        }

    }
}