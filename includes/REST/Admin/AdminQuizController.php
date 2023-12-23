<?php

namespace Yuvayana\Acadlix\REST\Admin;

use WP_REST_Server;

class AdminQuizController {

    protected $namespace = 'acadlix/v1';

    protected $base = 'admin-quiz';

    public function register_routes() {
        register_rest_route(
            $this->namespace, '/' . $this->base,
            [
                [
                    'methods'             => WP_REST_Server::READABLE,
                    'callback'            => [ $this, 'get_all_quiz' ],
                    'permission_callback' => [ $this, 'check_permission' ],
                ],
                [
                    'methods'             => WP_REST_Server::CREATABLE,
                    'callback'            => [ $this, 'post_create_quiz' ],
                    'permission_callback' => [ $this, 'check_permission' ],
                ],
                [
                    'methods'             => WP_REST_Server::DELETABLE,
                    'callback'            => [ $this, 'delete_quiz' ],
                    'permission_callback' => [ $this, 'check_permission' ],
                ],
            ]
        );

        register_rest_route(
            $this->namespace, '/' . $this->base . '/(?P<id>[a-zA-Z0-9-]+)',
            [
                [
                    'methods'             => WP_REST_Server::READABLE,
                    'callback'            => [ $this, 'get_quiz_by_id' ],
                    'permission_callback' => [ $this, 'check_permission' ],
                ],
                [
                    'methods'             => WP_REST_Server::EDITABLE,
                    'callback'            => [ $this, 'update_quiz_by_id' ],
                    'permission_callback' => [ $this, 'check_permission' ],
                ],
            ]
        );
    }

    public function get_all_quiz($request) {
        return rest_ensure_response("Get all quizzes");
    }

    public function post_create_quiz($request) {
        return rest_ensure_response("Create a new quiz");
    }

    public function delete_quiz($request) {
        return rest_ensure_response("Delete a quiz");
    }

    public function get_quiz_by_id($request) {
        $id = $request['id'];
        return rest_ensure_response("Get quiz by ID: $id");
    }

    public function update_quiz_by_id($request) {
        $id = $request['id'];
        return rest_ensure_response("Update quiz by ID: $id");
    }

    public function check_permission() {
        return true;
    }
}
