<?php

namespace Yuvayana\Acadlix\Common\Submenu;

defined('ABSPATH') || exit();

class Submenu_Home
{
    private static $_instance = null;

    protected $_options = [];

    public function __construct()
    {
        $this->_options = [
            'page_title' => __('Acadlix', 'acadlix'),
            'menu_title' => __('Acadlix', 'acadlix'),
            'capability' => 'manage_options',
            'menu_slug' => ACADLIX_SLUG,
            'callback' => [$this, 'home_callback'],
            'dashicon' => ACADLIX_ASSETS_IMAGE_URL . 'acadlix-icon.svg',
            'position' => 40
        ];
    }

    public function get_position(){
        return $this->_options['position'];
    }

    public function add_submenu()
    {
        $page = add_menu_page(
            $this->_options['page_title'],
            $this->_options['menu_title'],
            $this->_options['capability'],
            $this->_options['menu_slug'],
            $this->_options['callback'],
            $this->_options['dashicon'],
            $this->_options['position'],
        );

        add_action("admin_print_scripts-{$page}", [$this, 'admin_print_scripts']);
    }

    public function localize_options()
    {
        return [
            'api_url' => esc_url_raw(rest_url('acadlix/v1')),
            'max_execution_time' => acadlix()->helper()->acadlix_max_execution_time(),
            'nonce' => wp_create_nonce('wp_rest'),
            'user_id' => get_current_user_id(),
            'settings' => acadlix()->helper()->acadlix_get_all_options(),
            'currency_symbol' => acadlix()->helper()->acadlix_currency_symbols()[acadlix()->helper()->acadlix_get_option('acadlix_currency')],
            'acadlix_documentation_url' => ACADLIX_DOCUMENTATION_URL,
            'acadlix_contact_us_url' => ACADLIX_CONTACT_US_URL,
            'isActive' => acadlix()->license()->isActive ?? false,
        ];
    }

    public function admin_print_scripts()
    {
        wp_enqueue_script('acadlix-runtime-js');
        wp_enqueue_script('acadlix-vendors-js');
        wp_enqueue_script("acadlix-admin-home");
        wp_localize_script('acadlix-admin-home', 'acadlixOptions', $this->localize_options());
        wp_set_script_translations('acadlix-admin-home', 'acadlix', ACADLIX_PLUGIN_DIR . 'languages/' . acadlix()->versionPath);
    }

    public function home_callback()
    {
        echo '<div id="acadlix-admin-home"><h2>' . __('Loading...', 'acadlix') . '</h2></div>';
    }

    public static function instance()
    {
        if (is_null(self::$_instance)) {
            self::$_instance = new self();
        }

        return self::$_instance;
    }
}