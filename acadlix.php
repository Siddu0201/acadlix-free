<?php

/**
 * Plugin Name:       Acadlix
 * Description:       Wordpress advance quiz plugin by yuvayana
 * Requires at least: 6.8
 * Requires PHP:      8.0
 * Version:           1.0.0
 * Tested upto:       6.8.1
 * Author:            Team Acadlix
 * Author URI:        https://acadlix.com/
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       acadlix
 * Doman Path:        /languages/
 */


defined('ABSPATH') || exit();


if (!defined('ACADLIX_PLUGIN_FILE')) {
    define('ACADLIX_PLUGIN_FILE', __FILE__);
    include_once 'includes/acadlix-contant.php';
}

if(function_exists('acadlix')){
    return;
}

require_once ACADLIX_INCLUDES_PATH .'/AcadlixAbstract.php';
require_once ACADLIX_INCLUDES_PATH .'/Acadlix.php';
acadlix();
