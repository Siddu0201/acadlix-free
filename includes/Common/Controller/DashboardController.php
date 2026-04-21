<?php

namespace Yuvayana\Acadlix\Common\Controller;

defined('ABSPATH') || exit();

if (!class_exists("DashboardController")) {
  class DashboardController
  {
    protected static $_instance = null;

    public function __construct()
    {
      if (is_admin())
        return;
      add_filter("template_include", [$this, 'template_loader'], 10);
      add_filter('show_admin_bar', [$this, 'disable_admin_bar_on_dashboard']);
    }

    protected function is_dashboard_page()
    {
      $dashboard_page_id = acadlix()->helper()->acadlix_get_option('acadlix_dashboard_page_id');
      return $dashboard_page_id && is_page($dashboard_page_id);
    }

    public function template_loader($template)
    {
      if ($this->is_dashboard_page()) {
        // !defined('DONOTCACHEPAGE') && define('DONOTCACHEPAGE', true); // phpcs:ignore
        $dashboard_template = ACADLIX_INCLUDES_PATH . 'Common/View/DashboardView.php';
        if ($dashboard_template) {
          return $dashboard_template;
        }
      }
      return $template;
    }

    public function disable_admin_bar_on_dashboard($show_admin_bar)
    {
      if ($this->is_dashboard_page()) {
        return false;
      }
      return $show_admin_bar;
    }

    public static function instance()
    {
      if (is_null(self::$_instance)) {
        self::$_instance = new self();
      }

      return self::$_instance;
    }
  }
}