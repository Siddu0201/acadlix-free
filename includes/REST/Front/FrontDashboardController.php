<?php

namespace Yuvayana\Acadlix\REST\Front;

use WP_REST_Server;
use WP_Error;


defined('ABSPATH') || exit();

class FrontDashboardController
{
    protected $namespace = 'acadlix/v1';

    protected $base = 'front-dashboard';

    public function register_routes()
    {
        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/get-user-courses',
            [
                [
                    'methods' => WP_REST_Server::CREATABLE,
                    'callback' => [$this, 'get_user_courses'],
                    'permission_callback' => [$this, 'check_permission'],
                ],
            ]
        );
    }

    public function get_user_courses($request)
    {
        return rest_ensure_response($request);
    }
}