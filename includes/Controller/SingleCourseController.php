<?php

namespace Yuvayana\Acadlix\Controller;

defined( 'ABSPATH' ) || exit();

if (!class_exists("SingleCourseController")) {
    class SingleCourseController
    {
        protected static $_instance = null;

        public function __construct()
        {
            add_filter("template_include", [$this, 'template_loader'], 10);
        }

        public function template_loader($template)
        {
            if(is_singular( ACADLIX_COURSE_CPT )){
                $single_course_template = ACADLIX_VIEW_PATH.'/AllCourseView.php';
                if($single_course_template){
                    return $single_course_template;
                }
            }
            return $template;
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