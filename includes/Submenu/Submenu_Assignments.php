<?php

namespace Yuvayana\Acadlix\Submenu;

use Yuvayana\Acadlix\Helper\Helper;

class Submenu_Assignments
{
    private static $_instance = null;

    protected $_options = [];

    private function __construct()
    {
        $this->_options = [
            'parent_slug' => ACADLIX_SLUG,
            'page_title' => __('Acadlix Assignments', 'acadlix'),
            'menu_title' => __('Assignments', 'acadlix'),
            'capability' => 'acadlix_show_assignment',
            'menu_slug' => 'acadlix_assignment',
            'callback' => [$this, 'assignment_callback'],
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
        $current_user = wp_get_current_user();
        $capabilities = $current_user->exists() ? $current_user->allcaps : [];

        wp_enqueue_editor();
        wp_enqueue_media();
        wp_enqueue_script('acadlix-runtime-js');
        wp_enqueue_script('acadlix-vendors-js');
        wp_enqueue_script("acadlix-admin-assignment");
        wp_enqueue_style("acadlix-admin-assignment-css");
        wp_localize_script('acadlix-admin-assignment', 'acadlixOptions', array(
            'api_url' => esc_url_raw(rest_url('acadlix/v1')),
            'max_execution_time' => Helper::instance()->acadlix_max_execution_time(),
            'nonce' => wp_create_nonce('wp_rest'),
            'default_img_url' => esc_url(ACADLIX_ASSETS_IMAGE_URL . "demo-course.jpg"),
            'user_id' => get_current_user_id(),
            'capabilities' => $capabilities,
        ));
        wp_set_script_translations('acadlix-admin-assignment', 'acadlix', ACADLIX_PLUGIN_DIR . 'languages');
    }
    
    public function assignment_callback()
    {
        echo '<div id="acadlix-admin-assignment"><h2>' . __('Loading...', 'acadlix') . '</h2></div>';
    }
    
    public static function instance()
    {
        if (is_null(self::$_instance)) {
            self::$_instance = new self();
        }

        return self::$_instance;
    }
}