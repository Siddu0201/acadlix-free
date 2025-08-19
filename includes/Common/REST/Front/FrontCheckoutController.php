<?php

namespace Yuvayana\Acadlix\Common\REST\Front;

use WP_REST_Server;
use WP_REST_Request;
use WP_REST_Response;
use WP_Error;
use Exception;

defined('ABSPATH') || exit();

class FrontCheckoutController
{
    protected $namespace = 'acadlix/v1';

    protected $base = 'front-checkout';

    public function register_routes()
    {
        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/get-checkout-cart',
            [
                [
                    'methods' => WP_REST_Server::READABLE,
                    'callback' => [$this, 'get_checkout_cart'],
                    'permission_callback' => [$this, 'check_permission'],
                ],
            ]
        );

        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/delete-course-from-cart',
            [
                [
                    'methods' => WP_REST_Server::DELETABLE,
                    'callback' => [$this, 'delete_course_from_cart'],
                    'permission_callback' => function (WP_REST_Request $request) {
                        if (wp_verify_nonce($request->get_header('X-WP-Nonce'), 'wp_rest')) {
                            return true;
                        }
                        return false;
                    },
                ],
            ]
        );

        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/post-checkout-razorpay',
            [
                [
                    'methods' => WP_REST_Server::CREATABLE,
                    'callback' => [$this, 'post_checkout_razorpay'],
                    'permission_callback' => [$this, 'check_permission'],
                ],
            ]
        );

        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/post-checkout-paypal',
            [
                [
                    'methods' => WP_REST_Server::CREATABLE,
                    'callback' => [$this, 'post_checkout_paypal'],
                    'permission_callback' => [$this, 'check_permission'],
                ],
            ]
        );

        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/post-checkout-payu',
            [
                [
                    'methods' => WP_REST_Server::CREATABLE,
                    'callback' => [$this, 'post_checkout_payu'],
                    'permission_callback' => [$this, 'check_permission'],
                ],
            ]
        );

        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/post-free-checkout',
            [
                [
                    'methods' => WP_REST_Server::CREATABLE,
                    'callback' => [$this, 'post_free_checkout'],
                    'permission_callback' => [$this, 'check_permission'],
                ],
            ]
        );

        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/post-checkout-stripe',
            [
                [
                    'methods' => WP_REST_Server::CREATABLE,
                    'callback' => [$this, 'post_checkout_stripe'],
                    'permission_callback' => [$this, 'check_permission'],
                ],
            ]
        );
        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/handle-webhook',
            [
                [
                    'methods' => WP_REST_Server::ALLMETHODS,
                    'callback' => [$this, 'handle_webhook'],
                    'permission_callback' => [$this, 'check_permission'],
                ],
            ]
        );
    }


    /**
     * Get user cart.
     *
     * @param int $userId
     *
     * @return array
     */
    public function get_user_cart($userId)
    {
        $cart = acadlix()->model()->courseCart()->where('user_id', $userId)
            ->get();

        $result = [
            'cart' => $cart,
        ];

        foreach ($cart as $key => $item) {
            $errors = [];
            $orderItem = acadlix()->model()->orderItem()->whereHas('order', function ($query) use ($userId) {
                $query->where('user_id', $userId)->where('status', 'success');
            })->where('course_id', $item->course_id)
                ->get();

            if ($orderItem->count() > 0) {
                $errors[] = __('Course already purchased.', 'acadlix');
            }

            $checkRegistrationDate = acadlix()->helper()->course()->checkRegistrationDate(
                $item->course->start_date,
                $item->course->end_date
            );

            if (!$checkRegistrationDate['status']) {
                $errors[] = $checkRegistrationDate['message'];
            }

            $result['cart'][$key]['errors'] = $errors;
        }

        return $result;
    }

    public function get_checkout_cart($request)
    {
        $res = [];
        $params = $request->get_params();
        $userId = $params['user_id'];
        if ($userId != 0) {
            $res = $this->get_user_cart($userId);
        } else {
            $res['cart'] = !empty($params['cart_token']) ? acadlix()->model()->courseCart()->where("cart_token", $params['cart_token'])->get() : [];
        }
        return rest_ensure_response($res);
    }

    public function delete_course_from_cart($request)
    {
        $res = [];

        if ($request->get_param("id") == 0) {
            return new WP_Error("cart_id_not_found", __('Cart id is required.', 'acadlix'), array('status' => 404));
        }

        $cart = acadlix()->model()->courseCart()->find($request->get_param("id"));
        if (!$cart) {
            return new WP_Error("cart_not_found", __('No course found.', 'acadlix'), array('status' => 404));
        }
        $cart->delete();

        if ($cart->user_id != 0) {
            $res = $this->get_user_cart($cart->user_id);
        } else {
            $res['cart'] = acadlix()->model()->courseCart()->where("cart_token", $cart->cart_token)->get();
        }

        return rest_ensure_response($res);
    }

    public function post_checkout_razorpay($request)
    {
        try {
            $required_fields = array('currency', 'user_id', 'total_amount', 'amount');
            $params = $request->get_json_params();
            if (is_array($params) && count($params) == 0) {
                throw new Exception(__('Required course id and user_id', 'acadlix'), 404);
            }

            if ($request->get_param("payment_method") != "razorpay") {
                throw new Exception(__('Unacceptable payment gateway', 'acadlix'), 404);
            }

            if (empty($request->get_param("order_items")) && count($request->get_param("order_items")) == 0) {
                throw new Exception(__('No order found', 'acadlix'), 404);
            }

            foreach ($required_fields as $field) {
                $param = $request->get_param($field);

                if (empty($param)) {
                    /* translators: %s is the required field */
                    $errors[] = sprintf(__('The %s parameter is required.', 'acadlix'), $field);
                }
            }

            if (!empty($errors)) {
                throw new Exception(implode(' ', $errors), 400);
            }

            $response = acadlix()->payments()->razorpay()
                ->setAmount($request->get_param('amount'))
                ->setCurrency($request->get_param('currency'))
                ->setBillingInfo($request->get_param('billing_info'))
                ->processOrder();

            if ($response && $response['order_id']) {
                $order = acadlix()->model()->order()->create([
                    'user_id' => $request->get_param('user_id'),
                    'status' => "pending",
                    'total_amount' => $request->get_param('total_amount'),
                ]);
                $message = "Razorpay OrderId: {$response['order_id']}";
                $order->createActivityLog($message);

                if ($order) {
                    foreach ($request->get_param("order_items") as $item) {
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

                    if (!empty($request->get_param("billing_info"))) {
                        $order->updateOrCreateMeta("billing_info", wp_json_encode($request->get_param("billing_info")));
                    }

                    $order->updateOrCreateMeta('payment_method', $request->get_param("payment_method"));
                    $order->updateOrCreateMeta('currency', $request->get_param("currency"));
                    $order->updateOrCreateMeta('razorpay_order_id', $response['order_id']);
                    $order->updateOrCreateMeta('razorpay_amount', $request->get_param('amount'));
                }
            }
            // Send back the order data to the frontend
            return rest_ensure_response($response);
        } catch (Exception $e) {
            return new WP_Error('error', $e->getMessage(), array('status' => 400));
        }
    }

    public function post_checkout_paypal($request)
    {
        try {
            $required_fields = array('currency', 'user_id', 'total_amount');
            $params = $request->get_json_params();
            if (is_array($params) && count($params) == 0) {
                throw new Exception('No data found');
            }

            if ($request->get_param("payment_method") != "paypal") {
                throw new Exception('Unacceptable payment gateway');
            }

            if (empty($request->get_param("order_items")) && count($request->get_param("order_items")) == 0) {
                throw new Exception('No order found');
            }

            foreach ($required_fields as $field) {
                $param = $request->get_param($field);

                if (empty($param)) {
                    /* translators: %s is the required field */
                    $errors[] = sprintf(__('The %s parameter is required.', 'acadlix'), $field);
                }
            }

            if (!empty($errors)) {
                throw new Exception(implode(' ', $errors));
            }

            $response = acadlix()->payments()->paypal()
                ->setAmount($request->get_param("total_amount"))
                ->setCurrency($request->get_param("currency"))
                ->setBillingInfo($request->get_param("billing_info"))
                ->setOrderItems($request->get_param("order_items"))
                ->processOrder();

            $paypal_order_id = $response->id ?? null;
            // Check if the order was successfully created
            if ($response && $paypal_order_id && $response->redirect_url) {
                $order = acadlix()->model()->order()->create([
                    'user_id' => $request->get_param('user_id'),
                    'status' => "pending",
                    'total_amount' => $request->get_param('total_amount'),
                ]);

                $message = "PayPal OrderId: {$paypal_order_id}";
                $order->createActivityLog($message);

                if ($order) {
                    foreach ($request->get_param("order_items") as $item) {
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

                    if (!empty($request->get_param("billing_info"))) {
                        $order->updateOrCreateMeta("billing_info", wp_json_encode($request->get_param("billing_info")));
                    }
                    $order->updateOrCreateMeta('payment_method', $request->get_param("payment_method"));
                    $order->updateOrCreateMeta('currency', $request->get_param("currency"));
                    $order->updateOrCreateMeta('paypal_order_id', $paypal_order_id);
                    $order->updateOrCreateMeta('paypal_amount', $request->get_param('total_amount'));
                }
                // Return PayPal order ID for further processing
                return rest_ensure_response([
                    'redirect_url' => $response->redirect_url
                ]);
            } else {
                // Handle error in creating the order
                throw new Exception('Error creating PayPal order');
            }
        } catch (Exception $e) {
            return new WP_Error('error', $e->getMessage(), array('status' => 400));
        }
    }

    public function post_checkout_payu($request)
    {
        try {
            $required_fields = array('currency', 'user_id', 'total_amount');
            $params = $request->get_json_params();
            if (is_array($params) && count($params) == 0) {
                throw new Exception('No data found');
            }

            if ($request->get_param("payment_method") != "payu") {
                throw new Exception('Unacceptable payment gateway');
            }

            if (empty($request->get_param("order_items")) && count($request->get_param("order_items")) == 0) {
                throw new Exception('No order found');
            }

            foreach ($required_fields as $field) {
                $param = $request->get_param($field);

                if (empty($param)) {
                    /* translators: %s is the required field */
                    $errors[] = sprintf(__('The %s parameter is required.', 'acadlix'), $field);
                }
            }

            if (!empty($errors)) {
                throw new Exception('Missing parameters');
            }

            $response = acadlix()->payments()->payu()
                ->setAmount($request->get_param("total_amount"))
                ->setCurrency($request->get_param("currency"))
                ->setBillingInfo($request->get_param("billing_info"))
                ->processOrder();

            if ($response && !empty($response['payu_url'])) {
                $order = acadlix()->model()->order()->create([
                    'user_id' => $request->get_param('user_id'),
                    'status' => "pending",
                    'total_amount' => $request->get_param('total_amount'),
                ]);

                $message = "PayU txn id: {$response['payu_data']['txnid']}";
                $order->createActivityLog($message);

                if ($order) {
                    foreach ($request->get_param("order_items") as $item) {
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

                    if (!empty($request->get_param("billing_info"))) {
                        $order->updateOrCreateMeta("billing_info", wp_json_encode($request->get_param("billing_info")));
                    }

                    $order->updateOrCreateMeta('payment_method', $request->get_param("payment_method"));
                    $order->updateOrCreateMeta('currency', $request->get_param("currency"));
                    $order->updateOrCreateMeta('payu_txn_id', $response['payu_data']['txnid']);
                    $order->updateOrCreateMeta('payu_amount', $request->get_param('total_amount'));
                }
                return rest_ensure_response([
                    'payment_url' => $response['payu_url'],
                    'formData' => $response['payu_data'],
                ]);
            } else {
                throw new Exception('Error creating PayU order');
            }
        } catch (Exception $e) {
            return new WP_Error('error', $e->getMessage(), array('status' => 400));
        }
    }

    public function post_checkout_stripe($request)
    {
        try {
            $required_fields = array('currency', 'user_id', 'total_amount', 'amount');
            $params = $request->get_json_params();
            if (is_array($params) && count($params) == 0) {
                throw new Exception('No data found');
            }

            if ($request->get_param("payment_method") != "stripe") {
                throw new Exception('Unacceptable payment gateway');
            }

            if (empty($request->get_param("order_items")) && count($request->get_param("order_items")) == 0) {
                throw new Exception('No order found');
            }

            foreach ($required_fields as $field) {
                $param = $request->get_param($field);

                if (empty($param)) {
                    /* translators: %s is the required field */
                    $errors[] = sprintf(__('The %s parameter is required.', 'acadlix'), $field);
                }
            }

            if (!empty($errors)) {
                throw new Exception(implode(' ', $errors));
            }

            $response = acadlix()->payments()->stripe()
                ->setAmount($request->get_param("amount"))
                ->setCurrency($request->get_param("currency"))
                ->setBillingInfo($request->get_param("billing_info"))
                ->processOrder();

            // Check if the order was successfully created
            if ($response && $response->id && $response->url) {
                $order = acadlix()->model()->order()->create([
                    'user_id' => $request->get_param('user_id'),
                    'status' => "pending",
                    'total_amount' => $request->get_param('total_amount'),
                ]);
                $message = "Stripe OrderId: {$response->id}";
                $order->createActivityLog($message);

                if ($order) {
                    foreach ($request->get_param("order_items") as $item) {
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

                    if (!empty($request->get_param("billing_info"))) {
                        $order->updateOrCreateMeta("billing_info", wp_json_encode($request->get_param("billing_info")));
                    }
                    $order->updateOrCreateMeta('payment_method', $request->get_param("payment_method"));
                    $order->updateOrCreateMeta('currency', $request->get_param("currency"));
                    $order->updateOrCreateMeta('stripe_order_id', $response->id);
                    $order->updateOrCreateMeta('stripe_amount', $request->get_param('amount'));
                }
                // Return PayPal order ID for further processing
                return rest_ensure_response([
                    'orderId' => $response->id,
                    'redirect_url' => $response->url
                ]);
            } else {
                // Handle error in creating the order
                throw new Exception('Error creating Stripe order');
            }
        } catch (Exception $e) {
            return new WP_Error('error', $e->getMessage(), array('status' => 400));
        }
    }

    public function post_free_checkout($request)
    {
        $required_fields = array('currency', 'user_id');
        $params = $request->get_json_params();
        if (is_array($params) && count($params) == 0) {
            return new WP_Error('no_data_found', __('Required course id and user_id', 'acadlix'), array('status' => 404));
        }

        if (empty($request->get_param("order_items")) && count($request->get_param("order_items")) == 0) {
            return new WP_Error('no_order_found', __('No order found', 'acadlix'), array('status' => 404));
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

        $order = acadlix()->model()->order()->create([
            'user_id' => $request->get_param('user_id'),
            'status' => "pending",
            'total_amount' => $request->get_param('total_amount'),
        ]);

        $message = "Free OrderId: {$order->id}";
        $order->createActivityLog($message);

        if ($order) {
            foreach ($request->get_param("order_items") as $item) {
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

            if (!empty($request->get_param("billing_info"))) {
                $order->updateOrCreateMeta("billing_info", wp_json_encode($request->get_param("billing_info")));
            }

            $order->updateOrCreateMeta('payment_method', $request->get_param("payment_method"));
            $order->update([
                'status' => 'success',
            ]);
            $message = "Order status updated to success";
            $order->createActivityLog($message);
            if ($order->order_items()->count() > 0) {
                foreach ($order->order_items as $item) {
                    $cart = acadlix()->model()->courseCart()->where("user_id", $order->user_id)->where("course_id", $item->course_id)->first();
                    $cart->delete();
                }
            }
            // send mail on success
            acadlix()->helper()->course()->handleCoursePurchaseEmail($order->id);
        }
        return rest_ensure_response([
            'status' => 'success',
        ]);
    }

    public function handle_webhook()
    {
        try {

            $webhook_data = array(
                'get' => $_GET,
                'post' => $_POST,
                'server' => $_SERVER,
                'stream' => file_get_contents('php://input'),
            );
            $payment_method = $webhook_data['get']['payment_method'] ?? null;

            $res = [];
            switch ($payment_method) {
                case 'razorpay':
                    $res = acadlix()->payments()->razorpay()->verifyWebhook($webhook_data);
                    break;
                case 'paypal':
                    $res = acadlix()->payments()->paypal()->verifyWebhook($webhook_data);
                    break;
                case 'payu':
                    $res = acadlix()->payments()->payu()->verifyWebhook($webhook_data);
                    break;
                case 'stripe':
                    $res = acadlix()->payments()->stripe()->verifyWebhook($webhook_data);
                    break;
                default:
                    break;
            }
            return $res;
        } catch (Exception $e) {
            return new WP_Error('error', $e->getMessage(), array('status' => 400));
        }
    }

    public function check_permission()
    {
        return true;
    }

}