<?php

namespace Yuvayana\Acadlix\Controller;
use Yuvayana\Acadlix\Helper\Helper;
use Yuvayana\Acadlix\Models\WpUsers;

defined('ABSPATH') || exit();

if (!class_exists("CheckoutController")) {
    class CheckoutController
    {
        protected static $_instance = null;

        public function __construct()
        {
            add_filter("template_include", [$this, 'template_loader'], 10);
            add_action("wp_enqueue_scripts", [$this, 'enqueue_front_checkout']);
        }

        public function template_loader($template)
        {
            $checkout_page_id = Helper::instance()->acadlix_get_option('acadlix_checkout_page_id');
            if ($checkout_page_id && is_page($checkout_page_id)) {
                $checkout_template = ACADLIX_VIEW_PATH . '/CheckoutView.php';
                if ($checkout_template) {
                    return $checkout_template;
                }
            }
            return $template;
        }

        public function enqueue_front_checkout()
        {
            $checkout_page_id = Helper::instance()->acadlix_get_option('acadlix_checkout_page_id');
            $paypal_active = Helper::instance()->acadlix_get_option('acadlix_paypal_active') == 'yes';
            if ($checkout_page_id && is_page($checkout_page_id)) {
                wp_dequeue_style('acadlix-front-css');
                wp_dequeue_script('acadlix-front-js');
                wp_enqueue_style('acadlix-front-checkout-css');
                wp_enqueue_script('acadlix-razorpay-js');
                if ($paypal_active) {
                    wp_enqueue_script('acadlix-paypal-js');
                }
                wp_enqueue_script('acadlix-front-checkout-js');
                wp_localize_script('acadlix-front-checkout-js', 'acadlixOptions', array(
                    'is_admin_bar_showing' => is_admin_bar_showing(),
                    'api_url' => esc_url_raw(rest_url('acadlix/v1')),
                    'ajax_url' => esc_url(admin_url('admin-ajax.php')),
                    'nonce' => wp_create_nonce('wp_rest'),
                    'user_id' => get_current_user_id() ?? 0,
                    'user' => get_current_user_id() > 0 ? WpUsers::where('ID', get_current_user_id())->first() : [],
                    'site_title' => get_bloginfo('name'),
                    'cart_token' => isset($_COOKIE['acadlix_cart_token']) ? sanitize_text_field(wp_unslash($_COOKIE['acadlix_cart_token'])) : '',
                    'settings' => Helper::instance()->acadlix_get_all_options(),
                    'currency_symbol' => Helper::instance()->acadlix_currency_symbols()[Helper::instance()->acadlix_get_option('acadlix_currency')],
                    'thankyou_url' => esc_url(get_permalink(Helper::instance()->acadlix_get_option("acadlix_thankyou_page_id"))),
                    'users_can_register' => Helper::instance()->acadlix_get_option("users_can_register"),
                    'default_img_url' => esc_url(ACADLIX_ASSETS_IMAGE_URL . "demo-course.jpg"),
                ));
            }
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