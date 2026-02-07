<?php

defined('ABSPATH') || exit;

class Acadlix_Bootstrap_Activator
{

  public static function activate($plugin_file, $network_wide)
  {
    include_once ABSPATH . 'wp-admin/includes/plugin.php';

    $this_plugin = plugin_basename($plugin_file);

    $free = 'acadlix/acadlix.php';
    $pro = 'acadlix-pro/acadlix.php';

    // If the sibling plugin is active, abort activation
    $sibling = ($this_plugin === $free) ? $pro : $free;

    // Deactivate sibling plugin
    if (is_plugin_active($sibling)) {
      // deactivate_plugins($this_plugin);
      // 🔔 Store notice data
      // update_option('acadlix_deactivated_plugin_notice', [
      //   'plugin' => $sibling,
      //   'time' => time(),
      // ]);
      wp_die(
        sprintf(
          'You cannot activate %s while %s is active. Please deactivate the other plugin first.',
          $this_plugin === $free ? 'Acadlix Free' : 'Acadlix Pro',
          $this_plugin === $free ? 'Acadlix Pro' : 'Acadlix Free'
        ),
        'Plugin conflict detected',
        ['back_link' => true]
      );
    }

    // Mark activation pending
    update_option('acadlix_activation_pending', [
      'plugin' => $this_plugin,
      'network' => (bool) $network_wide,
    ]);
  }

}
