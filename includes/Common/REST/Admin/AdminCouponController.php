<?php

namespace Yuvayana\Acadlix\Common\REST\Admin;

use WP_Error;
use WP_REST_Server;
defined('ABSPATH') || exit();

class AdminCouponController
{
  protected $namespace = 'acadlix/v1';

  protected $base = 'admin-coupon';

  public function register_routes()
  {
    register_rest_route(
      $this->namespace,
      '/' . $this->base,
      [
        [
          'methods' => WP_REST_Server::READABLE,
          'callback' => [$this, 'get_coupons'],
          'permission_callback' => function () {
            return current_user_can('acadlix_show_coupon');
          },
        ],
        [
          'methods' => WP_REST_Server::CREATABLE,
          'callback' => [$this, 'post_create_coupon'],
          'permission_callback' => function () {
            return current_user_can('acadlix_add_coupon');
          },
        ],
      ]
    );

    register_rest_route(
      $this->namespace,
      '/' . $this->base . '/(?P<coupon_id>[\d]+)',
      [
        [
          'methods' => WP_REST_Server::READABLE,
          'callback' => [$this, 'get_coupon_by_id'],
          'permission_callback' => function () {
            return current_user_can('acadlix_edit_coupon');
          },
          'args' => array(
            'coupon_id' => array(
              'validate_callback' => function ($param, $request, $key) {
                return is_numeric($param);
              }
            ),
          ),
        ],
        [
          'methods' => WP_REST_Server::EDITABLE,
          'callback' => [$this, 'update_coupon_by_id'],
          'permission_callback' => function () {
            return current_user_can('acadlix_edit_coupon');
          },
          'args' => array(
            'coupon_id' => array(
              'validate_callback' => function ($param, $request, $key) {
                return is_numeric($param);
              }
            ),
          ),
        ],
        [
          'methods' => WP_REST_Server::DELETABLE,
          'callback' => [$this, 'delete_coupon_by_id'],
          'permission_callback' => function () {
            return current_user_can('acadlix_delete_coupon');
          },
          'args' => array(
            'coupon_id' => array(
              'validate_callback' => function ($param, $request, $key) {
                return is_numeric($param);
              }
            ),
          ),
        ],
      ]
    );

    register_rest_route(
      $this->namespace,
      '/' . $this->base . '/delete-bulk-coupon',
      [
        [
          'methods' => WP_REST_Server::DELETABLE,
          'callback' => [$this, 'delete_bulk_coupon'],
          'permission_callback' => function () {
            return current_user_can('acadlix_bulk_delete_coupon');
          },
        ],
      ]
    );
  }

  public function get_coupons($request)
  {
    $res = [];
    $params = $request->get_params();
    $search = $params['search'];
    $skip = $params['page'] * $params['pageSize'];
    $coupon = acadlix()->model()->coupon()->ofCoupon()->orderBy('ID', 'desc');
    if (!empty($search)) {
      $coupon->where('post_title', 'like', "%$search%");
    }
    $res['total'] = $coupon->count();
    $res['coupons'] = $coupon->skip($skip)->take($params['pageSize'])->get();
    return rest_ensure_response($res);
  }

  public function post_create_coupon($request)
  {
    $res = [];
    $params = $request->get_json_params();

    // Validate required fields
    if (empty($params['code'])) {
      return new WP_Error(
        'missing_code',
        __('Coupon code is required.', 'acadlix'),
        ['status' => 400]
      );
    }

    // Prepare meta data
    $meta = !empty($params['meta']) && is_array($params['meta'])
      ? acadlix()->helper()->cpt()->acadlix_add_prefix_meta_keys($params['meta'], 'coupon')
      : [];

    try {
      // Insert the coupon post
      $couponId = acadlix()->model()->coupon()->insertCoupon([
        'post_title' => $params['code'],
        'post_content' => $params['post_content'],
        'post_author' => (int) $params['post_author'], // Assign to current user
      ], $meta);

      if (is_wp_error($couponId)) {
        return new WP_Error(
          'coupon_creation_failed',
          __('Failed to create the coupon.', 'acadlix'),
          ['status' => 500, 'error' => $couponId->get_error_message()]
        );
      }

      // Retrieve and return the coupon data
      $coupon = get_post($couponId);
      if (!$coupon) {
        return new WP_Error(
          'coupon_not_found',
          __('Created coupon not found.', 'acadlix'),
          ['status' => 500]
        );
      }

      $res['coupon'] = $coupon;
      return rest_ensure_response($res);

    } catch (Exception $e) {
      return new WP_Error(
        'exception_occurred',
        $e->getMessage(),
        ['status' => 500]
      );
    }
  }

