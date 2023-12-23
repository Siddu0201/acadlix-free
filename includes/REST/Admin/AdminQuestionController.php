<?php

namespace Yuvayana\Acadlix\REST\Admin;

use WP_REST_Server;

class AdminQuestionController {

    protected $namespace = 'acadlix/v1';
    protected $base = 'admin-quiz';

    public function register_routes() {
        register_rest_route(
            $this->namespace, '/' . $this->base . '/(?P<quiz_id>[a-zA-Z0-9-]+)/question',
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
                [
                    'methods'             => WP_REST_Server::DELETABLE,
                    'callback'            => [ $this, 'delete_quiz_question' ],
                    'permission_callback' => [ $this, 'check_permission' ],
                ],
            ]
        );

        register_rest_route(
            $this->namespace, '/' . $this->base . '/(?P<quiz_id>[a-zA-Z0-9-]+)/question/(?P<question_id>[a-zA-Z0-9-]+)',
            [
                [
                    'methods'             => WP_REST_Server::READABLE,
                    'callback'            => [ $this, 'get_quiz_question_by_id' ],
                    'permission_callback' => [ $this, 'check_permission' ],
                ],
                [
                    'methods'             => WP_REST_Server::EDITABLE,
                    'callback'            => [ $this, 'update_quiz_question_by_id' ],
                    'permission_callback' => [ $this, 'check_permission' ],
                ],
            ]
        );
    }

    public function get_quiz_questions($request) {
        $quiz_id = $request['quiz_id'];
        return rest_ensure_response("Get all questions for quiz ID: $quiz_id");
    }

    public function post_create_quiz_question($request) {
        $quiz_id = $request['quiz_id'];
        return rest_ensure_response("Create a new question for quiz ID: $quiz_id");
    }

    public function delete_quiz_question($request) {
        $quiz_id = $request['quiz_id'];
        return rest_ensure_response("Delete a question for quiz ID: $quiz_id");
    }

    public function get_quiz_question_by_id($request) {
        $quiz_id = $request['quiz_id'];
        $question_id = $request['question_id'];
        return rest_ensure_response("Get question by ID: $question_id for quiz ID: $quiz_id");
    }

    public function update_quiz_question_by_id($request) {
        $quiz_id = $request['quiz_id'];
        $question_id = $request['question_id'];
        return rest_ensure_response("Update question by ID: $question_id for quiz ID: $quiz_id");
    }

    public function check_permission() {
        return true;
    }
}
