<?php

namespace Yuvayana\Acadlix\Submenu;

defined('ABSPATH') || exit();

class Submenu_Tools
{
    private static $_instance = null;

    protected $_options = [];

    public function __construct()
    {
        $this->_options = [
            'parent_slug' => ACADLIX_SLUG,
            'page_title' => __('Acadlix Tools', 'acadlix'),
            'menu_title' => __('Tools', 'acadlix'),
            'capability' => 'manage_options',
            'menu_slug' => 'acadlix_tool',
            'callback' => [$this, 'tool_callback'],
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
        wp_enqueue_script('acadlix-runtime-js');
        wp_enqueue_script('acadlix-vendors-js');
        wp_enqueue_script( "acadlix-admin-tool" );
        wp_set_script_translations('acadlix-admin-tool', 'acadlix', ACADLIX_PLUGIN_DIR . 'languages');
    }

    public function tool_callback()
    {
        echo '<div id="acadlix-admin-tool"><h2>' . __('Loading...', 'acadlix') . '</h2></div>';
    }

    public static function instance()
    {
        if (is_null(self::$_instance)) {
            self::$_instance = new self();
        }

        return self::$_instance;
    }
}