  public function get_coupon_by_id($request)
  {
    $res = [];
    $coupon_id = $request['coupon_id'];

    // Validate required fields
    if (empty($coupon_id)) {
      return new WP_Error(
        'missing_id',
        __('Coupon id is required.', 'acadlix'),
        ['status' => 400]
      );
    }

    $coupon = acadlix()->model()->coupon()->find($coupon_id);
    if ($coupon) {
      $res['coupon'] = $coupon;
    }
    return rest_ensure_response($res);
  }

  public function update_coupon_by_id($request)
  {
    $res = [];
    $couponId = $request['coupon_id'];
    $params = $request->get_json_params();

    // Validate required fields
    if (empty($params['code'])) {
      return new WP_Error(
        'missing_code',
        __('Coupon code is required.', 'acadlix'),
        ['status' => 400]
      );
    }

    // Validate required fields
    if (empty($couponId)) {
      return new WP_Error(
        'missing_id',
        __('Coupon id is required.', 'acadlix'),
        ['status' => 400]
      );
    }

    // Prepare meta data
    $meta = !empty($params['meta']) && is_array($params['meta'])
      ? acadlix()->helper()->cpt()->acadlix_add_prefix_meta_keys($params['meta'], 'coupon')
      : [];

    try {
      // Update the coupon post
      $couponId = acadlix()->model()->coupon()->updateCoupon($couponId, [
        'post_title' => $params['code'],
        'post_content' => $params['post_content'],
        'post_author' => (int) $params['post_author'], // Assign to current user
      ], $meta);

      if (is_wp_error($couponId)) {
        return new WP_Error(
          'coupon_updation_failed',
          __('Failed to update the coupon.', 'acadlix'),
          ['status' => 500, 'error' => $couponId->get_error_message()]
        );
      }

      // Retrieve and return the coupon data
      $coupon = get_post($couponId);
      if (!$coupon) {
        return new WP_Error(
          'coupon_not_found',
          __('Updated coupon not found.', 'acadlix'),
          ['status' => 500]
        );
      }

      $res['coupon'] = $coupon;
      return rest_ensure_response($res);

    } catch (Exception $e) {
      return new WP_Error(
        'exception_occurred',
        $e->getMessage(),
        ['status' => 500]
      );
    }

  }

  public function delete_coupon_by_id($request)
  {
    $res = [];
    $coupon_id = $request['coupon_id'];

    // Validate required fields
    if (empty($coupon_id)) {
      return new WP_Error(
        'missing_id',
        __('Coupon id is required.', 'acadlix'),
        ['status' => 400]
      );
    }
    $coupon = acadlix()->model()->coupon()->deleteCoupon($coupon_id);

    if (is_wp_error($coupon)) {
      return new WP_Error(
        'coupon_deletion_failed',
        __('Failed to delete the coupon.', 'acadlix'),
        ['status' => 500, 'error' => $coupon->get_error_message()]
      );
    }
    $res['message'] = __('Coupon successfully deleted.', 'acadlix');
    return rest_ensure_response($res);
  }

  public function delete_bulk_coupon($request)
  {
    $res = [];
    $params = $request->get_json_params();

    // Validate required fields
    if (!is_array($params['coupon_ids']) || count($params['coupon_ids']) == 0) {
      return new WP_Error(
        'missing_ids',
        __('Coupon ids is required.', 'acadlix'),
        ['status' => 400]
      );
    }

    foreach ($params['coupon_ids'] as $coupon_id) {
      if (empty($coupon_id)) {
        return new WP_Error(
          'missing_id',
          __('Coupon id is required.', 'acadlix'),
          ['status' => 400]
        );
      }
      $coupon = acadlix()->model()->coupon()->deleteCoupon($coupon_id);

      if (is_wp_error($coupon)) {
        return new WP_Error(
          'coupon_deletion_failed',
          __('Failed to delete the coupon.', 'acadlix'),
          ['status' => 500, 'error' => $coupon->get_error_message()]
        );
      }
    }
    $res['message'] = __('Coupons successfully deleted.', 'acadlix');
    return rest_ensure_response($res);
  }
}