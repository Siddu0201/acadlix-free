<?php

namespace Yuvayana\Acadlix\Common\Controller;
use Yuvayana\Acadlix\Common\Helper\Helper;

defined('ABSPATH') || exit();

if (!class_exists("AdvanceQuizController")) {
    class AdvanceQuizController
    {
        protected static $_instance = null;

        public function __construct()
        {
            if(is_admin(  ))return; 
            add_filter("template_include", [$this, 'template_loader'], 10);
            add_filter('show_admin_bar', [$this, 'disable_admin_bar_on_advance_quiz']);
        }

        public function template_loader($template)
        {
            $advance_quiz_page_id = Helper::instance()->acadlix_get_option('acadlix_advance_quiz_page_id');
            if ($advance_quiz_page_id && is_page($advance_quiz_page_id)) {
                $advance_quiz_template = ACADLIX_VIEW_PATH . '/AdvanceQuizView.php';
                if ($advance_quiz_template) {
                    return $advance_quiz_template;
                }
            }
            return $template;
        }

        public function disable_admin_bar_on_advance_quiz($show_admin_bar)
        {
            $advance_quiz_page_id = Helper::instance()->acadlix_get_option('acadlix_advance_quiz_page_id');
            if ($advance_quiz_page_id && is_page($advance_quiz_page_id)) {
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