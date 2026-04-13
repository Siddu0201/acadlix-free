<?php

namespace Yuvayana\Acadlix\Common\Admin;

defined('ABSPATH') || exit();

use WP_Error;

class Ajax
{
  protected static $_instance = null;

  public function __construct()
  {
    add_action('wp_ajax_acadlix_check_user_login_status', [$this, 'acadlix_check_user_login_status']);
    add_action('wp_ajax_nopriv_acadlix_check_user_login_status', [$this, 'acadlix_check_user_login_status']);

    add_action('wp_ajax_nopriv_acadlix_login', [$this, 'acadlix_login']);
    add_action('wp_ajax_nopriv_acadlix_register', [$this, 'acadlix_register']);
    add_action('wp_ajax_nopriv_acadlix_forgot_password', [$this, 'acadlix_forgot_password']);

    // action for ajax calls
    add_filter('acadlix_login_pre_validate', [$this, 'acadlix_verify_captcha'], 10, 1);
    add_filter('acadlix_register_pre_validate', [$this, 'acadlix_verify_captcha'], 10, 1);

    // For course filtering (frontend)
    add_action('wp_ajax_acadlix_filter_courses', [$this, 'acadlix_filter_courses']);
    add_action('wp_ajax_nopriv_acadlix_filter_courses', [$this, 'acadlix_filter_courses']);
  }

  public function acadlix_check_user_login_status()
  {
    $nonce = isset($_POST['nonce']) ? sanitize_text_field(wp_unslash($_POST['nonce'])) : '';
    if (
      empty($nonce) ||
      !wp_verify_nonce($nonce, 'acadlix_auth_nonce')
    ) {
      wp_send_json_error([
        'message' => __('Invalid nonce', 'acadlix'),
        'error_code' => 'invalid_nonce'
      ], 403);
    }
    if (is_user_logged_in()) {
      wp_send_json_success(array('logged_in' => true, 'user_id' => get_current_user_id()));
    } else {
      wp_send_json_success(array('logged_in' => false, 'user_id' => 0));
    }

    // Always die in AJAX functions
    wp_die();
  }

  public function acadlix_login()
  {
    try {
      $nonce = isset($_POST['nonce']) ? sanitize_text_field(wp_unslash($_POST['nonce'])) : '';
      if (
        empty($nonce) ||
        !wp_verify_nonce($nonce, 'acadlix_auth_nonce')
      ) {
        wp_send_json_error([
          'message' => __('Invalid nonce', 'acadlix'),
          'error_code' => 'invalid_nonce'
        ], 403);
      }

      $username = isset($_POST['username'])
        ? sanitize_text_field(wp_unslash($_POST['username']))
        : '';
      $password = isset($_POST['password'])
        ? wp_unslash($_POST['password']) // phpcs:ignore
        : '';
      $remember = isset($_POST['remember'])
        ? (bool) wp_unslash($_POST['remember']) // phpcs:ignore
        : true;

      /**
       * 1. PRE-VALIDATION HOOK
       *    For: rate limits, IP blocking, captcha, maintenance mode
       */
      $pre = apply_filters('acadlix_login_pre_validate', null, $username, $password);
      if ($pre instanceof WP_Error) {
        wp_send_json_error([
          'error_stage' => 'pre_validate',
          'message' => $pre->get_error_message(),
        ]);
      }

      /**
       * 2. CORE USER VALIDATION
       */
      $user = apply_filters(
        'acadlix_login_validate_credentials',
        wp_authenticate($username, $password),
        $username,
        $password
      );

      if (is_wp_error($user)) {
        wp_send_json_error([
          'error_stage' => 'credentials',
          'message' => __('Invalid email/username or password.', 'acadlix')
        ]);
      }

      /**
       * 3. AUTHENTICATED BUT NOT LOGGED-IN YET
       */
      $after_auth = apply_filters('acadlix_login_after_authenticate', [
        'allow_login' => true,
        'user' => $user
      ], $user);

      if ($after_auth instanceof WP_Error) {
        wp_send_json_error([
          'error_stage' => 'after_authenticate',
          'message' => $after_auth->get_error_message(),
        ]);
      }

      if (!$after_auth['allow_login']) {
        // PRO plugin will return custom JSON (e.g., MFA REQUIRED)
        wp_send_json_success($after_auth);
      }

      /**
       * 4. PRE-SIGNON HOOK
       *    Good for logging, security events, device fingerprinting
       */
      do_action('acadlix_login_pre_signon', $user);

      /**
       * 5. LOG THE USER IN
       */
      $creds = array(
        'user_login' => $username,
        'user_password' => $password,
        'remember' => $remember,
      );
      $user = wp_signon($creds, false);
      if (is_wp_error($user)) {
        wp_send_json_error([
          'error_stage' => 'signon',
          'message' => $user->get_error_message(),
        ]);
      }

      /**
       * 6. FINAL RESPONSE (can be customized entirely)
       */
      $response = apply_filters('acadlix_login_response', [
        'message' => __('Login successful', 'acadlix'),
        'user' => [
          'ID' => $user->ID,
          'user_email' => $user->user_email,
          'display_name' => $user->display_name,
        ]
      ], $user);

      if ($response instanceof WP_Error) {
        wp_send_json_error([
          'error_stage' => 'final_response',
          'message' => $response->get_error_message(),
        ]);
      }

      wp_send_json_success($response);
    } catch (\Throwable $th) {
      wp_send_json_error([
        'message' => $th->getMessage(),
        'error_code' => $th->getCode()
      ]);
    }
  }


