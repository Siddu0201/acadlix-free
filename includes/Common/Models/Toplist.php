<?php

namespace Yuvayana\Acadlix\Common\Models;

use Illuminate\Database\Capsule\Manager as DB;
use Illuminate\Database\Eloquent\Model;

defined('ABSPATH') || exit();

if (!class_exists('Toplist')) {
  class Toplist extends Model
  {
    protected $table;

    protected $fillable = [
      "quiz_id",
      "user_token",
      "user_id",
      "name",
      "email",
      "points",
      "result",
      "ip",
      "quiz_time",
      "accuracy",
      "status",
    ];

    protected $casts = [
      "quiz_id" => "integer",
      "user_id" => "integer",
      "points" => "double",
      "result" => "double",
      "quiz_time" => "integer",
      "accuracy" => "double",
    ];

    public function __construct(array $attributes = [])
    {
      parent::__construct($attributes);

      $this->table = acadlix()->helper()->acadlix_table_prefix('toplist');
    }

    public function setUserIdAttribute($value)
    {
      $this->attributes['user_id'] = $value == 0 ? NULL : $value;
    }

    public function setUserTokenAttribute($value)
    {
      $this->attributes['user_token'] = empty($value) ? NULL : $value;
    }

    public function getNameAttribute($value)
    {
      return is_null($value) ? "Anonymous" : $value;
    }

    public function getTopList($quiz_id, $skip = 0, $take = 10)
    {
      return DB::table($this->table)
        ->select(
          '*',
          DB::raw('RANK() OVER (ORDER BY result DESC, quiz_time ASC) as `rank`')
        )
        ->where('quiz_id', $quiz_id)
        ->skip($skip)
        ->take($take)
        ->get()
        ->map(function ($row) {
          // Convert to float in PHP after retrieval
          $row->points = (float) $row->points;
          $row->result = (float) $row->result;
          return $row;
        });
    }


  }
}