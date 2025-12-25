<?php

defined('ABSPATH') || exit;

class Acadlix_Bootstrap_Activator
{

  public static function activate($network_wide)
  {
    include_once ABSPATH . 'wp-admin/includes/plugin.php';

    // Deactivate sibling plugin
    if (defined('ACADLIX_SIBLING_PLUGIN') && is_plugin_active(ACADLIX_SIBLING_PLUGIN)) {
      deactivate_plugins(ACADLIX_SIBLING_PLUGIN);
    }

    // Mark activation pending
    update_option('acadlix_activation_pending', [
      'variant' => ACADLIX_PLUGIN_TYPE,
      'network' => (bool) $network_wide,
    ]);
  }

}
