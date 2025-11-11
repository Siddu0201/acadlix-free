<?php

namespace Yuvayana\Acadlix\Common\Admin;

defined('ABSPATH') || exit();

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

            $username = isset($_POST['username']) ? $_POST['username'] : '';
            $password = isset($_POST['password']) ? $_POST['password'] : '';

            if (empty($username) || empty($password)) {
                wp_send_json_error(['message' => __('All fields are required', 'acadlix')]);
                wp_die();
            }

            if(isset($_POST['g-recaptcha-response'])){
                $recaptchav3 = acadlix()->authentications()->recaptchav3()->verify($_POST['g-recaptcha-response']);
                if (is_wp_error($recaptchav3)) {
                    wp_send_json_error(['message' => $recaptchav3->get_error_message(), 'error_code' => $recaptchav3->get_error_code()]);
                }
            }

            $creds = array(
                'user_login' => $username,
                'user_password' => $password,
                'remember' => true
            );
            $user = wp_signon($creds, false);

            if (is_wp_error($user)) {
                wp_send_json_error(['message' => $user->get_error_message(), 'error_code' => $user->get_error_code()]);
            } else {
                wp_send_json_success(['user' => $user, 'message' => __('Login successful', 'acadlix')]);
            }
            wp_die();
        } catch (\Throwable $th) {
            wp_send_json_error(['message' => $th->getMessage(), 'error_code' => $th->getCode()]);
        }
    }

    public function acadlix_register()
    {
        try {
            check_ajax_referer('wp_rest', 'nonce');

            $username = isset($_POST['username']) ? $_POST['username'] : '';
            $email = isset($_POST['email']) ? filter_var($_POST['email'], FILTER_VALIDATE_EMAIL) : '';
            $password = isset($_POST['password']) ? $_POST['password'] : '';

            // Ensure username, email, and password are provided
            if (empty($username) || empty($email) || empty($password)) {
                wp_send_json_error(['message' => __('All fields are required', 'acadlix')]);
                wp_die();
            }

            if(isset($_POST['g-recaptcha-response'])){
                $recaptchav3 = acadlix()->authentications()->recaptchav3()->verify($_POST['g-recaptcha-response']);
                if (is_wp_error($recaptchav3)) {
                    wp_send_json_error(['message' => $recaptchav3->get_error_message(), 'error_code' => $recaptchav3->get_error_code()]);
                }
            }

            // Register the user
            $user_id = wp_create_user($username, $password, $email);

            if (is_wp_error($user_id)) {
                wp_send_json_error(['message' => $user_id->get_error_message()]);
                wp_die();
            } else {
                // Automatically log in the user
                $creds = array(
                    'user_login' => $username,
                    'user_password' => $password,
                    'remember' => true
                );

                $user = wp_signon($creds, false);

                if (is_wp_error($user)) {
                    wp_send_json_error(['message' => $user->get_error_message()]);
                } else {
                    wp_send_json_success(['user' => $user, 'message' => __('Registration and login successful', 'acadlix')]);
                }
            }
            wp_die();
        } catch (\Throwable $th) {
            wp_send_json_error(['message' => $th->getMessage(), 'error_code' => $th->getCode()]);
        }
    }

    public function acadlix_forgot_password()
    {
        check_ajax_referer('wp_rest', 'nonce');

        $user_identifier = isset($_POST['username']) ? sanitize_text_field(wp_unslash($_POST['username'])) : '';

        if(isset($_POST['g-recaptcha-response'])){
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

    public static function instance()
    {
        if (!self::$_instance) {
            self::$_instance = new self();
        }

        return self::$_instance;
    }
}
