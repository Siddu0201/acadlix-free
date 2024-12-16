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
            add_action('wp_enqueue_scripts', [$this, 'enqueue_front_all_course']);

            add_filter("template_include", [$this, 'template_loader'], 10);
        }

        public function template_loader($template)
        {
            $all_courses_page_id = Helper::instance()->acadlix_get_option('acadlix_all_courses_page_id');
            if ($all_courses_page_id && is_page($all_courses_page_id)) {
                $all_course_template = ACADLIX_VIEW_PATH . '/AllCourseView.php';
                if ($all_course_template) {
                    return $all_course_template;
                }
            }
            return $template;
        }

        public function enqueue_front_all_course()
        {
            $all_courses_page_id = Helper::instance()->acadlix_get_option('acadlix_all_courses_page_id');
            if ($all_courses_page_id && is_page($all_courses_page_id)) {
                wp_dequeue_style( 'acadlix-front-css' );
                wp_dequeue_script( 'acadlix-front-js' );
                wp_enqueue_style('acadlix-front-all-course-css');
                wp_enqueue_style('acadlix-front-font-awesome-css');
                wp_enqueue_style('acadlix-front-line-awesome-css');

                wp_enqueue_script('acadlix-front-action-button-course-js');
                wp_localize_script('acadlix-front-action-button-course-js', 'acadlixOptions', array(
                    'is_admin_bar_showing' => is_admin_bar_showing(),
                    'api_url' => esc_url_raw(rest_url('acadlix/v1')),
                    'nonce' => wp_create_nonce('wp_rest'),
                    'home_url' => esc_url(home_url( )),
                    'ajax_url' => esc_url(admin_url( 'admin-ajax.php' )),
                    'checkout_url' => esc_url(get_permalink(Helper::instance()->acadlix_get_option('acadlix_checkout_page_id'))),
                    'cart_url' => esc_url(get_permalink(Helper::instance()->acadlix_get_option('acadlix_cart_page_id'))),
                    'user_id' => get_current_user_id() ?? 0 ,
                ));
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