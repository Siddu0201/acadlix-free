<?php

namespace Yuvayana\Acadlix\Common\Submenu;

defined('ABSPATH') || exit();

class Submenu_Design_Studio
{
    private static $_instance = null;

    protected $_options = [];

    public function __construct()
    {
        $this->_options = [
            'parent_slug' => ACADLIX_SLUG,
            'page_title' => __('Acadlix Design Studio', 'acadlix'),
            'menu_title' => __('Design Studio', 'acadlix'),
            'capability' => 'acadlix_show_design_studio',
            'menu_slug' => 'acadlix_design_studio',
            'callback' => [$this, 'design_studio_callback'],
            'position' => 350,
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
            'options' => acadlix()->helper()->acadlix_get_all_options(),
            'theme_settings'=> acadlix()->helper()->acadlix_get_option('acadlix_theme_settings'),
            'capabilities' => $capabilities,
            'user_id' => get_current_user_id(),
            'acadlix_docs_url' => ACADLIX_DOCUMENTATION_URL,
            'isActive' => acadlix()->license()->isActive ?? false,
            'home_url' => home_url(),
            'pricing_link' => ACADLIX_MARKETPLACE_URL . 'pricing',
            'basic_palette_link' => ACADLIX_DOCUMENTATION_URL . 'design-studio/basic-palette/',
        ];
    }

    public function admin_print_scripts()
    {
        acadlix()->assets()->manager()->load_assets('admin_design_studio', $this->localize_options());
        // wp_enqueue_script('acadlix-runtime-js');
        // wp_enqueue_script('acadlix-vendors-js');

        // wp_enqueue_script("acadlix-admin-design-studio");
        // wp_enqueue_style("acadlix-admin-design-studio-css");

        // wp_localize_script('acadlix-admin-design-studio', 'acadlixOptions', $this->localize_options());
        // wp_set_script_translations('acadlix-admin-design-studio', 'acadlix', ACADLIX_PLUGIN_DIR . 'languages');
    }

    public function design_studio_callback()
    {
        echo '<div id="acadlix-admin-design-studio"><h2>' . esc_html__('Loading...', 'acadlix') . '</h2></div>';
    }

    public static function instance()
    {
        if (is_null(self::$_instance)) {
            self::$_instance = new self();
        }

        return self::$_instance;
    }
}

