<?php

namespace Yuvayana\Acadlix\Common\REST\Admin;

use WP_REST_Server;
use WP_REST_Request;
use WP_Error;
defined('ABSPATH') || exit();

class AdminQuestionController
{

    protected $namespace = 'acadlix/v1';
    protected $base = 'admin-quiz';

    public function register_routes()
    {
        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/(?P<quiz_id>[\d]+)/question',
            [
                [
                    'methods' => WP_REST_Server::READABLE,
                    'callback' => [$this, 'get_quiz_questions'],
                    'permission_callback' => [$this, 'check_permission'],
                ],
                [
                    'methods' => WP_REST_Server::CREATABLE,
                    'callback' => [$this, 'post_create_quiz_question'],
                    'permission_callback' => [$this, 'check_permission'],
                ],
            ]
        );

        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/(?P<quiz_id>[\d]+)/question/create',
            [
                [
                    'methods' => WP_REST_Server::READABLE,
                    'callback' => [$this, 'get_create_quiz_question'],
                    'permission_callback' => [$this, 'check_permission'],
                ],
            ]
        );

        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/(?P<quiz_id>[\d]+)/question/(?P<question_id>[\d]+)',
            [
                [
                    'methods' => WP_REST_Server::READABLE,
                    'callback' => [$this, 'get_quiz_question_by_id'],
                    'permission_callback' => [$this, 'check_permission'],
                    'args' => array(
                        'quiz_id' => array(
                            'validate_callback' => function ($param, $request, $key) {
                                return is_numeric($param);
                            }
                        ),
                        'question_id' => array(
                            'validate_callback' => function ($param, $request, $key) {
                                return is_numeric($param);
                            }
                        ),
                    ),
                ],
                [
                    'methods' => WP_REST_Server::EDITABLE,
                    'callback' => [$this, 'update_quiz_question_by_id'],
                    'permission_callback' => [$this, 'check_permission'],
                    'args' => array(
                        'quiz_id' => array(
                            'validate_callback' => function ($param, $request, $key) {
                                return is_numeric($param);
                            }
                        ),
                        'question_id' => array(
                            'validate_callback' => function ($param, $request, $key) {
                                return is_numeric($param);
                            }
                        ),
                    ),
                ],
                [
                    'methods' => WP_REST_Server::DELETABLE,
                    'callback' => [$this, 'delete_quiz_question_by_id'],
                    'permission_callback' => function (WP_REST_REQUEST $request) {
                        if (wp_verify_nonce($request->get_header('X-WP-Nonce'), 'wp_rest')) {
                            return true;
                        }
                        return false;
                    },
                    'args' => array(
                        'quiz_id' => array(
                            'validate_callback' => function ($param, $request, $key) {
                                return is_numeric($param);
                            }
                        ),
                        'question_id' => array(
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
            '/' . $this->base . '/(?P<quiz_id>[\d]+)/question/set-subject-and-point',
            [
                [
                    'methods' => WP_REST_Server::EDITABLE,
                    'callback' => [$this, 'post_set_subject_and_point'],
                    'permission_callback' => [$this, 'check_permission'],
                ],
            ]
        );

        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/(?P<quiz_id>[\d]+)/question/delete-bulk-question',
            [
                [
                    'methods' => WP_REST_Server::DELETABLE,
                    'callback' => [$this, 'delete_bulk_question'],
                    'permission_callback' => function (WP_REST_REQUEST $request) {
                        if (wp_verify_nonce($request->get_header('X-WP-Nonce'), 'wp_rest')) {
                            return true;
                        }
                        return false;
                    },
                ],
            ]
        );
    }

    public function get_quiz_questions($request)
    {
        $res = [];
        $quiz_id = $request['quiz_id'];
        $params = $request->get_params();
        $skip = $params['page'] * $params['pageSize'];
        $search = $params['search'];
        $question = acadlix()->model()->question()->ofOnline()->where('quiz_id', $quiz_id)->orderBy("sort");
        if (!empty($search)) {
            $question->where(function ($query) use ($search) {
                $query->where('title', 'LIKE', "%{$search}%"); // Search in quiz title
            })
            ->orWhereHas('question_languages', function ($query) use ($search) {
                $query->where('question', 'LIKE', "%{$search}%"); 
            });
        }
        $res['total'] = $question->count();
        $res['questions'] = $question->skip($skip)->take($params['pageSize'])->get();
        return rest_ensure_response($res);
    }

    public function get_create_quiz_question($request)
    {
        $res = [];
        $quiz_id = $request['quiz_id'];
        $res['subjects'] = acadlix()->model()->subject()->get();
        $res['quiz'] = acadlix()->model()->quiz()->ofQuiz()->find($quiz_id);
        return rest_ensure_response($res);
    }

    public function post_create_quiz_question($request)
    {
        $res = [];
        $params = $request->get_json_params();
        $question = acadlix()->model()->question()->create($params);
        $question->question_languages()->createMany($params['language']);
        $res['question'] = $question;
        return rest_ensure_response($res);
    }

    public function get_quiz_question_by_id($request)
    {
        $res = [];
        $quiz_id = $request['quiz_id'];
        $question_id = $request['question_id'];
        $res['question'] = acadlix()->model()->question()->find($question_id);
        $res['subjects'] = acadlix()->model()->subject()->get();
        $res['quiz'] = acadlix()->model()->quiz()->ofQuiz()->find($quiz_id);
        return rest_ensure_response($res);
    }

    public function update_quiz_question_by_id($request)
    {
        $res = [];
        $question_id = $request['question_id'];
        $params = $request->get_json_params();

        if (empty($question_id)) {
            return new WP_Error(
                'missing_question_id',
                __('Question id is required.', 'acadlix'),
                ['status' => 400]
            );
        }

        if (is_array($params['language']) && count($params['language']) == 0) {
            return new WP_Error(
                'missing_question_languages',
                __('Question language is required.', 'acadlix'),
                ['status' => 400]
            );
        }
        $question = acadlix()->model()->question()->find($question_id);
        $question->update($params);

        foreach ($params['language'] as $lang) {
            $question->question_languages()->updateOrCreate(
                ['language_id' => $lang['language_id']],
                $lang
            );
        }
        $res = $question;
        return rest_ensure_response($res);
    }

    public function delete_quiz_question_by_id($request)
    {
        $res = [];
        $question_id = $request['question_id'];
        $question = acadlix()->model()->question()->find($question_id);
        $question->update(['online' => 0]);
        $res = $question;
        return rest_ensure_response($res);
    }

    public function post_set_subject_and_point($request)
    {
        $res = [];
        $params = $request->get_json_params();
        if (is_array($params['question_ids']) && count($params['question_ids']) == 0) {
            return new WP_Error(
                'missing_question_ids',
                __('Question ids is required.', 'acadlix'),
                ['status' => 400]
            );
        }
        foreach ($params['question_ids'] as $question_id) {
            $question = acadlix()->model()->question()->find($question_id);
            $question->update([
                'subject_id' => !empty($params['subject_id']) ? $params['subject_id'] : $question->subject_id,
                'points' => !empty($params['points']) ? $params['points'] : $question->points,
                'negative_points' => $params['negative_points'] != "" ? (float) $params['negative_points'] : $question->negative_points,
            ]);
        }
        return rest_ensure_response($res);
    }

    public function delete_bulk_question($request)
    {
        $res = [];
        $params = $request->get_json_params();
        if (is_array($params['question_ids']) && count($params['question_ids']) == 0) {
            return new WP_Error(
                'missing_question_ids',
                __('Question ids is required.', 'acadlix'),
                ['status' => 400]
            );
        }
        if (count($params['question_ids']) > 0) {
            foreach ($params['question_ids'] as $question_id) {
                $question = acadlix()->model()->question()->find($question_id);
                $question->update(['online' => 0]);
            }
        }
        return rest_ensure_response($res);
    }

    public function check_permission()
    {
        return true;
    }
}
