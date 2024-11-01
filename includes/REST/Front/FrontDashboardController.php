<?php

namespace Yuvayana\Acadlix\REST\Front;

use WP_REST_Server;
use WP_Error;
use Yuvayana\Acadlix\Models\Order;
use Yuvayana\Acadlix\Models\OrderItem;
use Yuvayana\Acadlix\Models\WpUsers;


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
                    'methods' => WP_REST_Server::READABLE,
                    'callback' => [$this, 'get_user_courses'],
                    'permission_callback' => [$this, 'check_permission'],
                ],
            ]
        );

        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/get-user-purchases',
            [
                [
                    'methods' => WP_REST_Server::READABLE,
                    'callback' => [$this, 'get_user_purchases'],
                    'permission_callback' => [$this, 'check_permission'],
                ],
            ]
        );

        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/get-user-profile',
            [
                [
                    'methods' => WP_REST_Server::READABLE,
                    'callback' => [$this, 'get_user_profile'],
                    'permission_callback' => [$this, 'check_permission'],
                ],
            ]
        );

        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/post-update-user-profile',
            [
                [
                    'methods' => WP_REST_Server::EDITABLE,
                    'callback' => [$this, 'post_update_user_profile'],
                    'permission_callback' => [$this, 'check_permission'],
                ],
            ]
        );
    }

    public function get_user_courses($request)
    {
        $res = [];
        $params = $request->get_params();

        if ($request->get_param("user_id") == 0) {
            return new WP_Error(__('No data found', 'acadlix'), __('Required user_id', 'acadlix'), array('status' => 404));
        }

        $skip = $params['page'] * $params['pageSize'];
        $userId = $request->get_param("user_id");
        $order_items = OrderItem::with(['order', 'course'])->whereHas('order', function ($query) use ($userId) {
            $query->where("user_id", $userId)->where("status", "success");
        })->orderByDesc("created_at");
        $res['total'] = $order_items->count();
        $res['order_items'] = $order_items->skip($skip)->take($params['pageSize'])->get();
        return rest_ensure_response($res);
    }

    public function get_user_purchases($request)
    {
        $res = [];
        $params = $request->get_params();
        if ($request->get_param("user_id") == 0) {
            return new WP_Error(__('No data found', 'acadlix'), __('Required user_id', 'acadlix'), array('status' => 404));
        }
        $skip = $params['page'] * $params['pageSize'];
        $order = Order::with(['order_items', 'order_items.course', 'order_metas', 'user'])->where("user_id", $request->get_param("user_id"))->orderBy('created_at', 'desc');
        $res['total'] = $order->count();
        $res['orders'] = $order->skip($skip)->take($params['pageSize'])->get();
        return rest_ensure_response($res);
    }

    public function get_user_profile($request)
    {
        $res = [];
        if ($request->get_param("user_id") == 0) {
            return new WP_Error(__('No data found', 'acadlix'), __('Required user_id', 'acadlix'), array('status' => 404));
        }
        $res['user'] = WpUsers::where('ID', $request->get_param("user_id"))->first();
        return rest_ensure_response($res);
    }

    public function post_update_user_profile($request)
    {
        $res = [];
        $params = $request->get_json_params();
        $user_id = $request->get_param("user_id");
        if ($user_id == 0) {
            return new WP_Error(__('No data found', 'acadlix'), __('Required user_id', 'acadlix'), array('status' => 404));
        }
        wp_update_user([
            'ID' => $user_id,
            'display_name' => sanitize_text_field($params['first_name']) . " " . sanitize_text_field($params['last_name']),
            'user_url' => sanitize_text_field($params['user_url'])
        ]);

        update_user_meta($user_id, 'first_name', sanitize_text_field($params['first_name']));
        update_user_meta($user_id, 'last_name', sanitize_text_field($params['last_name']));
        update_user_meta($user_id, 'description', sanitize_text_field($params['description']));
        update_user_meta($user_id, '_acadlix_profile_phonecode', sanitize_text_field($params['phonecode']));
        update_user_meta($user_id, '_acadlix_profile_phone_number', sanitize_text_field($params['phone_number']));
        update_user_meta($user_id, '_acadlix_profile_address', sanitize_text_field($params['address']));
        update_user_meta($user_id, '_acadlix_profile_country', sanitize_text_field($params['country']));
        update_user_meta($user_id, '_acadlix_profile_city', sanitize_text_field($params['city']));
        update_user_meta($user_id, '_acadlix_profile_zip_code', sanitize_text_field($params['zip_code']));
        update_user_meta($user_id, '_acadlix_profile_photo', sanitize_text_field($params['photo']));

        $res['user'] = WpUsers::where('ID', $user_id)->first();
        return rest_ensure_response($res);
    }

    public function check_permission()
    {
        return true;
    }
}