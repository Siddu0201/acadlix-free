<?php

namespace Yuvayana\Acadlix\Common\REST\Front;

use WP_REST_Server;

defined('ABSPATH') || exit();

class FrontStatisticController
{
  protected $namespace = 'acadlix/v1';
  protected $base = 'front-statistic';

  public function register_routes()
  {
    register_rest_route(
      $this->namespace,
      '/' . $this->base,
      array(
        array(
          'methods' => WP_REST_Server::READABLE,
          'callback' => array($this, 'get_statistic_by_user_id'),
          'permission_callback' => array($this, 'check_permission'),
          'args' => array(
            'user_id' => array(
              'validate_callback' => function ($param, $request, $key) {
                return is_numeric($param);
              }
            ),
          ),
        )
      )
    );

    register_rest_route(
      $this->namespace,
      '/' . $this->base . '/(?P<statistic_id>[\d]+)/statistic',
      array(
        array(
          'methods' => WP_REST_Server::READABLE,
          'callback' => array($this, 'get_statistic_by_statistic_id'),
          'permission_callback' => array($this, 'check_permission'),
          'args' => array(
            'statistic_id' => array(
              'validate_callback' => function ($param, $request, $key) {
                return is_numeric($param);
              }
            ),
          ),
        )
      )
    );
  }

  public function get_statistic_by_user_id($request)
  {
    $res = [];
    $params = $request->get_params();

    $user_id = $request->get_param('user_id');
    $search = $request->get_param('search') ?? '';
    $category_ids = $request->get_param('category_ids') ?? [];
    // Validate required fields
    if (empty($user_id)) {
      return new WP_Error(
        'missing_id',
        __('User id is required.', 'acadlix'),
        ['status' => 400]
      );
    }
    $skip = $params['page'] * $params['pageSize'];
    $res['categories'] = acadlix()->model()->category()->all();
    $stat_ref = acadlix()->model()->statisticRef()
      ->with('quiz')
      ->where('user_id', $user_id)
      ->when(!empty($category_ids), function ($query) use ($category_ids) {
        $query->whereHas('quiz.quiz_categories', function ($q) use ($category_ids) {
          $q->whereIn('term_id', $category_ids);
        });
      })
      ->when(!empty($search), function ($query) use ($search) {
        $query->whereHas('quiz', function ($q) use ($search) {
          $q->where('post_title', 'like', '%' . $search . '%');
        });
      })
      ->orderBy("id", "desc");
    $res['total'] = $stat_ref->count();
    $res['stat_refs'] = $stat_ref->skip($skip)->take($params['pageSize'])->get();
    return rest_ensure_response($res);
  }

  public function get_statistic_by_statistic_id($request)
  {
    $res = [];
    $statistic_id = $request['statistic_id'];

    $user_id = $request->get_param('user_id');
    // Validate required fields
    if (empty($user_id)) {
      return new WP_Error(
        'missing_id',
        __('User id is required.', 'acadlix'),
        ['status' => 400]
      );
    }

    // Validate required fields
    if (empty($statistic_id)) {
      return new WP_Error(
        'missing_id',
        __('Statistic id is required.', 'acadlix'),
        ['status' => 400]
      );
    }

    $stat_ref = acadlix()->model()->statisticRef()->find($statistic_id);
    $res['quiz'] = acadlix()->model()->quiz()->ofQuiz()->find($stat_ref->quiz_id)->setAppends([
      'rendered_post_content',
      'rendered_metas',
      'category',
      'languages',
      'rendered_questions',
    ]);
    $res['statistic_ref'] = $stat_ref;
    $res['statistic'] = $stat_ref ? $stat_ref->statistics()->with("question")->get() : [];

    return rest_ensure_response($res);
  }

  public function check_permission($request)
  {
    if (!is_user_logged_in()) {
      return new WP_Error('not_logged_in', 'Login required', ['status' => 401]);
    }

    $user_id = absint($request->get_param('user_id') ?? 0);

    if ($user_id && get_current_user_id() !== $user_id) {
      return new WP_Error('forbidden', 'Access denied', ['status' => 403]);
    }

    return true;
  }
}