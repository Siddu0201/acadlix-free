<?php 

namespace Yuvayana\Acadlix\Admin;

if(!class_exists("Option")){
    class Option
    {
        protected $_page = [];

        public function __construct()
        {
            $this->_page = array(
                'acadlix_dashboard_page' => [
                    'post_title'    => 'Acadlix Dashboard Page',
                    'post_content'  => '[Acadlix_Dashboard]',
                    'post_status'   => 'publish',
                    'post_author'   => get_current_user_id(), // Change this to the desired author ID
                    'post_type'     => 'page',
                ],
                'acadlix_advance_quiz_page' => [
                    'post_title'    => 'Acadlix Advance Quiz Page',
                    'post_content'  => '[Acadlix_Advance_Quiz]',
                    'post_status'   => 'publish',
                    'post_author'   => get_current_user_id(), // Change this to the desired author ID
                    'post_type'     => 'page',
                ],
            );
        }

        public static function createOption()
        {
            foreach ((new Option())->_page as $key => $page) {
                if(!get_option( $key )){
                    self::createPage($key, $page);
                }
            }
        }

        public static function createPage($option = '', $data = [])
        {
            $args = array(
                'post_type' => 'page',
                'post_status' => 'publish',
                'posts_per_page' => 1,
                'post_title' => $data['post_title']
            );
            $query = new WP_Query( $args );

            // If the page doesn't exist, create it
            if ( empty($query->post) ) {
                // Insert the page into the database
                $page_id = wp_insert_post( $data );
                $page_permalink = get_permalink($page_id);
                // Optionally, you can store the page ID in an option or somewhere else for future reference
                update_option( $option, $page_permalink );
            }else{
                
            }
        }
    }
}