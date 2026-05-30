<?php

namespace Yuvayana\Acadlix\Common\REST\Admin;

use WP_REST_Server;

defined('ABSPATH') || exit();

class AdminHomeController
{
  protected $namespace = 'acadlix/v1';
  protected $base = 'admin-home';

  public function register_routes()
  {
    register_rest_route(
      $this->namespace,
      '/' . $this->base,
      [
        [
          'methods' => WP_REST_Server::READABLE,
          'callback' => [$this, 'get_home_data'],
          'permission_callback' => function () {
            return current_user_can('manage_options');
          },
        ],
      ]
    );

    register_rest_route(
      $this->namespace,
      '/' . $this->base . '/quick-performance',
      [
        [
          'methods' => WP_REST_Server::READABLE,
          'callback' => [$this, 'get_quick_performance_data'],
          'permission_callback' => function () {
            return current_user_can('acadlix_show_quick_performance');
          },
        ],
      ]
    );

    register_rest_route(
      $this->namespace,
      '/' . $this->base . '/top-courses-by-enrollment',
      [
        [
          'methods' => WP_REST_Server::READABLE,
          'callback' => [$this, 'get_top_course_by_enrollment'],
          'permission_callback' => function () {
            return current_user_can('acadlix_show_top_courses_by_enrollment');
          },
        ],
      ]
    );

    register_rest_route(
      $this->namespace,
      '/' . $this->base . '/top-courses-by-sales',
      [
        [
          'methods' => WP_REST_Server::READABLE,
          'callback' => [$this, 'get_top_course_by_sales'],
          'permission_callback' => function () {
            return current_user_can('acadlix_show_top_courses_by_sales');
          },
        ],
      ]
    );
  }

  public function get_home_data($request)
  {
    $res = [];
    $res['quizes'] = acadlix()->model()->quiz()->ofQuiz()->count();
    $res['courses'] = acadlix()->model()->course()->ofCourse()->count();
    $res['lessons'] = acadlix()->model()->lesson()->ofLesson()->count();
    $res['questions'] = acadlix()->model()->question()->ofOnline()->count();
    $res['today_sale'] = acadlix()->model()->order()->getTodaySalesTotal();
    $res['total_sale'] = acadlix()->model()->order()->getTotalSales();
    return rest_ensure_response($res);
  }

  public function get_quick_performance_data($request)
  {
    $res = [];
    $res['quizes'] = acadlix()->model()->quiz()->ofQuiz()->count();
    $res['courses'] = acadlix()->model()->course()->ofCourse()->count();
    $res['lessons'] = acadlix()->model()->lesson()->ofLesson()->count();
    $res['questions'] = acadlix()->model()->question()->ofOnline()->count();
    $res['today_sale'] = acadlix()->model()->order()->getTodaySalesTotal();
    $res['total_sale'] = acadlix()->model()->order()->getTotalSales();
    return rest_ensure_response($res);
  }

  public function get_top_course_by_enrollment($request)
  {
    $res = [];
    $res['top_courses'] = acadlix()->model()->course()->getTopCoursesByEnrollment(3);
    return rest_ensure_response($res);
  }

  public function get_top_course_by_sales($request)
  {
    $res = [];
    $res['top_courses'] = acadlix()->model()->course()->getTopCoursesBySales(3);
    return rest_ensure_response($res);
  }
}
