<?php

namespace Yuvayana\Acadlix\Submenu;

defined('ABSPATH') || exit();

class Submenu_Quiz
{
    private static $_instance = null;

    protected $_options = [];

    public function __construct()
    {
        $this->_options = [
            'parent_slug' => ACADLIX_SLUG,
            'page_title' => __('Acadlix Quizzes', acadlix),
            'menu_title' => __('Quizzes', acadlix),
            'capability' => 'manage_options',
            'menu_slug' => 'acadlix_quiz',
            'callback' => [$this, 'quiz_callback'],
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
        wp_enqueue_style("acadlix-admin-quiz-css");
        wp_enqueue_script("acadlix-admin-quiz");
        wp_localize_script('acadlix-admin-quiz', 'acadlixOptions', array(
            'api_url' => esc_url_raw(rest_url('acadlix/v1')),
            'nonce' => wp_create_nonce('wp_rest'),
            'abqu_url' => admin_url('admin.php?page=abqu'),
            'is_abqu_active' => !is_plugin_active('abqu/abqu.php') ? false : true,
        ));
    }

    public function quiz_callback()
    {
        echo '<div id="acadlix-admin-quiz"><h2>Loading...</h2></div>';
    }

    public static function instance()
    {
        if (is_null(self::$_instance)) {
            self::$_instance = new self();
        }

        return self::$_instance;
    }
}