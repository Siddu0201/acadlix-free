<?php

namespace Yuvayana\Acadlix\Common\Helper;
use Illuminate\Database\Capsule\Manager as DB;

defined('ABSPATH') || exit();

if (!class_exists('QueryLogger')) {
  class QueryLogger
  {
    protected $totalQueryTime = 0;
    protected $queryCount = 0;
    public function enable()
    {
      DB::listen(function ($query) {
        $this->totalQueryTime += $query->time;
        $this->queryCount++;

        // error_log(sprintf(
        //   "SQL: %s | Time: %sms",
        //   $query->sql,
        //   $query->time
        // ));
      });

      register_shutdown_function(function () {
        // error_log(sprintf(
        //   "Total Queries: %d | Total DB Time: %.2fms",
        //   $this->queryCount,
        //   $this->totalQueryTime
        // ));
      });
    }
  }
}