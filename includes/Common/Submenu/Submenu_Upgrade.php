<?php

namespace Yuvayana\Acadlix\Common\Submenu;

defined('ABSPATH') || exit();

class Submenu_Upgrade
{

  protected $_options = [];

  public function __construct()
  {
    $this->_options = [
      'parent_slug' => ACADLIX_SLUG,
      'page_title' => __('Upgrade to Pro', 'acadlix'),
      'menu_title' => sprintf('<span class="acadlix-get-pro-text">%s</span>', __('Upgrade to Pro', 'tutor')),
      'capability' => 'acadlix_show_upgrade',
      'menu_slug' => 'acadlix_upgrade',
      'callback' => [$this, 'upgrade_callback'],
      'position' => 100
    ];
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
  }

  public function upgrade_callback()
  {
    ?>
      <div class="wrap">
        <a href="<?php echo esc_url(ACADLIX_MARKETPLACE_URL . 'pricing'); ?>"><?php esc_html_e('Get pro plugin', 'acadlix'); ?></a>
      </div>

      <script>
        location.href = '<?php echo esc_url(ACADLIX_MARKETPLACE_URL . 'pricing'); ?>';
      </script>
    <?php
  }
}