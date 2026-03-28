<?php

namespace Yuvayana\Acadlix\Common\REST\Admin;

use WP_REST_Server;
use WP_REST_Request;
use WP_Error;

defined('ABSPATH') || exit();

class AdminAddonController
{
  protected $namespace = 'acadlix/v1';

  protected $base = 'admin-addon';

  public function register_routes()
  {
    register_rest_route(
      $this->namespace,
      '/' . $this->base,
      [
        [
          'methods' => WP_REST_Server::READABLE,
          'callback' => [$this, 'get_addons'],
          'permission_callback' => function () {
            return current_user_can('acadlix_show_addon');
          }
        ],
        [
          'methods' => WP_REST_Server::EDITABLE,
          'callback' => [$this, 'post_update_internal_addon'],
          'permission_callback' => function () {
            return current_user_can('acadlix_edit_addon');
          }
        ]
      ]
    );
  }

  public function get_addons($request)
  {
    // $res = $this->addon_list();
    $res = [];
    $res['addons'] = acadlix()->helper()->acadlix_get_all_addons();
    return rest_ensure_response($res);
  }

  public function post_update_internal_addon($request)
  {
    $res = [];
    $key = $request['key'];
    $value = $request['value'];

    if (empty($key) || empty($value)) {
      return new WP_Error(
        'missing_key_value',
        __('Key and value are required.', 'acadlix'),
        ['status' => 400]
      );
    }
    acadlix()->helper()->acadlix_update_option($key, $value);

    $res['message'] = __('Addon updated successfully.', 'acadlix');
    return rest_ensure_response($res);
  }

  public function post_activate_internal_addon($request)
  {

  }

  public function post_deactivate_internal_addon($request)
  {

  }

  public function check_permission()
  {
    return true;
  }
}
