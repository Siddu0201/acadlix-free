<?php

namespace Yuvayana\Acadlix\Helper;

use Yuvayana\Acadlix\Models\Course;
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
            $helper = Helper::instance();
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
        public function isCourseFree(float $price, float $sale_price): bool
        {
            return 0 == $price && 0 == $sale_price;
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

            if ($course->users_count === 0) {
                return $this->getUserLinkHtml($course->post->post_author);
            }

            $userLinks = [];
            foreach ($course->users as $user) {

                if (is_null($user)) {
                    return new WP_Error("invalid_user", __("The user objects in the course object are invalid.", "acadlix"));
                }

                $userLinks[] = $this->getUserLinkHtml($user->user_id);
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
                'day'  => $days,
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
    }
}
