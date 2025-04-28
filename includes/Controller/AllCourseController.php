<?php

namespace Yuvayana\Acadlix\Controller;
use Yuvayana\Acadlix\Helper\Helper;

defined('ABSPATH') || exit();

if (!class_exists("AllCourseController")) {
    class AllCourseController
    {
        protected static $_instance = null;

        public function __construct()
        {
            if(is_admin(  ))return;
            add_action('wp_enqueue_scripts', [$this, 'enqueue_front_all_course']);

            add_filter("template_include", [$this, 'template_loader'], 10);
        }

        public function template_loader($template)
        {
            if ( is_post_type_archive( ACADLIX_COURSE_CPT ) ){
                $all_course_template = ACADLIX_VIEW_PATH . '/AllCourseView.php';
                if ($all_course_template) {
                    return $all_course_template;
                }
            }
            return $template;
        }

        public function enqueue_front_all_course()
        {
            if ( is_post_type_archive( ACADLIX_COURSE_CPT ) ){
                wp_dequeue_style( 'acadlix-front-css' );
                wp_dequeue_script( 'acadlix-front-js' );
                wp_enqueue_style('acadlix-front-all-course-css');
                wp_enqueue_style('acadlix-front-font-awesome-css');
                wp_enqueue_style('acadlix-front-line-awesome-css');

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