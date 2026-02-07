<?php

namespace Yuvayana\Acadlix\Common\Controller;

defined('ABSPATH') || exit();

if (!class_exists("CheckoutController")) {
    class CheckoutController
    {
        protected static $_instance = null;

        public function __construct()
        {
            if (is_admin())
                return;
            add_filter("template_include", [$this, 'template_loader'], 10);
            add_action('wp_enqueue_scripts', [$this, 'enqueue_front_dequeue_assets'], 100);
            add_action("wp_enqueue_scripts", [$this, 'enqueue_front_checkout']);
        }

        public function template_loader($template)
        {
            $checkout_page_id = acadlix()->helper()->acadlix_get_option('acadlix_checkout_page_id');
            if ($checkout_page_id && is_page($checkout_page_id)) {
                // !defined('DONOTCACHEPAGE') && define('DONOTCACHEPAGE', true); // phpcs:ignore
                $checkout_template = ACADLIX_INCLUDES_PATH . 'Common/View/CheckoutView.php';
                if ($checkout_template) {
                    return $checkout_template;
                }
            }
            return $template;
        }

        public function enqueue_front_dequeue_assets()
        {
            $checkout_page_id = acadlix()->helper()->acadlix_get_option('acadlix_checkout_page_id');
            if ($checkout_page_id && is_page($checkout_page_id)) {
                wp_dequeue_style('acadlix-front-css');
                wp_dequeue_script('acadlix-front-js');
            }
        }

        private function localize_checkout_options()
        {
            return [
                'is_admin_bar_showing' => is_admin_bar_showing(),
                'api_url' => esc_url_raw(rest_url('acadlix/v1')),
                'max_execution_time' => acadlix()->helper()->acadlix_max_execution_time(),
                'ajax_url' => esc_url(admin_url('admin-ajax.php')),
                'nonce' => wp_create_nonce('wp_rest'),
                'user_id' => get_current_user_id() ?? 0,
                'user' => get_current_user_id() > 0 ?
                    acadlix()->model()->wpUsers()
                        ->select([
                            'ID',
                            'user_email',
                            'display_name',
                            'user_url'
                        ])
                        ->with('user_metas')
                        ->where('ID', get_current_user_id())
                        ->first() : [],
                'site_title' => get_bloginfo('name'),
                'cart_token' => isset($_COOKIE['acadlix_cart_token']) ? sanitize_text_field(wp_unslash($_COOKIE['acadlix_cart_token'])) : '',
                'settings' => acadlix()->helper()->acadlix_get_all_options(),
                'currency_symbol' => acadlix()->helper()->acadlix_currency_symbols()[acadlix()->helper()->acadlix_get_option('acadlix_currency')],
                'thankyou_url' => esc_url(get_permalink(acadlix()->helper()->acadlix_get_option("acadlix_thankyou_page_id"))),
                'dashboard_url' => esc_url(get_permalink(acadlix()->helper()->acadlix_get_option("acadlix_dashboard_page_id"))),
                'users_can_register' => acadlix()->helper()->acadlix_get_option("users_can_register"),
                'default_img_url' => esc_url(ACADLIX_ASSETS_IMAGE_URL . "demo-course.jpg"),
                'is_paypal_active' => acadlix()->payments()->paypal()->is_paypal_active() ?? false,
                'is_razorpay_active' => acadlix()->payments()->razorpay()->is_razorpay_active() ?? false,
                'is_payu_active' => acadlix()->payments()->payu()->is_payu_active() ?? false,
                'is_stripe_active' => acadlix()->payments()->stripe()->is_stripe_active() ?? false,
                'is_offline_active' => acadlix()->payments()->offline()->is_offline_active() ?? false,
                'offline_data' => acadlix()->payments()->offline()->getData() ?? [],
            ];
        }

        public function enqueue_front_checkout()
        {
            $checkout_page_id = acadlix()->helper()->acadlix_get_option('acadlix_checkout_page_id');
            if ($checkout_page_id && is_page($checkout_page_id)) {
                wp_enqueue_script('acadlix-razorpay-js');
                
                acadlix()->assets()->manager()->load_assets('front_checkout', $this->localize_checkout_options(), 'acadlixCheckoutOptions');
                // wp_enqueue_style('acadlix-front-checkout-css');
                // wp_enqueue_script('acadlix-front-checkout-js');
                // wp_localize_script('acadlix-front-checkout-js', 'acadlixOptions', array(

                // ));
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