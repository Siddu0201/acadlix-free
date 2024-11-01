<?php

namespace Yuvayana\Acadlix\Submenu;
use Yuvayana\Acadlix\Helper\Helper;

defined('ABSPATH') || exit();

class Submenu_Settings
{
    private static $_instance = null;

    protected $_options = [];

    public function __construct()
    {
        $this->_options = [
            'parent_slug' => ACADLIX_SLUG,
            'page_title' => __('Acadlix Settings', 'acadlix'),
            'menu_title' => __('Settings', 'acadlix'),
            'capability' => 'manage_options',
            'menu_slug' => 'acadlix_setting',
            'callback' => [$this, 'setting_callback'],
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
        wp_enqueue_style("acadlix-admin-setting-css");
        wp_enqueue_script("acadlix-admin-setting");
        wp_localize_script("acadlix-admin-setting", "acadlixOptions", array(
            'api_url' => esc_url_raw(rest_url('acadlix/v1')),
            'nonce' => wp_create_nonce('wp_rest'),
            'currecies_with_symbol' => Helper::instance()->acadlix_get_currency_with_symbols(),
            'options' => Helper::instance()->acadlix_get_all_options(),
            'all_pages' => get_pages(),
            'user_id' => get_current_user_id(  ),
        ));
    }

    public function setting_callback()
    {
        echo '<div id="acadlix-admin-setting"><h2>Loading...</h2></div>';
    }

    public static function instance()
    {
        if (is_null(self::$_instance)) {
            self::$_instance = new self();
        }

        return self::$_instance;
    }
}