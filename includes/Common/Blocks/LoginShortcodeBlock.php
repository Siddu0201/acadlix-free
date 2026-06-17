<?php

namespace Yuvayana\Acadlix\Common\Blocks;

defined('ABSPATH') || exit;

use WP_REST_Request;
use WP_REST_Server;

class LoginShortcodeBlock
{
  protected string $namespace = 'acadlix/v1';

  protected string $rest_base = 'block-login-shortcodes';
  public function register()
  {
    add_action('rest_api_init', [$this, 'register_rest_routes']);

    if (!function_exists('register_block_type')) {
      return;
    }

    $script_file = ACADLIX_BUILD_PATH . acadlix()->versionPath . '/login_shortcode_block.js';
    if (!file_exists($script_file)) {
      return;
    }

    $asset_file = ACADLIX_BUILD_PATH . acadlix()->versionPath . '/login_shortcode_block.asset.php';
    $asset_data = file_exists($asset_file)
      ? include $asset_file
      : [
        'dependencies' => ['wp-blocks', 'wp-element', 'wp-i18n', 'wp-components', 'wp-block-editor', 'wp-api-fetch'],
        'version' => ACADLIX_VERSION,
      ];

    wp_register_script(
      'acadlix-login-shortcode-block-editor',
      ACADLIX_BUILD_URL . acadlix()->versionPath . '/login_shortcode_block.js',
      $asset_data['dependencies'],
      $asset_data['version'],
      true
    );

    register_block_type('acadlix/login-shortcode', [
      'api_version' => 3,
      'editor_script' => 'acadlix-login-shortcode-block-editor',
      'render_callback' => [$this, 'render'],
      'attributes' => [
        'redirectUrl' => [
          'type' => 'string',
          'default' => '',
        ],
        'redirectId' => [
          'type' => 'number',
          'default' => 0,
        ],
      ],
    ]);
  }

  public function register_rest_routes()
  {
    register_rest_route(
      $this->namespace,
      '/' . $this->rest_base,
      [
        [
          'methods' => WP_REST_Server::READABLE,
          'callback' => [$this, 'get_login_options'],
          'permission_callback' => function () {
            return current_user_can('edit_posts');
          },
        ],
      ]
    );
  }

  public function get_login_options(WP_REST_Request $request)
  {
    $pages = get_pages([
      'post_type' => 'page',
      'post_status' => 'publish',
    ]);
    
    return rest_ensure_response([
      'pages' => array_map(function ($page) {
        return [
          'id' => $page->ID,
          'title' => $page->post_title,
          'label' => sprintf('%s (#%d)', wp_strip_all_tags($page->post_title), $page->ID),
        ];
      }, $pages),
    ]);
  }

  public function render($attributes)
  {
    $redirectUrl = esc_url($attributes['redirectUrl'] ?? '');
    $redirectId = absint($attributes['redirectId'] ?? 0);

    $shortcode = '[acadlix_login';

    if (!empty($redirectUrl)) {
      $shortcode .= ' redirect_url="' . $redirectUrl . '"';
    }

    if (!empty($redirectId)) {
      $shortcode .= ' redirect_page_id="' . $redirectId . '"';
    }

    $shortcode .= ']';

    return do_shortcode($shortcode);
  }
}
