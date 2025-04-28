<?php

namespace Yuvayana\Acadlix\Controller;

use Yuvayana\Acadlix\Helper\Helper;
use Yuvayana\Acadlix\Models\Course;

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
                $single_course_template = ACADLIX_VIEW_PATH . '/SingleCourseView.php';
                if ($single_course_template) {
                    return $single_course_template;
                }
            }
            return $template;
        }

        public function enqueue_front_single_course()
        {
            global $post;
            $course = Course::ofCourse()->find($post->ID);
            if (is_singular(ACADLIX_COURSE_CPT)) {
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