<?php

namespace Yuvayana\Acadlix\Controller;
use Yuvayana\Acadlix\Helper\Helper;

defined('ABSPATH') || exit();

if (!class_exists("ThankyouController")) {
    class ThankyouController
    {
        protected static $_instance = null;

        public function __construct()
        {
            if(is_admin(  ))return;
            add_filter("template_include", [$this, 'template_loader'], 10);
        }

        public function template_loader($template)
        {
            $thankyou_page_id = Helper::instance()->acadlix_get_option('acadlix_thankyou_page_id');
            if ($thankyou_page_id && is_page($thankyou_page_id)) {
                $thankyou_template = ACADLIX_VIEW_PATH . '/ThankyouView.php';
                if ($thankyou_template) {
                    return $thankyou_template;
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