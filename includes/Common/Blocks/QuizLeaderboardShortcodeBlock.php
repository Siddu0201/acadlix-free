<?php

namespace Yuvayana\Acadlix\Common\Blocks;

defined('ABSPATH') || exit;

class QuizLeaderboardShortcodeBlock
{
  public function register()
  {
    if (!function_exists('register_block_type')) {
      return;
    }

    $script_file = ACADLIX_BUILD_PATH . acadlix()->versionPath . '/quiz_leaderboard_shortcode_block.js';
    if (!file_exists($script_file)) {
      return;
    }

    $asset_file = ACADLIX_BUILD_PATH . acadlix()->versionPath . '/quiz_leaderboard_shortcode_block.asset.php';
    $asset_data = file_exists($asset_file)
      ? include $asset_file
      : [
        'dependencies' => ['wp-blocks', 'wp-element', 'wp-i18n', 'wp-components', 'wp-block-editor', 'wp-api-fetch'],
        'version' => ACADLIX_VERSION,
      ];

    wp_register_script(
      'acadlix-quiz-leaderboard-shortcode-block-editor',
      ACADLIX_BUILD_URL . acadlix()->versionPath . '/quiz_leaderboard_shortcode_block.js',
      $asset_data['dependencies'],
      $asset_data['version'],
      true
    );

    register_block_type('acadlix/quiz-leaderboard-shortcode', [
      'api_version' => 3,
      'editor_script' => 'acadlix-quiz-leaderboard-shortcode-block-editor',
      'render_callback' => [$this, 'render'],
      'attributes' => [
        'shortcodeId' => [
          'type' => 'number',
          'default' => 0,
        ],
      ],
    ]);
  }

  public function render($attributes)
  {
    $shortcode_id = absint($attributes['shortcodeId'] ?? 0);
    if (empty($shortcode_id)) {
      return '';
    }

    $shortcode = '[Acadlix_Leaderboard ' . $shortcode_id;

    $shortcode .= ']';

    return do_shortcode($shortcode);
  }
}
