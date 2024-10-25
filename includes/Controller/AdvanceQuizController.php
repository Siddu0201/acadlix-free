<?php

namespace Yuvayana\Acadlix\Controller;
use Yuvayana\Acadlix\Helper\Helper;

defined('ABSPATH') || exit();

if (!class_exists("AdvanceQuizController")) {
    class AdvanceQuizController
    {
        protected static $_instance = null;

        public function __construct()
        {
            add_filter("template_include", [$this, 'template_loader'], 10);
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

        public static function instance()
        {
            if (is_null(self::$_instance)) {
                self::$_instance = new self();
            }

            return self::$_instance;
        }
    }
}