<?php

namespace Yuvayana\Acadlix\Common\REST\Front;

use Exception;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

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
            '/' . $this->base . '/post-checkout-offline-payment',
            [
                [
                    'methods' => WP_REST_Server::CREATABLE,
                    'callback' => [$this, 'post_checkout_offline_payment'],
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
        $cart = acadlix()
            ->model()
            ->courseCart()
            ->where('user_id', $userId)
            ->get();

        $result = [
            'cart' => $cart,
        ];

        foreach ($cart as $key => $item) {
            $errors = [];
            if ($item->course->isPurchasedBy($userId)) {
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
            $res['cart'] = !empty($params['cart_token']) ? acadlix()->model()->courseCart()->where('cart_token', $params['cart_token'])->get() : [];
        }
        return rest_ensure_response($res);
    }

    public function delete_course_from_cart($request)
    {
        $res = [];

        if ($request->get_param('id') == 0) {
            return new WP_Error('cart_id_not_found', __('Cart id is required.', 'acadlix'), array('status' => 404));
        }

        $cart = acadlix()->model()->courseCart()->find($request->get_param('id'));
        if (!$cart) {
            return new WP_Error('cart_not_found', __('No course found.', 'acadlix'), array('status' => 404));
        }
        $cart->delete();

        if ($cart->user_id != 0) {
            $res = $this->get_user_cart($cart->user_id);
        } else {
            $res['cart'] = acadlix()->model()->courseCart()->where('cart_token', $cart->cart_token)->get();
        }

        return rest_ensure_response($res);
    }

    public function post_checkout_razorpay($request)
    {
        try {
            $required_fields = array('currency', 'user_id', 'total_amount');
            $params = $request->get_json_params();
            if (is_array($params) && count($params) == 0) {
                throw new Exception(__('Required course id and user_id', 'acadlix'), 404);
            }

            if ($request->get_param('payment_method') != 'razorpay') {
                throw new Exception(__('Unacceptable payment gateway', 'acadlix'), 404);
            }

            if (empty($request->get_param('order_items')) && count($request->get_param('order_items')) == 0) {
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

            $response = acadlix()
                ->payments()
                ->razorpay()
                ->setAmount($request->get_param('total_amount'))
                ->setCurrency($request->get_param('currency'))
                ->setBillingInfo($request->get_param('billing_info'))
                ->processOrder();

            if ($response && $response['order_id']) {
                $order = acadlix()->model()->order()->create([
                    'user_id' => $request->get_param('user_id'),
                    'status' => 'pending',
                    'total_amount' => $request->get_param('total_amount'),
                ]);
                $message = "Razorpay OrderId: {$response['order_id']}";
                $order->createActivityLog($message);

                if ($order) {
                    foreach ($request->get_param('order_items') as $item) {
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

                    if (!empty($request->get_param('billing_info'))) {
                        $order->updateOrCreateMeta('billing_info', $request->get_param('billing_info'));
                    }

                    $order->updateOrCreateMeta('payment_method', $request->get_param('payment_method'));
                    $order->updateOrCreateMeta('currency', $request->get_param('currency'));
                    $order->updateOrCreateMeta('razorpay_order_id', $response['order_id']);
                    $order->updateOrCreateMeta('razorpay_amount', acadlix()->helper()->acadlix_convert_to_unit_price($request->get_param('total_amount')));
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

            if ($request->get_param('payment_method') != 'paypal') {
                throw new Exception('Unacceptable payment gateway');
            }

            if (empty($request->get_param('order_items')) && count($request->get_param('order_items')) == 0) {
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

            $response = acadlix()
                ->payments()
                ->paypal()
                ->setAmount($request->get_param('total_amount'))
                ->setCurrency($request->get_param('currency'))
                ->setBillingInfo($request->get_param('billing_info'))
                ->setOrderItems($request->get_param('order_items'))
                ->processOrder();

            $paypal_order_id = $response->id ?? null;
            // Check if the order was successfully created
            if ($response && $paypal_order_id && $response->redirect_url) {
                $order = acadlix()->model()->order()->create([
                    'user_id' => $request->get_param('user_id'),
                    'status' => 'pending',
                    'total_amount' => $request->get_param('total_amount'),
                ]);

                $message = "PayPal OrderId: {$paypal_order_id}";
                $order->createActivityLog($message);

                if ($order) {
                    foreach ($request->get_param('order_items') as $item) {
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

                    if (!empty($request->get_param('billing_info'))) {
                        $order->updateOrCreateMeta('billing_info', $request->get_param('billing_info'));
                    }
                    $order->updateOrCreateMeta('payment_method', $request->get_param('payment_method'));
                    $order->updateOrCreateMeta('currency', $request->get_param('currency'));
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

            if ($request->get_param('payment_method') != 'payu') {
                throw new Exception('Unacceptable payment gateway');
            }

            if (empty($request->get_param('order_items')) && count($request->get_param('order_items')) == 0) {
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

            $response = acadlix()
                ->payments()
                ->payu()
                ->setAmount($request->get_param('total_amount'))
                ->setCurrency($request->get_param('currency'))
                ->setBillingInfo($request->get_param('billing_info'))
                ->processOrder();

            if ($response && !empty($response['payu_url'])) {
                $order = acadlix()->model()->order()->create([
                    'user_id' => $request->get_param('user_id'),
                    'status' => 'pending',
                    'total_amount' => $request->get_param('total_amount'),
                ]);

                $message = "PayU txn id: {$response['payu_data']['txnid']}";
                $order->createActivityLog($message);

                if ($order) {
                    foreach ($request->get_param('order_items') as $item) {
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

                    if (!empty($request->get_param('billing_info'))) {
                        $order->updateOrCreateMeta('billing_info', $request->get_param('billing_info'));
                    }

                    $order->updateOrCreateMeta('payment_method', $request->get_param('payment_method'));
                    $order->updateOrCreateMeta('currency', $request->get_param('currency'));
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
            $required_fields = array('currency', 'user_id', 'total_amount');
            $params = $request->get_json_params();
            if (is_array($params) && count($params) == 0) {
                throw new Exception('No data found');
            }

            if ($request->get_param('payment_method') != 'stripe') {
                throw new Exception('Unacceptable payment gateway');
            }

            if (empty($request->get_param('order_items')) && count($request->get_param('order_items')) == 0) {
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

            $response = acadlix()
                ->payments()
                ->stripe()
                ->setAmount($request->get_param('total_amount'))
                ->setCurrency($request->get_param('currency'))
                ->setBillingInfo($request->get_param('billing_info'))
                ->processOrder();

            // Check if the order was successfully created
            if ($response && $response->id && $response->url) {
                $order = acadlix()->model()->order()->create([
                    'user_id' => $request->get_param('user_id'),
                    'status' => 'pending',
                    'total_amount' => $request->get_param('total_amount'),
                ]);
                $message = "Stripe OrderId: {$response->id}";
                $order->createActivityLog($message);

                if ($order) {
                    foreach ($request->get_param('order_items') as $item) {
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

                    if (!empty($request->get_param('billing_info'))) {
                        $order->updateOrCreateMeta('billing_info', $request->get_param('billing_info'));
                    }
                    $order->updateOrCreateMeta('payment_method', $request->get_param('payment_method'));
                    $order->updateOrCreateMeta('currency', $request->get_param('currency'));
                    $order->updateOrCreateMeta('stripe_order_id', $response->id);
                    $order->updateOrCreateMeta('stripe_amount', acadlix()->helper()->acadlix_convert_to_unit_price($request->get_param('total_amount')));
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

        if (empty($request->get_param('order_items')) && count($request->get_param('order_items')) == 0) {
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
            'status' => 'pending',
            'total_amount' => $request->get_param('total_amount'),
        ]);

        $message = "Free OrderId: {$order->id}";
        $order->createActivityLog($message);

        if ($order) {
            foreach ($request->get_param('order_items') as $item) {
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

            if (!empty($request->get_param('billing_info'))) {
                $order->updateOrCreateMeta('billing_info', $request->get_param('billing_info'));
            }

            $order->updateOrCreateMeta('payment_method', 'free');
            $order->update([
                'status' => 'success',
            ]);
            $message = 'Order status updated to success';
            $order->createActivityLog($message);
            if ($order->order_items()->count() > 0) {
                foreach ($order->order_items as $item) {
                    $cart = acadlix()->model()->courseCart()->where('user_id', $order->user_id)->where('course_id', $item->course_id)->first();
                    $cart->delete();
                }
            }
            // send mail on success
            acadlix()->notifications()->email()->handleCoursePurchaseEmail($order->id);
        }
        return rest_ensure_response([
            'status' => 'success',
        ]);
    }

    public function post_checkout_offline_payment($request)
    {
        $required_fields = array('currency', 'user_id');
        $params = $request->get_json_params();
        $files = $request->get_file_params();
        if (is_array($params) && count($params) == 0) {
            return new WP_Error('no_data_found', __('Required course id and user_id', 'acadlix'), array('status' => 404));
        }
        if (empty($request->get_param('order_items')) && count($request->get_param('order_items')) == 0) {
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
            return new WP_Error('missing_parameters', implode(' ', $errors), array('status' => 400));
        }
        $new_file = [];
        if (!empty($files['offline_upload_file'])) {
            // Include WordPress upload functions
            require_once ABSPATH . 'wp-admin/includes/file.php';

            // Get the base uploads directory
            $upload_dir = wp_upload_dir();  // Gives [basedir] and [baseurl]

            // Define custom subdirectory path
            $custom_subdir = '/acadlix-offline-payments';
            $custom_dir_path = $upload_dir['basedir'] . $custom_subdir;

            // Create the folder if it doesn't exist
            if (!file_exists($custom_dir_path)) {
                if (!wp_mkdir_p($custom_dir_path)) {
                    return new WP_Error('mkdir_failed', __('Failed to create acadlix-offline-payments folder.', 'acadlix'), ['status' => 500]);
                }
            }

            // Upload override settings
            $upload_overrides = ['test_form' => false];
            $file = [
                'name' => $files['offline_upload_file']['name'],
                'type' => $files['offline_upload_file']['type'],
                'tmp_name' => $files['offline_upload_file']['tmp_name'],
                'error' => $files['offline_upload_file']['error'],
                'size' => $files['offline_upload_file']['size'],
            ];
            $original_filename = sanitize_file_name($file['name']);
            $timestamp = time();
            $extension = pathinfo($original_filename, PATHINFO_EXTENSION);
            $filename_wo_ext = pathinfo($original_filename, PATHINFO_FILENAME);
            $file['name'] = "{$filename_wo_ext}_{$timestamp}.{$extension}";

            // Set upload_dir filter for each file
            add_filter('upload_dir', function ($dirs) use ($custom_subdir) {
                $dirs['subdir'] = $custom_subdir;
                $dirs['path'] = $dirs['basedir'] . $custom_subdir;
                $dirs['url'] = $dirs['baseurl'] . $custom_subdir;
                return $dirs;
            });

            $result = wp_handle_upload($file, $upload_overrides);

            // Remove the filter (important when looping)
            remove_filter('upload_dir', '__return_custom_acadlix_offline_payments_dir');

            if ($result && !isset($result['error'])) {
                $new_file = [
                    'file_name' => $file['name'],
                    'file_size' => $file['size'],
                    'file_extension' => $extension,
                    'file_url' => $result['url'],
                    'file_path' => $result['file'],
                    'file_type' => $result['type'],
                ];
            } else {
                return new WP_Error('upload_failed', __('Failed to upload file.', 'acadlix'), array('status' => 500));
            }
        }


        $order = acadlix()->model()->order()->create([
            'user_id' => $request->get_param('user_id'),
            'status' => 'pending',
            'total_amount' => $request->get_param('total_amount'),
        ]);

        $message = "Offline Payment OrderId: {$order->id}";
        $order->createActivityLog($message);

        if( $order ) {
            $order_items = json_decode($request['order_items'], true);
            foreach ( $order_items as $item ) {
                $order->order_items()->create( [
                    'course_id'             => $item['course_id'],
                    'course_title'          => $item['course_title'],
                    'quantity'              => $item['quantity'],
                    'price'                 => $item['price'],
                    'discount'              => $item['discount'],
                    'price_after_discount'  => $item['price_after_discount'],
                    'additional_fee'        => $item['additional_fee'],
                    'tax'                   => $item['tax'],
                    'price_after_tax'       => $item['price_after_tax'],
                ] );
            }

            if ( ! empty( $request->get_param( 'billing_info' ) ) ) {
                $order->updateOrCreateMeta( 'billing_info', $request->get_param( 'billing_info' ) );
            }

            $order->updateOrCreateMeta( 'payment_method', 'offline' );
            $order->updateOrCreateMeta( 'currency', $request->get_param( 'currency' ) );
            $order->updateOrCreateMeta( 'offline_user_text', $request->get_param( 'offline_user_text' ) );
            if ( ! empty( $new_file ) ) {
                $order->updateOrCreateMeta( 'offline_upload_file', $new_file );
            }
            
            if ( $order->order_items()->count() > 0 ) {
                foreach ( $order->order_items as $item ) {
                    $cart = acadlix()->model()->courseCart()->where( 'user_id', $order->user_id )->where( 'course_id', $item->course_id )->first();
                    $cart->delete();
                }
            }
            // send mail on success
            // acadlix()->notifications()->email()->handleCoursePurchaseEmail( $order->id );
        }
        $thankyou_page_url = esc_url(get_permalink(acadlix()->helper()->acadlix_get_option('acadlix_thankyou_page_id')));
        $redirect_url = !empty($thankyou_page_url) 
                        ? add_query_arg([
                            'order_id' => $order->id,
                            'offline' => true
                        ], $thankyou_page_url)
                        : '';
        return rest_ensure_response([
            'status' => 'success',
            'redirect_url' => $redirect_url,
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
