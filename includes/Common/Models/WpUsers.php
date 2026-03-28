<?php

namespace Yuvayana\Acadlix\Common\Models;

use Illuminate\Database\Eloquent\Model;
defined('ABSPATH') || exit();

if (!class_exists('WpUsers')) {
  class WpUsers extends Model
  {
    protected $table;
    protected $primaryKey = 'ID';

    protected $appends = [
      'course_purchased_count'
    ];

    public function __construct(array $attributes = [])
    {
      global $wpdb;
      parent::__construct($attributes);
      $this->table = "{$wpdb->base_prefix}users";
    }

    public function user_metas()
    {
      return $this->hasMany(acadlix()->model()->wpUserMeta(), 'user_id', 'ID');
    }

    public function orders()
    {
      return $this->hasMany(acadlix()->model()->order(), 'user_id', 'ID');
    }

    // public function coursesPurchased()
    // {
    //   return $this->hasManyThrough(
    //     acadlix()->model()->orderItem(),
    //     acadlix()->model()->order(),
    //     'user_id',     // Foreign key on Order table
    //     'order_id',    // Foreign key on OrderItem table
    //     'ID',          // Local key on User table
    //     'id'           // Local key on Order table
    //   )->whereHas('order', function ($query) {
    //     $query->ofSuccess();
    //   });
    // }

    public function getCoursePurchasedCountAttribute()
    {
      return $this->getPurchasedCoursesIds()->unique()->count();
    }

    public function getPurchasedCoursesIds()
    {
      return acadlix()->model()->course()
        ->ofCourse()
        ->whereHas('order_items', function ($query) {
          $query->whereHas('order', function ($q) {
            $q->ofSuccess()
              ->where('user_id', $this->ID);
          });
        })
        ->get()
        ->pluck('ID');
    }
  }
}