<?php

namespace Yuvayana\Acadlix\REST\Admin;

use WP_REST_Server;
use WP_REST_Response;
use WP_REST_Request;
use Yuvayana\Acadlix\Models\Quiz;
use Yuvayana\Acadlix\Models\Category;
use Yuvayana\Acadlix\Models\Language;
use Illuminate\Contracts\Database\Query\Builder;

class AdminQuizController {

    protected $namespace = 'acadlix/v1';

    protected $base = 'admin-quiz';

    public function register_routes() {
        register_rest_route(
            $this->namespace, '/' . $this->base,
            [
                [
                    'methods'             => WP_REST_Server::READABLE,
                    'callback'            => [ $this, 'get_quizes' ],
                    'permission_callback' => [ $this, 'check_permission' ],
                ],
                [
                    'methods'             => WP_REST_Server::CREATABLE,
                    'callback'            => [ $this, 'post_create_quiz' ],
                    'permission_callback' => [ $this, 'check_permission' ],
                ],
            ]
        );

        register_rest_route( 
            $this->namespace, '/' . $this->base . '/create', 
            [
                [
                    'methods'             => WP_REST_Server::READABLE,
                    'callback'            => [ $this, 'get_create_quiz' ],
                    'permission_callback' => [ $this, 'check_permission' ],
                ],
            ]
        );

        register_rest_route(
            $this->namespace, '/' . $this->base . '/(?P<quiz_id>[\d]+)',
            [
                [
                    'methods'             => WP_REST_Server::READABLE,
                    'callback'            => [ $this, 'get_quiz_by_id' ],
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
                    'callback'            => [ $this, 'update_quiz_by_id' ],
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
                    'methods'             => WP_REST_Server::DELETABLE,
                    'callback'            => [ $this, 'delete_quiz' ],
                    'permission_callback' => function (WP_REST_REQUEST $request){
                        if(wp_verify_nonce( $request->get_header('X-WP-Nonce'), 'wp_rest' )){
                            return true;
                        }
                        return false;
                    },
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
    /**
     * @api /admin-quiz
     * @method GET get_quizes()
     * @param [type] $request
     * @return all the quizes in backend with offset
     */
    public function get_quizes($request) {
        $res = [];
        $params = $request->get_params();
        $skip = $params['page'] * $params['pageSize'];
        $quiz = Quiz::withCount(['questions' => function (Builder $query) {
            $query->where('online', 1);
        }]);
        $res['total'] = $quiz->count();
        $res['quizes'] = $quiz->skip($skip)->take($params['pageSize'])->get();
        return rest_ensure_response($res);
    }

    public function get_create_quiz($request){
        $res = [];
        $res['categories'] = Category::get();
        $res['languages'] = Language::get();
        $res['quizes'] = Quiz::get();
        return rest_ensure_response( $res );
    }

    public function post_create_quiz($request) {
        $res = [];
        $params = $request->get_json_params();
        $quiz = Quiz::create($params);
        $quiz->quiz_languages()->createMany($params['language_data']);
        $quiz->prerequisites()->createMany($params['prerequisite_data']);
        $res['quiz'] = $quiz;
        return rest_ensure_response($res);
    }

    public function get_quiz_by_id($request) {
        $res = [];
        $id = $request['quiz_id'];
        $res['quiz'] = Quiz::withCount(['questions' => function (Builder $query) {
            $query->where('online', 1);
        }])->with(['prerequisites'])->find($id);
        $res['categories'] = Category::get();
        $res['languages'] = Language::get();
        $res['quizes'] = Quiz::whereNot('id', $id)->get();
        return rest_ensure_response($res);
    }
    
    public function update_quiz_by_id($request) {
        $res = [];
        $quiz_id = $request['quiz_id'];
        $params = $request->get_json_params();
        $quiz = Quiz::find($quiz_id);
        $quiz->update($params);
        foreach($params['language_data'] as $lang){
            $quiz->quiz_languages()->updateOrCreate(
                ['language_id' => $lang['language_id']],
                $lang
                );
        }
        $rowToDelete = $quiz->quiz_languages()->whereNotIn('language_id', array_column($params['language_data'], 'language_id'))->pluck('id');
        $quiz->quiz_languages()->whereIn('id', $rowToDelete)->delete();

        foreach($params['prerequisite_data'] as $pre){
            $quiz->prerequisites()->updateOrCreate(
                ['prerequisite_quiz_id' => $pre['prerequisite_quiz_id']],
                $pre
                );
        }
        $rowToDelete = $quiz->prerequisites()->whereNotIn('prerequisite_quiz_id', array_column($params['prerequisite_data'], 'prerequisite_quiz_id'))->pluck('id');
        $quiz->prerequisites()->whereIn('id', $rowToDelete)->delete();
        return rest_ensure_response($res);
    }
    
    public function delete_quiz($request) {
        $res = [];
        $quiz_id = $request['quiz_id'];
        $quiz = Quiz::find($quiz_id);
        $quiz->delete();
        $res['quiz'] = $quiz;
        return rest_ensure_response($res);
    }

    public function check_permission() {
        return true;
    }
}
