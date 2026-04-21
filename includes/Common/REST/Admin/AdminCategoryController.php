<?php

namespace Yuvayana\Acadlix\Common\REST\Admin;

use WP_REST_Server;
use WP_REST_Request;
use WP_Error;

defined('ABSPATH') || exit();

class AdminCategoryController
{
  protected $namespace = 'acadlix/v1';
  protected $base = 'admin-category';

  public function register_routes()
  {
    register_rest_route(
      $this->namespace,
      '/' . $this->base,
      [
        [
          'methods' => WP_REST_Server::READABLE,
          'callback' => [$this, 'get_categories'],
          'permission_callback' => function () {
            return current_user_can('acadlix_show_quiz_category');
          }
        ],
        [
          'methods' => WP_REST_Server::CREATABLE,
          'callback' => [$this, 'post_create_category'],
          'permission_callback' => function () {
            return current_user_can('acadlix_add_quiz_category');
          }
        ],
      ]
    );

    register_rest_route(
      $this->namespace,
      '/' . $this->base . '/(?P<category_id>[\d]+)',
      [
        [
          'methods' => WP_REST_Server::READABLE,
          'callback' => [$this, 'get_category_by_id'],
          'permission_callback' => function () {
            return current_user_can('acadlix_edit_quiz_category');
          },
          'args' => array(
            'category_id' => array(
              'validate_callback' => function ($param, $request, $key) {
                return is_numeric($param);
              }
            ),
          ),
        ],
        [
          'methods' => WP_REST_Server::EDITABLE,
          'callback' => [$this, 'update_category_by_id'],
          'permission_callback' => function () {
            return current_user_can('acadlix_edit_quiz_category');
          },
          'args' => array(
            'category_id' => array(
              'validate_callback' => function ($param, $request, $key) {
                return is_numeric($param);
              }
            ),
          ),
        ],
        [
          'methods' => WP_REST_Server::DELETABLE,
          'callback' => [$this, 'delete_category_by_id'],
          'permission_callback' => function () {
            return current_user_can('acadlix_delete_quiz_category');
          },
          'args' => array(
            'category_id' => array(
              'validate_callback' => function ($param, $request, $key) {
                return is_numeric($param);
              }
            ),
          ),
        ],
      ]
    );
  }

  public function get_categories($request)
  {
    $res = [];
    $res['categories'] = acadlix()->model()->category()->all();
    return rest_ensure_response($res);
  }

  public function post_create_category($request)
  {
    $res = [];
    $params = $request->get_json_params();

    if (empty($params["category_name"])) {
      return new WP_Error(
        'missing_category',
        __('Category name is required.', 'acadlix'),
        ['status' => 400]
      );
    }
    $category = acadlix()->model()->category()->create(["category_name" => $params["category_name"]]);

    if (is_wp_error($category)) {
      return new WP_Error(
        'category_not_created',
        __('Failed to create the category.', 'acadlix'),
        ['status' => 500]
      );
    }
    $res['category'] = $category;
    $res['categories'] = acadlix()->model()->category()->all();
    return rest_ensure_response($res);
  }

  public function get_category_by_id($request)
  {
    $res = [];
    $category_id = $request['category_id'];
    $res['category'] = acadlix()->model()->category()->find($category_id);
    return rest_ensure_response($res);
  }

  public function update_category_by_id($request)
  {
    $res = [];
    $category_id = $request['category_id'];
    $params = $request->get_json_params();
    if (empty($category_id)) {
      return new WP_Error(
        'missing_category',
        __('Category id is required.', 'acadlix'),
        ['status' => 400]
      );
    }

    if (empty($params["category_name"])) {
      return new WP_Error(
        'missing_category',
        __('Category name is required.', 'acadlix'),
        ['status' => 400]
      );
    }
    $category = acadlix()->model()->category()->update($category_id, [
      "category_name" => $params["category_name"]
    ]);

    if (is_wp_error($category)) {
      return new WP_Error(
        'category_not_updated',
        __('Failed to update the category.', 'acadlix'),
        ['status' => 500]
      );
    }
    $res['category'] = $category;
    $res['categories'] = acadlix()->model()->category()->all();
    return rest_ensure_response($res);
  }

  public function delete_category_by_id($request)
  {
    $res = [];
    $category_id = $request['category_id'];
    $category = acadlix()->model()->category()->delete($category_id);
    if (is_wp_error($category)) {
      return new WP_Error(
        'category_not_deleted',
        __('Failed to delete the category.', 'acadlix'),
        ['status' => 500]
      );
    }
    $res['category'] = $category;
    $res['categories'] = acadlix()->model()->category()->all();
    return rest_ensure_response($res);
  }
}
