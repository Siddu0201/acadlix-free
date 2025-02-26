<?php

namespace Yuvayana\Acadlix\REST\Front;

use WP_REST_Server;
use Yuvayana\Acadlix\Models\StatisticRef;

defined('ABSPATH') || exit();

class FrontStatisticController
{
    protected $namespace = 'acadlix/v1';

    protected $base = 'front-statistic';

    public function register_routes()
    {
        register_rest_route(
            $this->namespace, 
            '/' . $this->base . '/(?P<user_id>[\d]+)', 
            array(
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'get_statistic_by_user_id'),
                'permission_callback' => array($this, 'check_permission'),
                'args' => array(
                    'user_id' => array(
                        'validate_callback' => function ($param, $request, $key) {
                            return is_numeric($param);
                        }
                    ),
                ),
            )
        ));

        register_rest_route(
            $this->namespace, 
            '/' . $this->base . '/(?P<statistic_id>[\d]+)/statistic', 
            array(
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'get_statistic_by_statistic_id'),
                'permission_callback' => array($this, 'check_permission'),
                'args' => array(
                    'statistic_id' => array(
                        'validate_callback' => function ($param, $request, $key) {
                            return is_numeric($param);
                        }
                    ),
                ),
            )
        ));
    }

    public function get_statistic_by_user_id($request) 
    {
        $res = [];
        $user_id = $request['user_id'];
        $params = $request->get_params();

        // Validate required fields
        if (empty($user_id)) {
            return new WP_Error(
                'missing_id',
                __('User id is required.', 'acadlix'),
                ['status' => 400]
            );
        }
        $skip = $params['page'] * $params['pageSize'];
        $stat_ref = StatisticRef::where('user_id', $user_id)->orderBy("id", "desc");
        $res['total'] = $stat_ref->count();
        $res['stat_refs'] = $stat_ref->skip($skip)->take($params['pageSize'])->get()->each->setAppends(['quiz']);
        return rest_ensure_response($res);
    }

    public function get_statistic_by_statistic_id($request)
    {
        $res = [];
        $statistic_id = $request['statistic_id'];

        // Validate required fields
        if (empty($statistic_id)) {
            return new WP_Error(
                'missing_id',
                __('Statistic id is required.', 'acadlix'),
                ['status' => 400]
            );
        }

        return rest_ensure_response($statistic_id);
    }

    public function check_permission()
    {
        return true;
    }
}