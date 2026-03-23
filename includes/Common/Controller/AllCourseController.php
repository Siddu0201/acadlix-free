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

    protected function is_course_archive()
    {
      return is_post_type_archive(ACADLIX_COURSE_CPT);
    }

    protected function is_course_category()
    {
      return is_tax(ACADLIX_COURSE_CATEGORY_TAXONOMY);
    }

    protected function is_course_tag()
    {
      return is_tax(ACADLIX_COURSE_TAG_TAXONOMY);
    }

    public function template_loader($template)
    {
      if ($this->is_course_archive()) {
        // !defined('DONOTCACHEPAGE') && define('DONOTCACHEPAGE', true); // phpcs:ignore
        add_filter('acadlix_course_page_context', function () {
          return ACADLIX_COURSE_CPT;
        });

        $all_course_template = ACADLIX_INCLUDES_PATH . 'Common/Wrappers/AllCourseWrapper.php';
        if ($all_course_template) {
          return $all_course_template;
        }
      }

      if ($this->is_course_category()) {
        add_filter('acadlix_course_page_context', function () {
          return ACADLIX_COURSE_CATEGORY_TAXONOMY;
        });

        $all_course_template = ACADLIX_INCLUDES_PATH . 'Common/Wrappers/AllCourseWrapper.php';
        if ($all_course_template) {
          return $all_course_template;
        }
      }

      if ($this->is_course_tag()) {
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
        $this->is_course_archive() ||
        $this->is_course_category() ||
        $this->is_course_tag()
      ) {
        wp_enqueue_style('acadlix-front-all-course-css');
        wp_enqueue_style('acadlix-front-font-awesome-css');

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