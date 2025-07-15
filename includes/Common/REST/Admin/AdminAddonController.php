<?php

namespace Yuvayana\Acadlix\Common\REST\Admin;

use WP_REST_Server;
use WP_REST_Request;
use WP_Error;

defined('ABSPATH') || exit();

class AdminAddonController
{

    public function register_routes()
    {
        register_rest_route('acadlix/v1', '/addon', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_addon'),
        ));
    }

    public function get_addon()
    {
        return array(
            'status' => true,
            'data' => array(
                'version' => '1.0.0',
                'pro' => false,
                'versionPath' => 'Common',
                'isDev' => false,
            ),
        );
    }
}
