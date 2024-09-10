<?php

namespace Yuvayana\Acadlix\Submenu;

defined('ABSPATH') || exit();

class Submenu_Home
{
    private static $_instance = null;

    protected $_options = [];

    public function __construct()
    {
        $this->_options = [
            'page_title' => __('Acadlix', ACADLIX_TEXT_DOMAIN),
            'menu_title' => __('Acadlix', ACADLIX_TEXT_DOMAIN),
            'capability' => 'manage_options',
            'menu_slug' => ACADLIX_SLUG,
            'callback' => [$this, 'home_callback'],
            'dashicon' => '',
            'position' => 50
        ];
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
            $this->_options['position']
        );

        add_action("admin_print_scripts-{$page}", [$this, 'admin_print_scripts']);
    }

    public function admin_print_scripts()
    {
        wp_enqueue_script("acadlix-admin-home");
    }

    public function home_callback()
    {
        echo '<div id="acadlix-admin-home"><h2>Loading...</h2></div>';

    }

    public static function instance()
    {
        if (is_null(self::$_instance)) {
            self::$_instance = new self();
        }

        return self::$_instance;
    }
}