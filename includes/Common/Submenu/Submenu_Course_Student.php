<?php

namespace Yuvayana\Acadlix\Common\Submenu;

defined('ABSPATH') || exit();

class Submenu_Course_Student
{
  private static $_instance = null;

  protected $_options = [];

  public function __construct()
  {
    $this->_options = [
      'parent_slug' => ACADLIX_SLUG,
      'page_title' => __('Course Students', 'acadlix'),
      'menu_title' => __('Course Students', 'acadlix'),
      'capability' => 'acadlix_show_course_student',
      'menu_slug' => 'acadlix_course_students',
      'callback' => [$this, 'course_student_callback'],
      'position' => 850
    ];
    add_action('admin_enqueue_scripts', [$this, 'admin_print_scripts']);
    add_action('admin_head', [$this, 'hide_submenu_item']);
  }

  public function get_position()
  {
    return $this->_options['position'];
  }

  public function add_submenu()
  {
    add_submenu_page(
      $this->_options['parent_slug'],
      $this->_options['page_title'],
      $this->_options['menu_title'],
      $this->_options['capability'],
      $this->_options['menu_slug'],
      $this->_options['callback'],
      $this->_options['position']
    );
  }

  public function hide_submenu_item()
  {
    echo '<style>#adminmenu a[href="admin.php?page=' . esc_attr($this->_options['menu_slug']) . '"]{display:none !important;}</style>';
  }

  public function localize_options()
  {
    $current_user = wp_get_current_user();
    $capabilities = $current_user->exists() ? $current_user->allcaps : [];
    return [
      'api_url' => esc_url_raw(rest_url('acadlix/v1')),
      'max_execution_time' => acadlix()->helper()->acadlix_max_execution_time(),
      'nonce' => wp_create_nonce('wp_rest'),
      'acadlix_quiz_url' => admin_url('admin.php?page=acadlix_quiz'),
      'acadlix_lesson_url' => admin_url('admin.php?page=acadlix_lesson'),
      'acadlix_course_url' => admin_url('edit.php?post_type=acadlix_course'),
      'default_img_url' => esc_url(ACADLIX_ASSETS_IMAGE_URL . "demo-course.jpg"),
      'date_time_format' => acadlix()->helper()->acadlix_get_date_time_format(),
      'timezone_string' => acadlix()->helper()->acadlix_get_time_zone_string(),
      'user_id' => get_current_user_id(),
      'capabilities' => $capabilities,
      'settings' => acadlix()->helper()->acadlix_get_all_options(),
      'theme_settings' => acadlix()->helper()->acadlix_get_option('acadlix_theme_settings'),
      'acadlix_docs_url' => ACADLIX_DOCUMENTATION_URL,
      'isPro' => acadlix()->pro,
      'isActive' => acadlix()->license()->isActive ?? false,
    ];
  }

  public function admin_print_scripts()
  {
    acadlix()->assets()->manager()->load_assets('admin_course_student', $this->localize_options());
  }

  public function course_student_callback()
  {
    $course_id = isset($_GET['course_id']) ? intval($_GET['course_id']) : 0; // phpcs:ignore
    echo '<div id="acadlix-admin-course-student" data-course-id="' . esc_attr($course_id) . '"><h2>' . esc_html__('Loading...', 'acadlix') . '</h2></div>';
  }

  public static function instance()
  {
    if (is_null(self::$_instance)) {
      self::$_instance = new self();
    }

    return self::$_instance;
  }
}