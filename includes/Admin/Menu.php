<?php

namespace Yuvayana\Acadlix\Admin;

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
            $capability    = 'manage_options';
            
            add_menu_page( 'Acadlix' , 'Acadlix' , $capability , $slug, [$this, 'plugin_page'] );

            add_submenu_page( $slug, 'Quiz', 'Quiz', $capability, 'admin.php?page=' . $slug . '#/' );
        }

        public function plugin_page()
        {
            require_once ACADLIX_TEMPLATE_PATH. '/app.php';
        }
    }
}