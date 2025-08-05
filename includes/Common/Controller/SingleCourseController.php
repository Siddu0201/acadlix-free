<?php

namespace Yuvayana\Acadlix\Common\Controller;

defined('ABSPATH') || exit();

if (!class_exists("SingleCourseController")) {
    class SingleCourseController
    {
        protected static $_instance = null;

        public function __construct()
        {
            if(is_admin(  ))return;
            add_action('wp_enqueue_scripts', [$this, 'enqueue_front_single_course']);
            add_filter("template_include", [$this, 'template_loader'], 99);
        }

        public function template_loader($template)
        {
            if (is_singular(ACADLIX_COURSE_CPT)) {
                !defined('DONOTCACHEPAGE') && define('DONOTCACHEPAGE', true);
                $single_course_template = ACADLIX_INCLUDES_PATH .'Common/View/SingleCourseView.php';
                if ($single_course_template) {
                    return $single_course_template;
                }
            }
            return $template;
        }

        public function enqueue_front_single_course()
        {
            global $post;
            if (is_singular(ACADLIX_COURSE_CPT)) {
                $course = acadlix()->model()->course()->ofCourse()->with('sections')->find($post->ID);
                // wp_dequeue_style('acadlix-front-css');
                // wp_dequeue_script('acadlix-front-js');
                wp_enqueue_style('acadlix-front-single-course-css');
                wp_enqueue_style('acadlix-front-font-awesome-css');
                wp_enqueue_style('acadlix-front-line-awesome-css');

                wp_enqueue_script('acadlix-front-single-course-js');
                wp_localize_script( 'acadlix-front-single-course-js', 'acadlixSingleCourse', array(
                    'course' => wp_json_encode($course)
                ) );
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