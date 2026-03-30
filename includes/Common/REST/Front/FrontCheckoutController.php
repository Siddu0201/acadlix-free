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
          'permission_callback' => function (WP_REST_Request $request) {
            return wp_verify_nonce(
              $request->get_header('X-WP-Nonce'),
              'wp_rest'
            );
          },
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
            return wp_verify_nonce(
              $request->get_header('X-WP-Nonce'),
              'wp_rest'
            );
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
          'permission_callback' => [$this, 'check_user_permission'],
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
          'permission_callback' => [$this, 'check_user_permission'],
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
          'permission_callback' => [$this, 'check_user_permission'],
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
          'permission_callback' => [$this, 'check_user_permission'],
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
          'permission_callback' => [$this, 'check_user_permission'],
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
          'permission_callback' => [$this, 'check_user_permission'],
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
          'permission_callback' => '__return_true',
        ],
      ]
    );

    register_rest_route(
      $this->namespace,
      '/' . $this->base . '/post-apply-coupon',
      [
        [
          'methods' => WP_REST_Server::CREATABLE,
          'callback' => [$this, 'post_apply_coupon'],
          'permission_callback' => [$this, 'check_user_permission'],
        ],
      ]
    );
  }

  protected function isItemPurchased($item, $userId)
  {
    if ($item->type == 'course') {
      $course = acadlix()->model()->course()->find($item->item_id);
      if ($course) {
        return $course->isPurchasedBy($userId);
      }
    }
    return false;
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
      if ($this->isItemPurchased($item->item, $userId)) {
        $errors[] = sprintf(__('%s already purchased.', 'acadlix'), $item->item->post_title);
      }

      $checkRegistrationDate = acadlix()->helper()->course()->checkRegistrationDate(
        $item->item->start_date,
        $item->item->end_date
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
      $res['cart'] = !empty($params['cart_token']) ?
        acadlix()
          ->model()
          ->courseCart()
          ->where('cart_token', $params['cart_token'])
          ->get()
        : [];
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
      return new WP_Error('cart_not_found', __('No cart item found.', 'acadlix'), array('status' => 404));
    }
    $cart->delete();

    if ($cart->user_id != 0) {
      $res = $this->get_user_cart($cart->user_id);
    } else {
      $res['cart'] = acadlix()
        ->model()
        ->courseCart()
        ->where('cart_token', $cart->cart_token)
        ->get();
    }

    return rest_ensure_response($res);
  }

  public function post_checkout_razorpay($request)
  {
    try {
      $required_fields = array('currency', 'user_id', 'total_amount');
      $params = $request->get_json_params();
      if (is_array($params) && count($params) == 0) {
        throw new Exception(__('Required parameters are missing.', 'acadlix'), 404);
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
          'coupon_id' => $request->get_param('coupon_id'),
          'coupon_code' => $request->get_param('coupon_code'),
          'coupon_amount' => $request->get_param('coupon_amount'),
          'discount_type' => $request->get_param('discount_type'),
        ]);
        $message = "Razorpay OrderId: {$response['order_id']}";
        $order->createActivityLog($message);

        if ($order) {
          foreach ($request->get_param('order_items') as $item) {
            $order->order_items()->create([
              'item_id' => $item['item_id'],
              'item_title' => $item['item_title'],
              'type' => $item['type'],
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
          'coupon_id' => $request->get_param('coupon_id'),
          'coupon_code' => $request->get_param('coupon_code'),
          'coupon_amount' => $request->get_param('coupon_amount'),
          'discount_type' => $request->get_param('discount_type'),
        ]);

        $message = "PayPal OrderId: {$paypal_order_id}";
        $order->createActivityLog($message);

        if ($order) {
          foreach ($request->get_param('order_items') as $item) {
            $order->order_items()->create([
              'item_id' => $item['item_id'],
              'item_title' => $item['item_title'],
              'type' => $item['type'],
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
          'coupon_id' => $request->get_param('coupon_id'),
          'coupon_code' => $request->get_param('coupon_code'),
          'coupon_amount' => $request->get_param('coupon_amount'),
          'discount_type' => $request->get_param('discount_type'),
        ]);

        $message = "PayU txn id: {$response['payu_data']['txnid']}";
        $order->createActivityLog($message);

        if ($order) {
          foreach ($request->get_param('order_items') as $item) {
            $order->order_items()->create([
              'item_id' => $item['item_id'],
              'item_title' => $item['item_title'],
              'type' => $item['type'],
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
          'coupon_id' => $request->get_param('coupon_id'),
          'coupon_code' => $request->get_param('coupon_code'),
          'coupon_amount' => $request->get_param('coupon_amount'),
          'discount_type' => $request->get_param('discount_type'),
        ]);
        $message = "Stripe OrderId: {$response->id}";
        $order->createActivityLog($message);

        if ($order) {
          foreach ($request->get_param('order_items') as $item) {
            $order->order_items()->create([
              'item_id' => $item['item_id'],
              'item_title' => $item['item_title'],
              'type' => $item['type'],
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
      return new WP_Error('no_data_found', __('Required parameters are missing', 'acadlix'), array('status' => 404));
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
      'coupon_id' => $request->get_param('coupon_id'),
      'coupon_code' => $request->get_param('coupon_code'),
      'coupon_amount' => $request->get_param('coupon_amount'),
      'discount_type' => $request->get_param('discount_type'),
    ]);

    $message = "Free OrderId: {$order->id}";
    $order->createActivityLog($message);

    if ($order) {
      foreach ($request->get_param('order_items') as $item) {
        $order->order_items()->create([
          'item_id' => $item['item_id'],
          'item_title' => $item['item_title'],
          'type' => $item['type'],
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
          $cart = acadlix()
            ->model()
            ->courseCart()
            ->where('user_id', $order->user_id)
            ->where('item_id', $item->item_id)
            ->first();
          if ($cart) {
            $cart->delete();
          }
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
      return new WP_Error('no_data_found', __('Required parameters not found', 'acadlix'), array('status' => 404));
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
      $allowed_extensions = array_column(
        acadlix()->helper()->acadlix_get_option('acadlix_offline_allowed_mime_types', []),
        'extension'
      );
      $max_file_size = acadlix()->helper()->acadlix_get_option('acadlix_offline_max_upload_file_size', 2);
      // Include WordPress upload functions
      $new_file = acadlix()->helper()->acadlix_upload_file_to_wordpress(
        $files['offline_upload_file'],
        '/acadlix-offline-payments',
        $allowed_extensions,
        (float) $max_file_size
      );
      if (is_wp_error($new_file)) {
        return $new_file; // Return the error if upload failed
      }
    }


    $order = acadlix()->model()->order()->create([
      'user_id' => $request->get_param('user_id'),
      'status' => 'pending',
      'total_amount' => $request->get_param('total_amount'),
      'coupon_id' => $request->get_param('coupon_id'),
      'coupon_code' => $request->get_param('coupon_code'),
      'coupon_amount' => $request->get_param('coupon_amount'),
      'discount_type' => $request->get_param('discount_type'),
    ]);

    $message = "Offline Payment OrderId: {$order->id}";
    $order->createActivityLog($message);

    if ($order) {
      $order_items = json_decode($request['order_items'], true);
      foreach ($order_items as $item) {
        $order->order_items()->create([
          'item_id' => $item['item_id'],
          'item_title' => $item['item_title'],
          'type' => $item['type'],
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

      $order->updateOrCreateMeta('payment_method', 'offline');
      $order->updateOrCreateMeta('currency', $request->get_param('currency'));
      $order->updateOrCreateMeta('offline_user_text', $request->get_param('offline_user_text'));
      if (!empty($new_file)) {
        $order->updateOrCreateMeta('offline_upload_file', $new_file);
      }

      if ($order->order_items()->count() > 0) {
        foreach ($order->order_items as $item) {
          $cart = acadlix()
            ->model()
            ->courseCart()
            ->where('user_id', $order->user_id)
            ->where('item_id', $item->item_id)
            ->first();
          if ($cart) {
            $cart->delete();
          }
        }
      }
      // send mail on success
      acadlix()->notifications()->email()->handleOfflinePurchaseEmail($order->id);
    }
    $thankyou_page_url = esc_url(get_permalink(acadlix()->helper()->acadlix_get_option('acadlix_thankyou_page_id')));
    $redirect_url = !empty($thankyou_page_url)
      ? add_query_arg([
        'order_id' => $order->id,
        'offline' => true,
        'nonce' => wp_create_nonce('acadlix_payment_nonce'),
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
      // Raw body is required for signature verification (do not sanitize yet)
      $raw_body = file_get_contents('php://input');

      if ($raw_body === false || $raw_body === '') {
        return new WP_Error('empty_body', 'Empty webhook body', ['status' => 400]);
      }
      // $webhook_data = array(
      //     'get' => $_GET, // phpcs:ignore
      //     'post' => $_POST, // phpcs:ignore
      //     'server' => $_SERVER,
      //     'stream' => file_get_contents('php://input'),
      // );
      $payment_method = sanitize_text_field(wp_unslash($_GET['payment_method'] ?? '')); // phpcs:ignore

      if (!$payment_method) {
        return new WP_Error('missing_gateway', 'Payment gateway not specified', ['status' => 400]);
      }

      // Whitelist headers ONLY
      $headers = [
        // Razorpay
        'razorpay_signature' => sanitize_text_field(
          wp_unslash($_SERVER['HTTP_X_RAZORPAY_SIGNATURE'] ?? '')
        ),

        // PayPal
        'paypal_transmission_id' => sanitize_text_field(
          wp_unslash($_SERVER['HTTP_PAYPAL_TRANSMISSION_ID'] ?? '')
        ),
        'paypal_transmission_time' => sanitize_text_field(
          wp_unslash($_SERVER['HTTP_PAYPAL_TRANSMISSION_TIME'] ?? '')
        ),
        'paypal_transmission_sig' => sanitize_text_field(
          wp_unslash($_SERVER['HTTP_PAYPAL_TRANSMISSION_SIG'] ?? '')
        ),
        'paypal_auth_algo' => sanitize_text_field(
          wp_unslash($_SERVER['HTTP_PAYPAL_AUTH_ALGO'] ?? '')
        ),
        'paypal_cert_url' => esc_url_raw(
          wp_unslash($_SERVER['HTTP_PAYPAL_CERT_URL'] ?? '')
        ),

        // Stripe
        'stripe_signature' => sanitize_text_field(
          wp_unslash($_SERVER['HTTP_STRIPE_SIGNATURE'] ?? '')
        ),
      ];
      $webhook_data = [
        'headers' => $headers,
        'stream' => $raw_body,
      ];

      return match ($payment_method) {
        'razorpay' => acadlix()->payments()->razorpay()->verifyWebhook($webhook_data),
        'paypal' => acadlix()->payments()->paypal()->verifyWebhook($webhook_data),
        'payu' => acadlix()->payments()->payu()->verifyWebhook($webhook_data),
        'stripe' => acadlix()->payments()->stripe()->verifyWebhook($webhook_data),
        default => new WP_Error('invalid_gateway', 'Unsupported payment gateway', ['status' => 400]),
      };
    } catch (Exception $e) {
      return new WP_Error('error', $e->getMessage(), array('status' => 400));
    }
  }

  public function post_apply_coupon($request)
  {
    $required_fields = array('coupon_code', 'user_id', 'price_after_discount');
    $params = $request->get_json_params();
    if (is_array($params) && count($params) == 0) {
      return new WP_Error('no_data_found', __('Required coupon code and user_id', 'acadlix'), array('status' => 404));
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

    if (acadlix()->helper()->acadlix_get_option('acadlix_enable_coupon_code') != 'yes') {
      return new WP_Error('invalid_coupon', __('Coupons are disabled.', 'acadlix'), array('status' => 404));
    }

    $coupon = acadlix()->model()->coupon()
      ->where('post_title', $request->get_param('coupon_code'))
      ->first();

    if (!$coupon) {
      return new WP_Error('invalid_coupon', __('Invalid coupon code.', 'acadlix'), array('status' => 404));
    }

    $metas = $coupon->rendered_metas;

    if ($metas['disable_coupon']) {
      return new WP_Error('invalid_coupon', __('This coupon code is disabled.', 'acadlix'), array('status' => 404));
    }

    if ($metas['minimum_purchase_amount'] > 0 && $request->get_param('price_after_discount') < $metas['minimum_purchase_amount']) {
      return new WP_Error('invalid_coupon', sprintf(__('This coupon code requires a minimum purchase of %1$s%2$s.', 'acadlix'), $request->get_param('currency_symbol'), $metas['minimum_purchase_amount']), array('status' => 404));
    }

    $current_time = current_time('timestamp');
    $expiry_timestamp = strtotime($metas['expiry_date']);

    if ($metas['expiry_date'] && $expiry_timestamp < $current_time) {
      return new WP_Error('invalid_coupon', __('This coupon code has expired.', 'acadlix'), array('status' => 404));
    }

    // handle usage limit
    if ($metas['usage_limit_per_coupon'] > 0 && $coupon->coupon_usage >= $metas['usage_limit_per_coupon']) {
      return new WP_Error('invalid_coupon', __('This coupon code has reached its maximum usage limit.', 'acadlix'), array('status' => 404));
    }

    if ($metas['usage_limit_per_user'] > 0 && $coupon->getCouponUsageByUser($request->get_param('user_id')) >= $metas['usage_limit_per_user']) {
      return new WP_Error('invalid_coupon', __('You have reached the maximum usage limit for this coupon code.', 'acadlix'), array('status' => 404));
    }

    return rest_ensure_response([
      'coupon' => $coupon,
    ]);
  }

  public function check_user_permission()
  {
    return is_user_logged_in();
  }
}
