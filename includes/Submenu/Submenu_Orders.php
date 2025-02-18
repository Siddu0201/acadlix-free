<?php

namespace Yuvayana\Acadlix\Submenu;

use Yuvayana\Acadlix\Helper\Helper;

defined('ABSPATH') || exit();

class Submenu_Orders
{
    private static $_instance = null;

    protected $_options = [];

    public function __construct()
    {
        $this->_options = [
            'parent_slug' => ACADLIX_SLUG,
            'page_title' => __('Acadlix Orders', 'acadlix'),
            'menu_title' => __('Orders', 'acadlix'),
            'capability' => 'manage_options',
            'menu_slug' => 'acadlix_order',
            'callback' => [$this, 'order_callback'],
            'position' => 40
        ];
    }

    public function add_submenu()
    {
        $page = add_submenu_page(
            $this->_options['parent_slug'],
            $this->_options['page_title'],
            $this->_options['menu_title'],
            $this->_options['capability'],
            $this->_options['menu_slug'],
            $this->_options['callback'],
            $this->_options['position']
        );

        add_action("admin_print_scripts-{$page}", [$this, 'admin_print_scripts']);
    }

    public function admin_print_scripts()
    {
        wp_enqueue_script('wp-date');
        wp_enqueue_script('acadlix-runtime-js');
        wp_enqueue_script('acadlix-vendors-js');
        wp_enqueue_script("acadlix-admin-order");
        wp_localize_script('acadlix-admin-order', 'acadlixOptions', array(
            'api_url' => esc_url_raw(rest_url('acadlix/v1')),
            'max_execution_time' => Helper::instance()->acadlix_max_execution_time(),
            'nonce' => wp_create_nonce('wp_rest'),
            'settings' => Helper::instance()->acadlix_get_all_options(),
            'currency_symbol' => Helper::instance()->acadlix_currency_symbols()[Helper::instance()->acadlix_get_option('acadlix_currency')],
            'currency_symbols' => Helper::instance()->acadlix_currency_symbols(),
            'date_time_format' => Helper::instance()->acadlix_get_date_time_format(),
            'timezone_string' => Helper::instance()->acadlix_get_time_zone_string(),
        ));
        wp_set_script_translations('acadlix-admin-order', 'acadlix', ACADLIX_PLUGIN_DIR . 'languages');
    }

    public function order_callback()
    {
        echo '<div id="acadlix-admin-order"><h2>' . __('Loading...', 'acadlix') . '</h2></div>';
    }

    public static function instance()
    {
        if (is_null(self::$_instance)) {
            self::$_instance = new self();
        }

        return self::$_instance;
    }
}