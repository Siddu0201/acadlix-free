<?php

namespace Yuvayana\Acadlix\Common\Models;

use Illuminate\Database\Eloquent\Model;

defined('ABSPATH') || exit();

if (!class_exists('CourseCart')) {
  class CourseCart extends Model
  {
    protected $table;

    protected $fillable = [
      'cart_token',
      'item_id',
      'user_id',
      'subscription_plan_id',
      'type',
      'quantity',
      'token_expiry',
    ];

    protected $casts = [
      'item_id' => "integer",
      'user_id' => "integer",
      'quantity' => "integer",
    ];

    protected $appends = ['item'];

    public function __construct(array $attributes = [])
    {
      parent::__construct($attributes);

      $this->table = acadlix()->helper()->acadlix_table_prefix('course_cart');
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
      if($this->isCourse()) {
        return acadlix()->model()->course()->ofCourse()->find($this->item_id);
      } 
      return null;
    }

    public function user()
    {
      return $this->belongsTo(acadlix()->model()->wpUsers(), 'user_id', 'ID');
    }
  }
}