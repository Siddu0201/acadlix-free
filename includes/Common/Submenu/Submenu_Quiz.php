<?php

namespace Yuvayana\Acadlix\Common\Submenu;

defined('ABSPATH') || exit();

class Submenu_Quiz
{
    private static $_instance = null;

    protected $_options = [];

    public function __construct()
    {
        $this->_options = [
            'parent_slug' => ACADLIX_SLUG,
            'page_title' => __('Acadlix Quizzes', 'acadlix'),
            'menu_title' => __('Quizzes', 'acadlix'),
            'capability' => 'acadlix_show_quiz',
            'menu_slug' => 'acadlix_quiz',
            'callback' => [$this, 'quiz_callback'],
            'position' => 700
        ];
    }

    public function get_position(){
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

        add_action("admin_print_scripts-{$page}", [$this, 'admin_print_scripts']);
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
            'abqu_url' => admin_url('admin.php?page=abqu'),
            'user_id' => get_current_user_id(),
            'is_abqu_active' => !is_plugin_active('abqu/abqu.php') ? false : true,
            'date_time_format' => acadlix()->helper()->acadlix_get_date_time_format(),
            'timezone_string' => acadlix()->helper()->acadlix_get_time_zone_string(),
            'capabilities' => $capabilities,
            'isActive' => acadlix()->license()->isActive ?? false,
            'isBulkUploadActive' => acadlix()->helper()->is_bulk_question_addon_active() ?? false,
        ];
    }

    public function admin_print_scripts()
    {
        // $manifest = include ACADLIX_PLUGIN_DIR . 'build/manifest.php';

        // if (!isset($manifest['admin_quiz.js'])) {
        //     return; // Avoid errors if the manifest is missing or incorrect
        // }

        // $adminManifest = $manifest['admin_quiz.js'];


        // if (!empty($adminManifest['imports'])) {
        //     foreach ($adminManifest['imports'] as $importScript) {
        //         wp_enqueue_script(
        //             sanitize_title($importScript),
        //             ACADLIX_PLUGIN_URL . "build/$importScript",
        //             [],
        //             null,
        //             true
        //         );
        //     }
        // }
        // wp_enqueue_script(
        //     'acadlix-admin-quiz',
        //     ACADLIX_PLUGIN_URL . 'build/admin_quiz.js',
        //     !empty($adminManifest['imports']) ? array_map(fn($s) => sanitize_title($s), $adminManifest['imports']) : [],
        //     null,
        //     true
        // );

        wp_enqueue_editor();
        wp_enqueue_media();
        wp_enqueue_style("acadlix-admin-quiz-css");

        wp_enqueue_script('acadlix-runtime-js');
        wp_enqueue_script('acadlix-vendors-js');
        wp_enqueue_script('acadlix-admin-quiz');
        wp_localize_script('acadlix-admin-quiz', 'acadlixOptions', $this->localize_options());
        wp_set_script_translations('acadlix-admin-quiz', 'acadlix', ACADLIX_PLUGIN_DIR . 'languages/' . acadlix()->versionPath);
    }

    public function quiz_callback()
    {
        echo '<div id="acadlix-admin-quiz"><h2>' . esc_html__('Loading...', 'acadlix') . '</h2></div>';
    }

    public static function instance()
    {
        if (is_null(self::$_instance)) {
            self::$_instance = new self();
        }

        return self::$_instance;
    }
}