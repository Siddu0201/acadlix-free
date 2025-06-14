<?php

namespace Yuvayana\Acadlix\Common\Admin;
use Yuvayana\Acadlix\Common\Submenu\Submenu_Categories;
use Yuvayana\Acadlix\Common\Submenu\Submenu_Courses;
use Yuvayana\Acadlix\Common\Submenu\Submenu_Home;
use Yuvayana\Acadlix\Common\Submenu\Submenu_Lessons;
use Yuvayana\Acadlix\Common\Submenu\Submenu_Orders;
use Yuvayana\Acadlix\Common\Submenu\Submenu_Quiz;
use Yuvayana\Acadlix\Common\Submenu\Submenu_Settings;
use Yuvayana\Acadlix\Common\Submenu\Submenu_Tags;

defined('ABSPATH') || exit();

class Menu
{
    private static $_instance = null;
    protected array $_submenus = [];

    public function __construct()
    {
        if(!is_admin(  )) return;

        add_action("admin_menu", [$this, 'init_admin_menu']);
        add_filter('parent_file', [$this, 'acadlix_set_active_menu_class']);
        add_action('admin_menu', [$this, 'modify_admin_menu_title'], 999);

        $this->submenu_home();
        $this->submenu_courses();
        $this->submenu_lessons();
        $this->submenu_quiz();
        $this->submenu_orders();
        $this->submenu_categories();
        $this->submenu_tags();
        $this->submenu_settings();
    }

    public function modify_admin_menu_title()
    {
        global $submenu;

        // Ensure the top-level menu exists and has submenus
        if (isset($submenu['acadlix'])) { // 'courses_admin' is the top-level menu slug
            // Modify the first submenu item
            if (isset($submenu['acadlix'][0])) { // Index 0 for the first submenu item
                $submenu['acadlix'][0][0] = __('Home', 'acadlix'); // New title
            }
        }
    }

    public function init_admin_menu()
    {
        $submenus = apply_filters('acadlix_admin_submenus', $this->submenus);

        usort($submenus, fn($a, $b) => $b->get_position() <=> $a->get_position());
        foreach ($submenus as $submenu) {
            $submenu->add_submenu();
        }
        // Submenu_Home::instance()->add_submenu();
        // Submenu_Courses::instance()->add_submenu();
        // Submenu_Lessons::instance()->add_submenu();
        // Submenu_Quiz::instance()->add_submenu();
        // Submenu_Orders::instance()->add_submenu();
        // Submenu_Categories::instance()->add_submenu();
        // Submenu_Tags::instance()->add_submenu();
        // Submenu_Settings::instance()->add_submenu();
    }

    public function submenu_home(){
        $instance = new Submenu_Home();
        $this->_submenus[] = $instance;
        return $instance;
    }

    public function submenu_courses(){
        $instance = new Submenu_Courses();
        $this->_submenus[] = $instance;
        return $instance;
    }

    public function submenu_lessons(){
        $instance = new Submenu_Lessons();
        $this->_submenus[] = $instance;
        return $instance;
    }

    public function submenu_quiz(){
        $instance = new Submenu_Quiz();
        $this->_submenus[] = $instance;
        return $instance;
    }

    public function submenu_orders(){
        $instance = new Submenu_Orders();
        $this->_submenus[] = $instance;
        return $instance;
    }

    public function submenu_categories(){
        $instance = new Submenu_Categories();
        $this->_submenus[] = $instance;
        return $instance;
    }

    public function submenu_tags(){
        $instance = new Submenu_Tags();
        $this->_submenus[] = $instance;
        return $instance;
    }

    public function submenu_settings(){
        $instance = new Submenu_Settings();
        $this->_submenus[] = $instance;
        return $instance;
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

        if ($current_screen->taxonomy == ACADLIX_COURSE_CATEGORY_TAXONOMY) {
            $parent_file = ACADLIX_SLUG;
        }
        if ($current_screen->taxonomy == ACADLIX_COURSE_TAG_TAXONOMY) {
            $parent_file = ACADLIX_SLUG;
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