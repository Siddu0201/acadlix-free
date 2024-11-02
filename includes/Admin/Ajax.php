<?php

namespace Yuvayana\Acadlix\Admin;

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
    }

    public function check_user_login_status()
    {
        if (is_user_logged_in()) {
            wp_send_json_success(array('logged_in' => true, 'user_id' => get_current_user_id(  )));
        } else {
            wp_send_json_success(array('logged_in' => false, 'user_id' => 0));
        }
    
        // Always die in AJAX functions
        wp_die();
    }

    public function acadlix_login()
    {
        check_ajax_referer( "wp_rest", "nonce" );

        $creds = array(
            'user_login'    => isset($_POST['username']) ? sanitize_user(wp_unslash($_POST['username'])) : "",
            'user_password' => isset($_POST['password']) ? sanitize_text_field( wp_unslash( $_POST['password'] ) ) : "",
            'remember'      => true
        );
        $user = wp_signon($creds, false);
    
        if (is_wp_error($user)) {
            wp_send_json_error(['message' => $user->get_error_message()]);
        } else {
            wp_send_json_success(['message' => 'Login successful']);
        }
        wp_die();
    }

    public function acadlix_register()
    {
        check_ajax_referer( "wp_rest", "nonce" );

        $username = isset($_POST['username']) ? sanitize_user($_POST['username']) : "";
        $email = isset($_POST['email']) ? sanitize_email(wp_unslash($_POST['email'])) : "";
        $password = isset($_POST['password']) ? sanitize_text_field( wp_unslash( $_POST['password'] ) ) : "";
    
        // Ensure username, email, and password are provided
        if (empty($username) || empty($email) || empty($password)) {
            wp_send_json_error(['message' => 'All fields are required']);
            wp_die();
        }
    
        // Register the user
        $user_id = wp_create_user($username, $password, $email);
    
        if (is_wp_error($user_id)) {
            wp_send_json_error(['message' => $user_id->get_error_message()]);
            wp_die();
        } else {
            // Automatically log in the user
            $creds = array(
                'user_login'    => $username,
                'user_password' => $password,
                'remember'      => true
            );
    
            $user = wp_signon($creds, false);
    
            if (is_wp_error($user)) {
                wp_send_json_error(['message' => $user->get_error_message()]);
            } else {
                wp_send_json_success(['message' => 'Registration and login successful']);
            }
        }
        wp_die();
    }

    public static function instance()
    {
        if (!self::$_instance) {
            self::$_instance = new self();
        }

        return self::$_instance;
    }
}