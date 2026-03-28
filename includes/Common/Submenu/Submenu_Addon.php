<?php

namespace Yuvayana\Acadlix\Common\Submenu;

defined('ABSPATH') || exit();

class Submenu_Addon
{
  private static $_instance = null;

  protected $_options = [];

  public function __construct()
  {
    $this->_options = [
      'parent_slug' => ACADLIX_SLUG,
      'page_title' => __('Acadlix Addons', 'acadlix'),
      'menu_title' => __('Addons', 'acadlix'),
      'capability' => 'acadlix_show_addon',
      'menu_slug' => 'acadlix_addon',
      'callback' => [$this, 'addon_callback'],
      'position' => 210
    ];

    add_action('admin_menu', array($this, 'add_submenu'));
  }

  public function get_position()
  {
    return $this->_options['position'];
  }

  public function add_submenu()
  {
    $page = add_submenu_page(
      $this->_options['parent_slug'],
      $this->_options['page_title'],
      $this->_options['menu_title'],
      $this->_options['capability'],
      $this->_options['menu_slug'],
      $this->_options['callback'],
      $this->_options['position']
    );

    add_action("admin_print_scripts-{$page}", [$this, 'admin_print_scripts']);
  }

  public function localize_options()
  {
    $current_user = wp_get_current_user();
    $capabilities = $current_user->exists() ? $current_user->allcaps : [];
    return [
      'api_url' => esc_url_raw(rest_url('acadlix/v1')),
      'max_execution_time' => acadlix()->helper()->acadlix_max_execution_time(),
      'nonce' => wp_create_nonce('wp_rest'),
      'settings' => acadlix()->helper()->acadlix_get_all_options(),
      'default_img_url' => esc_url(ACADLIX_ASSETS_IMAGE_URL . "demo-course.jpg"),
      'user_id' => get_current_user_id(),
      'capabilities' => $capabilities,
      'isPro' => acadlix()->pro,
      'acadlix_docs_url' => ACADLIX_DOCUMENTATION_URL,
      'isActive' => acadlix()->license()->isActive ?? false,
      'theme_settings' => acadlix()->helper()->acadlix_get_option('acadlix_theme_settings'),
    ];
  }

  public function admin_print_scripts()
  {
    acadlix()->assets()->manager()->load_assets('admin_addon', $this->localize_options());
  }

  public function addon_callback()
  {
    echo '<div id="acadlix-admin-addon"><h2>' . esc_html__('Loading...', 'acadlix') . '</h2></div>';
  }

  public static function instance()
  {
    if (is_null(self::$_instance)) {
      self::$_instance = new self();
    }

    return self::$_instance;
  }
}