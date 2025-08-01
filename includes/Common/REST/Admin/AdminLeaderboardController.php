<?php

namespace Yuvayana\Acadlix\Common\REST\Admin;

use WP_REST_Server;

defined( 'ABSPATH' ) || exit();

class AdminLeaderboardController {

    protected $namespace = 'acadlix/v1';

    protected $base = 'admin-leaderboard';

    public function register_routes(){
        register_rest_route(
            $this->namespace, '/' . $this->base . '/quiz-load-more-leaderboard/(?P<quiz_id>[\d]+)',
            [
                [
                    'methods'             => WP_REST_Server::EDITABLE,
                    'callback'            => [$this, 'post_quiz_load_more_leaderboard' ],
                    'permission_callback' => fn() => current_user_can('acadlix_show_leaderboard') && $this->check_permission(),
                    'args' => array(
                        'quiz_id' => array(
                          'validate_callback' => function($param, $request, $key) {
                            return is_numeric( $param );
                          }
                        ),
                    ),
                ],
            ]
        );

        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/(?P<quiz_id>[\d]+)/reset-leaderboard',
            [
                [
                    'methods' => WP_REST_Server::EDITABLE,
                    'callback' => [$this, 'post_reset_leaderboard_by_quiz_id'],
                    'permission_callback' => fn() => current_user_can('acadlix_reset_leaderboard') && $this->check_permission(),
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
    }

    public function post_quiz_load_more_leaderboard($request){
        $res = [];
        $quiz_id = $request['quiz_id'];
        $params = $request->get_json_params();

        if (empty($quiz_id)) {
            return new WP_Error(
                'missing_quiz_id',
                __('Quiz id is required.', 'acadlix'),
                ['status' => 400]
            );
        }
        $toplist = acadlix()->model()->toplist();
        $res['toplist'] = $toplist->getTopList($quiz_id, $params['toplist_view_count'], 10);
        $res["toplist_count"] = $toplist->where("quiz_id", $quiz_id)->count();
        return rest_ensure_response( $res ); 
    }

    public function post_reset_leaderboard_by_quiz_id($request){
        $res = [];
        $quiz_id = $request['quiz_id'];
        if (empty($quiz_id)) {
            return new WP_Error(
                'missing_quiz_id',
                __('Quiz id is required.', 'acadlix'),
                ['status' => 400]
            );
        }
        $res['toplist'] = acadlix()->model()->toplist()->where("quiz_id", $quiz_id)->delete();
        return rest_ensure_response( $res );
    }

    public function check_permission(){
        return true;
    }
}