  public function acadlix_register()
  {
    try {
      $nonce = isset($_POST['nonce']) ? sanitize_text_field(wp_unslash($_POST['nonce'])) : '';
      if (
        empty($nonce) ||
        !wp_verify_nonce($nonce, 'acadlix_auth_nonce')
      ) {
        wp_send_json_error([
          'message' => __('Invalid nonce', 'acadlix'),
          'error_code' => 'invalid_nonce'
        ], 403);
      }

      $username = isset($_POST['username'])
        ? sanitize_text_field(wp_unslash($_POST['username']))
        : '';

      $email = isset($_POST['email'])
        ? sanitize_email(wp_unslash($_POST['email']))
        : '';

      // ❗ Password must NOT be sanitized
      $password = isset($_POST['password'])
        ? wp_unslash($_POST['password']) // phpcs:ignore
        : '';

      $phonecode = isset($_POST['phonecode'])
        ? sanitize_text_field(wp_unslash($_POST['phonecode']))
        : '';
      
      $isocode = isset($_POST['isocode'])
        ? sanitize_text_field(wp_unslash($_POST['isocode']))
        : '';

      $phone_number = isset($_POST['phone_number'])
        ? sanitize_text_field(wp_unslash($_POST['phone_number']))
        : '';

      // check if phone number are already used by another user
      if (!empty($phone_number)) {
        // 1. Find all user IDs that use this phone number
        $user_ids_with_number = get_users(array(
          'meta_key' => acadlix()->helper()->acadlix_get_option("acadlix_phone_user_meta_key", '_acadlix_profile_phone_number'),
          'meta_value' => $phone_number,
          'fields' => 'ID',
        ));
        if (!empty($user_ids_with_number)) {
          // 2. Out of those users, check if any have the same phone code
          $existing_user = get_users(array(
            'include' => $user_ids_with_number,
            'meta_key' => acadlix()->helper()->acadlix_get_option("acadlix_phonecode_user_meta_key", '_acadlix_profile_phonecode'),
            'meta_value' => $phonecode,
            'fields' => 'ID',
            'number' => 1
          ));

          if (!empty($existing_user)) {
            wp_send_json_error(['message' => __('This phone number with this country code is already in use.', 'acadlix')]);
          }
        }
      }


      /**
       * 1. PRE-VALIDATION
       *    For captcha, IP checks, maintenance mode, closed registration etc.
       */
      $pre = apply_filters('acadlix_register_pre_validate', null, $username, $email, $password);
      if ($pre instanceof WP_Error) {
        wp_send_json_error([
          'error_stage' => 'pre_validate',
          'message' => $pre->get_error_message(),
        ]);
      }

      /**
       * 2. FIELD VALIDATION HOOK
       *    Add: password strength, email domain restriction, username rules, etc
       */
      $validate = apply_filters('acadlix_register_validate_fields', null, $username, $email, $password);
      if ($validate instanceof WP_Error) {
        wp_send_json_error([
          'error_stage' => 'field_validation',
          'message' => $validate->get_error_message(),
        ]);
      }

      /**
       * 3. CORE REGISTRATION LOGIC (filterable)
       *    PRO plugin can override user creation logic completely.
       */
      $user_meta = [
        acadlix()->helper()->acadlix_get_option("acadlix_phonecode_user_meta_key", '_acadlix_profile_phonecode') => $phonecode,
        acadlix()->helper()->acadlix_get_option("acadlix_isocode_user_meta_key", '_acadlix_profile_isocode') => $isocode,
        acadlix()->helper()->acadlix_get_option("acadlix_phone_user_meta_key", '_acadlix_profile_phone_number') => $phone_number,
      ];

      $user_id = $this->acadlix_register_user(
        $username,
        $email,
        $password,
        [],
        $user_meta,
        true
      );

      if (is_wp_error($user_id)) {
        wp_send_json_error([
          'error_stage' => 'create_user',
          'message' => $user_id->get_error_message(),
        ]);
      }

      /**
       * 4. FINAL RESPONSE TO FRONTEND (customizable)
       */
      $user = get_user_by('id', $user_id);
      $response = apply_filters('acadlix_register_response', [
        'user_id' => $user_id,
        'message' => __('Registration successful', 'acadlix'),
        'user' => [
          'ID' => $user->ID,
          'user_email' => $user->user_email,
          'display_name' => $user->display_name,
        ]
      ], $user_id);

      if ($response instanceof WP_Error) {
        wp_send_json_error([
          'error_stage' => 'final_response',
          'message' => $response->get_error_message(),
        ]);
      }

      wp_send_json_success($response);

    } catch (\Throwable $th) {
      wp_send_json_error([
        'message' => $th->getMessage(),
        'error_code' => $th->getCode()
      ]);
    }
  }

