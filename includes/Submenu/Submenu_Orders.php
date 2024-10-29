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
            'page_title' => __('Acadlix Orders', ACADLIX_TEXT_DOMAIN),
            'menu_title' => __('Orders', ACADLIX_TEXT_DOMAIN),
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
        wp_enqueue_script( "acadlix-admin-order" );
        wp_localize_script('acadlix-admin-order', 'acadlixOptions', array(
            'api_url' => esc_url_raw(rest_url('acadlix/v1')),
            'nonce' => wp_create_nonce('wp_rest'),
            'settings' => Helper::instance()->acadlix_get_all_options(),
            'currency_symbol' => Helper::instance()->acadlix_currency_symbols()[Helper::instance()->acadlix_get_option('acadlix_currency')],
            'currency_symbols' => Helper::instance()->acadlix_currency_symbols(),
            'date_format' => Helper::instance()->acadlix_get_option("date_format"),
            'time_format' => Helper::instance()->acadlix_get_option("time_format"),
        ));
    }

    public function order_callback()
    {
        echo '<div id="acadlix-admin-order"><h2>Loading...</h2></div>';
    }

    public static function instance()
    {
        if (is_null(self::$_instance)) {
            self::$_instance = new self();
        }

        return self::$_instance;
    }
}