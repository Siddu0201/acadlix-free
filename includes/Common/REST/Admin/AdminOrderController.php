<?php

namespace Yuvayana\Acadlix\Common\REST\Admin;

use Yuvayana\Acadlix\Common\Models\Course;
use WP_Error;
use WP_REST_Request;
use WP_REST_Server;

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
                    'permission_callback' => fn() => current_user_can('acadlix_show_order') && $this->check_permission(),
                ],
                [
                    'methods' => WP_REST_Server::CREATABLE,
                    'callback' => [$this, 'post_create_order'],
                    'permission_callback' => fn() => current_user_can('acadlix_add_order') && $this->check_permission(),
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
                    'permission_callback' => fn() => current_user_can('acadlix_add_order') && $this->check_permission(),
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
                    'permission_callback' => fn() => current_user_can('acadlix_edit_order') && $this->check_permission(),
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
                    'permission_callback' => fn() => current_user_can('acadlix_edit_order') && $this->check_permission(),
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
                    'permission_callback' => fn() => current_user_can('acadlix_edit_order') && $this->check_permission(),
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
                    'permission_callback' => fn() => current_user_can('acadlix_edit_order') && $this->check_permission(),
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
                    'permission_callback' => fn() => current_user_can('acadlix_delete_order') && $this->check_permission(),
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
        $search = $params['search'] ?? '';
        $status = $params['status'] ?? '';
        $payment_method = $params['payment_method'] ?? '';

        $skip = $params['page'] * $params['pageSize'];
        $order = acadlix()->model()->order()->with(['order_items', 'order_metas', 'user'])->orderBy('ID', 'desc');

        if (!empty($search)) {
            $order->where(function ($query) use ($search) {
                $query
                    ->whereHas('order_items', function ($q) use ($search) {
                        $q->where('course_title', 'LIKE', "%{$search}%");
                    })
                    ->orWhereHas('order_metas', function ($q) use ($search) {
                        $q
                            ->whereIn('meta_key', ['razorpay_order_id', 'paypal_order_id', 'payu_txn_id', 'stripe_order_id'])
                            ->where('meta_value', 'LIKE', "%{$search}%");
                    })
                    ->orWhereHas('user', function ($q) use ($search) {
                        $q
                            ->where('display_name', 'LIKE', "%{$search}%")
                            ->orWhere('user_login', 'LIKE', "%{$search}%")
                            ->orWhere('user_email', 'LIKE', "%{$search}%");
                    });
            });
        }

        if (!empty($status)) {
            $order->where('status', $status);
        }

        if (!empty($payment_method)) {
            $order->whereHas('order_metas', function ($q) use ($payment_method) {
                $q
                    ->where('meta_key', 'payment_method')
                    ->where('meta_value', $payment_method);
            });
        }
        $res['total'] = $order->count();
        $res['orders'] = $order->skip($skip)->take($params['pageSize'])->get();
        return rest_ensure_response($res);
    }

    public function get_create_order($request)
    {
        $res = [];
        $res['courses'] = acadlix()
            ->model()
            ->course()
            ->ofCourse()
            ->ofPublish()
            ->without(['author', 'metas'])
            ->get(['ID', 'post_title'])
            ->each
            ->setAppends([
                'rendered_metas',
            ]);
        $res['users'] = acadlix()->model()->wpUsers()->get(['ID', 'display_name']);
        return rest_ensure_response($res);
    }

    public function get_order_courses($request)
    {
        $res = [];
        $params = $request->get_params();
        $search = $params['search'];

        if (!empty($search)) {
            $res['courses'] = acadlix()
                ->model()
                ->course()
                ->ofCourse()
                ->ofPublish()
                ->without(['author', 'metas'])
                ->where(function ($query) use ($search) {
                    $query->where('post_title', 'LIKE', "%{$search}%");
                })
                ->skip(0)
                ->take(50)
                ->get(['ID', 'post_title'])
                ->each
                ->setAppends([
                    'rendered_metas',
                ]);
        }
        return rest_ensure_response($res);
    }

    public function get_order_users($request)
    {
        $res = [];
        $params = $request->get_params();
        $search = $params['search'];

        if (!empty($search)) {
            $res['users'] = acadlix()
                ->model()
                ->wpUsers()
                ->with(['user_metas'])
                ->where(function ($query) use ($search) {
                    $query
                        ->where('display_name', 'LIKE', "%{$search}%")
                        ->orWhere('user_login', 'LIKE', "%{$search}%")
                        ->orWhere('user_email', 'LIKE', "%{$search}%");
                })
                ->skip(0)
                ->take(50)
                ->get(['ID', 'display_name', 'user_email', 'user_login']);
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
        $admin_id = $params['admin_id'];
        $billing_info = $params['billing_info'];

        if (empty($user_id)) {
            $errors[] = __('User id is required.', 'acadlix');
        }

        if (empty($order_items)) {
            $errors[] = __('Order items is required.', 'acadlix');
        }
        foreach ($order_items as $order_item) {
            if (!$order_item['course_id'])
                continue;
            $course = acadlix()->model()->course()->find($order_item['course_id']);
            if ($course->isPurchasedBy($user_id)) {
                /* translators: %s is the course title */
                $errors[] = sprintf(__('Course %s already purchased.', 'acadlix'), $order_item['course_title']);
            } else {
                $cartItem = acadlix()
                    ->model()
                    ->courseCart()
                    ->where('user_id', $user_id)
                    ->where('course_id', $order_item['course_id'])
                    ->first();
                if ($cartItem && $params['status'] == 'success') {
                    $cartItem->delete();
                }
            }
        }

        if (!empty($errors)) {
            return new WP_Error('missing_params', implode(' ', $errors), array('status' => 400));
        }

        $order = acadlix()->model()->order()->create([
            'user_id' => $user_id,
            'status' => $params['status'],
            'total_amount' => (float) $params['total_amount'],
        ]);
        $admin = get_userdata($admin_id);
        $message = "Order created by {$admin->display_name}";
        $order->createActivityLog($message);

        $message = "Order status updated to {$params['status']} by {$admin->display_name}";
        $order->createActivityLog($message);

        if ($order) {
            foreach ($order_items as $item) {
                $order->order_items()->create([
                    'course_id' => $item['course_id'],
                    'course_title' => $item['course_title'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                    'discount' => $item['discount'],
                    'price_after_discount' => $item['price_after_discount'],
                    'additional_fee' => $item['additional_fee'],
                    'tax' => $item['tax'],
                    'price_after_tax' => $item['price_after_tax'],
                ]);
            }
            $order->updateOrCreateMeta('billing_info', $billing_info);
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
        $res['order'] = acadlix()
            ->model()
            ->order()
            ->with([
                'order_items',
                'order_items.course',
                'order_metas',
                'user',
                'activity_logs'
            ])
            ->find($orderId);
        return rest_ensure_response($res);
    }

    public function update_order_by_id($request)
    {
        $res = [];
        $errors = [];
        $params = $request->get_params();
        $orderId = $request['order_id'];
        $user_id = $params['user_id'];
        // $order_items = $params['order_items'];
        $admin_id = $params['admin_id'];

        if (empty($orderId)) {
            $errors[] = __('Order id is required.', 'acadlix');
        }

        if (empty($user_id)) {
            $errors[] = __('User id is required.', 'acadlix');
        }

        // if (empty($order_items)) {
        //     $errors[] = __('Order items is required.', 'acadlix');
        // }

        // foreach ($order_items as $order_item) {
        //     if (!$order_item['course_id'])
        //         continue;
        //     $orderItem = acadlix()->model()->orderItem()
        //                 ->where('order_id', $orderId)
        //                 ->where('course_id', $order_item['course_id'])
        //                 ->first();
        //     if($orderItem){
        //        continue;
        //     }
        //     $course = acadlix()->model()->course()->ofCourse()->find($order_item['course_id']);
        //     if ($course->isPurchasedBy($user_id)) {
        //         /* translators: %s is the course title */
        //         $errors[] = sprintf(__('Course %s already purchased.', 'acadlix'), $order_item['course_title']);
        //     }
        //     $cartItem = acadlix()->model()->courseCart()
        //                 ->where('user_id', $user_id)
        //                 ->where('course_id', $order_item['course_id'])
        //                 ->first();
        //     if ($cartItem && $params['status'] == 'success') {
        //         $cartItem->delete();
        //     }
        // }

        if (!empty($errors)) {
            return new WP_Error('missing_params', implode(' ', $errors), array('status' => 400));
        }

        $order = acadlix()->model()->order()->find($orderId);
        if ($order) {
            $order->update([
                'user_id' => $user_id,
                'status' => $params['status'],
                // 'total_amount' => (float) $params['total_amount'],
            ]);
            $admin = get_userdata($admin_id);
            $message = "Order status updated to {$params['status']} by {$admin->display_name}";
            $order->createActivityLog($message);

            // $course_ids = array_column($order_items, 'course_id');
            // $order->order_items()->whereNotIn('course_id', $course_ids)->delete();
            // foreach ($order_items as $item) {
            //     if (!$item['course_id'])
            //         continue;
            //     $order->order_items()->updateOrCreate([
            //         'course_id' => $item['course_id'],
            //     ], [
            //         'course_title' => $item['course_title'],
            //         'quantity' => $item['quantity'],
            //         'price' => $item['price'],
            //         'discount' => $item['discount'],
            //         'price_after_discount' => $item['price_after_discount'],
            //         'additional_fee' => $item['additional_fee'],
            //         'tax' => $item['tax'],
            //         'price_after_tax' => $item['price_after_tax'],
            //     ]);
            // }

            // $order->updateOrCreateMeta('payment_method', $params['meta']['payment_method']);
            // $order->updateOrCreateMeta('is_free', (bool) $params['meta']['is_free']);
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

        $order = acadlix()->model()->order()->find($order_id);
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
