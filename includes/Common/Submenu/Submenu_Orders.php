<?php

namespace Yuvayana\Acadlix\Common\Submenu;

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
            'capability' => 'acadlix_show_order',
            'menu_slug' => 'acadlix_order',
            'callback' => [$this, 'order_callback'],
            'position' => 600
        ];
    }

    public function get_position()
    {
        return $this->_options['position'];
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

    public function localize_options()
    {
        $current_user = wp_get_current_user();
        $capabilities = $current_user->exists() ? $current_user->allcaps : [];
        return [
            'api_url' => esc_url_raw(rest_url('acadlix/v1')),
            'max_execution_time' => acadlix()->helper()->acadlix_max_execution_time(),
            'nonce' => wp_create_nonce('wp_rest'),
            'settings' => acadlix()->helper()->acadlix_get_all_options(),
            'currency_symbol' => acadlix()->helper()->acadlix_currency_symbols()[acadlix()->helper()->acadlix_get_option('acadlix_currency')],
            'currency_symbols' => acadlix()->helper()->acadlix_currency_symbols(),
            'date_time_format' => acadlix()->helper()->acadlix_get_date_time_format(),
            'timezone_string' => acadlix()->helper()->acadlix_get_time_zone_string(),
            'capabilities' => $capabilities,
            'isActive' => acadlix()->license()->isActive ?? false,
        ];
    }

    public function admin_print_scripts()
    {
        wp_enqueue_script('wp-date');
        wp_enqueue_script('acadlix-runtime-js');
        wp_enqueue_script('acadlix-vendors-js');
        wp_enqueue_script("acadlix-admin-order");
        wp_enqueue_style("acadlix-admin-order-css");
        wp_localize_script('acadlix-admin-order', 'acadlixOptions', $this->localize_options());
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