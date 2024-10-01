<?php

namespace Yuvayana\Acadlix\Admin;

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
                'acadlix_all_courses_page_id' => [
                    'post_title' => 'Acadlix All Courses',
                    'post_content' => '[Acadlix_All_Courses]',
                    'post_status' => 'publish',
                    'post_author' => get_current_user_id(), // Change this to the desired author ID
                    'post_type' => 'page',
                ],
            ];

            add_filter( 'option_rewrite_rules', [ $this, 'update_option_rewrite_rules' ], 1 );
        }

        public static function createOption()
        {
            foreach ((new self())->pages as $key => $page) {
                if (!get_option($key)) {
                    self::instance()->createPage($key, $page);
                }
            }

            flush_rewrite_rules();
            // Set permalink is "Post name".
			if ( ! get_option( 'permalink_structure' ) ) {
				update_option( 'permalink_structure', '/%postname%/' );
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
            }else{
                $page_id = $existing_page[0]?->ID;
                update_option($option, $page_id);
            }

        }

        public function update_option_rewrite_rules($wp_rules){
            if ( ! is_array( $wp_rules ) ) {
                return $wp_rules;
            }
            $rule = ["^courses/([^/]+)/?$" =>
						'index.php?' . ACADLIX_COURSE_CPT . '=$matches[1]'];
            try {
                if(is_array($rule)){
                    $wp_rules = array_merge( $rule, $wp_rules );
                }
            } catch ( Throwable $e ) {
                error_log( sprintf( '%s:%s:%s', __FILE__, __LINE__, $e->getMessage() ) );
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