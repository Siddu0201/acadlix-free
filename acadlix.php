<?php

/**
 * Plugin Name:       Acadlix
 * Description:       Acadlix is a feature-rich LMS plugin for WordPress, designed to transform your website into a complete e-learning platform. With Acadlix, you can effortlessly create and sell online courses, test series, quizzes, and assignments.
 * Version:           {{VERSION}}
 * Tested upto:       6.8.2
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

if ( ! version_compare( PHP_VERSION, '8.2', '>=' ) ) {
    add_action( 'admin_notices', function() {
        ?>
        <div class="notice notice-warning">
            <p><?php printf( __( 'Acadlix requires PHP %s or higher. You are running PHP %s.', 'acadlix' ), '8.2', PHP_VERSION ); ?></p>
        </div>
        <?php
    } );
    return;
}

if(!version_compare(get_bloginfo( 'version' ), '6.8', '>=')) {
    add_action( 'admin_notices', function() {
        ?>
        <div class="notice notice-warning">
            <p><?php printf( __( 'Acadlix requires WordPress %s or higher. You are running WordPress %s.', 'acadlix' ), '6.8', get_bloginfo( 'version' ) ); ?></p>
        </div>
        <?php
    } );
    return;
}

if (function_exists('acadlix')) {
    return;
}

require_once ACADLIX_INCLUDES_PATH . '/AcadlixAbstract.php';
require_once ACADLIX_INCLUDES_PATH . '/Acadlix.php';
acadlix();
