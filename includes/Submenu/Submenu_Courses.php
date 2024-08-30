<?php

namespace Yuvayana\Acadlix\Submenu;

defined('ABSPATH') || exit();

class Submenu_Courses
{
    private static $_instance = null;

    protected $_options = [];

    public function __construct()
    {
        $this->_options = [
            'parent_slug' => ACADLIX_SLUG,
            'page_title' => __('Courses', ACADLIX_TEXT_DOMAIN),
            'menu_title' => __('Courses', ACADLIX_TEXT_DOMAIN),
            'capability' => 'manage_options',
            'menu_slug' => 'edit.php?post_type=' . ACADLIX_COURSE_CPT,
            'callback' => '',
            'position' => 999
        ];
        add_action( 'admin_enqueue_scripts', [$this, 'admin_print_scripts'] );
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

    public function admin_print_scripts() {
        $screen = get_current_screen();
        if($screen->post_type === ACADLIX_COURSE_CPT){
            wp_enqueue_script( 'acadlix-admin-course' );
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