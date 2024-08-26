<?php

namespace Yuvayana\Acadlix\REST\Admin;

use WP_REST_Server;
use Yuvayana\Acadlix\Models\Toplist;

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
                    'callback'            => [ $this, 'post_quiz_load_more_leaderboard' ],
                    'permission_callback' => [ $this, 'check_permission' ],
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
    }

    public function post_quiz_load_more_leaderboard($request){
        $res = [];
        $quiz_id = $request['quiz_id'];
        $params = $request->get_json_params();
        $toplist = Toplist::where('quiz_id', $quiz_id)->orderBy("result", "desc")->orderBy("quiz_time", "asc")->orderBy('created_at', 'asc');
        $res["toplist_count"] = $toplist->count();
        $res["toplist"] = $toplist->skip($params["toplist_view_count"])->take(10)->get();
        return rest_ensure_response( $res ); 
    }

    public function check_permission(){
        return true;
    }
}