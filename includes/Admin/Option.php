<?php

namespace Yuvayana\Acadlix\Admin;
use Yuvayana\Acadlix\Helper\Helper;

defined( 'ABSPATH' ) || exit();

if (!class_exists("Option")) {
    class Option
    {
        private static $_instance = null;
        protected $pages = [];

        public function __construct()
        {
            $this->pages = [
                'acadlix_dashboard_page_id' => [
                    'post_title' => __('Student Dashboard', 'acadlix'),
                    'post_status' => 'publish',
                    'post_author' => get_current_user_id(), // Change this to the desired author ID
                    'post_type' => 'page',
                ],
                'acadlix_all_courses_page_id' => [
                    'post_title' => __('All Courses', 'acadlix'),
                    'post_status' => 'publish',
                    'post_author' => get_current_user_id(), // Change this to the desired author ID
                    'post_type' => 'page',
                ],
                'acadlix_cart_page_id' => [
                    'post_title' => __('Cart', 'acadlix'),
                    'post_status' => 'publish',
                    'post_author' => get_current_user_id(), // Change this to the desired author ID
                    'post_type' => 'page',
                ],
                'acadlix_checkout_page_id' => [
                    'post_title' => __('Checkout', 'acadlix'),
                    'post_status' => 'publish',
                    'post_author' => get_current_user_id(), // Change this to the desired author ID
                    'post_type' => 'page',
                ],
                'acadlix_thankyou_page_id' => [
                    'post_title' => __('Thankyou', 'acadlix'),
                    'post_status' => 'publish',
                    'post_author' => get_current_user_id(), // Change this to the desired author ID
                    'post_type' => 'page',
                ],
                'acadlix_advance_quiz_page_id' => [
                    'post_title' => __('Advance Quiz', 'acadlix'),
                    'post_status' => 'publish',
                    'post_author' => get_current_user_id(), // Change this to the desired author ID
                    'post_type' => 'page',
                ],
            ];

            // add_filter( 'option_rewrite_rules', [ $this, 'update_option_rewrite_rules' ], 1 );
        }

        public static function createOption()
        {
            foreach ((new self())->pages as $key => $page) {
                self::instance()->createPage($key, $page);
            }

            // Set permalink is "Post name".
			if ( ! get_option( 'permalink_structure' ) ) {
				update_option( 'permalink_structure', '/%postname%/' );
			}
        }

        private function createPage($option = '', $data = [])
        {
            if (get_option( $option )) {
                update_option($option, get_option( $option ));
            }else{
                // Insert the page into the database
                $page_id = wp_insert_post($data);
                // Optionally, you can store the page ID in an option or somewhere else for future reference
                update_option($option, $page_id);
            }
        }

        public function update_option_rewrite_rules($wp_rules){
            if ( ! is_array( $wp_rules ) ) {
                return $wp_rules;
            }
            $course_permalink = Helper::instance()->acadlix_get_option('acadlix_course_base', 'courses');
            $rules = array();
            $rules = ["^$course_permalink/([^/]+)/?$" =>
						'index.php?' . ACADLIX_COURSE_CPT . '=$matches[1]'];
            try {
                if(is_array($rules)){
                    $wp_rules = array_merge( $rules, $wp_rules );
                }
            } catch ( Throwable $e ) {
                if (defined('WP_DEBUG') && WP_DEBUG) {
                    error_log( sprintf( '%s:%s:%s', __FILE__, __LINE__, $e->getMessage() ) ); // phpcs:ignore
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