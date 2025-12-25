<?php

/**
 * Plugin Name:       Acadlix
 * Description:       Acadlix is a feature-rich LMS plugin for WordPress, designed to transform your website into a complete e-learning platform. With Acadlix, you can effortlessly create and sell online courses, test series, quizzes, and assignments.
 * Version:           {{VERSION}}
 * Tested upto:       6.8.2
 * Author:            Team Acadlix
 * Author URI:        https://acadlix.com/
 * Text Domain:       acadlix
 * Domain Path:        /languages/Common/
 */


defined('ABSPATH') || exit();


if (!defined('ACADLIX_PLUGIN_FILE')) {
    define('ACADLIX_PLUGIN_FILE', __FILE__);
    include_once 'includes/acadlix-constant.php';
}

if (!defined('ACADLIX_PLUGIN_TYPE')) {
    define('ACADLIX_PLUGIN_TYPE', '{{PLUGIN_TYPE}}');
}

if (!defined('ACADLIX_SIBLING_PLUGIN')) {
    define('ACADLIX_SIBLING_PLUGIN', '{{SIBLING_PLUGIN_BASENAME}}');
}
/**
 * Environment checks
 */
if (!function_exists('acadlix_environment_check')) {
    /**
     * Check if the environment meets the plugin requirements.
     *
     * @return bool True if the environment is suitable, false otherwise.
     */
    function acadlix_environment_check()
    {
        global $wp_version;

        // PHP check
        if (version_compare(PHP_VERSION, '8.2', '<')) {
            add_action('admin_notices', function () {
                ?>
                <div class="notice notice-error">
                    <p><?php echo esc_html(sprintf(
                        /* translators: 1: required PHP version 2: current PHP version */
                        __('Acadlix requires PHP %1$s or higher. You are running PHP %2$s.', 'acadlix'),
                        '8.2',
                        PHP_VERSION
                    )); ?></p>
                </div>
                <?php
            });

            // deactivate and prevent reactivation
            deactivate_plugins(ACADLIX_PLUGIN_BASENAME);
            return false;
        }

        // WordPress check
        if (version_compare($wp_version, '6.8', '<')) {
            add_action('admin_notices', function () use ($wp_version) {
                ?>
                <div class="notice notice-error">
                    <p><?php echo esc_html(sprintf(
                        /* translators: 1: required WP version 2: current WP version */
                        __('Acadlix requires WordPress %1$s or higher. You are running WordPress %2$s.', 'acadlix'),
                        '6.8',
                        $wp_version
                    )); ?></p>
                </div>
                <?php
            });

            deactivate_plugins(ACADLIX_PLUGIN_BASENAME);
            return false;
        }

        return true;
    }
}

// Run environment check early
if (!acadlix_environment_check()) {
    return; // stop loading the plugin completely
}

require_once ACADLIX_PLUGIN_DIR . '/bootstrap-activator.php';
register_activation_hook(ACADLIX_PLUGIN_FILE, ['Acadlix_Bootstrap_Activator', 'activate']);

if (function_exists('acadlix')) {
    return;
}

require_once ACADLIX_INCLUDES_PATH . '/AcadlixAbstract.php';
require_once ACADLIX_INCLUDES_PATH . '/Acadlix.php';
acadlix();
