<?php

/**
 * Plugin Name:       Acadlix
 * Description:       Acadlix is a feature-rich LMS plugin for WordPress, designed to transform your website into a complete e-learning platform. With Acadlix, you can effortlessly create and sell online courses, test series, quizzes, and assignments.
 * Requires at least: 6.8
 * Requires PHP:      8.0
 * Version:           {{VERSION}}
 * Tested upto:       6.8.1
 * Author:            Team Acadlix
 * Author URI:        https://acadlix.com/
 * Text Domain:       acadlix
 * Doman Path:        /languages/Common/
 */


defined('ABSPATH') || exit();


if (!defined('ACADLIX_PLUGIN_FILE')) {
    define('ACADLIX_PLUGIN_FILE', __FILE__);
    include_once 'includes/acadlix-contant.php';
}

if (function_exists('acadlix')) {
    return;
}

require_once ACADLIX_INCLUDES_PATH . '/AcadlixAbstract.php';
require_once ACADLIX_INCLUDES_PATH . '/Acadlix.php';
acadlix();
