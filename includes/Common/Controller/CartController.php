<?php

namespace Yuvayana\Acadlix\Common\Controller;
use Yuvayana\Acadlix\Common\Helper\Helper;

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
                $cart_template = ACADLIX_INCLUDES_PATH. acadlix()->versionPath .'/View/CartView.php';
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