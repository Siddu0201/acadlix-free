<?php

namespace Yuvayana\Acadlix\Common\Models;

use Illuminate\Database\Eloquent\Model;

defined('ABSPATH') || exit();

if (!class_exists('OrderItem')) {
    class OrderItem extends Model
    {
        protected $table;

        protected $fillable = [
            'course_id',
            'order_id',
            'subscription_id',
            'course_title',
            'quantity',
            'price',
            'discount',
            'price_after_discount',
            'additional_fee',
            'tax',
            'price_after_tax'
        ];

        protected $casts = [
            'course_id' => 'integer',
            'order_id' => 'integer',
            'quantity' => 'integer',
            'price' => 'double',
            'discount' => 'double',
            'price_after_discount' => 'double',
            'additional_fee' => 'double',
            'tax' => 'double',
            'price_after_tax' => 'double',
        ];

        // protected $with = ["course"];

        public function __construct(array $attributes = [])
        {
            parent::__construct($attributes);

            $this->table = acadlix()->helper()->acadlix_table_prefix('order_items');
        }

        public function setPriceAttribute($value)
        {
            $this->attributes['price'] = acadlix()->helper()->acadlix_format_price_for_storage($value);
        }

        public function getPriceAttribute($value)
        {
            return acadlix()->helper()->acadlix_format_price_for_display($value);
        }

        public function setDiscountAttribute($value)
        {
            $this->attributes['discount'] = acadlix()->helper()->acadlix_format_price_for_storage($value);
        }

        public function getDiscountAttribute($value)
        {
            return acadlix()->helper()->acadlix_format_price_for_display($value);
        }

        public function setPriceAfterDiscountAttribute($value)
        {
            $this->attributes['price_after_discount'] = acadlix()->helper()->acadlix_format_price_for_storage($value);
        }

        public function getPriceAfterDiscountAttribute($value)
        {
            return acadlix()->helper()->acadlix_format_price_for_display($value);
        }

        public function setAdditionalFeeAttribute($value)
        {
            $this->attributes['additional_fee'] = acadlix()->helper()->acadlix_format_price_for_storage($value);
        }

        public function getAdditionalFeeAttribute($value)
        {
            return acadlix()->helper()->acadlix_format_price_for_display($value);
        }

        public function setTaxAttribute($value)
        {
            $this->attributes['tax'] = acadlix()->helper()->acadlix_format_price_for_storage($value);
        }

        public function getTaxAttribute($value)
        {
            return acadlix()->helper()->acadlix_format_price_for_display($value);
        }

        public function setPriceAfterTaxAttribute($value)
        {
            $this->attributes['price_after_tax'] = acadlix()->helper()->acadlix_format_price_for_storage($value);
        }

        public function getPriceAfterTaxAttribute($value)
        {
            return acadlix()->helper()->acadlix_format_price_for_display($value);
        }

        public function course()
        {
            return $this->belongsTo(acadlix()->model()->course(), 'course_id', 'ID')->ofCourse();
        }

        public function order()
        {
            return $this->belongsTo(acadlix()->model()->order(), 'order_id', 'id');
        }

        public function course_statistics()
        {
            return $this->hasMany(acadlix()->model()->courseStatistic(), 'order_item_id', 'id');
        }

        public function getCourseCompletionPercentageAttribute()
        {
            $course = $this->course;
            $statistics = $this->course_statistics;

            if (!$course || $statistics->isEmpty()) {
                return 0;
            }

            $total_count = $course->sections->flatMap->contents->count();
            if ($total_count === 0) {
                return 0;
            }

            $completed_count = $statistics->where('is_completed', true)->count();

            return round(($completed_count / $total_count) * 100, 0);
        }

        public static function softDeleteByCourseId(int $courseId)
        {
            return acadlix()->model()->orderItem()->where('course_id', $courseId)->update(['course_id' => null]);
        }
    }
}