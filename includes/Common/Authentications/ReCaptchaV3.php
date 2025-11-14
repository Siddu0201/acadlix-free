<?php

namespace Yuvayana\Acadlix\Common\Authentications;

use WP_Error;

defined('ABSPATH') || exit();

class ReCaptchaV3
{
    protected $_enabled = false;
    protected $_secret_key = '';
    protected $_site_key = '';
    protected $actions = [];

    public function __construct()
    {
        $this->_enabled = acadlix()->helper()->acadlix_get_option("acadlix_enable_fraud_protection") === "yes";
        $this->_secret_key = acadlix()->helper()->acadlix_get_option("acadlix_v3_secret_key");
        $this->_site_key = acadlix()->helper()->acadlix_get_option("acadlix_v3_site_key");
        $this->actions = ['acadlix_login', 'acadlix_register', 'acadlix_forgot_password'];
    }

    public function is_enabled()
    {
        return $this->_enabled && !empty($this->_secret_key) && !empty($this->_site_key);
    }

    public function verify($token = '')
    {
        if (!$this->is_enabled()) {
            return;
        }

        if (empty($token)) {
            return new WP_Error(
                'acadlix_invalid_token',
                __('Invalid token', 'acadlix'),
                ['status' => 400]
            );
        }

        $verify = wp_remote_post('https://www.google.com/recaptcha/api/siteverify', [
            'body' => [
                'secret'   => $this->_secret_key,
                'response' => $token,
                'remoteip' => $_SERVER['REMOTE_ADDR'],
            ],
        ]);

        $result = json_decode(wp_remote_retrieve_body($verify));
        // error_log(print_r($result, true));
        if (empty($result->success) || $result->score < 0.5) { // score threshold
            return new WP_Error(
                'acadlix_recaptcha_failed',
                __('reCAPTCHA verification failed. Please try again.', 'acadlix'),
                ['status' => 400]
            );
        }

        if(!in_array($result->action, $this->actions)){
            return new WP_Error(
                'acadlix_invalid_action',
                __('Invalid action', 'acadlix'),
                ['status' => 400]
            );
        }

        return;
    }
}
