<?php

namespace Yuvayana\Acadlix\Common\Models;

defined('ABSPATH') || exit();

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Capsule\Manager as DB;

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

    public function course_statistics()
    {
      return $this->hasMany(acadlix()->model()->courseStatistic(), 'user_id', 'ID');
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
          $query->whereNull('subscription_id')
            ->whereHas('order', function ($q) {
              $q->ofSuccess()
                ->where('user_id', $this->ID);
            });
        })
        ->get()
        ->pluck('ID');
    }

    public function getEnrolledUsers(
      $courseId = '',
      $search = null,
      $skip = 0,
      $take = 10,
      $with = []
    ) {

      if (empty($courseId)) {
        return [
          'total' => 0,
          'users' => collect(),
        ];
      }

      $orderItemTable = acadlix()->model()->orderItem()->getTable();
      $ordersTable = acadlix()->model()->order()->getTable();

      $purchaseMap = DB::table($orderItemTable)
        ->join($ordersTable, "$ordersTable.id", '=', "$orderItemTable.order_id")
        ->whereNull("$orderItemTable.subscription_id")
        ->where("$orderItemTable.item_id", $courseId)
        ->where("$ordersTable.status", 'success')
        ->where("$orderItemTable.type", 'course')
        ->selectRaw("$ordersTable.user_id as user_id, MAX($ordersTable.created_at) as purchased_at")
        ->groupBy("$ordersTable.user_id")
        ->pluck('purchased_at', 'user_id');

      $purchaseMap = $purchaseMap
        ->filter()
        ->sortByDesc(fn($date) => $date);

      $userIds = $purchaseMap->keys()->values();

      if ($userIds->isEmpty()) {
        return [
          'total' => 0,
          'users' => collect(),
        ];
      }

      $idsString = $userIds->implode(',');

      $query = self::whereIn('ID', $userIds)
        ->orderByRaw("FIELD(ID, $idsString)");

      // Apply eager loading if any
      if (!empty($with)) {
        $query->with($with);
      }

      if (!empty($search)) {
        $query->where("display_name", 'like', "%$search%");
      }

      // Get total count before pagination
      $total = $query->count();

      if ($total <= $skip) {
        $skip = 0;
      }

      // Apply skip/take for pagination
      $paginatedUsers = $query->skip($skip)->take($take)->get();

      // Add completion percentage
      $paginatedUsers->each(function ($user) use ($courseId) {
        $coursecompletion = acadlix()->model()->course()->find($courseId)->getCourseCompletionPercentage($user->ID);
        $user->is_completed = $coursecompletion >= 100;
        $user->completion_percentage = $coursecompletion;
        $user->statistic_overview = acadlix()->model()->courseStatistic()->getUserStatsOverview($courseId, $user->ID);

      });

      return [
        'total' => $total,
        'users' => $paginatedUsers,
      ];
    }
  }
}