<?php


namespace Yuvayana\Acadlix\Admin;

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
} 

if(!class_exists('Menu')){
    class Menu {
        public function __construct()
        {
            add_action("admin_menu", [$this, 'init_menu']);
        }


        public function init_menu()
        {
            global $submenu;

            $slug          = ACADLIX_SLUG;
            $menu_position = 50;
            $capability    = 'manage_options';
            
            add_menu_page( 'Acadlix' , 'Acadlix' , $capability , $slug, [$this, 'plugin_page'], '' , $menu_position );

            // add_submenu_page( $slug, 'Quiz', 'Quiz', $capability, 'admin.php?page=' . $slug . '#/quiz' ); // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited
        }

        public function plugin_page()
        {
            require_once ACADLIX_TEMPLATE_PATH. '/app.php';
        }
    }
}