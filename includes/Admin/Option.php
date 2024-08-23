<?php

namespace Yuvayana\Acadlix\Admin;

defined( 'ABSPATH' ) || exit();

if (!class_exists("Option")) {
    class Option
    {
        private static $_instance = null;
        public $pages = [];

        public function __construct()
        {
            $this->pages = [
                'acadlix_dashboard_page_id' => [
                    'post_title' => 'Acadlix Dashboard Page',
                    'post_content' => '[Acadlix_Dashboard]',
                    'post_status' => 'publish',
                    'post_author' => get_current_user_id(), // Change this to the desired author ID
                    'post_type' => 'page',
                ],
                'acadlix_advance_quiz_page_id' => [
                    'post_title' => 'Acadlix Advance Quiz Page',
                    'post_content' => '[Acadlix_Advance_Quiz]',
                    'post_status' => 'publish',
                    'post_author' => get_current_user_id(), // Change this to the desired author ID
                    'post_type' => 'page',
                ],
            ];
        }

        public function createOption()
        {
            foreach ($this->pages as $key => $page) {
                if (!get_option($key)) {
                    $this->createPage($key, $page);
                }
            }
        }

        private function createPage($option = '', $data = [])
        {

            $existing_page = get_posts(array(
                'post_type' => $data['post_type'],
                'title' => $data['post_title'],
                'post_status' => $data['post_status'],
                'numberposts' => 1
            ));
            if (empty($existing_page)) {
                // Insert the page into the database
                $page_id = wp_insert_post($data);
                // Optionally, you can store the page ID in an option or somewhere else for future reference
                update_option($option, $page_id);
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
}