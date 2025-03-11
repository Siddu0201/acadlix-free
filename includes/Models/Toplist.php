<?php

namespace Yuvayana\Acadlix\Models;

use Illuminate\Database\Capsule\Manager as DB;
use Illuminate\Database\Eloquent\Model;

defined('ABSPATH') || exit();

if (!class_exists('Toplist')) {
    class Toplist extends Model
    {
        protected $table = "acadlix_toplist";

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

        public function getPointsAttribute($value)
        {
            return floatval($value);
        }

        public function getResultAttribute($value)
        {
            return floatval($value);
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

        public function getEntryRank($quiz_id, $entry_id)
        {
            $ranks = DB::table($this->table)
                ->select('id', DB::raw('RANK() OVER (ORDER BY result DESC, quiz_time ASC) as rank'))
                ->where('quiz_id', $quiz_id)
                ->get();

            $rank = $ranks->where('id', $entry_id)->first();
            return $rank?->rank;
        }

        public function getTopper($quiz_id)
        {
            return self::where('quiz_id', $quiz_id)
                ->orderByDesc('result')
                ->orderBy('quiz_time')
                ->first();
        }

        public function getTopList($quiz_id, $skip = 0, $take = 10)
        {
            return DB::table($this->table)
                ->select(
                    '*',
                    DB::raw('RANK() OVER (ORDER BY result DESC, quiz_time ASC) as rank')
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