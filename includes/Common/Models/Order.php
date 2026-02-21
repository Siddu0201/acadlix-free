<?php

namespace Yuvayana\Acadlix\Common\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

defined('ABSPATH') || exit();

if (!class_exists('Order')) {
    class Order extends Model
    {
        protected $table;

        protected $fillable = [
            'user_id',
            'subscription_id',
            'parent_id',
            'status',
            'coupon_id',
            'coupon_code',
            'coupon_amount',
            'discount_type',
            'extra_charges',
            'total_amount'
        ];

        protected $casts = [
            'user_id' => 'integer',
        ];

        public function __construct(array $attributes = [])
        {
            parent::__construct($attributes);

            $this->table = acadlix()->helper()->acadlix_table_prefix('orders');
        }

        public function setExtraChargesAttribute($value)
        {
            $this->attributes['extra_charges'] = acadlix()->helper()->acadlix_format_price_for_storage($value);
        }

        public function getExtraChargesAttribute($value)
        {
            return acadlix()->helper()->acadlix_format_price_for_display($value);
        }

        public function setTotalAmountAttribute($value)
        {
            $this->attributes['total_amount'] = acadlix()->helper()->acadlix_format_price_for_storage($value);
        }

        public function getTotalAmountAttribute($value)
        {
            return acadlix()->helper()->acadlix_format_price_for_display($value);
        }

        public function scopeOfSuccess($query)
        {
            return $query->where('status', 'success');
        }

        public function order_items()
        {
            return $this->hasMany(acadlix()->model()->orderItem(), 'order_id', 'id');
        }

        public function getCourseNames()
        {
            return $this
                ->order_items
                ->map(fn($item) => $item->course->post_title ?? $item->course_title ?? '')
                ->filter()
                ->implode(', ');
        }

        public function order_metas()
        {
            return $this->hasMany(acadlix()->model()->orderMeta(), 'order_id', 'id');
        }

        public function activity_logs()
        {
            return $this
                ->hasMany(acadlix()->model()->userActivityMeta(), 'type_id', 'id')
                ->where('type', 'order')
                ->where('meta_key', 'activity_log')
                ->orderBy('id', 'desc');
        }

        public function getMetaValue($key)
        {
            $meta = $this->order_metas()->where('meta_key', $key)->first();

            // Check if the meta exists and return its value or null
            return $meta?->meta_value ?? null;
        }

        public function updateStatus($status = 'pending')
        {
            return $this->update(['status' => $status]);
        }

        public function updateOrCreateMeta($metaKey, $metaValue)
        {
            return $this->order_metas()->updateOrCreate(
                // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key -- Its custom order meta table
                ['meta_key' => $metaKey],  // Condition to check for existing meta_key
                // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_value -- Its custom order meta table
                ['meta_value' => $metaValue]  // Values to update or create
            );
        }

        public function createActivityLog($message = '')
        {
            return acadlix()->model()->userActivityMeta()->create([
                'user_id' => $this->user_id ?? 0,
                'type' => 'order',
                'type_id' => $this->id,
                'meta_key' => 'activity_log',  // phpcs:ignore
                'meta_value' => $message  // phpcs:ignore
            ]);
        }

        public function user()
        {
            return $this->belongsTo(acadlix()->model()->wpUsers(), 'user_id', 'ID');
        }

        public function delete()
        {
            acadlix()
                ->model()
                ->userActivityMeta()
                ->where('type', 'order')
                ->where('type_id', $this->id)
                ->delete();
            // check if payment if offline to delete uploaded files
            $payment_method = $this->getMetaValue('payment_method');
            if ($payment_method === 'offline') {
                // Add logic to delete uploaded files related to offline payment
                $uploaded_files = $this->getMetaValue('offline_upload_file');
                if ($uploaded_files) {
                    if (file_exists($uploaded_files['file_path'])) {
                        wp_delete_file($uploaded_files['file_path']);
                    }
                }
            }
            return parent::delete();
        }

        public function getTodaySalesTotal()
        {
            return $this
                ->whereDate('created_at', Carbon::today())
                ->ofSuccess()
                ->sum('total_amount');
        }

        public function getTotalSales()
        {
            return $this
                ->ofSuccess()
                ->sum('total_amount');
        }
    }
}
