<?php

namespace Yuvayana\Acadlix\Submenu;

defined('ABSPATH') || exit();

class Submenu_Lessons
{
    private static $_instance = null;

    protected $_options = [];

    public function __construct()
    {
        $this->_options = [
            'parent_slug' => ACADLIX_SLUG,
            'page_title' => __('Acadlix Lessons', ACADLIX_TEXT_DOMAIN),
            'menu_title' => __('Lessons', ACADLIX_TEXT_DOMAIN),
            'capability' => 'manage_options',
            'menu_slug' => 'acadlix_lesson',
            'callback' => [$this, 'lesson_callback'],
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
        wp_enqueue_editor();
        wp_enqueue_media();
        wp_enqueue_script( "acadlix-admin-lesson" );
        wp_enqueue_style( "acadlix-admin-lesson-css");
        wp_localize_script('acadlix-admin-lesson', 'acadlixOptions', array(
            'api_url' => esc_url_raw(rest_url('acadlix/v1')),
            'nonce' => wp_create_nonce('wp_rest'),
        ));
    }

    public function lesson_callback()
    {
        echo '<div id="acadlix-admin-lesson"><h2>Loading...</h2></div>';
    }

    public static function instance()
    {
        if (is_null(self::$_instance)) {
            self::$_instance = new self();
        }

        return self::$_instance;
    }
}