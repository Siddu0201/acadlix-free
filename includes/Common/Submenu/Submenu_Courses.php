<?php

namespace Yuvayana\Acadlix\Common\Submenu;

defined('ABSPATH') || exit();

class Submenu_Courses
{
    private static $_instance = null;

    protected $_options = [];

    public function __construct()
    {
        $this->_options = [
            'parent_slug' => ACADLIX_SLUG,
            'page_title' => __('Courses', 'acadlix'),
            'menu_title' => __('Courses', 'acadlix'),
            'capability' => 'edit_acadlix_courses',
            'menu_slug' => 'edit.php?post_type=' . ACADLIX_COURSE_CPT,
            'callback' => '',
            'position' => 900
        ];
        add_action('admin_enqueue_scripts', [$this, 'admin_print_scripts']);
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

    }

    public function localize_options()
    {
        $current_user = wp_get_current_user();
        $capabilities = $current_user->exists() ? $current_user->allcaps : [];
        return [
            'api_url' => esc_url_raw(rest_url('acadlix/v1')),
            'max_execution_time' => acadlix()->helper()->acadlix_max_execution_time(),
            'nonce' => wp_create_nonce('wp_rest'),
            'acadlix_quiz_url' => admin_url('admin.php?page=acadlix_quiz'),
            'acadlix_lesson_url' => admin_url('admin.php?page=acadlix_lesson'),
            'default_img_url' => esc_url(ACADLIX_ASSETS_IMAGE_URL . "demo-course.jpg"),
            'date_time_format' => acadlix()->helper()->acadlix_get_date_time_format(),
            'timezone_string' => acadlix()->helper()->acadlix_get_time_zone_string(),
            'user_id' => get_current_user_id(),
            'capabilities' => $capabilities,
            'isActive' => acadlix()->license()->isActive ?? false,
        ];
    }

    public function admin_print_scripts()
    {
        $screen = get_current_screen();
        if ($screen->post_type === ACADLIX_COURSE_CPT) {
            wp_enqueue_editor();
            wp_enqueue_media();
            wp_enqueue_script('acadlix-runtime-js');
            wp_enqueue_script('acadlix-vendors-js');
            wp_enqueue_script('acadlix-admin-course');
            wp_localize_script('acadlix-admin-course', 'acadlixOptions', $this->localize_options());

            wp_set_script_translations('acadlix-admin-course', 'acadlix', ACADLIX_PLUGIN_DIR . 'languages/' . acadlix()->versionPath);
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