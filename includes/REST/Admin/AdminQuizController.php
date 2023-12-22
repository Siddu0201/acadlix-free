<?php

namespace Yuvayana\Acadlix\REST\Admin;

use WP_REST_Server;

class AdminQuizController {

    protected $namespace = 'acadlix/v1';

    protected $base = 'quiz';

    public function register_routes() {
        register_rest_route(
            $this->namespace, '/' . $this->base,
            [
                [
                    'methods'             => WP_REST_Server::READABLE,
                    'callback'            => [ $this, 'get_quiz_data' ],
                    'permission_callback' => [ $this, 'check_permission' ],
                ],
            ]
        );
    }

    public function get_quiz_data($request) {
        return rest_ensure_response( "hello" );
    }

    public function check_permission() {
        return true;    
    }
}
