<?php

namespace Yuvayana\Acadlix\REST\Admin;

use WP_REST_Server;
use WP_REST_Request;
use Yuvayana\Acadlix\Models\Question;
use Yuvayana\Acadlix\Models\Quiz;
use Yuvayana\Acadlix\Models\Category;
use Yuvayana\Acadlix\Models\Language;
use Yuvayana\Acadlix\Models\SubjectTime;
use Illuminate\Contracts\Database\Query\Builder;
use Yuvayana\Acadlix\Models\Template;

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
} 

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
                    'permission_callback' => function (WP_REST_Request $request){
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

        register_rest_route( 
            $this->namespace, '/' . $this->base . '/set-category', 
            [
                [
                    'methods'             => WP_REST_Server::EDITABLE,
                    'callback'            => [ $this, 'post_set_category' ],
                    'permission_callback' => [ $this, 'check_permission' ],
                ],
            ]
        );

        register_rest_route( 
            $this->namespace, '/' . $this->base . '/delete-bulk-quiz', 
            [
                [
                    'methods'             => WP_REST_Server::DELETABLE,
                    'callback'            => [ $this, 'delete_bulk_quiz' ],
                    'permission_callback' => function (WP_REST_REQUEST $request) {
                        if (wp_verify_nonce($request->get_header('X-WP-Nonce'), 'wp_rest')) {
                            return true;
                        }
                        return false;
                    },
                ],
            ]
        );

        register_rest_route( 
            $this->namespace, '/' . $this->base . '/(?P<quiz_id>[\d]+)/get-subject-by-quiz-id',
            [
                [
                    'methods'             => WP_REST_Server::READABLE,
                    'callback'            => [ $this, 'get_subject_by_quiz_id' ],
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

        register_rest_route( 
            $this->namespace, '/' . $this->base . '/update-quiz-subject',
            [
                [
                    'methods'             => WP_REST_Server::EDITABLE,
                    'callback'            => [ $this, 'update_quiz_subject' ],
                    'permission_callback' => [ $this, 'check_permission' ],
                    'args' => array( ),
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
        }])->orderBy('created_at', 'desc');
        $res['total'] = $quiz->count();
        $res['quizes'] = $quiz->skip($skip)->take($params['pageSize'])->get();
        return rest_ensure_response($res);
    }

    public function get_create_quiz($request){
        $res = [];
        $res['categories'] = Category::get();
        $res['languages'] = Language::get();
        $res['quizes'] = Quiz::get();
        $res['templates'] = Template::where("type", "quiz")->get(["id", "name"]);
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
        $res['templates'] = Template::where("type", "quiz")->get(["id", "name"]);
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
            $prerequisite_quiz = Quiz::find($pre['prerequisite_quiz_id']);
            $prerequisite_quiz->update([
                'enable_login_register' => true,
                'login_register_type' => "at_start_of_quiz",
                'save_statistic' => true,
            ]); 
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

    public function post_set_category($request){
        $res = [];
        $params = $request->get_json_params();
        if(count($params['quiz_ids']) > 0){
            foreach($params['quiz_ids'] as $quiz_id){
                $quiz = Quiz::find($quiz_id);
                $quiz->update([
                    'category_id' => !empty($params['category_id']) ? $params['category_id'] : $quiz->category_id,
                ]);
            }
        }
        return rest_ensure_response( $res );
    }

    public function delete_bulk_quiz($request){
        $res = [];
        $params = $request->get_json_params();
        if(count($params['quiz_ids']) > 0){
            foreach($params['quiz_ids'] as $quiz_id){
                $quiz = Quiz::find($quiz_id);
                $quiz->delete();
            }
        }
        return rest_ensure_response( $res );
    }

    public function get_subject_by_quiz_id($request){
        $res = [];
        $quiz_id = $request['quiz_id'];
        $res['quiz'] = Quiz::select('quiz_timing_type', 'subject_wise_question', 'optional_subject', 'advance_mode_type')->where('id', $quiz_id)->first();
        $questions = Question::where('quiz_id', $quiz_id)->get();
        $grouped = $questions->groupBy('subject_id')->map(function ($group) use ($quiz_id) {
            return [
                'subject_id' => $group->first()->subject_id,
                'number_of_question' => $group->count(),
                'subject_name' => $group->first()->subject->subject_name ?? "Uncategorized",
                'time' => SubjectTime::where("quiz_id", $quiz_id)->where("subject_id", $group->first()->subject_id)->first()->time ?? 0,
                'specific_number_of_questions' => SubjectTime::where("quiz_id", $quiz_id)->where("subject_id", $group->first()->subject_id)->first()->specific_number_of_questions ?? $group->count(),
                'optional' => SubjectTime::where("quiz_id", $quiz_id)->where("subject_id", $group->first()->subject_id)->first()->optional ?? 0,
            ];
        })->values();
        $res['subjects'] = $grouped->toArray();
        return rest_ensure_response( $res );
    }

    public function update_quiz_subject($request){
        $res = [];
        $params = $request->get_json_params();
        $quiz = Quiz::find($params['quiz_id']);
        $quiz->update([
            'quiz_timing_type' => $params['quiz_timing_type'] ?? $quiz->quiz_timing_type,
            'subject_wise_question' => $params['subject_wise_question'],
            'optional_subject' => $params['optional_subject']
        ]);
        foreach($params['subjects'] as $subject){
            $subject_time = SubjectTime:: where("quiz_id", $params['quiz_id'])->where("subject_id", $subject['subject_id'])->first();
            if($subject_time){
                $subject_time->update([
                    'time' => $subject['time'],
                    'specific_number_of_questions' => $subject['specific_number_of_questions'],
                    'optional' => $params['optional_subject'] ? $subject['optional'] : 0,
                ]);
            }else{
                SubjectTime::create([
                    'quiz_id' => $params['quiz_id'],
                    'subject_id' => $subject['subject_id'],
                    'time' => $subject['time'],
                    'specific_number_of_questions' => $subject['specific_number_of_questions'],
                    'optional' => $params['optional_subject'] ? $subject['optional'] : 0,
                ]);
            }
        }
        return rest_ensure_response( $res );
    }

    public function check_permission() {
        return true;
    }
}
