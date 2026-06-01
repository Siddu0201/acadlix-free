<?php

namespace Yuvayana\Acadlix\Common\REST\Admin;

use WP_REST_Server;
defined('ABSPATH') || exit();
class AdminStudentController
{
  protected $namespace = 'acadlix/v1';
  protected $base = 'admin-student';

  public function register_routes()
  {
    register_rest_route(
      $this->namespace,
      '/' . $this->base,
      [
        [
          'methods' => WP_REST_Server::READABLE,
          'callback' => [$this, 'get_students'],
          'permission_callback' => function () {
            return current_user_can('acadlix_show_student');
          },
        ],
      ]
    );

    register_rest_route(
      $this->namespace,
      '/' . $this->base . '/get-student-quiz-result',
      [
        [
          'methods' => WP_REST_Server::READABLE,
          'callback' => [$this, 'get_student_quiz_result'],
          'permission_callback' => function () {
            return current_user_can('acadlix_show_student');
          },
        ],
      ]
    );
  }

  public function get_students($request)
  {
    $res = [];
    $params = $request->get_params();
    $search = $params['search'];
    $skip = $params['page'] * $params['pageSize'];
    // $student = acadlix()->model()->wpUsers()
    //   ->whereHas('orders', function ($q) {
    //     $q->ofSuccess(); // optional status filter
    //   })
    //   ->orderBy('ID', 'desc'); // or 'asc'
    // if (!empty($search)) {
    //   $student->where(function ($query) use ($search) {
    //     $query->where('display_name', 'like', "%{$search}%")
    //       ->orWhere('user_email', 'like', "%{$search}%");
    //   });
    // }
    // $res['total'] = $student->count();
    // $res['students'] = $student->skip($skip)->take($params['pageSize'])->get();
    $query = acadlix()
      ->model()
      ->wpUsers()
      ->newQuery()
      ->enrolled()
      ->withCoursePurchasedCount()
      ->search($search);

    $res['total'] = (clone $query)->count();
    $res['students'] = $query->orderBy('ID', 'desc')->skip($skip)->take($params['pageSize'])->get();
    return rest_ensure_response($res);
  }

  public function get_student_quiz_result($request)
  {
    $res = [];
    $user_id = $request->get_param('student_id');
    $quiz_id = $request->get_param('quiz_id');
    $course_section_content_id = $request->get_param('course_section_content_id');

    if (empty($user_id) || empty($quiz_id)) {
      return new WP_Error(
        'quiz_not_found',
        __('Quiz not found.', 'acadlix'),
        ['status' => 400]
      );
    }

    $statistics_ids = acadlix()
      ->model()
      ->courseStatistic()
      ->with([
        'user_activity_meta' => function ($query) {
          $query
            ->where('meta_key', 'statistic_ref_id')
            ->select('meta_value', 'type_id');
        },
      ])
      ->where('user_id', $user_id)
      ->where('course_section_content_id', $course_section_content_id)
      ->get()
      ->pluck('user_activity_meta')
      ->flatten()
      ->pluck('meta_value')
      ->filter()  // optional: removes null or empty values
      ->values();
    $res['statistics_ids'] = $statistics_ids;

    $statistics = acadlix()
      ->model()
      ->statisticRef()
      ->with([
        'statistics' => function ($query) {
          $query->with([
            'question',
          ]);
        },
      ])
      ->where('user_id', $user_id)
      ->where('quiz_id', $quiz_id)
      ->orderBy('created_at', 'desc')
      ->whereIn('id', $statistics_ids)
      ->get();
    $res['statistics'] = $statistics;
    return rest_ensure_response($res);
  }
}
