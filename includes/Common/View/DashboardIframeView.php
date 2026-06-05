<?php

namespace Yuvayana\Acadlix\Common\View;

defined('ABSPATH') || exit();

class DashboardIframeView
{
  protected $type = '';
  protected $data = [];

  public function __construct()
  {
    $this->type = sanitize_key(
      wp_unslash($_GET['type'] ?? '')
    );

    $this->boot();
  }

  protected function boot()
  {
    $method = "boot_{$this->type}";

    if (method_exists($this, $method)) {
      $this->{$method}();
    }
  }

  protected function render_content()
  {
    $method = "render_{$this->type}";

    if (method_exists($this, $method)) {
      $this->{$method}();
      return;
    }

    wp_die(
      esc_html__('Invalid iframe type.', 'acadlix')
    );
  }

  public function render()
  {
    $this->render_header();
    $this->render_content();
    $this->render_footer();
  }

  protected function boot_lesson()
  {
    $lesson_id = absint(
      wp_unslash($_GET['id'] ?? 0)
    );
    if (!$lesson_id) {
      wp_die(
        esc_html__('Content ID is required.', 'acadlix')
      );
    }
    $lesson = acadlix()->model()->lesson()->find($lesson_id);

    if (!$lesson) {
      wp_die(
        esc_html__('Lesson not found.', 'acadlix')
      );
    }

    $this->data['lesson'] = $lesson;
  }

  protected function render_lesson()
  {
    echo $this->data['lesson']->rendered_post_content ?? '';
  }

  protected function render_header()
  {
    ?>
    <!doctype html>
    <html <?php language_attributes(); ?>>

    <head>
      <meta charset="<?php bloginfo('charset'); ?>" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>
        <?php wp_title('|', true, 'right'); ?>
      </title>
      <link rel="pingback" href="<?php bloginfo('pingback_url'); ?>" />
      <?php wp_head(); ?>
    </head>

    <body <?php body_class(); ?>>
      <?php
  }

  protected function render_footer()
  {
    wp_footer();
    echo '</body>';
    echo '</html>';
  }
}