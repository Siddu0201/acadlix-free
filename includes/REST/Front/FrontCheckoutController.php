<?php

namespace Yuvayana\Acadlix\REST\Front;

use WP_REST_Server;
use WP_REST_Request;
use WP_Error;
use Yuvayana\Acadlix\Helper\CourseHelper;
use Yuvayana\Acadlix\Helper\Helper;
use Yuvayana\Acadlix\Models\CourseCart;
use Yuvayana\Acadlix\Models\Order;
use Yuvayana\Acadlix\Models\OrderItem;
use Yuvayana\Acadlix\Models\OrderMeta;

defined('ABSPATH') || exit();

class FrontCheckoutController
{
    protected $namespace = 'acadlix/v1';

    protected $base = 'front-checkout';

    private $razorpay_url = 'https://api.razorpay.com/v1/orders';

    private $paypal_sandbox_url = 'https://api-m.sandbox.paypal.com/v2/checkout/orders';

    private $paypal_url = 'https://api-m.paypal.com/v2/checkout/orders';

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
            '/' . $this->base . '/post-verify-razorpay-payment',
            [
                [
                    'methods' => WP_REST_Server::CREATABLE,
                    'callback' => [$this, 'post_verify_razorpay_payment'],
                    'permission_callback' => [$this, 'check_permission'],
                ],
            ]
        );

        register_rest_route(
            $this->namespace,
            '/' . $this->base . '/post-fail-razorpay-payment',
            [
                [
                    'methods' => WP_REST_Server::CREATABLE,
                    'callback' => [$this, 'post_fail_razorpay_payment'],
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
        $cart = CourseCart::where('user_id', $userId)
            ->get();

        $result = [
            'cart' => $cart,
        ];

        foreach ($cart as $key => $item) {
            $errors = [];
            $orderItem = OrderItem::whereHas('order', function ($query) use ($userId) {
                $query->where('user_id', $userId)->where('status', 'success');
            })->where('course_id', $item->course_id)
                ->get();

            if ($orderItem->count() > 0) {
                $errors[] = __('Course already purchased.', 'acadlix');
            }

            $checkRegistrationDate = CourseHelper::instance()->checkRegistrationDate(
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
            $res['cart'] = !empty($params['cart_token']) ? CourseCart::where("cart_token", $params['cart_token'])->get() : [];
        }
        return rest_ensure_response($res);
    }

    public function delete_course_from_cart($request)
    {
        $res = [];

        if ($request->get_param("id") == 0) {
            return new WP_Error("cart_id_not_found", __('Cart id is required.', 'acadlix'), array('status' => 404));
        }

        $cart = CourseCart::find($request->get_param("id"));
        if (!$cart) {
            return new WP_Error("cart_not_found", __('No course found.', 'acadlix'), array('status' => 404));
        }
        $cart->delete();

        if ($cart->user_id != 0) {
            $res = $this->get_user_cart($cart->user_id);
        } else {
            $res['cart'] = CourseCart::where("cart_token", $cart->cart_token)->get();
        }

        return rest_ensure_response($res);
    }

    public function post_checkout_razorpay($request)
    {
        $razorpay_key = Helper::instance()->acadlix_get_option('acadlix_razorpay_client_id');
        $razorpay_secret = Helper::instance()->acadlix_get_option('acadlix_razorpay_secret_key');

        $required_fields = array('currency', 'user_id');
        $params = $request->get_json_params();
        if (is_array($params) && count($params) == 0) {
            return new WP_Error('no_data_found', __('Required course id and user_id', 'acadlix'), array('status' => 404));
        }

        if ($request->get_param("payment_method") != "razorpay") {
            return new WP_Error('unacceptable_payment_gateway', __('Unacceptable payment gateway', 'acadlix'), array('status' => 404));
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

        $receipt_number = 'receipt#' . time();
        $order_data = [
            'amount' => $request->get_param("amount"), // Example amount in paise (5000 paise = 50 INR)
            'currency' => $request->get_param("currency"),
            'receipt' => $receipt_number,
            'payment_capture' => 1 // Auto capture
        ];

        // Create the HTTP request headers
        $headers = [
            'Authorization' => 'Basic ' . base64_encode($razorpay_key . ':' . $razorpay_secret),
            'Content-Type' => 'application/json'
        ];

        $response = wp_remote_post($this->razorpay_url, [
            'headers' => $headers,
            'body' => wp_json_encode($order_data),
            'method' => 'POST'
        ]);

        if (is_wp_error($response)) {
            wp_send_json_error(['message' => __('Error creating Razorpay order.', 'acadlix')]);
        } else {
            $body = wp_remote_retrieve_body($response);
            $data = json_decode($body, true);

            if ($data) {
                $order = Order::create([
                    'user_id' => $request->get_param('user_id'),
                    'status' => "pending",
                    'total_amount' => $request->get_param('total_amount'),
                ]);

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
                    $order->updateOrCreateMeta('razorpay_order_id', $data['id']);
                    $order->updateOrCreateMeta('razorpay_receipt_id', $receipt_number);
                    $order->updateOrCreateMeta('razorpay_amount', $request->get_param('amount'));
                }
            }
            // Send back the order data to the frontend
            wp_send_json_success($data);
        }
    }

    public function post_verify_razorpay_payment($request)
    {
        $razorpay_secret = Helper::instance()->acadlix_get_option('acadlix_razorpay_secret_key');

        $required_fields = array('razorpay_payment_id', 'razorpay_order_id', 'razorpay_signature');

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
        $order_meta = OrderMeta::where("meta_value", $request->get_param("razorpay_order_id"))->first();
        $order = Order::find($order_meta->order_id);
        $generated_signature = hash_hmac('sha256', $request->get_param('razorpay_order_id') . '|' . $request->get_param('razorpay_payment_id'), $razorpay_secret);
        if ($generated_signature === $request->get_param("razorpay_signature")) {
            // Payment is verified
            if ($order) {
                $order->update([
                    'status' => 'success'
                ]);
                if ($order->order_items()->count() > 0) {
                    foreach ($order->order_items as $item) {
                        $cart = CourseCart::where("user_id", $order->user_id)->where("course_id", $item->course_id)->first();
                        $cart->delete();
                    }
                }
                // send mail on success
                CourseHelper::instance()->handleCoursePurchaseEmail($order->id);
            }
            $order->updateOrCreateMeta("razorpay_payment_id", $request->get_param("razorpay_payment_id"));
            $order->updateOrCreateMeta("razorpay_signature", $request->get_param("razorpay_signature"));
            wp_send_json_success(['message' => __('Payment verified successfully.', 'acadlix'), 'razorpay_order_id' => $request->get_param("razorpay_order_id")]);
        } else {
            $order->update([
                'status' => 'failed'
            ]);
            $order->updateOrCreateMeta("message", __('Payment verification failed.', 'acadlix'));
            // send mail on failed
            CourseHelper::instance()->handleFailedTransationEmail($order->id);
            wp_send_json_error(['message' => __('Payment verification failed.', 'acadlix')]);
        }
    }

    public function post_fail_razorpay_payment($request)
    {
        $required_fields = array('razorpay_order_id');

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
        $order_meta = OrderMeta::where("meta_value", $request->get_param("razorpay_order_id"))->first();
        $order = Order::find($order_meta->order_id);
        $order->update([
            "status" => "failed"
        ]);
        $order->updateOrCreateMeta("message", __('Payment verification failed.', 'acadlix'));
        // send mail on failed
        CourseHelper::instance()->handleFailedTransationEmail($order->id);
        return rest_ensure_response(["success" => true]);
    }

    public function post_checkout_paypal($request)
    {
        $client_id = Helper::instance()->acadlix_get_option("acadlix_paypal_client_id"); // Your PayPal Client ID
        $secret = Helper::instance()->acadlix_get_option("acadlix_paypal_secret_key");      // Your PayPal Secret
        $is_sandbox = Helper::instance()->acadlix_get_option("acadlix_paypal_sandbox") == "yes";  // Use sandbox for testing

        $required_fields = array('currency', 'user_id');
        $params = $request->get_json_params();
        if (is_array($params) && count($params) == 0) {
            return new WP_Error('no_data_found', __('Required course id and user_id', 'acadlix'), array('status' => 404));
        }

        if ($request->get_param("payment_method") != "paypal") {
            return new WP_Error('unacceptable_payment_gateway', __('Unacceptable payment gateway', 'acadlix'), array('status' => 404));
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

        $url = $is_sandbox ? $this->paypal_sandbox_url : $this->paypal_url;

        // Encode PayPal client ID and secret for Basic Auth
        $credentials = base64_encode($client_id . ':' . $secret);

        // Set the return URL and cancel URL for redirecting the user
        $return_url = esc_url(get_permalink(Helper::instance()->acadlix_get_option('acadlix_thankyou_page_id'))); // Change to your success page URL

        // Create the order payload
        $body = wp_json_encode([
            'intent' => 'CAPTURE',
            'purchase_units' => [
                [
                    'amount' => [
                        'currency_code' => $request->get_param("currency"),
                        'value' => $request->get_param('total_amount'), // Set the amount to be paid
                    ]
                ]
            ],
            'application_context' => [
                'return_url' => $return_url,   // Where PayPal should redirect on success
                'cancel_url' => $return_url,   // Where PayPal should redirect if the payment is canceled
            ]
        ]);

        // Set up request arguments
        $args = [
            'headers' => [
                'Authorization' => "Basic {$credentials}",
                'Content-Type' => 'application/json',
            ],
            'body' => $body,
            'method' => 'POST',
        ];

        // Make the request to create the PayPal order
        $response = wp_remote_post($url, $args);

        if (is_wp_error($response)) {
            return new WP_Error('Error', $response->get_error_message(), array('status' => 400));
        }

        // Process the response from PayPal
        $response_body = wp_remote_retrieve_body($response);
        $data = json_decode($response_body, true);
        // Check if the order was successfully created
        if (isset($data['id'])) {
            $order = Order::create([
                'user_id' => $request->get_param('user_id'),
                'status' => "pending",
                'total_amount' => $request->get_param('total_amount'),
            ]);

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
                $order->updateOrCreateMeta('paypal_order_id', $data['id']);
                $order->updateOrCreateMeta('paypal_amount', $request->get_param('total_amount'));
            }
            // Return PayPal order ID for further processing
            return rest_ensure_response(['orderId' => $data['id']]);
        } else {
            // Handle error in creating the order
            return new WP_Error('error', __('Error creating PayPal order', 'acadlix'), array('status' => 400));
        }
    }

    public function post_checkout_payu($request)
    {
        $merchant_key = Helper::instance()->acadlix_get_option("acadlix_payu_merchant_key");
        ;
        $salt = Helper::instance()->acadlix_get_option("acadlix_payu_salt");
        ;
        $is_sandbox = Helper::instance()->acadlix_get_option("acadlix_payu_sandbox") == "yes";  // Use sandbox for testing

        $required_fields = array('currency', 'user_id');
        $params = $request->get_json_params();
        if (is_array($params) && count($params) == 0) {
            return new WP_Error('no_data_found', __('Required course id and user_id', 'acadlix'), array('status' => 404));
        }

        if ($request->get_param("payment_method") != "payu") {
            return new WP_Error('unacceptable_payment_gateway', __('Unacceptable payment gateway', 'acadlix'), array('status' => 404));
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

        $first_name = empty($params['billing_info']['first_name']) ? "First Name" : $params['billing_info']['first_name'];
        $email = empty($params['billing_info']['email']) ? "Email" : $params['billing_info']['email'];
        $phone = empty($params['billing_info']['phone_number']) ? "First Name" : $params['billing_info']['phone_number'];
        $amount = $request->get_param("total_amount");
        $txnid = substr(hash('sha256', wp_rand() . microtime()), 0, 20);
        $hash_string = $merchant_key . '|' . $txnid . '|' . $amount . '|Product Info|' . $first_name . '|' . $email . '|||||||||||' . $salt;
        $hash = strtolower(hash('sha512', $hash_string));

        $payu_url = $is_sandbox ? 'https://test.payu.in/_payment' : 'https://secure.payu.in/_payment'; // Use live URL for production
        $return_url = esc_url(get_permalink(Helper::instance()->acadlix_get_option('acadlix_thankyou_page_id'))) . '?token=' . $txnid; // Change to your success page URL

        $payu_data = [
            'key' => $merchant_key,
            'txnid' => $txnid,
            'amount' => $amount,
            'productinfo' => 'Product Info',
            'firstname' => $first_name,
            'email' => $email,
            'phone' => $phone,
            'surl' => $return_url,
            'furl' => $return_url,
            'hash' => $hash,
        ];

        $order = Order::create([
            'user_id' => $request->get_param('user_id'),
            'status' => "pending",
            'total_amount' => $request->get_param('total_amount'),
        ]);

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
            $order->updateOrCreateMeta('payu_txn_id', $txnid);
            $order->updateOrCreateMeta('payu_amount', $request->get_param('total_amount'));
        }
        return rest_ensure_response([
            'payment_url' => $payu_url,
            'formData' => $payu_data,
            'status' => 'success',
        ]);
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

        $order = Order::create([
            'user_id' => $request->get_param('user_id'),
            'status' => "pending",
            'total_amount' => $request->get_param('total_amount'),
        ]);

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
            if ($order->order_items()->count() > 0) {
                foreach ($order->order_items as $item) {
                    $cart = CourseCart::where("user_id", $order->user_id)->where("course_id", $item->course_id)->first();
                    $cart->delete();
                }
            }
            // send mail on success
            CourseHelper::instance()->handleCoursePurchaseEmail($order->id);
        }
        return rest_ensure_response([
            'status' => 'success',
        ]);
    }

    public function check_permission()
    {
        return true;
    }

}