<?php

/**
 * Plugin Name:       Acadlix
 * Description:       Wordpress advance quiz plugin by yuvayana
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

if (!defined('ACADLIX_VERSION')) {
    // define('ACADLIX_VERSION', '1.0.1');
    if (!function_exists('get_file_data')) {
        require_once ABSPATH . 'wp-includes/functions.php';
    }

    $plugin_data = get_file_data(__FILE__, ['Version' => 'Version']);
    define('ACADLIX_VERSION', $plugin_data['Version']);
}

if (function_exists('acadlix')) {
    return;
}

require_once ACADLIX_INCLUDES_PATH . '/AcadlixAbstract.php';
require_once ACADLIX_INCLUDES_PATH . '/Acadlix.php';
acadlix();
