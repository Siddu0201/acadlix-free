<?php

namespace Yuvayana\Acadlix\Submenu;

defined('ABSPATH') || exit();

class Submenu_Tags
{
    private static $_instance = null;

    protected $_options = [];

    public function __construct()
    {
        $this->_options = [
            'parent_slug' => ACADLIX_SLUG,
            'page_title' => __('Acadlix Course Tag', 'acadlix'),
            'menu_title' => __('Tags', 'acadlix'),
            'capability' => 'acadlix_manage_course_tag',
            'menu_slug' => 'edit-tags.php?taxonomy=' . ACADLIX_COURSE_TAG_TAXONOMY,
            'callback' => '',
            'position' => 30
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

    }

    public static function instance()
    {
        if (is_null(self::$_instance)) {
            self::$_instance = new self();
        }

        return self::$_instance;
    }
}