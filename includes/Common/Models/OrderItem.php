<?php

namespace Yuvayana\Acadlix\Common\Models;

use Illuminate\Database\Eloquent\Model;

defined('ABSPATH') || exit();

if (!class_exists('OrderItem')) {
  class OrderItem extends Model
  {
    protected $table;

    protected $fillable = [
      'item_id',
      'order_id',
      'subscription_id',
      'type',
      'item_title',
      'quantity',
      'price',
      'discount',
      'price_after_discount',
      'additional_fee',
      'tax',
      'price_after_tax'
    ];

    protected $casts = [
      'item_id' => 'integer',
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
    protected $appends = ['item'];

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

    public function scopeOfCourse($query)
    {
      return $query->where('type', 'course');
    }

    public function isCourse()
    {
      return $this->type === 'course';
    }

    public function getItemAttribute()
    {
      if ($this->isCourse()) {
        return acadlix()->model()->course()->find($this->item_id);
      }
      return apply_filters(
        'acadlix/model/order_item/get_item',
        null,
        $this
      );
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
      if ($this->type !== 'course') {
        return 0;
      }
      $course = $this->item;
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

    public static function softDeleteByItemId(int $itemId)
    {
      return acadlix()->model()->orderItem()->where('item_id', $itemId)->update(['item_id' => null]);
    }
  }
}