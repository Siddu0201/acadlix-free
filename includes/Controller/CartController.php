<?php

namespace Yuvayana\Acadlix\Controller;
use Yuvayana\Acadlix\Helper\Helper;

defined('ABSPATH') || exit();

if (!class_exists("CartController")) {
    class CartController
    {
        protected static $_instance = null;

        public function __construct()
        {
            if(is_admin(  ))return;
            add_filter("template_include", [$this, 'template_loader'], 10);
        }

        public function template_loader($template)
        {
            $cart_page_id = Helper::instance()->acadlix_get_option('acadlix_cart_page_id');
            if ($cart_page_id && is_page($cart_page_id)) {
                $cart_template = ACADLIX_VIEW_PATH . '/CartView.php';
                if ($cart_template) {
                    return $cart_template;
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