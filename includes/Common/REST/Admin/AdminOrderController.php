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
          'permission_callback' => function () {
            return current_user_can('acadlix_show_order');
          },
        ],
        [
          'methods' => WP_REST_Server::CREATABLE,
          'callback' => [$this, 'post_create_order'],
          'permission_callback' => function () {
            return current_user_can('acadlix_add_order');
          },
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
          'permission_callback' => function () {
            return current_user_can('acadlix_add_order');
          },
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
          'permission_callback' => function () {
            return current_user_can('acadlix_edit_order');
          },
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
          'permission_callback' => function () {
            return current_user_can('acadlix_edit_order');
          },
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
          'permission_callback' => function () {
            return current_user_can('acadlix_edit_order');
          },
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
          'permission_callback' => function () {
            return current_user_can('acadlix_edit_order');
          },
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
          'permission_callback' => function () {
            return current_user_can('acadlix_delete_order');
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
    $search = $params['search'] ?? '';
    $status = $params['status'] ?? '';
    $payment_method = $params['payment_method'] ?? '';

    $skip = $params['page'] * $params['pageSize'];
    $order = acadlix()->model()->order()->with(['order_items', 'order_metas', 'user'])->orderBy('ID', 'desc');

    if (!empty($search)) {
      $order->where(function ($query) use ($search) {
        $query
          // ->whereHas('order_items', function ($q) use ($search) {
          //     $q->where('course_title', 'LIKE', "%{$search}%");
          // })
          // ->orWhereHas('order_metas', function ($q) use ($search) {
          //     $q
          //         ->whereIn('meta_key', ['razorpay_order_id', 'paypal_order_id', 'payu_txn_id', 'stripe_order_id'])
          //         ->where('meta_value', 'LIKE', "%{$search}%");
          // })
          ->orWhereHas('user', function ($q) use ($search) {
            $q
              ->where('display_name', 'LIKE', "%{$search}%")
              ->orWhere('user_login', 'LIKE', "%{$search}%")
              ->orWhere('user_email', 'LIKE', "%{$search}%");
          });
      })
        ->orWhere('id', 'LIKE', "%{$search}%");
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
    $res['users'] = acadlix()->model()->wpUsers()->with(['user_metas'])->get(['ID', 'display_name', 'user_email', 'user_login']);
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

  public function isItemPurchasedBy($item_id, $user_id, $type = 'course')
  {
    if ($type === 'course') {
      $item = acadlix()->model()->course()->find($item_id);
      if ($item && method_exists($item, 'isPurchasedBy')) {
        return $item->isPurchasedBy($user_id);
      }
    }
    return false;
  }

  public function post_create_order($request)
  {
    $res = [];
    $errors = [];
    $params = $request->get_params();
    $user_type = $params['user_type'];
    $users = $params['users'];
    $skip_already_purchased = $params['skip_already_purchased'];
    $user_id = $params['user_id'];
    $order_items = $params['order_items'];
    $admin_id = $params['admin_id'];
    $billing_info = $params['billing_info'];

    if ($user_type === 'single' && empty($user_id)) {
      $errors[] = __('User id is required.', 'acadlix');
    }

    if ($user_type === 'multiple' && empty($users)) {
      $errors[] = __('Users is required.', 'acadlix');
    }

    if (empty($order_items)) {
      $errors[] = __('Order items is required.', 'acadlix');
    }

    if (!empty($errors)) {
      return new WP_Error(
        'missing_params',
        implode('<br/> ', $errors),
        ['status' => 400]
      );
    }

    $prepare_user_order = function ($target_user_id, $user_data = []) use ($order_items, $skip_already_purchased, &$errors) {
      $available_items = [];
      foreach ($order_items as $item) {
        if (empty($item['item_id'])) {
          continue;
        }
        /* ---- Purchase Check ---- */

        if (
          $this->isItemPurchasedBy(
            $item['item_id'],
            $target_user_id,
            $item['type']
          )
        ) {

          if ($skip_already_purchased) {
            continue;
          }

          if (!empty($user_data)) {
            $user_info = $user_data['display_name'] ?? $user_data['user_email'] ?? '';
          } else {
            $user = get_userdata($target_user_id);
            $user_info = $user ? $user->display_name : '';
          }

          $errors[] = sprintf(
            /* translators: 1: item title 2: user info */
            __('%1$s already purchased by %2$s.', 'acadlix'),
            $item['item_title'],
            $user_info
          );

          continue;
        }
        $available_items[] = $item;
      }
      /* prevent duplicate items inside same order */
      $available_items = collect($available_items)
        ->unique(fn($i) => $i['type'] . '_' . $i['item_id'])
        ->values()
        ->all();

      return $available_items;
    };
    /* -------------------------------------------------
     | PHASE 1 — VALIDATE ALL USERS
     --------------------------------------------------*/

    if ($user_type === 'single') {

      $items = $prepare_user_order($user_id);

      if (!empty($items)) {
        $orders_to_create[] = [
          'user_id' => $user_id,
          'items' => $items,
          'user' => []
        ];
      }
    }
    if ($user_type === 'multiple') {
      foreach ($users as $user) {
        $items = $prepare_user_order($user['ID'], $user);

        if (!empty($items)) {
          $orders_to_create[] = [
            'user_id' => $user['ID'],
            'items' => $items,
            'user' => $user
          ];
        }
      }
    }
    /* -------------------------------------------------
     | STOP IF ANY ERROR EXISTS (ATOMIC SAFETY)
     --------------------------------------------------*/

    if (!empty($errors)) {
      return new WP_Error(
        'purchase_error',
        implode('<br/>', $errors),
        ['status' => 400]
      );
    }

    /* -------------------------------------------------
     | PHASE 2 — CREATE ORDERS
     --------------------------------------------------*/

    $admin = get_userdata($admin_id);

    foreach ($orders_to_create as $data) {

      $target_user_id = $data['user_id'];
      $available_items = $data['items'];
      $user_data = $data['user'];

      /* ---- Cart Cleanup ---- */
      foreach ($available_items as $item) {
        $cartItem = acadlix()
          ->model()
          ->courseCart()
          ->where('user_id', $target_user_id)
          ->where('item_id', $item['item_id'])
          ->where('type', $item['type'])
          ->first();

        if ($cartItem) {
          $cartItem->delete();
        }
      }

      /* ---- Create Order ---- */

      $order = acadlix()->model()->order()->create([
        'user_id' => $target_user_id,
        'status' => $params['status'],
        'total_amount' => (float) 
          array_sum(array_column($available_items, 'price_after_tax')),
      ]);

      if (!$order) {
        continue;
      }

      $order->createActivityLog(
        "Order created by {$admin->display_name}"
      );

      $order->createActivityLog(
        "Order status updated to {$params['status']} by {$admin->display_name}"
      );

      /* ---- Order Items ---- */

      foreach ($available_items as $item) {

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

      /* ---- Billing Meta ---- */

      if (!empty($user_data)) {

        $metas = array_column(
          $user_data['user_metas'],
          'meta_value',
          'meta_key'
        );

        $billing_info = [
          "first_name" => $metas['first_name'] ?? "",
          "last_name" => $metas['last_name'] ?? "",
          "email" => $user_data['user_email'] ?? "",
          "phonecode" => $metas['_acadlix_profile_phonecode'] ?? "",
          "isocode" => $metas['_acadlix_profile_isocode'] ?? "",
          "phone_number" => $metas['_acadlix_profile_phone_number'] ?? "",
          "address" => $metas['_acadlix_profile_address'] ?? "",
          "country" => $metas['_acadlix_profile_country'] ?? "",
          "city" => $metas['_acadlix_profile_city'] ?? "",
          "zip_code" => $metas['_acadlix_profile_zip_code'] ?? "",
        ];

      }
      $order->updateOrCreateMeta('billing_info', $billing_info);

      $order->updateOrCreateMeta(
        'payment_method',
        $params['meta']['payment_method']
      );

      $order->updateOrCreateMeta(
        'is_free',
        $params['meta']['is_free']
      );
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
    $order_items = $params['order_items'];
    $admin_id = $params['admin_id'];
    $billing_info = $params['billing_info'];

    if (empty($orderId)) {
      $errors[] = __('Order id is required.', 'acadlix');
    }

    if (empty($user_id)) {
      $errors[] = __('User id is required.', 'acadlix');
    }

    if (empty($order_items)) {
      $errors[] = __('Order items is required.', 'acadlix');
    }

    // foreach ($order_items as $order_item) {
    //     if (!$order_item['course_id'])
    //         continue;
    //     $orderItem = acadlix()->model()->orderItem()
    //                 ->where('order_id', $orderId)
    //                 ->where('item_id', $order_item['item_id'])
    //                 ->first();
    //     if($orderItem){
    //        continue;
    //     }
    //     $course = acadlix()->model()->course()->ofCourse()->find($order_item['item_id']);
    //     if ($course->isPurchasedBy($user_id)) {
    //         /* translators: %s is the course title */
    //         $errors[] = sprintf(__('Course %s already purchased.', 'acadlix'), $order_item['course_title']);
    //     }
    //     $cartItem = acadlix()->model()->courseCart()
    //                 ->where('user_id', $user_id)
    //                 ->where('item_id', $order_item['item_id'])
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
      if ($order->status !== $params['status']) {
        $order->createActivityLog(
          "Order status updated to {$params['status']} by " . get_userdata($admin_id)->display_name
        );
      }
      $order->update([
        'user_id' => $user_id,
        'status' => $params['status'],
        // 'total_amount' => (float) $params['total_amount'],
      ]);

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

      $order->updateOrCreateMeta('billing_info', $billing_info);
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
}