  protected function acadlix_register_user(
    $username,
    $email,
    $password = '',
    $user_data = [],
    $user_meta = [],
    $auto_login = false
  ) {
    if (empty($username) || empty($email)) {
      return new WP_Error('missing_fields', __('Username and email are required.', 'acadlix'));
    }

    if (!is_email($email)) {
      return new WP_Error('invalid_email', __('Invalid email address.', 'acadlix'));
    }

    if (username_exists($username)) {
      return new WP_Error('username_exists', __('Username already exists.', 'acadlix'));
    }

    if (email_exists($email)) {
      return new WP_Error('email_exists', __('Email already registered.', 'acadlix'));
    }

    if (empty($password)) {
      $password = wp_generate_password(12, false);
    }

    $user_can_register = acadlix()->helper()->acadlix_get_option("users_can_register", false);
    if (!$user_can_register) {
      return new WP_Error('registration_disabled', __('User registration is currently disabled.', 'acadlix'));
    }

    // Create user
    $user_id = apply_filters(
      'acadlix_register_user',
      wp_create_user($username, $password, $email),
      $username,
      $email,
      $password
    );
    if (is_wp_error($user_id)) {
      return $user_id; // return error if user creation failed WP_Error
    }

    do_action('acadlix_register_after_create', $user_id, $username, $email);

    // Update user data
    if (!empty($user_data)) {
      $user_data['ID'] = $user_id;
      wp_update_user($user_data);
    }

    // Add user meta
    if (!empty($user_meta)) {
      foreach ($user_meta as $meta_key => $meta_value) {
        update_user_meta($user_id, $meta_key, $meta_value);
      }
    }

    $auto_login = apply_filters(
      'acadlix_register_auto_login',
      $auto_login,
      $user_id
    );

    if (is_wp_error($auto_login)) {
      return $auto_login;
    }

    // Auto login
    if ($auto_login) {
      wp_set_current_user($user_id);
      wp_set_auth_cookie($user_id, true);

      do_action('wp_login', $username, get_user_by('id', $user_id)); // phpcs:ignore
    }

    return $user_id;
  }

