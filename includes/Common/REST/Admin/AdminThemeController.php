<?php

namespace Yuvayana\Acadlix\Common\REST\Admin;

use WP_REST_Server;

defined('ABSPATH') || exit();

class AdminThemeController
{
    protected $namespace = 'acadlix/v1';
    protected $base = 'admin-theme';

    public function register_routes()
    {
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
    }

    public function post_update_settings($request)
    {
        $res = [];
        $params = $request->get_json_params();

        if (is_array($params)) {
            acadlix()->helper()->acadlix_update_option('acadlix_theme_settings', $params);
        }
        $res['message'] = __('Theme updated successfully', 'acadlix');
        return rest_ensure_response($res);
    }

    public function check_permission()
    {
        return true;
    }
}