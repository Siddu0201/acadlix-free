<?php

namespace Yuvayana\Acadlix\Common\Models;

use Illuminate\Database\Eloquent\Model;

defined('ABSPATH') || exit();

if (!class_exists('Order')) {
    class Order extends Model
    {
        protected $table = "acadlix_orders";

        protected $fillable = [
            'user_id',
            'status',
            'extra_charges',
            'total_amount'
        ];

        protected $casts = [
            'user_id' => 'integer',
        ];

        public function scopeOfSuccess($query)
        {
            return $query->where('status', 'success');
        }

        public function order_items()
        {
            return $this->hasMany(OrderItem::class, 'order_id', 'id');
        }

        public function getCourseNames()
        {
            return $this->order_items->map(fn($item) => $item->course->post_title ?? $item->course_title ?? "")
                ->filter()
                ->implode(', ');
        }

        public function order_metas()
        {
            return $this->hasMany(OrderMeta::class, 'order_id', 'id');
        }

        public function getMetaValue($key)
        {
            $meta = $this->order_metas()->where('meta_key', $key)->first();

            // Check if the meta exists and return its value or null
            return $meta?->meta_value ?? null;
        }

        public function updateOrCreateMeta($metaKey, $metaValue)
        {
            return $this->order_metas()->updateOrCreate(
                // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key -- Its custom order meta table
                ['meta_key' => $metaKey], // Condition to check for existing meta_key
                // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_value -- Its custom order meta table
                ['meta_value' => $metaValue] // Values to update or create
            );
        }

        public function user()
        {
            return $this->belongsTo(WpUsers::class, 'user_id', 'ID');
        }

    }
}