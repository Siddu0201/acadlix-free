<?php

namespace Yuvayana\Acadlix\REST\Admin;

use WP_Error;
use WP_REST_Server;
use WP_REST_Request;
use Yuvayana\Acadlix\Models\Course;
use Yuvayana\Acadlix\Models\Order;
use Yuvayana\Acadlix\Models\OrderItem;
use Yuvayana\Acadlix\Models\WpUsers;


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
                [
                    'methods' => WP_REST_Server::CREATABLE,
                    'callback' => [$this, 'post_create_order'],
                    'permission_callback' => [$this, 'check_permission'],
                ],
            ]
        );

        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/create',
            [
                [
                    'methods' => WP_REST_Server::READABLE,
                    'callback' => [$this, 'get_create_order'],
                    'permission_callback' => [$this, 'check_permission'],
                ],
            ]
        );

        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/courses',
            [
                [
                    'methods' => WP_REST_Server::READABLE,
                    'callback' => [$this, 'get_order_courses'],
                    'permission_callback' => [$this, 'check_permission'],
                ],
            ]
        );

        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/users',
            [
                [
                    'methods' => WP_REST_Server::READABLE,
                    'callback' => [$this, 'get_order_users'],
                    'permission_callback' => [$this, 'check_permission'],
                ],
            ]
        );

        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/(?P<order_id>[\d]+)',
            [
                [
                    'methods' => WP_REST_Server::READABLE,
                    'callback' => [$this, 'get_order_by_id'],
                    'permission_callback' => [$this, 'check_permission'],
                    'args' => array(
                        'order_id' => array(
                            'validate_callback' => function ($param, $request, $key) {
                                return is_numeric($param);
                            }
                        ),
                    ),
                ],
                [
                    'methods' => WP_REST_Server::EDITABLE,
                    'callback' => [$this, 'update_order_by_id'],
                    'permission_callback' => [$this, 'check_permission'],
                    'args' => array(
                        'order_id' => array(
                            'validate_callback' => function ($param, $request, $key) {
                                return is_numeric($param);
                            }
                        ),
                    ),
                ],
                [
                    'methods' => WP_REST_Server::DELETABLE,
                    'callback' => [$this, 'delete_order_by_id'],
                    'permission_callback' => function (WP_REST_Request $request) {
                        if (wp_verify_nonce($request->get_header('X-WP-Nonce'), 'wp_rest')) {
                            return true;
                        }
                        return false;
                    },
                    'args' => array(
                        'order_id' => array(
                            'validate_callback' => function ($param, $request, $key) {
                                return is_numeric($param);
                            }
                        ),
                    ),
                ],
            ]
        );

    }

    public function get_orders($request)
    {
        $res = [];
        $params = $request->get_params();
        $search = $params['search'] ?? "";

        $skip = $params['page'] * $params['pageSize'];
        $order = Order::with(['order_items', 'order_metas', 'user'])->orderBy('created_at', 'desc');

        if (!empty($search)) {
            $order->whereHas('order_items', function ($query) use ($search) {
                $query->where('course_title', 'LIKE', "%{$search}%"); // Search in course_title
            })
            ->orWhereHas('order_metas', function ($query) use ($search) {
                $query->whereIn('meta_key', ['razorpay_order_id', 'paypal_order_id', 'payu_txn_id'])
                        ->where('meta_value', 'LIKE', "%{$search}%"); // Search in transaction_id
            })
            ->orWhereHas('user', function ($query) use ($search) {
                $query->where('display_name', 'LIKE', "%{$search}%") // Search in user_name
                      ->orWhere('user_login', 'LIKE', "%{$search}%") // Search in user_login
                      ->orWhere('user_email', 'LIKE', "%{$search}%"); // Search in user_email
            });
        }
        $res['total'] = $order->count();
        $res['orders'] = $order->skip($skip)->take($params['pageSize'])->get();
        return rest_ensure_response($res);
    }

    public function get_create_order($request)
    {
        $res = [];
        $res['courses'] = Course::ofCourse()
            ->ofPublish()
            ->without(['author', 'metas'])
            ->get(["ID", "post_title"])
            ->each
            ->setAppends(['rendered_metas',]);
        $res['users'] = WpUsers::get(["ID", "display_name"]);
        return rest_ensure_response($res);
    }

    public function get_order_courses($request)
    {
        $res = [];
        $params = $request->get_params();
        $search = $params['search'];

        if (!empty($search)) {
            $res['courses'] = Course::ofCourse()
                ->ofPublish()
                ->without(['author', 'metas'])
                ->where(function ($query) use ($search) {
                    $query->where('post_title', 'LIKE', "%{$search}%");
                })
                ->skip(0)
                ->take(50)
                ->get(["ID", "post_title"])
                ->each
                ->setAppends(['rendered_metas',]);
        }
        return rest_ensure_response($res);
    }

    public function get_order_users($request)
    {
        $res = [];
        $params = $request->get_params();
        $search = $params['search'];

        if (!empty($search)) {
            $res['users'] = WpUsers::skip(0)
                ->take(50)
                ->where(function ($query) use ($search) {
                    $query->where('display_name', 'LIKE', "%{$search}%")
                        ->orWhere('user_login', 'LIKE', "%{$search}%")
                        ->orWhere('user_email', 'LIKE', "%{$search}%");
                })
                ->get(["ID", "display_name", "user_email", "user_login"]);
        }
        return rest_ensure_response($res);
    }

    public function post_create_order($request)
    {
        $res = [];
        $errors = [];
        $params = $request->get_params();
        $user_id = $params['user_id'];
        $order_items = $params['order_items'];

        if (empty($user_id)) {
            $errors[] = __('User id is required.', 'acadlix');
        }

        if (empty($order_items)) {
            $errors[] = __('Order items is required.', 'acadlix');
        }
        foreach ($order_items as $order_item) {
            if(!$order_item['course_id']) continue;
            $alreadyPurchased = OrderItem::with('order')->whereHas('order', function ($query) use ($user_id) {
                $query->ofSuccess()->where('user_id', $user_id);
            })->where('course_id', $order_item['course_id'])->exists();
            if ($alreadyPurchased) {
                /* translators: %s is the course title */
                $errors[] = sprintf(__('%s already purchased.', 'acadlix'), $order_item['course_title']);
            }
        }

        if (!empty($errors)) {
            return new WP_Error('missing_params', implode(' ', $errors), array('status' => 400));
        }

        $order = Order::create([
            'user_id' => $user_id,
            'status' => $params['status'],
            'total_amount' => (float) $params['total_amount'],
        ]);

        if ($order) {
            foreach ($order_items as $item) {
                $order->order_items()->create([
                    'course_id' => $item['course_id'],
                    'course_title' => $item['course_title'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                    'discount' => $item['discount'],
                    'price_after_discount' => $item['price_after_discount'],
                    'tax' => $item['tax'],
                    'price_after_tax' => $item['price_after_tax'],
                ]);
            }

            $order->updateOrCreateMeta('payment_method', $params['meta']['payment_method']);
            $order->updateOrCreateMeta('is_free', $params['meta']['is_free']);
        }
        return rest_ensure_response($res);
    }

    public function get_order_by_id($request)
    {
        $res = [];
        $orderId = $request['order_id'];

        // Validate required fields
        if (empty($orderId)) {
            return new WP_Error(
                'missing_id',
                __('Order id is required.', 'acadlix'),
                ['status' => 400]
            );
        }
        $res['order'] = Order::with(['order_items', 'order_items.course', 'order_metas', 'user'])->find($orderId);
        return rest_ensure_response($res);
    }

    public function update_order_by_id($request)
    {
        $res = [];
        $errors = [];
        $params = $request->get_params();
        $orderId = $request['order_id'];
        $user_id = $params['user_id'];
        $order_items = $params['order_items'];

        if (empty($orderId)) {
            $errors[] = __('Order id is required.', 'acadlix');
        }

        if (empty($user_id)) {
            $errors[] = __('User id is required.', 'acadlix');
        }

        if (empty($order_items)) {
            $errors[] = __('Order items is required.', 'acadlix');
        }

        foreach ($order_items as $order_item) {
            if(!$order_item['course_id']) continue;
            $alreadyPurchased = OrderItem::with('order')->whereHas('order', function ($query) use ($user_id, $orderId) {
                $query->ofSuccess()->where('user_id', $user_id)->whereNot('id', $orderId);
            })->where('course_id', $order_item['course_id'])->exists();
            if ($alreadyPurchased) {
                /* translators: %s is the course title */
                $errors[] = sprintf(__('%s already purchased.', 'acadlix'), $order_item['course_title']);
            }
        }

        if (!empty($errors)) {
            return new WP_Error('missing_params', implode(' ', $errors), array('status' => 400));
        }

        $order = Order::find($orderId);
        if ($order) {
            $order->update([
                'user_id' => $user_id,
                'status' => $params['status'],
                'total_amount' => (float) $params['total_amount'],
            ]);
            $course_ids = array_column($order_items, 'course_id');
            $order->order_items()->whereNotIn('course_id', $course_ids)->delete();
            foreach ($order_items as $item) {
                if(!$item['course_id']) continue;
                $order->order_items()->updateOrCreate([
                    'course_id' => $item['course_id'],
                ], [
                    'course_title' => $item['course_title'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                    'discount' => $item['discount'],
                    'price_after_discount' => $item['price_after_discount'],
                    'tax' => $item['tax'],
                    'price_after_tax' => $item['price_after_tax'],
                ]);
            }

            $order->updateOrCreateMeta('payment_method', $params['meta']['payment_method']);
            $order->updateOrCreateMeta('is_free', (bool)$params['meta']['is_free']);
        }

        return rest_ensure_response($res);
    }

    public function delete_order_by_id($request)
    {
        $res = [];
        $order_id = $request['order_id'];
        // Validate required fields
        if (empty($order_id)) {
            return new WP_Error(
                'missing_id',
                __('Order id is required.', 'acadlix'),
                ['status' => 400]
            );
        }

        $order = Order::find($order_id);
        if ($order) {
            $order->delete();
        }
        $res['message'] = __('Order successfully deleted.', 'acadlix');
        return rest_ensure_response($res);
    }

    public function check_permission()
    {
        return true;
    }
}