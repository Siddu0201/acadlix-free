<?php

namespace Yuvayana\Acadlix\Admin;

defined('ABSPATH') || exit();

class Menu
{
    private static $_instance = null;
    public function __construct()
    {
        add_action("admin_menu", [$this, 'init_menu']);
        add_filter('parent_file', [$this, 'acadlix_set_active_menu_class']);
    }


    public function init_menu()
    {
        global $submenu;

        $slug = ACADLIX_SLUG;
        $menu_position = 50;
        $capability = 'manage_options';

        $page[] = add_menu_page('Acadlix', 'Acadlix', $capability, $slug, [$this, 'plugin_page'], '', $menu_position);
        $page[] = add_submenu_page(
            $slug,          // Parent slug
            'Courses',                   // Page title
            'All Courses',                   // Menu title
            'manage_options',          // Capability
            'edit.php?post_type=' . ACADLIX_COURSE_CPT,  // Menu slug or URL pointing to the custom post type
            ''
        );
    }

    public function acadlix_set_active_menu_class($parent_file)
    {
        global $submenu_file, $current_screen;
        if ($current_screen->post_type == ACADLIX_COURSE_CPT) {
            // Set the parent menu to be active
            $parent_file = ACADLIX_SLUG;

            // Set the correct submenu to be active
            if ($current_screen->base == 'post' && $current_screen->action == 'add') {
                $submenu_file = 'edit.php?post_type=' . ACADLIX_COURSE_CPT;
            }
        }
        return $parent_file;
    }

    public function plugin_page()
    {
        require_once ACADLIX_TEMPLATE_PATH . 'app.php';
    }

    public static function instance()
    {
        if (is_null(self::$_instance)) {
            self::$_instance = new self();
        }

        return self::$_instance;
    }
}