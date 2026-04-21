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
          'permission_callback' => function () {
            return is_user_logged_in();
          },
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
          'permission_callback' => function () {
            return is_user_logged_in();
          },
        ],
      ]
    );

    register_rest_route(
      $this->namespace,
      '/' . $this->base . '/submit-review',
      [
        [
          'methods' => WP_REST_Server::CREATABLE,
          'callback' => [$this, 'post_submit_review'],
          'permission_callback' => [$this, 'check_permission'],
        ],
      ]
    );

    register_rest_route(
      $this->namespace,
      '/' . $this->base . '/load-more-reviews',
      [
        [
          'methods' => WP_REST_Server::CREATABLE,
          'callback' => [$this, 'post_load_more_reviews'],
          'permission_callback' => [$this, 'check_permission'],
        ],
      ]
    );
  }

  public function post_add_to_cart($request)
  {
    $errors = [];
    $required_fields = array('item_id', 'type');
    $params = $request->get_json_params();
    if (is_array($params) && count($params) == 0) {
      return new WP_Error('no_data_found', __('Required item id and user_id', 'acadlix'), array('status' => 404));
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
    $required_fields = array('item_id', 'type');
    $params = $request->get_json_params();
    if (is_array($params) && count($params) == 0) {
      return new WP_Error('no_data_found', __('Required item id and user_id', 'acadlix'), array('status' => 404));
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

      $cart_tokens = acadlix()
        ->model()
        ->courseCart()
        ->where("cart_token", $params['cart_token'])
        ->get();
      if (count($cart_tokens) > 0) {
        foreach ($cart_tokens as $cart_token) {
          $cart_token->update([
            'token_expiry' => $params['token_expiry'] ?? 0
          ]);
        }
      }
      $cart = acadlix()
        ->model()
        ->courseCart()
        ->where("cart_token", $params['cart_token'])
        ->where('item_id', $params['item_id'])
        ->where('type', $params['type'])
        ->first();
      if (!$cart) {
        $cart = acadlix()->model()->courseCart()->create([
          'cart_token' => $params['cart_token'],
          'item_id' => $params['item_id'],
          'type' => $params['type'],
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
      $cart = acadlix()
        ->model()
        ->courseCart()
        ->where('user_id', $params['user_id'])
        ->where('item_id', $params['item_id'])
        ->where('type', $params['type'])
        ->first();
      if (!$cart) {
        $cart = acadlix()->model()->courseCart()->create([
          'item_id' => $params['item_id'],
          'type' => $params['type'],
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

  protected function get_item($item_id, $type)
  {
    $item = null;
    if ($type === 'course') {
      $item = acadlix()
        ->model()
        ->course()
        ->ofCourse()
        ->find($item_id);
    }
    return $item;
  }

  public function post_start_now($request)
  {
    $errors = [];
    $required_fields = array('item_id', 'type');
    $params = $request->get_json_params();
    if (is_array($params) && count($params) == 0) {
      return new WP_Error('no_data_found', __('Required item id and user_id', 'acadlix'), array('status' => 404));
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

      $cart_tokens = acadlix()
        ->model()
        ->courseCart()
        ->where("cart_token", $params['cart_token'])
        ->get();
      if (count($cart_tokens) > 0) {
        foreach ($cart_tokens as $cart_token) {
          $cart_token->update([
            'token_expiry' => $params['token_expiry'] ?? 0
          ]);
        }
      }
      $cart = acadlix()
        ->model()
        ->courseCart()
        ->where("cart_token", $params['cart_token'])
        ->where('item_id', $params['item_id'])
        ->where('type', $params['type'])
        ->first();
      if (!$cart) {
        $cart = acadlix()->model()->courseCart()->create([
          'cart_token' => $params['cart_token'],
          'item_id' => $params['item_id'],
          'type' => $params['type'],
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
      $item = $this->get_item($params['item_id'], $params['type']);
      if (!$item) {
        return new WP_Error('item_not_found', __('Item not found', 'acadlix'), array('status' => 404));
      }
      if (!$item->isPurchasedBy($userId)) {
        $order = acadlix()->model()->order()->create([
          'user_id' => $userId,
          'status' => 'pending',
          'extra_charges' => 0,
          'total_amount' => 0
        ]);
        $order->order_items()->create([
          'item_id' => $params['item_id'],
          'item_title' => $item->post_title,
          'type' => $params['type'],
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
        acadlix()->notifications()->email()->handleCoursePurchaseEmail($order->id);
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
    $required_fields = array('item_id', 'user_id', 'type');
    $params = $request->get_json_params();
    if (is_array($params) && count($params) == 0) {
      return new WP_Error('no_data_found', __('Required item id, user_id, and type', 'acadlix'), array('status' => 404));
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
    $user_meta = acadlix()->model()->userActivityMeta()
      ->ofWishlist()
      ->where('type_id', $params['item_id'])
      ->where('user_id', $params['user_id'])
      ->where('type', $params['type'])
      ->first();
    if (!$user_meta) {
      $user_meta = acadlix()->model()->userActivityMeta()->create([
        'user_id' => $params['user_id'],
        'type' => $params['type'],
        'type_id' => $params['item_id'],
        'meta_key' => "wishlist", // phpcs:ignore
        'meta_value' => 1 // phpcs:ignore
      ]);
    } else {
      $user_meta->update([
        'meta_value' => 1 // phpcs:ignore
      ]);
    }
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
    $required_fields = array('item_id', 'user_id', 'type');
    $params = $request->get_json_params();
    if (is_array($params) && count($params) == 0) {
      return new WP_Error('no_data_found', __('Required item id, user_id, and type', 'acadlix'), array('status' => 404));
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

    $wishlist = acadlix()->model()->userActivityMeta()
      ->ofWishlist()
      ->where('type_id', $params['item_id'])
      ->where('user_id', $params['user_id'])
      ->where('type', $params['type'])
      ->first();
    if ($wishlist) {
      $wishlist->delete();
    }
    $res = array(
      'status' => 'success',
      'code' => array('status' => 200),
      'message' => __('Course removed from the wishlist', 'acadlix')
    );
    return rest_ensure_response($res);
  }

  public function post_submit_review($request)
  {
    $errors = [];
    $required_fields = array('course_id', 'user_id', 'rating', 'review_text');
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

    $review_text = sanitize_text_field($params['review_text']);
    $rating = intval($params['rating']);

    $review = acadlix()->model()->courseReview()->add_or_update_review(
      $params['user_id'],
      $params['course_id'],
      $rating,
      $review_text,
      $params['review_id'] ?? 0
    );

    if (is_wp_error($review)) {
      return $review;
    }
    $res = array(
      'status' => 'success',
      'code' => array('status' => 200),
      'data' => $review
    );
    return rest_ensure_response($res);
  }

  public function post_load_more_reviews($request)
  {
    $errors = [];
    $required_fields = array('course_id', 'current_page', 'skip_count', 'take_count');
    $params = $request->get_json_params();
    if (is_array($params) && count($params) == 0) {
      return new WP_Error('no_data_found', __('Required course id and page number', 'acadlix'), array('status' => 404));
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

    $course_id = intval($params['course_id']);
    $current_page = intval($params['current_page']);
    $skip_count = intval($params['skip_count']);
    $take_count = intval($params['take_count']);

    $reviews_query = acadlix()
      ->model()
      ->courseReview()
      ->ofCourseRating()
      ->ofApproved()
      ->where('comment_post_ID', $course_id)
      ->orderBy('comment_date', 'DESC');

    $total_reviews = $reviews_query->count();

    $reviews = $reviews_query
      ->skip($skip_count)
      ->take($take_count)
      ->get();

    setup_postdata(get_post($course_id));
    ob_start();
    acadlix()->view()->singleCourse()->course_main_reviews_list($reviews);
    $review_html = ob_get_clean();
    wp_reset_postdata();

    $res = array(
      'reviews' => $reviews,
      'reviews_html' => $review_html,
      'total_reviews' => $total_reviews,
      'next_page' => $current_page + 1,
    );

    return rest_ensure_response($res);
  }
  public function check_permission($request)
  {
    return wp_verify_nonce(
      $request->get_header('X-WP-Nonce'),
      'wp_rest'
    );
  }
}