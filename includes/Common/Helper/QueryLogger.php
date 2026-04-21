<?php

namespace Yuvayana\Acadlix\Common\Helper;
use Illuminate\Database\Capsule\Manager as DB;

defined('ABSPATH') || exit();

if (!class_exists('QueryLogger')) {
  class QueryLogger
  {
    public function enable()
    {
      DB::listen(function ($query) {
        $logMessage = sprintf(
          "SQL: %s | Bindings: %s | Time: %sms",
          $query->sql,
          json_encode($query->bindings),
          $query->time
        );

        // error_log($logMessage);
      });
    }
  }
}