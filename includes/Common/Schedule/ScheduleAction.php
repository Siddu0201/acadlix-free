<?php

namespace Yuvayana\Acadlix\Common\Schedule;

defined('ABSPATH') || exit();

if (!class_exists(__NAMESPACE__ . '\\ScheduleAction')) {
  class ScheduleAction
  {
    protected $events = [];

    public function __construct()
    {
      $this->registerHooks();
      add_filter('cron_schedules', [$this, 'registerCustomSchedules']);
    }

    protected function registerHooks()
    {
      foreach ((array) $this->events as $hook => $data) {
        add_action($hook, [$this, $data['callback']]);
      }
    }

    public function registerCustomSchedules($schedules)
    {
      return $schedules;
    }

    public function createSchedules()
    {
      foreach ((array) $this->events as $hook => $data) {
        if (!wp_next_scheduled($hook)) {
          wp_schedule_event(time(), $data['interval'], $hook);
        }
      }
    }

    public function deleteSchedules()
    {
      foreach ((array) array_keys($this->events) as $hook) {
        wp_clear_scheduled_hook($hook);
      }
    }
  }
}