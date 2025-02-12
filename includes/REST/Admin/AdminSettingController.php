<?php

namespace Yuvayana\Acadlix\REST\Admin;

use WP_Error;
use WP_REST_Server;
use Yuvayana\Acadlix\Helper\EmailHelper;
use Yuvayana\Acadlix\Helper\Helper;

defined('ABSPATH') || exit();

class AdminSettingController
{

    protected $namespace = 'acadlix/v1';
    protected $base = 'admin-setting';

    public function register_routes()
    {
        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/create-page',
            [
                [
                    'methods' => WP_REST_Server::CREATABLE,
                    'callback' => [$this, 'post_create_page'],
                    'permission_callback' => [$this, 'check_permission'],
                ],
            ]
        );

        register_rest_route(
            $this->namespace,
            '/' . $this->base,
            [
                [
                    'methods' => WP_REST_Server::EDITABLE,
                    'callback' => [$this, 'post_update_settings'],
                    'permission_callback' => [$this, 'check_permission'],
                ],
            ]
        );

        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/test-email',
            [
                [
                    'methods' => WP_REST_Server::EDITABLE,
                    'callback' => [$this, 'post_test_email'],
                    'permission_callback' => [$this, 'check_permission'],
                ],
            ]
        );
    }

    public function post_create_page($request)
    {
        $res = [];
        $params = $request->get_json_params();
        $res['page_id'] = wp_insert_post([
            'post_title' => $params['title'],
            'post_status' => 'publish',
            'post_author' => $params['user_id'] ?? 0,
            'post_type' => 'page',
        ]);
        $res['all_pages'] = get_pages();
        return rest_ensure_response($res);
    }

    public function post_update_settings($request)
    {
        $res = [];
        $params = $request->get_json_params();
        if (is_array($params)) {
            foreach ($params as $key => $value) {
                Helper::instance()->acadlix_update_option($key, $value);
            }
        }
        flush_rewrite_rules();
        $res['options'] = Helper::instance()->acadlix_get_all_options();
        return rest_ensure_response($res);
    }

    public function post_test_email($request)
    {
        $res = [];
        $params = $request->get_json_params();

        $mail = EmailHelper::instance()->sendEmail($params['to'], $params['subject'], $params['message'], "siddu@gmail.com");
        if (is_wp_error($mail)) {
            return $mail;
        }
        $res['message'] = __('Email sent successfully', 'acadlix');
        return rest_ensure_response($res);
    }


    public function check_permission()
    {
        return true;
    }
}