<?php

namespace Yuvayana\Acadlix\Controller;

defined('ABSPATH') || exit();

if (!class_exists("SingleCourseController")) {
    class SingleCourseController
    {
        protected static $_instance = null;

        public function __construct()
        {
            add_action('wp_enqueue_scripts', [$this, 'enqueue_front_single_course']);
            add_filter("template_include", [$this, 'template_loader'], 10);
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
            if (is_singular(ACADLIX_COURSE_CPT)) {
                wp_dequeue_style('acadlix-front-css');
                wp_dequeue_script('acadlix-front-js');
                wp_enqueue_style('acadlix-front-single-course-css');
                wp_enqueue_style('acadlix-front-font-awesome-css');
                wp_enqueue_style('acadlix-front-line-awesome-css');

                $custom_css = "
                    :root {
                        --acadlix-primary-main: hsl(210, 100%, 45%); 
                        --acadlix-primary-dark: hsl(210, 100%, 38%);
                        --acadlix-text-primary: hsl(215, 15%, 12%);
                        --acadlix-text-tertiary: hsl(218, 10%, 55%);
                        --acadlix-grey: hsl(215, 15%, 97%);
                        --acadlix-border-color: hsl(2515, 15%, 82%);
                    }
                ";

                wp_add_inline_style( 'acadlix-front-single-course-css', $custom_css );

                // wp_enqueue_script('acadlix-front-single-course-js');
                // wp_localize_script('acadlix-front-single-course-js', 'acadlixOptions', array(
                //     'is_admin_bar_showing' => is_admin_bar_showing(),
                //     'api_url' => esc_url_raw(rest_url('acadlix/v1')),
                //     'nonce' => wp_create_nonce('wp_rest'),
                //     'home_url' => esc_url(home_url( )),
                //     'ajax_url' => esc_url(admin_url( 'admin-ajax.php' )),
                //     'checkout_url' => esc_url(get_permalink(Helper::instance()->acadlix_get_option('acadlix_checkout_page_id'))),
                //     'cart_url' => esc_url(get_permalink(Helper::instance()->acadlix_get_option('acadlix_cart_page_id'))),
                //     'user_id' => get_current_user_id() ?? 0 ,
                // ));
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