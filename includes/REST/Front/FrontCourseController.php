<?php

namespace Yuvayana\Acadlix\REST\Front;

use WP_REST_Server;
use WP_Error;
use Yuvayana\Acadlix\Helper\Helper;
use Yuvayana\Acadlix\Models\Course;
use Yuvayana\Acadlix\Models\CourseCart;
use Yuvayana\Acadlix\Models\CourseWishlist;
use Yuvayana\Acadlix\Models\Order;
use Yuvayana\Acadlix\Models\OrderItem;

defined('ABSPATH') || exit();

class FrontCourseController
{
    protected $namespace = 'acadlix/v1';

    protected $base = 'front-course';

    public function register_routes()
    {
        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/add-to-cart',
            [
                [
                    'methods' => WP_REST_Server::CREATABLE,
                    'callback' => [$this, 'post_add_to_cart'],
                    'permission_callback' => [$this, 'check_permission'],
                ],
            ]
        );

        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/buy-now',
            [
                [
                    'methods' => WP_REST_Server::CREATABLE,
                    'callback' => [$this, 'post_buy_now'],
                    'permission_callback' => [$this, 'check_permission'],
                ],
            ]
        );

        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/start-now',
            [
                [
                    'methods' => WP_REST_Server::CREATABLE,
                    'callback' => [$this, 'post_start_now'],
                    'permission_callback' => [$this, 'check_permission'],
                ],
            ]
        );

        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/add-wishlist',
            [
                [
                    'methods' => WP_REST_Server::CREATABLE,
                    'callback' => [$this, 'post_add_wishlist'],
                    'permission_callback' => [$this, 'check_permission'],
                ],
            ]
        );
        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/remove-wishlist',
            [
                [
                    'methods' => WP_REST_Server::DELETABLE,
                    'callback' => [$this, 'post_remove_wishlist'],
                    'permission_callback' => [$this, 'check_permission'],
                ],
            ]
        );
    }

    public function post_add_to_cart($request)
    {
        $errors = [];
        $required_fields = array('course_id');
        $params = $request->get_json_params();
        if (is_array($params) && count($params) == 0) {
            return new WP_Error(__('No data found', 'acadlix'), __('Required course id and user_id', 'acadlix'), array('status' => 404));
        }

        foreach ($required_fields as $field) {
            $param = $request->get_param($field);

            if (empty($param)) {
                /* translators: %s is the required field */
                $errors[] = sprintf(__('The %s parameter is required.', 'acadlix'), $field);
            }
        }

        if (!empty($errors)) {
            return new WP_Error('missing_params', implode(' ', $errors), array('status' => 400));
        }
        $res = array(
            'status' => 'success',
            'code' => array('status' => 200),
            'data' => ""
        );

        return rest_ensure_response($res);
    }

    public function post_buy_now($request)
    {
        $errors = [];
        $required_fields = array('course_id');
        $params = $request->get_json_params();
        if (is_array($params) && count($params) == 0) {
            return new WP_Error(__('No data found', 'acadlix'), __('Required course id and user_id', 'acadlix'), array('status' => 404));
        }

        foreach ($required_fields as $field) {
            $param = $request->get_param($field);

            if (empty($param)) {
                /* translators: %s is the required field */
                $errors[] = sprintf(__('The %s parameter is required.', 'acadlix'), $field);
            }
        }

        if (!empty($errors)) {
            return new WP_Error('missing_params', implode(' ', $errors), array('status' => 400));
        }

        if($params['user_id'] == 0){
            if (empty($request->get_param("cart_token"))) {
                /* translators: %s is the required field */
                return new WP_Error('missing_params', sprintf(__('The %s parameter is required.', 'acadlix'), $field), array('status' => 400));
            }

            $cart_tokens = CourseCart::where("cart_token", $params['cart_token'])->get();
            if(count($cart_tokens) > 0){
                foreach($cart_tokens as $cart_token){
                    $cart_token->update([
                        'token_expiry' => $params['token_expiry'] ?? 0
                    ]);
                }
            }
            $cart = CourseCart::where("cart_token", $params['cart_token'])->where('course_id', $params['course_id'])->first();
            if(!$cart){
                $cart = CourseCart::create([
                    'cart_token' => $params['cart_token'],
                    'course_id' => $params['course_id'],
                    'user_id' => $params['user_id'],
                    'quantity' => 1,
                    'token_expiry' => $params['token_expiry'] ?? 0
                ]);
            }
            $res = array(
                'status' => 'success',
                'code' => array('status' => 200),
                'data' => $cart,
                'redirect' => esc_url(get_permalink(Helper::instance()->acadlix_get_option('acadlix_checkout_page_id')))
            );
        }else{
            $cart = CourseCart::where('user_id', $params['user_id'])->where('course_id', $params['course_id'])->first();
            if(!$cart){
                $cart = CourseCart::create([
                    'course_id' => $params['course_id'],
                    'user_id' => $params['user_id'],
                    'quantity' => 1,
                ]);
            }
            $res = array(
                'status' => 'success',
                'code' => array('status' => 200),
                'data' => $cart,
                'redirect' => esc_url(get_permalink(Helper::instance()->acadlix_get_option('acadlix_checkout_page_id')))
            );
        }

        return rest_ensure_response($res);
    }

    public function post_start_now($request)
    {
        $errors = [];
        $required_fields = array('course_id');
        $params = $request->get_json_params();
        if (is_array($params) && count($params) == 0) {
            return new WP_Error(__('No data found', 'acadlix'), __('Required course id and user_id', 'acadlix'), array('status' => 404));
        }

        foreach ($required_fields as $field) {
            $param = $request->get_param($field);

            if (empty($param)) {
                /* translators: %s is the required field */
                $errors[] = sprintf(__('The %s parameter is required.', 'acadlix'), $field);
            }
        }

        if (!empty($errors)) {
            return new WP_Error('missing_params', implode(' ', $errors), array('status' => 400));
        }

        if ($params['user_id'] == 0) {
            if (empty($request->get_param("cart_token"))) {
                /* translators: %s is the required field */
                return new WP_Error('missing_params', sprintf(__('The %s parameter is required.', 'acadlix'), $field), array('status' => 400));
            }

            $cart_tokens = CourseCart::where("cart_token", $params['cart_token'])->get();
            if(count($cart_tokens) > 0){
                foreach($cart_tokens as $cart_token){
                    $cart_token->update([
                        'token_expiry' => $params['token_expiry'] ?? 0
                    ]);
                }
            }
            $cart = CourseCart::where("cart_token", $params['cart_token'])->where('course_id', $params['course_id'])->first();
            if(!$cart){
                $cart = CourseCart::create([
                    'cart_token' => $params['cart_token'],
                    'course_id' => $params['course_id'],
                    'user_id' => $params['user_id'],
                    'quantity' => 1,
                    'token_expiry' => $params['token_expiry'] ?? 0
                ]);
            }
            $res = array(
                'status' => 'success',
                'code' => array('status' => 200),
                'data' => $cart,
                'redirect' => esc_url(get_permalink(Helper::instance()->acadlix_get_option('acadlix_checkout_page_id')))
            );
        } else {
            $userId = $params['user_id'];
            $order_items = OrderItem::whereHas('order', function ($query) use ($userId) {
                $query->where('user_id', $userId);
            })->pluck('course_id')->toArray();
            if(count($order_items) == 0){
                $order = Order::create([
                    'user_id' => $params['user_id'],
                    'status' => 'success',
                    'extra_charges' => 0,
                    'total_amount' => 0
                ]);
    
                $order->order_item()->create([
                    'course_id' => $params['course_id'],
                    'quantity' => 1,
                    'price' => 0,
                    'discount' => 0,
                    'price_after_discount' => 0,
                    'tax' => 0,
                    'price_after_tax' => 0
                ]);
            }
            $res = array(
                'status' => 'success',
                'code' => array('status' => 200),
                'data' => $order_items,
                'redirect' => esc_url(get_permalink(Helper::instance()->acadlix_get_option('acadlix_dashboard_page_id')))
            );
        }

        return rest_ensure_response($res);
    }

    public function post_add_wishlist($request)
    {
        $errors = [];
        $required_fields = array('course_id', 'user_id');
        $params = $request->get_json_params();
        if (is_array($params) && count($params) == 0) {
            return new WP_Error(__('No data found', 'acadlix'), __('Required course id and user_id', 'acadlix'), array('status' => 404));
        }

        foreach ($required_fields as $field) {
            $param = $request->get_param($field);

            if (empty($param)) {
                /* translators: %s is the required field */
                $errors[] = sprintf(__('The %s parameter is required.', 'acadlix'), $field);
            }
        }

        if (!empty($errors)) {
            return new WP_Error('missing_params', implode(' ', $errors), array('status' => 400));
        }
        $course = Course::find($params['course_id']);
        if (!$course) {
            return new WP_Error(__('Missing Course', 'acadlix'), __('This Course is not available', 'acadlix'), array('status' => 404));
        }
        $wishlist = $course->wishlist()->create(['user_id' => $params['user_id']]);
        $res = array(
            'status' => 'success',
            'code' => array('status' => 200),
            'data' => $wishlist
        );

        return rest_ensure_response($res);
    }

    public function post_remove_wishlist($request)
    {
        $errors = [];
        $required_fields = array('course_id', 'user_id');
        $params = $request->get_json_params();
        if (is_array($params) && count($params) == 0) {
            return new WP_Error(__('No data found', 'acadlix'), __('Required course id and user_id', 'acadlix'), array('status' => 404));
        }

        foreach ($required_fields as $field) {
            $param = $request->get_param($field);

            if (empty($param)) {
                /* translators: %s is the required field */
                $errors[] = sprintf(__('The %s parameter is required.', 'acadlix'), $field);
            }
        }

        if (!empty($errors)) {
            return new WP_Error('missing_params', implode(' ', $errors), array('status' => 400));
        }

        $wishlist = CourseWishlist::where('course_id', $params['course_id'])->where('user_id', $params['user_id'])->first();
        if (!$wishlist) {
            return new WP_Error(__('Missing Course', 'acadlix'), __('This Course is not available', 'acadlix'), array('status' => 404));
        }
        $wishlist->delete();
        $res = array(
            'status' => 'success',
            'code' => array('status' => 200),
            'message' => __('Course removed from the wishlist', 'acadlix')
        );
        return rest_ensure_response($res);
    }

    public function check_permission()
    {
        return true;
    }
}