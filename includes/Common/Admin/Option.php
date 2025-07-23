<?php

namespace Yuvayana\Acadlix\Common\Admin;

defined('ABSPATH') || exit();

if (!class_exists("Option")) {
    class Option
    {
        private static $_instance = null;
        protected $pages = [];

        public function __construct()
        {
            // / add_filter( 'option_rewrite_rules', [ $this, 'update_option_rewrite_rules' ], 
        }

        public function init_options()
        {
            $this->pages = [
                'acadlix_dashboard_page_id' => [
                    'post_title' => __('Dashboard', 'acadlix'),
                    'post_status' => 'publish',
                    'post_author' => get_current_user_id(),
                    'post_type' => 'page',
                ],
                'acadlix_cart_page_id' => [
                    'post_title' => __('Cart', 'acadlix'),
                    'post_status' => 'publish',
                    'post_author' => get_current_user_id(),
                    'post_type' => 'page',
                ],
                'acadlix_checkout_page_id' => [
                    'post_title' => __('Checkout', 'acadlix'),
                    'post_status' => 'publish',
                    'post_author' => get_current_user_id(),
                    'post_type' => 'page',
                ],
                'acadlix_thankyou_page_id' => [
                    'post_title' => __('Thankyou', 'acadlix'),
                    'post_status' => 'publish',
                    'post_author' => get_current_user_id(),
                    'post_type' => 'page',
                ],
            ];
        }

        public function createOption()
        {
            $this->init_options();

            foreach ($this->pages as $key => $page) {
                $this->createPage($key, $page);
            }

            // Set permalink is "Post name".
            if (!acadlix()->helper()->acadlix_get_option('permalink_structure')) {
                acadlix()->helper()->acadlix_update_option('permalink_structure', '/%postname%/');
            }
        }

        public function removeOptions()
        {
            acadlix()->helper()->acadlix_delete_all_options();
            acadlix()->helper()->acadlix_delete_addon_options();
        }

        private function createPage($option = '', $data = [])
        {
            if (acadlix()->helper()->acadlix_get_option($option)) {
                acadlix()->helper()->acadlix_update_option($option, acadlix()->helper()->acadlix_get_option($option));
            } else {
                // Insert the page into the database
                $page_id = wp_insert_post($data);
                // Optionally, you can store the page ID in an option or somewhere else for future reference
                acadlix()->helper()->acadlix_update_option($option, $page_id);
            }
        }



        public function update_option_rewrite_rules($wp_rules)
        {
            if (!is_array($wp_rules)) {
                return $wp_rules;
            }
            $course_permalink = acadlix()->helper()->acadlix_get_option('acadlix_course_base', 'courses');
            $rules = array();
            $rules = [
                "^$course_permalink/([^/]+)/?$" =>
                    'index.php?' . ACADLIX_COURSE_CPT . '=$matches[1]'
            ];
            try {
                if (is_array($rules)) {
                    $wp_rules = array_merge($rules, $wp_rules);
                }
            } catch (Throwable $e) {
                if (defined('WP_DEBUG') && WP_DEBUG) {
                    error_log(sprintf('%s:%s:%s', __FILE__, __LINE__, $e->getMessage())); // phpcs:ignore
                }
            }

            return $wp_rules;
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