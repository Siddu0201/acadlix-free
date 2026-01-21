<?php

namespace Yuvayana\Acadlix\Common\REST\Front;

use WP_REST_Server;
defined( 'ABSPATH' ) || exit();

class FrontUserController
{
    protected $namespace = 'acadlix/v1';

    protected $base = 'front-user';

    public function register_routes()
    {
        // register_rest_route(
        //     $this->namespace,
        //     '/' . $this->base . '/login',
        //     [
        //         [
        //             'methods' => WP_REST_Server::EDITABLE,
        //             'callback' => [$this, 'post_user_login'],
        //             'permission_callback' => [$this, 'check_permission'],
        //         ],
        //     ]
        // );

        // register_rest_route(
        //     $this->namespace,
        //     '/' . $this->base . '/register',
        //     [
        //         [
        //             'methods' => WP_REST_Server::EDITABLE,
        //             'callback' => [$this, 'post_user_register'],
        //             'permission_callback' => [$this, 'check_permission'],
        //         ],
        //     ]
        // );
    }

    public function post_user_login($request)
    {
        $res = [];
        $params = $request->get_json_params();
        $user = wp_signon($params);

        if (is_wp_error($user)) {
            $res['error'] = $user->get_error_message();
        } else {
            $res['user'] = $user;
        }
        return rest_ensure_response($res);
    }

    public function post_user_register($request)
    {
        $res = [];
        $params = $request->get_json_params();
        $user = wp_create_user($params['user_login'], $params['user_password'], $params['user_email']);
        if (is_wp_error($user)) {
            $res['error'] = $user->get_error_message();
            //handle error here
        } else {
            $user = get_user_by('id', $user);
            $data = [
                'user_login' => $params['user_login'],
                'user_password' => $params['user_password'],
            ];
            $user = wp_signon($data);
            if (is_wp_error($user)) {
                $res['error'] = $user->get_error_message();
            } else {
                $res['user'] = $user;
            }
        }

        return rest_ensure_response($res);
    }

    public function check_permission()
    {
        return true;
    }
}