<?php

namespace Yuvayana\Acadlix\Common\REST\Front;

use WP_REST_Server;
use WP_Error;

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
            return new WP_Error('no_data_found', __('Required course id and user_id', 'acadlix'), array('status' => 404));
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
            return new WP_Error('no_data_found', __('Required course id and user_id', 'acadlix'), array('status' => 404));
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

            $cart_tokens = acadlix()->model()->courseCart()->where("cart_token", $params['cart_token'])->get();
            if (count($cart_tokens) > 0) {
                foreach ($cart_tokens as $cart_token) {
                    $cart_token->update([
                        'token_expiry' => $params['token_expiry'] ?? 0
                    ]);
                }
            }
            $cart = acadlix()->model()->courseCart()->where("cart_token", $params['cart_token'])->where('course_id', $params['course_id'])->first();
            if (!$cart) {
                $cart = acadlix()->model()->courseCart()->create([
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
                'redirect' => esc_url(get_permalink(acadlix()->helper()->acadlix_get_option('acadlix_checkout_page_id')))
            );
        } else {
            $cart = acadlix()->model()->courseCart()->where('user_id', $params['user_id'])->where('course_id', $params['course_id'])->first();
            if (!$cart) {
                $cart = acadlix()->model()->courseCart()->create([
                    'course_id' => $params['course_id'],
                    'user_id' => $params['user_id'],
                    'quantity' => 1,
                ]);
            }
            $res = array(
                'status' => 'success',
                'code' => array('status' => 200),
                'data' => $cart,
                'redirect' => esc_url(get_permalink(acadlix()->helper()->acadlix_get_option('acadlix_checkout_page_id')))
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
            return new WP_Error('no_data_found', __('Required course id and user_id', 'acadlix'), array('status' => 404));
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

            $cart_tokens = acadlix()->model()->courseCart()->where("cart_token", $params['cart_token'])->get();
            if (count($cart_tokens) > 0) {
                foreach ($cart_tokens as $cart_token) {
                    $cart_token->update([
                        'token_expiry' => $params['token_expiry'] ?? 0
                    ]);
                }
            }
            $cart = acadlix()->model()->courseCart()->where("cart_token", $params['cart_token'])->where('course_id', $params['course_id'])->first();
            if (!$cart) {
                $cart = acadlix()->model()->courseCart()->create([
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
                'redirect' => esc_url(get_permalink(acadlix()->helper()->acadlix_get_option('acadlix_checkout_page_id')))
            );
        } else {
            $userId = $params['user_id'];
            $course = acadlix()->model()->course()->ofCourse()->find($params['course_id']);
            if (!$course) {
                return new WP_Error('course_not_found', __('Course not found', 'acadlix'), array('status' => 404));
            }
            $order_items = acadlix()->model()->orderItem()
                ->with(['order','course'])
                ->whereHas('order', function ($query) use ($userId) {
                    $query->where('user_id', $userId)->where('status', 'success');
                })
                ->where('course_id', $params['course_id'])
                ->get();
            if (!$course->isPurchasedBy($userId)) {
                $order = acadlix()->model()->order()->create([
                    'user_id' => $userId,
                    'status' => 'pending',
                    'extra_charges' => 0,
                    'total_amount' => 0
                ]);
                $course = acadlix()->model()->course()->ofCourse()->find($params['course_id']);
                $order->order_items()->create([
                    'course_id' => $params['course_id'],
                    'course_title' => $course->post_title,
                    'quantity' => 1,
                    'price' => 0,
                    'discount' => 0,
                    'price_after_discount' => 0,
                    'additional_fee' => 0,
                    'tax' => 0,
                    'price_after_tax' => 0
                ]);

                $order->updateOrCreateMeta('payment_method', 'free');
                $order->update([
                    'status' => 'success',
                ]);
                // send mail on success
                acadlix()->helper()->course()->handleCoursePurchaseEmail($order->id);
                $res = array(
                    'status' => 'success',
                    'code' => array('status' => 200),
                    'redirect' => esc_url(get_permalink(acadlix()->helper()->acadlix_get_option('acadlix_dashboard_page_id')))
                );
            }
            $res = array(
                'status' => 'success',
                'code' => array('status' => 200),
                'redirect' => esc_url(get_permalink(acadlix()->helper()->acadlix_get_option('acadlix_dashboard_page_id')))
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
            return new WP_Error('no_data_found', __('Required course id and user_id', 'acadlix'), array('status' => 404));
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
        $course = acadlix()->model()->course()->find($params['course_id']);
        if (!$course) {
            return new WP_Error('missing_course', __('This Course is not available', 'acadlix'), array('status' => 404));
        }
        $user_meta = acadlix()->model()->userActivityMeta()->create([
            'user_id' => $params['user_id'],
            'type' => "course",
            'type_id' => $params['course_id'],
            'meta_key' => "wishlist", // phpcs:ignore
            'meta_value' => 1 // phpcs:ignore
        ]);
        $res = array(
            'status' => 'success',
            'code' => array('status' => 200),
            'data' => $user_meta
        );

        return rest_ensure_response($res);
    }

    public function post_remove_wishlist($request)
    {
        $errors = [];
        $required_fields = array('course_id', 'user_id');
        $params = $request->get_json_params();
        if (is_array($params) && count($params) == 0) {
            return new WP_Error('no_data_found', __('Required course id and user_id', 'acadlix'), array('status' => 404));
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

        $wishlist = acadlix()->model()->userActivityMeta()->ofCourse()
            ->ofCourseWishlist()
            ->where('type_id', $params['course_id'])
            ->where('user_id', $params['user_id'])
            ->first();
        if (!$wishlist) {
            return new WP_Error('missing_course', __('This Course is not available', 'acadlix'), array('status' => 404));
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