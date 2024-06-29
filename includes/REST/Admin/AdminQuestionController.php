<?php

namespace Yuvayana\Acadlix\REST\Admin;

use WP_REST_Server;
use WP_REST_Request;
use Yuvayana\Acadlix\Models\Question;
use Yuvayana\Acadlix\Models\Quiz;
use Yuvayana\Acadlix\Models\Subject;

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
} 

class AdminQuestionController {

    protected $namespace = 'acadlix/v1';
    protected $base = 'admin-quiz';

    public function register_routes() {
        register_rest_route(
            $this->namespace, '/' . $this->base . '/(?P<quiz_id>[\d]+)/question',
            [
                [
                    'methods'             => WP_REST_Server::READABLE,
                    'callback'            => [ $this, 'get_quiz_questions' ],
                    'permission_callback' => [ $this, 'check_permission' ],
                ],
                [
                    'methods'             => WP_REST_Server::CREATABLE,
                    'callback'            => [ $this, 'post_create_quiz_question' ],
                    'permission_callback' => [ $this, 'check_permission' ],
                ],
                ]
            );

            register_rest_route( 
                $this->namespace, '/' . $this->base . '/(?P<quiz_id>[\d]+)/question/create', 
                [
                    [
                        'methods'             => WP_REST_Server::READABLE,
                        'callback'            => [ $this, 'get_create_quiz_question' ],
                        'permission_callback' => [ $this, 'check_permission' ],
                    ],
                ]
            );
            
            register_rest_route(
                $this->namespace, '/' . $this->base . '/(?P<quiz_id>[\d]+)/question/(?P<question_id>[\d]+)',
                [
                    [
                        'methods'             => WP_REST_Server::READABLE,
                        'callback'            => [ $this, 'get_quiz_question_by_id' ],
                        'permission_callback' => [ $this, 'check_permission' ],
                        'args' => array(
                            'quiz_id' => array(
                              'validate_callback' => function($param, $request, $key) {
                                return is_numeric( $param );
                              }
                            ),
                            'question_id' => array(
                              'validate_callback' => function($param, $request, $key) {
                                return is_numeric( $param );
                              }
                            ),
                        ),
                    ],
                    [
                        'methods'             => WP_REST_Server::EDITABLE,
                        'callback'            => [ $this, 'update_quiz_question_by_id' ],
                        'permission_callback' => [ $this, 'check_permission' ],
                        'args' => array(
                            'quiz_id' => array(
                              'validate_callback' => function($param, $request, $key) {
                                return is_numeric( $param );
                              }
                            ),
                            'question_id' => array(
                              'validate_callback' => function($param, $request, $key) {
                                return is_numeric( $param );
                              }
                            ),
                        ),
                    ],
                    [
                        'methods'             => WP_REST_Server::DELETABLE,
                        'callback'            => [ $this, 'delete_quiz_question_by_id' ],
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
                            'question_id' => array(
                              'validate_callback' => function($param, $request, $key) {
                                return is_numeric( $param );
                              }
                            ),
                        ),
                    ],
            ]
        );
    }

    public function get_quiz_questions($request) {
        $res = [];
        $quiz_id = $request['quiz_id'];
        $params = $request->get_params();
        $skip = $params['page'] * $params['pageSize'];
        $question = Question::where('quiz_id', $quiz_id)->where('online', 1)->orderBy('created_at', 'desc');
        $res['total'] = $question->count();
        $res['questions'] = $question->skip($skip)->take($params['pageSize'])->get();
        foreach($res['questions'] as $key => $question){
            foreach($question->question_languages as $lkey => $lang){
                $lang['question'] = strip_tags($this->renderShortCode($lang['question']));
                $res['questions'][$key]['question_languages'][$lkey] = $lang;
            }
        }
        $res['quiz'] = Quiz::find($quiz_id);
        return rest_ensure_response($res);
    }

    public function get_create_quiz_question($request){
        $res = [];
        $quiz_id = $request['quiz_id'];
        $res['subjects'] = Subject::get();
        $res['quiz'] = Quiz::withCount('questions')->find($quiz_id);
        return rest_ensure_response( $res );
    }

    public function post_create_quiz_question($request) {
        $res = [];
        $quiz_id = $request['quiz_id'];
        $params = $request->get_json_params();
        $question = Question::create($params);
        $question->question_languages()->createMany($params['language']);
        $res['question'] = $question;
        return rest_ensure_response($res);
    }

    public function get_quiz_question_by_id($request) {
        $res = [];
        $quiz_id = $request['quiz_id'];
        $question_id = $request['question_id'];
        $res['question'] = Question::find($question_id);
        $res['subjects'] = Subject::get();
        $res['quiz'] = Quiz::withCount('questions')->find($quiz_id);
        return rest_ensure_response($res);
    }
    
    public function update_quiz_question_by_id($request) {
        $res = [];
        $quiz_id = $request['quiz_id'];
        $question_id = $request['question_id'];
        $params = $request->get_json_params();
        $question = Question::find($question_id);
        $question->update($params);
        foreach($params['language'] as $lang){
            $question->question_languages()->updateOrCreate(
                ['language_id' => $lang['language_id']],
                $lang
            );
        }
        $res = $question;
        return rest_ensure_response($res);
    }
    
    public function delete_quiz_question_by_id($request) {
        $res = [];
        $quiz_id = $request['quiz_id'];
        $question_id = $request['question_id'];
        $question = Question::find($question_id);
        $question->update(['online' => 0]);
        $res = $question;
        return rest_ensure_response($res);
    }
    public function check_permission() {
        return true;
    }

    public function renderShortCode($data){
        return do_shortcode(apply_filters('comment_text',  $data));
    }
}
