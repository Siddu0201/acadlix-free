<?php

if (!function_exists('get_plugin_data')) {
    require_once(ABSPATH . 'wp-admin/includes/plugin.php');
}
$plugin_data = get_plugin_data(ACADLIX_PLUGIN_FILE);

//version
define('ACADLIX_VERSION', $plugin_data['Version']);

define('ACADLIX_TEXT_DOMAIN', $plugin_data['TextDomain']);

define('ACADLIX_SLUG', 'acadlix');
// Plugin paths and urls
define('ACADLIX_PLUGIN_DIR', plugin_dir_path(ACADLIX_PLUGIN_FILE));
define( 'ACADLIX_PLUGIN_BASENAME', plugin_basename( ACADLIX_PLUGIN_FILE ) );
define( 'ACADLIX_PLUGIN_FOLDER_NAME', str_replace( array( '/', basename( ACADLIX_PLUGIN_FILE ) ), '', ACADLIX_PLUGIN_BASENAME ) );
define('ACADLIX_INCLUDES_PATH', ACADLIX_PLUGIN_DIR . 'includes/');
define('ACADLIX_TEMPLATE_PATH', ACADLIX_PLUGIN_DIR . 'templates/');
define('ACADLIX_PLUGIN_URL', trailingslashit(plugins_url('', ACADLIX_PLUGIN_FILE)));
define('ACADLIX_BUILD_URL', ACADLIX_PLUGIN_URL . 'build/');
define('ACADLIX_BUILD_PATH', ACADLIX_PLUGIN_DIR . 'build/');

// Custom post type constant
const ACADLIX_COURSE_CPT = 'acadlix_course';