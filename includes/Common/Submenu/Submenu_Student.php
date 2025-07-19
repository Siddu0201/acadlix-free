<?php

namespace Yuvayana\Acadlix\Common\Submenu;

defined('ABSPATH') || exit();

class Submenu_Student
{
    private static $_instance = null;
    private $_options = [];
    public function __construct()
    {
        $this->_options = [
            'parent_slug' => ACADLIX_SLUG,
            'page_title' => __('Acadlix Student', 'acadlix'),
            'menu_title' => __('Student', 'acadlix'),
            'capability' => 'manage_options',
            'menu_slug' => 'acadlix_student',
            'callback' => [$this, 'student_callback'],
            'position' => 510
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
        add_action( "admin_print_scripts-{$page}", [$this, 'admin_print_scripts']);
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
            'default_img_url' => esc_url(ACADLIX_ASSETS_IMAGE_URL . "demo-course.jpg"),
            'user_id' => get_current_user_id(),
            'capabilities' => $capabilities,
            'isPro' => acadlix()->pro,
            'isActive' => acadlix()->license()->isActive ?? false,
        ];
    }

    public function admin_print_scripts()
    {
        wp_enqueue_script('acadlix-runtime-js');
        wp_enqueue_script('acadlix-vendors-js');
        wp_enqueue_script("acadlix-admin-student");
        wp_enqueue_style("acadlix-admin-student-css");
        wp_localize_script('acadlix-admin-student', 'acadlixOptions', $this->localize_options());
        wp_set_script_translations('acadlix-admin-student', 'acadlix', ACADLIX_PLUGIN_DIR . 'languages/' . acadlix()->versionPath);
    }

    public function student_callback()
    {
        echo '<div id="acadlix-admin-student"><h2>' . esc_html__('Loading...', 'acadlix') . '</h2></div>';
    }
}