  public function acadlix_forgot_password()
  {
    try {
      $nonce = isset($_POST['nonce']) ? sanitize_text_field(wp_unslash($_POST['nonce'])) : '';
      if (
        empty($nonce) ||
        !wp_verify_nonce($nonce, 'acadlix_auth_nonce')
      ) {
        wp_send_json_error([
          'message' => __('Invalid nonce', 'acadlix'),
          'error_code' => 'invalid_nonce'
        ], 403);
      }

      $user_identifier = isset($_POST['username'])
        ? sanitize_text_field(wp_unslash($_POST['username']))
        : '';

      if (empty($user_identifier)) {
        wp_send_json_error(
          [
            'message' => __('Please enter a username or email address.', 'acadlix'),
          ]
        );
      }

      // ---------------------------
      // reCAPTCHA (optional)
      // ---------------------------
      if (isset($_POST['g-recaptcha-response'])) {

        $recaptcha_response = sanitize_text_field(
          wp_unslash($_POST['g-recaptcha-response'])
        );

        $recaptchav3 = acadlix()
          ->authentications()
          ->recaptchav3()
          ->verify($recaptcha_response);

        if (is_wp_error($recaptchav3)) {
          wp_send_json_error(
            [
              'message' => $recaptchav3->get_error_message(),
              'error_code' => $recaptchav3->get_error_code(),
            ]
          );
        }
      }

      // // Register the user
      $result = retrieve_password($user_identifier);
      if (is_wp_error($result)) {
        return wp_send_json_error(['message' => $result->get_error_message()]);
      }

      return wp_send_json_success(array(
        'message' => __('Password reset email sent successfully.', 'acadlix'),
      ));

    } catch (\Throwable $th) {
      // ❗ Do not expose internal errors
      wp_send_json_error(
        [
          'message' => __('Unexpected error occurred.', 'acadlix'),
          'error_code' => 'server_error',
        ],
        500
      );
    }
  }

  public function acadlix_verify_captcha($return)
  {
    if (!acadlix()->authentications()->recaptchav3()->is_enabled()) {
      return $return; // skip if captcha not enabled
    }
    if (empty($_POST['g-recaptcha-response'])) { // phpcs:ignore
      return new WP_Error('captcha_missing', __('Captcha is required.', 'acadlix'));
    }

    $captcha_token = sanitize_text_field(
      wp_unslash($_POST['g-recaptcha-response']) // phpcs:ignore
    );

    // Call your existing captcha class
    $verify = acadlix()->authentications()->recaptchav3()->verify(
      $captcha_token
    );

    if (is_wp_error($verify)) {
      return new WP_Error('captcha_invalid', $verify->get_error_message());
    }

    return $return; // no error → continue login pipeline
  }

  public function acadlix_filter_courses()
  {
    $nonce = isset($_POST['nonce']) ? sanitize_text_field(wp_unslash($_POST['nonce'])) : '';
    if (
      empty($nonce) ||
      !wp_verify_nonce($nonce, 'acadlix_course_nonce')
    ) {
      wp_send_json_error([
        'message' => __('Invalid nonce', 'acadlix'),
        'error_code' => 'invalid_nonce'
      ], 403);
    }

    $context = isset($_POST['context']) ? sanitize_text_field(wp_unslash($_POST['context'])) : '';
    $term_id = isset($_POST['term_id']) ? intval($_POST['term_id']) : 0;

    $categories = isset($_POST['categories'])
      ? json_decode(wp_unslash($_POST['categories']), true) // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
      : [];

    $search = isset($_POST['search'])
      ? sanitize_text_field(wp_unslash($_POST['search']))
      : '';
    $page = isset($_POST['page']) ? max(1, intval($_POST['page']))
      : 1;
    $coursesPerPage = acadlix()->helper()->acadlix_get_option('acadlix_no_of_courses_per_page');

    $allCourseView = acadlix()->view()->allCourse();
    $query = $allCourseView->setup_query(
      $search,
      $categories,
      $term_id,
      $context,
      $page,
      $coursesPerPage
    );
    $total_courses = $query['course_count'];
    $courses = $query['courses'];

    $allCourseView->setPage($page);
    $allCourseView->setCourseCount($total_courses);
    ob_start();
    add_filter('acadlix_course_page_context', function () {
      return ACADLIX_COURSE_CPT;
    });
    $allCourseView->render_all_courses($courses);
    $rendered_courses = ob_get_clean();

    wp_send_json_success([
      'courses' => $rendered_courses,
    ]);
  }



  public static function instance()
  {
    if (!self::$_instance) {
      self::$_instance = new self();
    }

    return self::$_instance;
  }
}
