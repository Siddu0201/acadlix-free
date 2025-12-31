<?php

namespace Yuvayana\Acadlix\Common\Controller;

defined('ABSPATH') || exit();

if (!class_exists("AllCourseController")) {
    class AllCourseController
    {
        protected static $_instance = null;

        public function __construct()
        {
            if (is_admin())
                return;
            add_action('wp_enqueue_scripts', [$this, 'enqueue_front_all_course']);

            add_filter("template_include", [$this, 'template_loader'], 10);
        }

        public function template_loader($template)
        {
            if (is_post_type_archive(ACADLIX_COURSE_CPT)) {
                !defined('DONOTCACHEPAGE') && define('DONOTCACHEPAGE', true); // phpcs:ignore
                add_filter('acadlix_course_page_context', function () {
                    return ACADLIX_COURSE_CPT;
                });

                $all_course_template = ACADLIX_INCLUDES_PATH . 'Common/Wrappers/AllCourseWrapper.php';
                if ($all_course_template) {
                    return $all_course_template;
                }
            }

            if (is_tax(ACADLIX_COURSE_CATEGORY_TAXONOMY)) {
                add_filter('acadlix_course_page_context', function () {
                    return ACADLIX_COURSE_CATEGORY_TAXONOMY;
                });

                $all_course_template = ACADLIX_INCLUDES_PATH . 'Common/Wrappers/AllCourseWrapper.php';
                if ($all_course_template) {
                    return $all_course_template;
                }
            }

            if (is_tax(ACADLIX_COURSE_TAG_TAXONOMY)) {
                add_filter('acadlix_course_page_context', function () {
                    return ACADLIX_COURSE_TAG_TAXONOMY;
                });

                $all_course_template = ACADLIX_INCLUDES_PATH . 'Common/Wrappers/AllCourseWrapper.php';
                if ($all_course_template) {
                    return $all_course_template;
                }
            }
            return $template;
        }

        public function enqueue_front_all_course()
        {
            if (
                is_post_type_archive(ACADLIX_COURSE_CPT) ||
                is_tax(ACADLIX_COURSE_CATEGORY_TAXONOMY) ||
                is_tax(ACADLIX_COURSE_TAG_TAXONOMY)
            ) {
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