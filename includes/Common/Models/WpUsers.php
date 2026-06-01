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
      // 'course_purchased_count'
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

    public function scopeSearch($query, $search = null)
    {
      if (empty($search)) {
        return $query;
      }

      $usersTable = $this->getTable();

      return $query->where(function ($q) use ($search, $usersTable) {
        $q->where("{$usersTable}.display_name", 'like', "%{$search}%")
          ->orWhere("{$usersTable}.user_email", 'like', "%{$search}%")
          ->orWhere("{$usersTable}.user_login", 'like', "%{$search}%");
      });
    }

    public function scopeWithCoursePurchasedCount($query)
    {
      $baseQuery = $this->getEnrolledCoursesQuery();
      $usersTable = $this->getTable();

      $courseCountSubQuery = DB::query()
        ->fromSub($baseQuery, 'purchased_courses')
        ->select(
          'purchased_courses.user_id',
          DB::raw('COUNT(DISTINCT purchased_courses.course_id) as course_purchased_count')
        )
        ->groupBy('purchased_courses.user_id');

      return $query->leftJoinSub(
        $courseCountSubQuery,
        'user_course_counts',
        function ($join) {
          $join->on('user_course_counts.user_id', '=', $this->getTable() . '.ID');
        }
      )->addSelect(
          "{$usersTable}.*",
          DB::raw('COALESCE(user_course_counts.course_purchased_count, 0) as course_purchased_count')
        );
    }

    public function scopeEnrolled($query)
    {
      $baseQuery = $this->getEnrolledCoursesQuery();

      $usersTable = $this->getTable();

      $enrolledUserIds = DB::query()
        ->fromSub($baseQuery, 'enrolled_courses')
        ->select('enrolled_courses.user_id');

      return $query->whereIn(
        "{$usersTable}.ID",
        $enrolledUserIds
      );
    }

    // public function getCoursePurchasedCountAttribute()
    // {
    //   return $this->getPurchasedCoursesIds()->count();
    // }

    public function getPurchasedCoursesIds()
    {
      $query = $this->getEnrolledCoursesQuery();
      return DB::query()
        ->fromSub($query, 'purchased_courses')
        ->where('purchased_courses.user_id', $this->ID)
        ->distinct()
        ->pluck('purchased_courses.course_id');
    }

    public function getEnrolledUsers()
    {
      $baseQuery = $this->getEnrolledCoursesQuery();

      $usersTable = $this->getTable();
      $courseCountSubQuery = DB::query()
        ->fromSub($baseQuery, 'purchased_courses')
        ->select(
          'purchased_courses.user_id',
          DB::raw('COUNT(DISTINCT purchased_courses.course_id) as course_purchased_count')
        )
        ->groupBy('purchased_courses.user_id');

      $query = self::query()
        ->from($usersTable)
        ->joinSub($courseCountSubQuery, 'user_course_counts', function ($join) use ($usersTable) {
          $join->on('user_course_counts.user_id', '=', "{$usersTable}.ID");
        })
        ->select("{$usersTable}.*", 'user_course_counts.course_purchased_count');

      // if (!empty($search)) {
      //   $query->where(function ($q) use ($search, $usersTable) {
      //     $q->where("{$usersTable}.display_name", 'like', "%{$search}%")
      //       ->orWhere("{$usersTable}.user_email", 'like', "%{$search}%");
      //   });
      // }

      return $query;
    }

    protected function getEnrolledCoursesQuery()
    {
      $orderItemTable = acadlix()->model()->orderItem()->getTable();
      $ordersTable = acadlix()->model()->order()->getTable();

      $directCourseQuery = DB::table($orderItemTable)
        ->join(
          $ordersTable,
          "$ordersTable.id",
          '=',
          "$orderItemTable.order_id"
        )
        ->select(
          "$orderItemTable.item_id as course_id",
          "$ordersTable.user_id"
        )
        ->where("$orderItemTable.type", 'course')
        ->whereNull("$orderItemTable.subscription_id")
        ->where("$ordersTable.status", 'success');
      return $directCourseQuery;
    }

    public function getEnrolledUsersByCourseId(
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