<?php

namespace Yuvayana\Acadlix\REST\Front;

use Illuminate\Contracts\Database\Query\Builder;
use WP_REST_Server;
use Yuvayana\Acadlix\Models\Quiz;

class FrontQuizController{
    protected $namespace = 'acadlix/v1';

    protected $base = 'front-quiz';

    public function register_routes() {

        register_rest_route(
            $this->namespace, '/' . $this->base . '/(?P<quiz_id>[\d]+)',
            [
                [
                    'methods'             => WP_REST_Server::READABLE,
                    'callback'            => [ $this, 'get_front_quiz_by_id' ],
                    'permission_callback' => [ $this, 'check_permission' ],
                    'args' => array(
                        'quiz_id' => array(
                          'validate_callback' => function($param, $request, $key) {
                            return is_numeric( $param );
                          }
                        ),
                    ),
                ],
                [
                    'methods'             => WP_REST_Server::EDITABLE,
                    'callback'            => [ $this, 'update_front_quiz_by_id' ],
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
    
    public function get_front_quiz_by_id($request){
        $res = [];
        $quiz_id = $request['quiz_id'];
        $res['quiz'] = Quiz::with(['questions' => function(Builder $query) {
            $query->where('online', 1);
        }])->find($quiz_id);
        return rest_ensure_response( $res );
    }

    public function check_permission(){
        return true;
    }
}