<?php

namespace Yuvayana\Acadlix\Controller;
use Yuvayana\Acadlix\Helper\Helper;

defined('ABSPATH') || exit();

if (!class_exists("DashboardController")) {
    class DashboardController
    {
        protected static $_instance = null;

        public function __construct()
        {
            add_filter("template_include", [$this, 'template_loader'], 10);
        }

        public function template_loader($template)
        {
            $dashboard_page_id = Helper::instance()->acadlix_get_option('acadlix_dashboard_page_id');
            if ($dashboard_page_id && is_page($dashboard_page_id)) {
                $dashboard_template = ACADLIX_VIEW_PATH . '/DashboardView.php';
                if ($dashboard_template) {
                    return $dashboard_template;
                }
            }
            return $template;
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