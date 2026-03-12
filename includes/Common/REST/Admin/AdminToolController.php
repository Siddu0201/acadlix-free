<?php

namespace Yuvayana\Acadlix\Common\REST\Admin;

use WP_REST_Server;
use WP_Error;

defined('ABSPATH') || exit();

class AdminToolController
{

  protected $namespace = 'acadlix/v1';
  protected $base = 'admin-tool';

  public function register_routes()
  {
    register_rest_route(
      $this->namespace,
      '/' . $this->base . '/import-users',
      [
        [
          'methods' => WP_REST_Server::CREATABLE,
          'callback' => [$this, 'post_import_users'],
          'permission_callback' => function () {
            return current_user_can('acadlix_show_import_export_tool');
          },
        ],
      ]
    );
  }

  public function post_import_users($request)
  {
    $res = [];
    $params = $request->get_json_params();
    // Your logic for importing users goes here
    $users = $params['users'] ?? [];
    if (count($users) === 0) {
      return new WP_Error('no_users', __('No users to import', 'acadlix'), ['status' => 400]);
    }

    foreach ($users as $user) {
      $email = isset($user['user_email']) ? sanitize_email($user['user_email']) : '';
      $password = $user['user_pass'] ?? '';

      if (empty($email) || empty($password)) {
        continue;
      }

      // 2. Determine Login (use email if login is empty)
      $login = !empty($user['user_login']) ? sanitize_user($user['user_login']) : $email;

      // 3. Skip if user_login or email already exists
      if (username_exists($login) || email_exists($email)) {
        continue;
      }

      // 4. Create the User
      $user_id = wp_create_user($login, $password, $email);

      if (is_wp_error($user_id)) {
        continue;
      }

      // Prepare Name Data
      $first_name = sanitize_text_field($user['first_name'] ?? '');
      $last_name = sanitize_text_field($user['last_name'] ?? '');

      // Construct Display Name: "First Last", "First", or fallback to Login
      $display_name = trim("$first_name $last_name");
      if (empty($display_name)) {
        $display_name = $login;
      }

      $user_data = [
        'ID' => $user_id,
        'first_name' => $first_name,
        'last_name' => $last_name,
        'display_name' => $display_name,
        'nickname' => $first_name ? $first_name : $login,
      ];
      wp_update_user($user_data);

      // 5. Save metadata (Phone, Address, etc.)
      update_user_meta($user_id, '_acadlix_profile_phone_number', sanitize_text_field($user['phone'] ?? ''));
      update_user_meta($user_id, '_acadlix_profile_phonecode', sanitize_text_field($user['country_code'] ?? ''));
      update_user_meta($user_id, '_acadlix_profile_address', sanitize_textarea_field($user['address_1'] ?? ''));
      update_user_meta($user_id, '_acadlix_profile_zip_code', sanitize_text_field($user['postcode'] ?? ''));
      update_user_meta($user_id, '_acadlix_profile_city', sanitize_text_field($user['city'] ?? ''));
      update_user_meta($user_id, '_acadlix_profile_state', sanitize_text_field($user['state'] ?? ''));
      update_user_meta($user_id, '_acadlix_profile_country', sanitize_text_field($user['country'] ?? ''));
    }

    $res['message'] = __('Users imported successfully', 'acadlix');
    return rest_ensure_response($res);
  }
}