<?php

namespace Yuvayana\Acadlix\Common\Blocks;

use WP_REST_Request;
use WP_REST_Server;

defined('ABSPATH') || exit;

class QuizShortcodeBlock
{
  protected string $namespace = 'acadlix/v1';
  protected string $rest_base = 'block-quiz-shortcodes';

  public function register()
  {
    add_action('rest_api_init', [$this, 'register_rest_routes']);

    if (!function_exists('register_block_type')) {
      return;
    }

    $script_file = ACADLIX_BUILD_PATH . acadlix()->versionPath . '/quiz_shortcode_block.js';
    if (!file_exists($script_file)) {
      return;
    }

    $asset_file = ACADLIX_BUILD_PATH . acadlix()->versionPath . '/quiz_shortcode_block.asset.php';
    $asset_data = file_exists($asset_file)
      ? include $asset_file
      : [
        'dependencies' => ['wp-blocks', 'wp-element', 'wp-i18n', 'wp-components', 'wp-block-editor', 'wp-api-fetch'],
        'version' => ACADLIX_VERSION,
      ];

    wp_register_script(
      'acadlix-quiz-shortcode-block-editor',
      ACADLIX_BUILD_URL . acadlix()->versionPath . '/quiz_shortcode_block.js',
      $asset_data['dependencies'],
      $asset_data['version'],
      true
    );

    register_block_type('acadlix/quiz-shortcode', [
      'api_version' => 3,
      'editor_script' => 'acadlix-quiz-shortcode-block-editor',
      'render_callback' => [$this, 'render'],
      'attributes' => [
        'shortcodeId' => [
          'type' => 'number',
          'default' => 0,
        ],
        'template' => [
          'type' => 'string',
          'default' => '',
        ],
        'fields' => [
          'type' => 'string',
          'default' => '',
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
          'callback' => [$this, 'get_quiz_options'],
          'permission_callback' => function () {
            return current_user_can('edit_posts');
          },
        ],
      ]
    );
  }

  public function get_quiz_options(WP_REST_Request $request)
  {
    $quizzes = acadlix()
      ->model()
      ->quiz()
      ->ofQuiz()
      ->without(['author', 'metas'])
      ->with('quiz_shortcode')
      ->whereHas('quiz_shortcode')
      ->orderBy('ID', 'desc')
      ->get(['ID', 'post_title']);

    $items = $quizzes
      ->map(function ($quiz) {
        $shortcode_id = absint($quiz->quiz_shortcode->id ?? 0);
        if (empty($shortcode_id)) {
          return null;
        }

        return [
          'value' => $shortcode_id,
          'label' => sprintf('%s (#%d)', wp_strip_all_tags($quiz->post_title), $shortcode_id),
          'quiz_id' => absint($quiz->ID),
          'quiz_title' => wp_strip_all_tags($quiz->post_title),
        ];
      })
      ->filter()
      ->values();

    return rest_ensure_response([
      'items' => $items,
    ]);
  }

  public function render($attributes)
  {
    $shortcode_id = absint($attributes['shortcodeId'] ?? 0);
    if (empty($shortcode_id)) {
      return '';
    }

    $template = sanitize_text_field($attributes['template'] ?? '');
    $fields = sanitize_text_field($attributes['fields'] ?? '');

    $shortcode = '[Acadlix_Quiz ' . $shortcode_id;

    if ($template !== '') {
      $shortcode .= ' template="' . esc_attr($template) . '"';
    }

    if ($fields !== '') {
      $shortcode .= ' fields="' . esc_attr($fields) . '"';
    }

    $shortcode .= ']';

    return do_shortcode($shortcode);
  }
}
