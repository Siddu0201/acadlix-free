<?php

defined('ABSPATH') || exit;

class Acadlix_Bootstrap_Activator
{

  public static function activate($plugin_file, $network_wide)
  {
    include_once ABSPATH . 'wp-admin/includes/plugin.php';

    $this_plugin = plugin_basename($plugin_file);
    // Decide sibling dynamically
    $sibling = ($this_plugin === 'acadlix/acadlix.php')
      ? 'acadlix-pro/acadlix.php'
      : 'acadlix/acadlix.php';

    // Deactivate sibling plugin
    if (is_plugin_active($sibling)) {
      deactivate_plugins($sibling);
      // 🔔 Store notice data
      update_option('acadlix_deactivated_plugin_notice', [
        'plugin' => $sibling,
        'time' => time(),
      ]);
    }

    // Mark activation pending
    update_option('acadlix_activation_pending', [
      'plugin' => $this_plugin,
      'network' => (bool) $network_wide,
    ]);
  }

}
