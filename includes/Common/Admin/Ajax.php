<?php

namespace Yuvayana\Acadlix\Common\Admin;

defined('ABSPATH') || exit();

use WP_Error;

class Ajax
{
    protected static $_instance = null;

    public function __construct()
    {
        add_action('wp_ajax_check_user_login_status', [$this, 'check_user_login_status']);
        add_action('wp_ajax_nopriv_check_user_login_status', [$this, 'check_user_login_status']);

        add_action('wp_ajax_nopriv_acadlix_login', [$this, 'acadlix_login']);
        add_action('wp_ajax_nopriv_acadlix_register', [$this, 'acadlix_register']);
        add_action('wp_ajax_nopriv_acadlix_forgot_password', [$this, 'acadlix_forgot_password']);

        // action for ajax calls
        add_filter('acadlix_login_pre_validate', [$this, 'acadlix_verify_captcha'], 10, 1);
        add_filter('acadlix_register_pre_validate', [$this, 'acadlix_verify_captcha'], 10, 1);
    }

    public function check_user_login_status()
    {
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

            check_ajax_referer('wp_rest', 'nonce');

            $username = sanitize_text_field($_POST['username'] ?? '');
            $password = sanitize_text_field($_POST['password'] ?? '');

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
                    'message' => $user->get_error_message(),
                ]);
            }

            /**
             * 3. AUTHENTICATED BUT NOT LOGGED-IN YET
             */
            $after_auth = apply_filters('acadlix_login_after_authenticate', [
                'allow_login' => true,
                'user' => $user
            ], $user);

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
            wp_set_auth_cookie($user->ID, true);

            /**
             * 6. FINAL RESPONSE (can be customized entirely)
             */
            $response = apply_filters('acadlix_login_response', [
                'message' => __('Login successful', 'acadlix'),
                'user' => [
                    'ID' => $user->ID,
                    'email' => $user->user_email,
                    'display_name' => $user->display_name,
                ]
            ], $user);

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
            check_ajax_referer('wp_rest', 'nonce');

            $username = sanitize_text_field($_POST['username'] ?? '');
            $email = sanitize_email($_POST['email'] ?? '');
            $password = sanitize_text_field($_POST['password'] ?? '');

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
            $user_id = apply_filters(
                'acadlix_register_create_user',
                wp_create_user($username, $password, $email),
                $username,
                $email,
                $password
            );

            if (is_wp_error($user_id)) {
                wp_send_json_error([
                    'error_stage' => 'create_user',
                    'message' => $user_id->get_error_message(),
                ]);
            }

            /**
             * 4. POST-REGISTRATION HOOK
             *    For: Email verification, profile creation, CRM connection, welcome SMS
             */
            do_action('acadlix_register_after_create', $user_id, $username, $email);

            /**
             * 5. AUTO-LOGIN CONTROL
             *    PRO plugin can disable auto-login (e.g., require email verification)
             */
            $auto_login = apply_filters('acadlix_register_auto_login', true, $user_id);

            if ($auto_login) {
                wp_set_auth_cookie($user_id, true);
            }

            /**
             * 6. FINAL RESPONSE TO FRONTEND (customizable)
             */
            $response = apply_filters('acadlix_register_response', [
                'user_id' => $user_id,
                'auto_login' => $auto_login,
                'message' => __('Registration successful', 'acadlix'),
            ], $user_id);

            wp_send_json_success($response);

        } catch (\Throwable $th) {
            wp_send_json_error([
                'message' => $th->getMessage(),
                'error_code' => $th->getCode()
            ]);
        }
    }


    public function acadlix_forgot_password()
    {
        check_ajax_referer('wp_rest', 'nonce');

        $user_identifier = isset($_POST['username']) ? sanitize_text_field(wp_unslash($_POST['username'])) : '';

        if (isset($_POST['g-recaptcha-response'])) {
            $recaptchav3 = acadlix()->authentications()->recaptchav3()->verify($_POST['g-recaptcha-response']);
            if (is_wp_error($recaptchav3)) {
                wp_send_json_error(['message' => $recaptchav3->get_error_message(), 'error_code' => $recaptchav3->get_error_code()]);
            }
        }

        if (is_email($user_identifier)) {
            // If it's an email, get the user by email
            $user = get_user_by('email', $user_identifier);
            if (!$user) {
                return wp_send_json_error(['message' => __('This email is not registered.', 'acadlix')]);
            }
        } else {
            // Otherwise, assume it's a username
            $user = get_user_by('login', $user_identifier);
            if (!$user) {
                return wp_send_json_error(['message' => __('This username is not registered.', 'acadlix')]);
            }
        }

        // // Register the user
        $result = retrieve_password($user->user_login);
        if (is_wp_error($result)) {
            return wp_send_json_error(['message' => $result->get_error_message()]);
        }

        return wp_send_json_success(array(
            'message' => __('Password reset email sent successfully.', 'acadlix'),
        ));
    }

    public function acadlix_verify_captcha($return)
    {
        if(!acadlix()->authentications()->recaptchav3()->is_enabled()){
            return $return; // skip if captcha not enabled
        }
        if (empty($_POST['g-recaptcha-response'])) {
            return new WP_Error('captcha_missing', __('Captcha is required.', 'acadlix'));
        }

        // Call your existing captcha class
        $verify = acadlix()->authentications()->recaptchav3()->verify(
            $_POST['g-recaptcha-response']
        );

        if (is_wp_error($verify)) {
            return new WP_Error('captcha_invalid', $verify->get_error_message());
        }

        return $return; // no error → continue login pipeline
    }

    public static function instance()
    {
        if (!self::$_instance) {
            self::$_instance = new self();
        }

        return self::$_instance;
    }
}
