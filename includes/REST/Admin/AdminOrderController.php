<?php

namespace Yuvayana\Acadlix\REST\Admin;

use WP_REST_Server;
use WP_REST_Request;
use Yuvayana\Acadlix\Models\Order;


defined('ABSPATH') || exit();

class AdminOrderController
{

    protected $namespace = 'acadlix/v1';
    protected $base = 'admin-order';

    public function register_routes()
    {
        register_rest_route(
            $this->namespace,
            '/' . $this->base,
            [
                [
                    'methods' => WP_REST_Server::READABLE,
                    'callback' => [$this, 'get_orders'],
                    'permission_callback' => [$this, 'check_permission'],
                ],
            ]
        );
    }

    public function get_orders($request)
    {
        $res = [];
        $params = $request->get_params();
        $skip = $params['page'] * $params['pageSize'];
        $order = Order::with(['order_items', 'order_items.course', 'order_metas', 'user'])->orderBy('created_at', 'desc');
        $res['total'] = $order->count();
        $res['orders'] = $order->skip($skip)->take($params['pageSize'])->get();
        return rest_ensure_response( $res );
    }

    public function check_permission()
    {
        return true;
    }
}