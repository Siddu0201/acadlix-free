<?php

// use Yuvayana\Acadlix\Common\Admin\Activator;
/**
 * Uninstall Acadlix
 *
 * @since 4.0.0
 */

// Exit if accessed directly.
if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

// Load plugin file.
require_once 'acadlix.php';

// Uninstall.
acadlix()->admin->activator->uninstall();