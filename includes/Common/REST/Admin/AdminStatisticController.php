<?php

namespace Yuvayana\Acadlix\Common\REST\Admin;

use WP_Error;
use WP_REST_Server;

defined('ABSPATH') || exit();

class AdminStatisticController
{

    protected $namespace = 'acadlix/v1';

    protected $base = 'admin-statistic';

    public function register_routes()
    {
        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/(?P<quiz_id>[\d]+)',
            [
                [
                    'methods' => WP_REST_Server::READABLE,
                    'callback' => [$this, 'get_statistic_by_quiz_id'],
                    'permission_callback' => function() {
                        return current_user_can('acadlix_show_statistic');
                    },
                    'args' => array(
                        'quiz_id' => array(
                            'validate_callback' => function ($param, $request, $key) {
                                return is_numeric($param);
                            }
                        ),
                    ),
                ],
            ]
        );

        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/(?P<quiz_id>[\d]+)/reset-statistic',
            [
                [
                    'methods' => WP_REST_Server::EDITABLE,
                    'callback' => [$this, 'post_reset_statistic_by_quiz_id'],
                    'permission_callback' => function() {
                        return current_user_can('acadlix_reset_statistic');
                    },
                    'args' => array(
                        'quiz_id' => array(
                            'validate_callback' => function ($param, $request, $key) {
                                return is_numeric($param);
                            }
                        ),
                    ),
                ],
            ]
        );

        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/(?P<statistic_ref_id>[\d]+)',
            [
                [
                    'methods' => WP_REST_Server::DELETABLE,
                    'callback' => [$this, 'delete_statistic_by_id'],
                    'permission_callback' => function() {
                        return current_user_can('acadlix_delete_statistic');
                    },
                    'args' => array(
                        'statistic_ref_id' => array(
                            'validate_callback' => function ($param, $request, $key) {
                                return is_numeric($param);
                            }
                        ),
                    ),
                ],
            ]
        );
    }

    public function get_statistic_by_quiz_id($request)
    {
        $res = [];
        $quiz_id = $request['quiz_id'];
        $params = $request->get_params();

        if (empty($quiz_id)) {
            return new WP_Error(
                'missing_quiz_id',
                __('Quiz id is required.', 'acadlix'),
                ['status' => 400]
            );
        }

        $skip = $params['page'] * $params['pageSize'];
        $search = $params['search'] ?? "";

        $stat_ref = acadlix()->model()->statisticRef()->where('quiz_id', $quiz_id)->orderBy("id", "desc");
        $res['quiz'] = acadlix()->model()->quiz()->ofQuiz()->find($quiz_id);
        $res['pass_count'] = (clone $stat_ref)->where('status', 'Pass')->count();
        $res['fail_count'] = (clone $stat_ref)->where('status', 'Fail')->count();

        if (!empty($search)) {
            $stat_ref->whereHas('user', function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('display_name', 'LIKE', "%{$search}%")
                      ->orWhere('user_email', 'LIKE', "%{$search}%")
                      ->orWhere('user_login', 'LIKE', "%{$search}%");
                });
            });
        }
        $res['total'] = $stat_ref->count();
        $res['stat_refs'] = $stat_ref->skip($skip)->take($params['pageSize'])->get()->toArray();
        return rest_ensure_response($res);
    }

    public function post_reset_statistic_by_quiz_id($request)
    {
        $res = [];
        $quiz_id = $request['quiz_id'];
        if (empty($quiz_id)) {
            return new WP_Error(
                'missing_quiz_id',
                __('Quiz id is required.', 'acadlix'),
                ['status' => 400]
            );
        }
        acadlix()->model()->statisticRef()->where('quiz_id', $quiz_id)->delete();
        return rest_ensure_response($res);
    }

    public function delete_statistic_by_id($request)
    {
        $res = [];
        $id = $request['statistic_ref_id'];

        if (empty($id)) {
            return new WP_Error(
                'missing_statistic_ref_id',
                __('Statistic ref id is required.', 'acadlix'),
                ['status' => 400]
            );
        }

        $stat_ref = acadlix()->model()->statisticRef()->find($id);
        if ($stat_ref) {
            $stat_ref->delete();
        }
        return rest_ensure_response($res);
    }
}