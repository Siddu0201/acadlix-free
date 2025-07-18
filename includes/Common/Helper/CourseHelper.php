<?php

namespace Yuvayana\Acadlix\Common\Helper;

use Yuvayana\Acadlix\Common\Models\Course;
use WP_Error;

if (!class_exists('CourseHelper')) {
    class CourseHelper
    {
        protected static $instance = null;

        public static function instance()
        {
            if (!self::$instance) {
                self::$instance = new self();
            }
            return self::$instance;
        }

        /**
         * Return the course level name based on the given level string.
         *
         * @param string $level The course level, one of "all_level", "beginner", "intermediate", "advance"
         * @return string The course level name
         */
        public function getCourseLevelName(string $level = ""): string
        {
            $courseLevels = [
                "all_level" => __("All Level", "acadlix"),
                "beginner" => __("Beginner", "acadlix"),
                "intermediate" => __("Intermediate", "acadlix"),
                "advance" => __("Advance", "acadlix"),
            ];

            return $courseLevels[$level] ?? __("All Level", "acadlix");
        }


        /**
         * Format the price according to the currency settings and return it as a string.
         *
         * @param float $price The price to be formatted.
         *
         * @return string|Wp_Error The formatted price or a Wp_Error object if an error occurs.
         */
        public function getCoursePrice(float $price): string|Wp_Error
        {
            $helper = acadlix()->helper();
            $currency_option = $helper->acadlix_get_option("acadlix_currency");
            $currency_position_option = $helper->acadlix_get_option("acadlix_currency_position");

            if (is_null($currency_option) || is_null($currency_position_option)) {
                return new WP_Error("currency_not_configured", __("Currency settings are not configured properly.", "acadlix"));
            }

            $currency_symbols = $helper->acadlix_currency_symbols();

            if (!array_key_exists($currency_option, $currency_symbols)) {
                return new Wp_Error("currency_symbol_not_found", __("Currency symbol not found for the selected currency.", "acadlix"));
            }

            $currency_symbol = $currency_symbols[$currency_option];

            return match ($currency_position_option) {
                "Left ( $99.99 )" => "$currency_symbol$price",
                "Right ( 99.99$ )" => "$price$currency_symbol",
                "Left with space ( $ 99.99 )" => "$currency_symbol $price",
                "Right with space ( 99.99 $ )" => "$price $currency_symbol",
                default => "$currency_symbol$price",
            };
        }

        /**
         * Determines if a course is free based on its price and sale price.
         *
         * @param float $price The original price of the course.
         * @param float $sale_price The sale price of the course.
         * 
         * @return bool True if both the price and sale price are zero, indicating the course is free; otherwise, false.
         */
        public function isCourseFree(float $price, bool $enable_sale_price, float $sale_price): bool
        {
            return $enable_sale_price ? 0 == $sale_price : 0 == $price;
        }


        /**
         * Generates an HTML string containing links to the profile pages of users enrolled in a course.
         *
         * @param Course $course The course object to generate the links for.
         *
         * @return string An HTML string containing the links to the user profile pages.
         *
         * @throws WP_Error If the course object is invalid or if the user objects in the course object are invalid.
         */
        public function getCourseUserHtml(Course $course): string|WP_Error
        {
            if (is_null($course) || !($course instanceof Course)) {
                return new WP_Error("invalid_course", __("The course object is invalid.", "acadlix"));
            }

            if (count($course->users) === 0) {
                return $this->getUserLinkHtml($course->post_author);
            }

            $userLinks = [];
            foreach ($course->users as $user) {

                if (is_null($user)) {
                    return new WP_Error("invalid_user", __("The user objects in the course object are invalid.", "acadlix"));
                }

                $userLinks[] = $this->getUserLinkHtml($user->ID);
            }

            return implode(', ', $userLinks);
        }

        /**
         * Generates an HTML link to a user's profile page.
         *
         * @param int $userId The ID of the user to generate a link for.
         *
         * @return string An HTML link to the user's profile page.
         */
        public function getUserLinkHtml(int $userId): string
        {
            $userInfo = get_userdata($userId);

            return sprintf(
                '<a href="%s">%s</a>',
                esc_url(get_author_posts_url($userId)),
                esc_html($userInfo->display_name)
            );
        }

        /**
         * Converts an integer representation of time (hours, minutes, seconds) into a standardized string format (HH:MM:SS).
         *
         * @param int $hours   The number of hours.
         * @param int $minutes The number of minutes.
         * @param int $seconds The number of seconds.
         *
         * @return string The time in the standardized string format.
         */
        public function intToTimeFormat(int $hours, int $minutes, int $seconds): string
        {
            return sprintf('%02d:%02d:%02d', $hours, $minutes, $seconds);
        }

        /**
         * Converts an integer representation of time (weeks, days, hours, minutes) into a readable string format.
         *
         * @param int $weeks   The number of weeks.
         * @param int $days    The number of days.
         * @param int $hours   The number of hours.
         * @param int $minutes The number of minutes.
         *
         * @return string The time in a readable string format.
         */
        public function getCourseDuration(int $weeks, int $days, int $hours, int $minutes): string
        {
            $parts = [];
            $timeUnits = [
                'week' => $weeks,
                'day' => $days,
                'hour' => $hours,
                'minute' => $minutes,
            ];

            foreach ($timeUnits as $unit => $value) {
                if ($value > 0) {
                    $parts[] = $value . ' ' . $unit . ($value > 1 ? 's' : '');
                }
            }

            return implode(' ', $parts);
        }

        /**
         * Checks if a course registration is open based on the given start and end dates.
         * 
         * @param string $start_date The start date of the registration period.
         * @param string $end_date The end date of the registration period.
         * 
         * @return array An associative array containing the status of the registration (true or false) and a message.
         */
        public function checkRegistrationDate($start_date, $end_date)
        {
            // Initialize the response array
            $response = [
                'status' => true,
                'message' => __('Registration is open.', 'acadlix'),
            ];

            // Check for null or empty values
            if (empty($start_date) && empty($end_date)) {
                return $response;
            }
            $timezone_string = acadlix()->helper()->acadlix_get_time_zone_string();
            // Get current date/time in WordPress timezone
            $current_timestamp = strtotime(wp_date('Y-m-d H:i:s'));
            $dateTimeFormat = acadlix()->helper()->acadlix_get_date_time_format();
            // Check start_date
            if (!empty($start_date) && $current_timestamp < strtotime($start_date)) {
                /* translators: 1: Registration start date, 2: Timezone string */
                $message = sprintf(esc_html__('Registration opens after: %1$s %2$s', 'acadlix'),date($dateTimeFormat, strtotime($start_date)), $timezone_string);
                return [
                    'status' => false,
                    'message' => $message,
                ];
            }

            // Check end_date
            if (!empty($end_date) && $current_timestamp > strtotime($end_date)) {
                return [
                    'status' => false,
                    'message' => __('Registration is closed', 'acadlix'),
                ];
            }

            return $response;
        }

        public function handleCoursePurchaseEmail($order_id = 0)
        {
            if ($order_id == 0) {
                return;
            }

            $order = acadlix()->model()->order()->find($order_id);
            if (!$order || $order->status !== "success") {
                return;
            }
            $r = [
                '$order_id' => $order_id,
                '$username' => $order->user->display_name ?? "",
                '$course_names' => $order->getCourseNames(),
                '$order_amount' => $this->getCoursePrice($order->total_amount),
                '$payment_method' => $order->getMetaValue("payment_method") ?? __("Free", 'acadlix'),
                '$order_date' => acadlix()->helper()->formatDate($order->updated_at),
                '$year' => date('Y'),
                '$sitename' => get_bloginfo('name'),
                '$admin_order_url' => admin_url('admin.php?page=acadlix_order')
            ];
            $student_email = $order->user->user_email;
            $acadlix_notify_course_purchase_to_student = acadlix()->helper()->acadlix_get_option("acadlix_notify_course_purchase_to_student");
            if ($acadlix_notify_course_purchase_to_student == "yes" && !empty($student_email)) {
                $student_email_template = acadlix()->helper()->acadlix_get_email_template("CoursePurchase.html", "student");
                $student_msg = str_replace(array_keys($r), $r, $student_email_template);
                /* translators: %d is the order ID */
                $student_subject = sprintf(esc_html__('Your order #%d confirmed!', 'acadlix'), $order_id);
                acadlix()->helper()->email()->sendEmail(
                    $student_email,
                    $student_subject,
                    $student_msg
                );
            }

            $acadlix_notify_course_purchase_to_admin = acadlix()->helper()->acadlix_get_option("acadlix_notify_course_purchase_to_admin");
            $admins = get_users(['role' => 'administrator']);
            $admin_emails = wp_list_pluck($admins, 'user_email');
            if ($acadlix_notify_course_purchase_to_admin == "yes" && !empty($admin_emails)) {
                $admin_email_template = acadlix()->helper()->acadlix_get_email_template("CoursePurchase.html", "admin");
                $admin_msg = str_replace(array_keys($r), $r, $admin_email_template);
                /* translators: %d is the order ID */
                $admin_subject = sprintf(esc_html__('New order received #%d', 'acadlix'), $order_id);
                acadlix()->helper()->email()->sendEmail(
                    $admin_emails,
                    $admin_subject,
                    $admin_msg
                );
            }
        }

        public function handleFailedTransationEmail($order_id = 0)
        {
            if ($order_id == 0) {
                return;
            }
            $order = acadlix()->model()->order()->find($order_id);
            if (!$order || $order->status !== "failed") {
                return;
            }
            $r = [
                '$order_id' => $order_id,
                '$username' => $order->user->display_name ?? "",
                '$course_names' => $order->getCourseNames(),
                '$order_amount' => $this->getCoursePrice($order->total_amount),
                '$payment_method' => $order->getMetaValue("payment_method") ?? __("Free", 'acadlix'),
                '$order_date' => acadlix()->helper()->formatDate($order->updated_at),
                '$year' => date('Y'),
                '$sitename' => get_bloginfo('name'),
                '$admin_order_url' => admin_url('admin.php?page=acadlix_order')
            ];
            $student_email = $order->user->user_email;
            $acadlix_notify_failed_transation_to_student = acadlix()->helper()->acadlix_get_option("acadlix_notify_failed_transation_to_student");
            if ($acadlix_notify_failed_transation_to_student == "yes" && !empty($student_email)) {
                $student_email_template = acadlix()->helper()->acadlix_get_email_template("FailedTransation.html", "student");
                $student_msg = str_replace(array_keys($r), $r, $student_email_template);
                /* translators: %d is the order ID */
                $student_subject = sprintf(esc_html__('Payement failed for order #%d', 'acadlix'), $order_id);
                acadlix()->helper()->email()->sendEmail(
                    $student_email,
                    $student_subject,
                    $student_msg
                );
            }

            $acadlix_notify_failed_transation_to_admin = acadlix()->helper()->acadlix_get_option("acadlix_notify_failed_transation_to_admin");
            $admins = get_users(['role' => 'administrator']);
            $admin_emails = wp_list_pluck($admins, 'user_email');
            if ($acadlix_notify_failed_transation_to_admin == "yes" && !empty($admin_emails)) {
                $admin_email_template = acadlix()->helper()->acadlix_get_email_template("FailedTransation.html", "admin");
                $admin_msg = str_replace(array_keys($r), $r, $admin_email_template);
                /* translators: %d is the order ID */
                $admin_subject = sprintf(esc_html__('Payment failed for order #%d', 'acadlix'), $order_id);
                acadlix()->helper()->email()->sendEmail(
                    $admin_emails,
                    $admin_subject,
                    $admin_msg
                );
            }
        }


        public function handleCourseCompletionEmail($order_item_id = 0)
        {
            if ($order_item_id == 0) {
                return;
            }
            $order_item = acadlix()->model()->orderItem()->with(['course'])->find($order_item_id);

            if (!$order_item || empty($order_item->course_id)) {
                return "";
            }

            $course_completion_percentage = $order_item->course_completion_percentage ?? 0;
            if ($course_completion_percentage != 100) {
                return "";
            }
            $r = [
                '$username' => $order_item->order->user->display_name ?? "",
                '$coursename' => $order_item->course->title ?? $order_item->course_title ?? "",
                '$date' => acadlix()->helper()->formatDate(current_time('mysql')),
                '$year' => date('Y'),
                '$sitename' => get_bloginfo('name'),
            ];

            $student_email = $order_item->order->user->user_email;
            $acadlix_notify_course_completion_to_student = acadlix()->helper()->acadlix_get_option("acadlix_notify_course_completion_to_student");
            if ($acadlix_notify_course_completion_to_student == "yes" && !empty($student_email)) {
                $student_email_template = acadlix()->helper()->acadlix_get_email_template("CourseCompletion.html", "student");
                $student_msg = str_replace(array_keys($r), $r, $student_email_template);
                /* translators: %s is the course name */
                $student_subject = sprintf(esc_html__('You have completed %s!', 'acadlix'), $r['$coursename']);
                acadlix()->helper()->email()->sendEmail(
                    $student_email,
                    $student_subject,
                    $student_msg
                );
            }

            $acadlix_notify_course_completion_to_admin = acadlix()->helper()->acadlix_get_option("acadlix_notify_course_completion_to_admin");
            $admins = get_users(['role' => 'administrator']);
            $admin_emails = wp_list_pluck($admins, 'user_email');
            if ($acadlix_notify_course_completion_to_admin == "yes" && !empty($admin_emails)) {
                $admin_email_template = acadlix()->helper()->acadlix_get_email_template("CourseCompletion.html", "admin");
                $admin_msg = str_replace(array_keys($r), $r, $admin_email_template);
                /* translators: 1: %s is the username, 2: %s is the coursename */
                $admin_subject = sprintf(esc_html__('%1$s has completed %2$s', 'acadlix'), $r['$username'], $r['$coursename']);
                acadlix()->helper()->email()->sendEmail(
                    $admin_emails,
                    $admin_subject,
                    $admin_msg
                );
            }
        }
    }
}
