<?php

/**
 * Plugin Name:       Acadlix
 * Description:       Wordpress advance quiz plugin by yuvayana
 * Requires at least: 5.8
 * Requires PHP:      7.4
 * Version:           0.0.1
 * Tested upto:       6.1.1
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

require_once dirname( __FILE__ ) .'/includes/AcadlixAbstract.php';
require_once dirname( __FILE__ ) .'/includes/Acadlix.php';
acadlix();
