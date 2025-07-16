<?php

namespace Yuvayana\Acadlix\Common\REST\Admin;

use WP_REST_Server;
use WP_REST_Request;
use WP_Error;

defined('ABSPATH') || exit();

class AdminAddonController
{
    protected $namespace = 'acadlix/v1';

    protected $base = 'admin-addon';

    public function register_routes()
    {
        register_rest_route(
            $this->namespace,
            '/'. $this->base,
            [
                [
                    'methods' => WP_REST_Server::READABLE,
                    'callback' => [$this, 'get_addons'],
                    'permission_callback' => [$this, 'check_permission']
                ]
            ]
        );
    }

    public function get_addons($request)
    {
        // $res = $this->addon_list();
        $res = [];
        $res['addons'] = acadlix()->helper()->acadlix_get_all_addons();
        return rest_ensure_response($res);
    }

    public function post_update_internal_addon($request)
    {

    }

    public function post_activate_internal_addon($request)
    {

    }

    public function post_deactivate_internal_addon($request)
    {

    }

    public function check_permission()
    {
        return true;
    }
}
