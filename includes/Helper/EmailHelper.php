<?php

namespace Yuvayana\Acadlix\Helper;

use Yuvayana\Acadlix\Models\Course;
use WP_Error;

if (!class_exists('EmailHelper')) {
    class EmailHelper
    {
        protected static $instance = null;

        public static function instance()
        {
            if (!self::$instance) {
                self::$instance = new self();
            }
            return self::$instance;
        }

        public function sendEmail($to, $subject = '', $message = '', $from = '')
        {
            if (is_array($to)) {
                foreach ($to as $email) {
                    if (!is_email($email)) {
                        return new WP_Error('invalid_email', __('Invalid email address', 'acadlix'), ['status' => 400]);
                    }
                }
            } elseif (!is_email($to)) {
                return new WP_Error('invalid_email', __('Invalid email address', 'acadlix'), ['status' => 400]);
            }

            if ($this->contains_html($message)) {
                add_filter('wp_mail_content_type', array($this, 'htmlEmailContent'));
            }
            $headers = "";
            if(!empty($from)){
                $headers = "From: {$from}";
            }
            $mail = wp_mail($to, $subject, $message, $headers);

            if ($this->contains_html($message) && !is_wp_error($mail)) {
                remove_filter('wp_mail_content_type', array($this, 'htmlEmailContent'));
            }
            if (!$mail) {
                return new WP_Error('email_not_sent', __('Email not sent', 'acadlix'), ['status' => 500]);
            }

            return $mail;
        }

        public function htmlEmailContent()
        {
            return 'text/html';
        }

        public function contains_html($content)
        {
            return $content !== strip_tags($content);
        }
    }
}