<?php

namespace Yuvayana\Acadlix\Common\Assets;

defined('ABSPATH') || exit();

/**
 * Asset Manager class.
 *
 * Responsible for managing all of the assets (CSS, JS, Images, Locales).
 */
class Manager
{
  protected static $_instance = null;

  public function __construct()
  {
    add_action('init', function () {
      if(acadlix()->isDev){
        acadlix()->helper()->queryLogger()->enable();
      }
    });
    add_action('init', [$this, 'register_all_scripts']);
    add_action('wp_enqueue_scripts', [$this, 'enqueue_front_react_assets'], 100);
    add_action('wp_enqueue_scripts', [$this, 'enqueue_front_assets']);
    add_action('wp_enqueue_scripts', [$this, 'enqueue_common_assets']);
    add_action('admin_enqueue_scripts', [$this, 'enqueue_common_assets']);
    add_shortcode('Acadlix_Quiz', [$this, 'add_shortcode_quiz']);
    add_shortcode('Acadlix_Leaderboard', [$this, 'add_shortcode_leaderboard']);
    add_shortcode('acadlix_login', [$this, 'add_shortcode_login']);
    // add_shortcode('Acadlix_Dashboard', [$this, 'acadlix_dashboard_shortcode']);
    // add_shortcode('Acadlix_Advance_Quiz', [$this, 'acadlix_advance_quiz_shortcode']);

    // add_filter('single_template', [$this, 'acadlix_template']);
    // add_filter('page_template', [$this, 'acadlix_template']);
    add_action('wp_footer', [$this, 'acadlix_front_footer']);
  }

  public function add_shortcode_quiz($atts)
  {
    $id = $atts[0];
    $content = '';

    if (is_numeric($id)) {
      ob_start();
      $quiz = acadlix()->model()->quiz()->ofQuiz()->whereHas('quiz_shortcode', function ($query) use ($id) {
        $query->where('id', $id);
      })->first();
      if ($quiz) {
        wp_enqueue_style('acadlix-quiz-shortcode-css');

        $title_classes = ['acadlix-front-quiz-title'];

        if (!empty($quiz->rendered_metas['quiz_settings']['hide_quiz_title'])) {
          $title_classes[] = 'acadlix-hide';
        }
        ?>

        <div class="acadlix-front-quiz-container">
          <h2 class="<?php echo esc_attr(implode(' ', $title_classes)); ?>"
            id="acadlix_front_quiz_title_<?php echo esc_html($quiz->ID); ?>">
            <?php echo esc_html($quiz->post_title); ?>
          </h2>
          <div class="acadlix-front-quiz-description" id="acadlix_front_quiz_description_<?php echo esc_html($quiz->ID); ?>">
            <?php echo wp_kses_post(
              do_shortcode(
                apply_filters('comment_text', $quiz->post_content) // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound
              )
            ); ?>
          </div>
          <div class="acadlix-front" id="<?php echo esc_html($quiz->ID); ?>">
            <div class="acadlix-front-quiz-button">
            </div>
          </div>
        </div>
        <?php
        wp_enqueue_script('acadlix-front-quiz-shortcode-js');
      } else {
        echo '[Acadlix_Quiz ' . esc_html($id) . ']';
      }
      $content = ob_get_contents();
      ob_get_clean();
    }
    return $content;
  }

  public function add_shortcode_leaderboard($atts)
  {
    $id = $atts[0];
    $content = '';

    if (is_numeric($id)) {
      ob_start();
      $quiz = acadlix()->model()->quiz()->ofQuiz()->whereHas('quiz_shortcode', function ($query) use ($id) {
        $query->where('id', $id);
      })->first();
      if ($quiz) {
        ?>
        <div class="acadlix-front-leaderboard" id="<?php echo esc_html($quiz->ID); ?>"></div>
        <?php
        wp_enqueue_script('acadlix-front-leaderboard-shortcode-js');
      } else {
        echo '[Acadlix_Leaderboard ' . esc_html($id) . ']';
      }
      $content = ob_get_contents();
      ob_get_clean();
    }
    return $content;
  }

  public function add_shortcode_login()
  {
    $content = '';
    $user_id = get_current_user_id();
    ob_start();
    if (!$user_id) {
      ?>
      <div class="acadlix-front-login"></div>
      <?php
    }
    $content = ob_get_contents();
    ob_get_clean();
    return $content;
  }

  public function acadlix_dashboard_shortcode()
  {
    $content = '';

    ob_start();
    ?>
    <div id="acadlix_dashboard"></div>
    <?php
    $content = ob_get_contents();
    ob_get_clean();
    return $content;
  }

  public function acadlix_advance_quiz_shortcode()
  {
    $content = '';

    ob_start();
    ?>
    <div id="acadlix_advance_quiz"></div>
    <?php
    $content = ob_get_contents();
    ob_get_clean();
    return $content;
  }
  public function acadlix_template($page_template)
  {
    global $post;

    if (has_shortcode($post->post_content, 'Acadlix_Dashboard') || has_shortcode($post->post_content, 'Acadlix_Advance_Quiz')) {
      $page_template = ACADLIX_TEMPLATE_PATH . 'dashboard.php';
    }
    return $page_template;
  }

  public function register_all_scripts()
  {
    $this->register_styles($this->get_styles());
    $this->register_scripts($this->get_scripts());
  }

  public function get_styles(): array
  {
    return [
      'acadlix-vendor-css' => [
        'src' => ACADLIX_BUILD_URL . acadlix()->versionPath . '/vendors.css',
        'version' => ACADLIX_VERSION,
        'deps' => [],
      ],
      'acadlix-admin-quiz-css' => [
        'src' => ACADLIX_BUILD_URL . acadlix()->versionPath . '/admin_quiz.css',
        'version' => ACADLIX_VERSION,
        'deps' => [],
      ],
      'acadlix-admin-lesson-css' => [
        'src' => ACADLIX_BUILD_URL . acadlix()->versionPath . '/admin_lesson.css',
        'version' => ACADLIX_VERSION,
        'deps' => [],
      ],
      'acadlix-admin-order-css' => [
        'src' => ACADLIX_BUILD_URL . acadlix()->versionPath . '/admin_order.css',
        'version' => ACADLIX_VERSION,
        'deps' => [],
      ],
      'acadlix-admin-setting-css' => [
        'src' => ACADLIX_BUILD_URL . acadlix()->versionPath . '/admin_setting.css',
        'version' => ACADLIX_VERSION,
        'deps' => [],
      ],
      'acadlix-admin-addon-css' => [
        'src' => ACADLIX_BUILD_URL . acadlix()->versionPath . '/admin_addon.css',
        'version' => ACADLIX_VERSION,
        'deps' => [],
      ],
      'acadlix-admin-student-css' => [
        'src' => ACADLIX_BUILD_URL . acadlix()->versionPath . '/admin_student.css',
        'version' => ACADLIX_VERSION,
        'deps' => [],
      ],
      'acadlix-admin-design-studio-css' => [
        'src' => ACADLIX_BUILD_URL . acadlix()->versionPath . '/admin_design_studio.css',
        'version' => ACADLIX_VERSION,
        'deps' => [],
      ],
      'acadlix-front-css' => [
        'src' => ACADLIX_BUILD_URL . acadlix()->versionPath . '/front.css',
        'version' => ACADLIX_VERSION,
        'deps' => [],
      ],
      'acadlix-front-checkout-css' => [
        'src' => ACADLIX_BUILD_URL . acadlix()->versionPath . '/front_checkout.css',
        'version' => ACADLIX_VERSION,
        'deps' => [],
      ],
      'acadlix-front-all-course-css' => [
        'src' => ACADLIX_ASSETS_CSS_URL . 'frontend/all_courses.css',
        'version' => ACADLIX_VERSION,
        'deps' => [],
      ],
      'acadlix-front-thankyou-css' => [
        'src' => ACADLIX_ASSETS_CSS_URL . 'frontend/thankyou.css',
        'version' => ACADLIX_VERSION,
        'deps' => [],
      ],
      'acadlix-front-font-awesome-css' => [
        'src' => ACADLIX_ASSETS_CSS_URL . 'font-awesome/css/all.min.css',
        'version' => ACADLIX_VERSION,
        'deps' => [],
      ],
      'acadlix-front-single-course-css' => [
        'src' => ACADLIX_ASSETS_CSS_URL . 'frontend/single_course.css',
        'version' => ACADLIX_VERSION,
        'deps' => [],
      ],
      'acadlix-front-base-style-css' => [
        'src' => ACADLIX_ASSETS_CSS_URL . 'acadlix_base_style.css',
        'version' => ACADLIX_VERSION,
        'deps' => [],
      ],
      'acadlix-katex-css' => [
        'src' => ACADLIX_ASSETS_CSS_URL . 'katex/Katex.min.css',
        'version' => ACADLIX_VERSION,
        'deps' => [],
      ],
      'acadlix-quiz-shortcode-css' => [
        'src' => ACADLIX_ASSETS_CSS_URL . 'frontend/quiz_shortcode.css',
        'version' => ACADLIX_VERSION,
        'deps' => [],
      ],
    ];
  }

  public function get_assets(): array
  {
    $manifest_file = ACADLIX_BUILD_PATH . acadlix()->versionPath . '/assets-manifest.php';

    if (!file_exists($manifest_file)) {
      return [];
    }

    $assets = include $manifest_file;

    return $assets;
  }

  public function load_assets(string $entrypoint, $localized_options = [], $localized_name = 'acadlixOptions'): void
  {
    $assets = $this->get_assets();
    $entry = $assets['entrypoints'][$entrypoint] ?? null;

    if ($entry) {
      foreach ($entry['assets']['js'] as $js_file) {
        $handle = 'acadlix-' . pathinfo($js_file, PATHINFO_FILENAME);
        $src = ACADLIX_BUILD_URL . acadlix()->versionPath . '/' . $js_file;

        // Optional: load dependencies from PHP asset file
        $asset_file = ACADLIX_BUILD_PATH . acadlix()->versionPath . '/' . str_replace('.js', '.asset.php', $js_file);
        $deps = [];
        if (file_exists($asset_file)) {
          $asset_data = include $asset_file;
          $deps = $asset_data['dependencies'] ?? [];
        }
        $deps = [...$deps, 'acadlix-global-hooks'];

        wp_enqueue_script($handle, $src, $deps, ACADLIX_VERSION, true);
        wp_set_script_translations($handle, 'acadlix', ACADLIX_PLUGIN_DIR . 'languages/' . acadlix()->versionPath . '/');

        $is_main_entry = $js_file === "{$entrypoint}.js";
        if ($is_main_entry && !empty($localized_options)) {
          wp_localize_script($handle, $localized_name, $localized_options);
        }
      }
      if (isset($entry['assets']['css']) && $entry['assets']['css']) {
        foreach ($entry['assets']['css'] as $css_file) {
          if (is_rtl()) {
            if (str_contains($css_file, 'rtl')) {
              $handle = 'acadlix-' . pathinfo($css_file, PATHINFO_FILENAME);
              $src = ACADLIX_BUILD_URL . acadlix()->versionPath . '/' . $css_file;
              wp_enqueue_style($handle, $src, [], ACADLIX_VERSION);
            }
          } else {
            if (!str_contains($css_file, 'rtl')) {
              $handle = 'acadlix-' . pathinfo($css_file, PATHINFO_FILENAME);
              $src = ACADLIX_BUILD_URL . acadlix()->versionPath . '/' . $css_file;
              wp_enqueue_style($handle, $src, [], ACADLIX_VERSION);
            }
          }
        }
      }

      if ($assets) {
        foreach ($assets as $file => $mappedFile) {
          if ($file != 'entrypoints' && str_contains($mappedFile, $entrypoint) && str_ends_with($mappedFile, '.bundle.js')) {
            $handle = 'acadlix-' . pathinfo($file, PATHINFO_FILENAME);
            $src = ACADLIX_BUILD_URL . acadlix()->versionPath . '/' . $mappedFile;
            $deps = ['acadlix-global-hooks'];
            wp_enqueue_script($handle, $src, $deps, ACADLIX_VERSION, true);
            wp_set_script_translations($handle, 'acadlix', ACADLIX_PLUGIN_DIR . 'languages/' . acadlix()->versionPath . '/');
          }
        }
      }
    }
  }

  public function unload_assets(string $entrypoint)
  {
    $assets = $this->get_assets();
    $entry = $assets['entrypoints'][$entrypoint] ?? null;
    if ($entry) {
      foreach ($entry['assets']['js'] as $js_file) {
        $handle = 'acadlix-' . pathinfo($js_file, PATHINFO_FILENAME);
        wp_dequeue_script($handle);
      }
      if (isset($entry['assets']['css']) && $entry['assets']['css']) {
        foreach ($entry['assets']['css'] as $css_file) {
          $handle = 'acadlix-' . pathinfo($css_file, PATHINFO_FILENAME);
          wp_dequeue_style($handle);
        }
      }
    }
  }

  public function get_scripts(): array
  {

    $paypal_client_id = acadlix()->helper()->acadlix_get_option('acadlix_paypal_client_id');

    return [
      'acadlix-global-hooks' => [
        'src' => ACADLIX_ASSETS_JS_URL . 'modules/hooks.js',
        'version' => ACADLIX_VERSION,
        'deps' => ['wp-hooks'],
        'in_footer' => true,
      ],
      'acadlix-content-protection' => [
        'src' => ACADLIX_ASSETS_JS_URL . 'frontend/content-protection.js',
        'version' => ACADLIX_VERSION,
        'deps' => ['jquery'],
        'in_footer' => true,
      ],
      'acadlix-razorpay-js' => [
        'src' => 'https://checkout.razorpay.com/v1/checkout.js',
        'version' => ACADLIX_VERSION,
        'deps' => [],
        'in_footer' => true,
      ],
      'acadlix-paypal-js' => [
        'src' => "https://www.paypal.com/sdk/js?client-id=$paypal_client_id",
        'version' => ACADLIX_VERSION,
        'deps' => [],
        'in_footer' => true,
      ],
      'acadlix-front-action-button-course-js' => [
        'src' => ACADLIX_ASSETS_JS_URL . 'course-action-button.js',
        'version' => ACADLIX_VERSION,
        'deps' => ['jquery'],
        'in_footer' => true,
      ],
      'acadlix-front-all-course-js' => [
        'src' => ACADLIX_ASSETS_JS_URL . 'all-courses.js',
        'version' => ACADLIX_VERSION,
        'deps' => ['jquery'],
        'in_footer' => true,
      ],
      'acadlix-katex-js' => [
        'src' => ACADLIX_ASSETS_JS_URL . 'katex/katex.min.js',
        'version' => ACADLIX_VERSION,
        'deps' => [],
        'in_footer' => true,
      ],
      'acadlix-katex-auto-render-js' => [
        'src' => ACADLIX_ASSETS_JS_URL . 'katex/auto-render.min.js',
        'version' => ACADLIX_VERSION,
        'deps' => ['acadlix-katex-js'],
        'in_footer' => true,
      ],
      'acadlix-plyr-js' => [
        'src' => ACADLIX_ASSETS_JS_URL . 'plyr/plyr.js',
        'version' => ACADLIX_VERSION,
        'deps' => ['jquery'],
        'in_footer' => true,
      ],
      'acadlix-front-quiz-shortcode-js' => [
        'src' => ACADLIX_ASSETS_JS_URL . 'frontend/quiz-shortcode.js',
        'version' => ACADLIX_VERSION,
        'deps' => ['jquery'],
        'in_footer' => true,
      ],
      'acadlix-front-leaderboard-shortcode-js' => [
        'src' => ACADLIX_ASSETS_JS_URL . 'frontend/leaderboard-shortcode.js',
        'version' => ACADLIX_VERSION,
        'deps' => ['jquery'],
        'in_footer' => true,
      ],
      'acadlix-katex-inline-js' => [
        'src' => ACADLIX_ASSETS_JS_URL . 'katex/katex-inline.js',
        'version' => ACADLIX_VERSION,
        'deps' => ['acadlix-katex-js', 'acadlix-katex-auto-render-js'],
        'in_footer' => true,
      ],
      'acadlix-admin-course-editor-js' => [
        'src' => ACADLIX_ASSETS_JS_URL . 'admin/course-editor.js',
        'version' => ACADLIX_VERSION,
        'deps' => ['wp-element'],
        'in_footer' => true,
      ],
    ];
  }

  public function register_styles(array $styles)
  {
    foreach ($styles as $handle => $style) {
      wp_register_style($handle, $style['src'], $style['deps'], $style['version']);
    }
  }

  public function register_scripts(array $scripts)
  {
    foreach ($scripts as $handle => $script) {
      wp_register_script($handle, $script['src'], $script['deps'], $script['version'], $script['in_footer']);
    }
  }

  public function localize_front_js_options()
  {
    $custom_logo_id = get_theme_mod('custom_logo');
    $logo_url = wp_get_attachment_image_url($custom_logo_id, 'full');
    return [
      'acadlix_plugin_url' => ACADLIX_PLUGIN_URL,
      'is_admin_bar_showing' => is_admin_bar_showing(),
      'api_url' => esc_url_raw(rest_url('acadlix/v1')),
      'max_execution_time' => acadlix()->helper()->acadlix_max_execution_time(),
      'ajax_url' => esc_url(admin_url('admin-ajax.php')),
      'home_url' => esc_url(home_url()),
      'certificate_url' => get_permalink(acadlix()->helper()->acadlix_get_option('acadlix_certificate_page_id')),
      'logout_url' => esc_url(wp_logout_url(acadlix()->helper()->acadlix_get_option('acadlix_logout_redirect_url') !== '' ? acadlix()->helper()->acadlix_get_option('acadlix_logout_redirect_url') : home_url())),
      'nonce' => wp_create_nonce('wp_rest'),
      'nonces' => [
        'auth' => wp_create_nonce('acadlix_auth_nonce'),
        'course' => wp_create_nonce('acadlix_course_nonce'),
      ],
      'user' => get_current_user_id() > 0
        ? acadlix()
          ->model()
          ->wpUsers()
          ->select([
            'ID',
            'user_email',
            'display_name',
            'user_url'
          ])
          ->where('ID', get_current_user_id())
          ->first()
        : [],
      'user_avatar_url' => get_current_user_id() > 0
        ? get_user_meta(get_current_user_id(), '_acadlix_profile_photo', true)
        : '',
      'settings' => acadlix()->helper()->acadlix_get_all_options(),
      'theme_settings' => acadlix()->helper()->acadlix_get_option('acadlix_theme_settings'),
      'logo_url' => $logo_url,
      'blog_name' => get_bloginfo('name'),
      'currency_symbol' => acadlix()->helper()->acadlix_currency_symbols()[acadlix()->helper()->acadlix_get_option('acadlix_currency')],
      'currency_symbols' => acadlix()->helper()->acadlix_currency_symbols(),
      'date_time_format' => acadlix()->helper()->acadlix_get_date_time_format(),
      'default_img_url' => esc_url(ACADLIX_ASSETS_IMAGE_URL . 'demo-course.jpg'),
      'certificate_url_path' => esc_url(ACADLIX_ASSETS_IMAGE_URL . 'certificate/'),
      'users_can_register' => acadlix()->helper()->acadlix_get_option('users_can_register'),
      'isActive' => acadlix()->license()->isActive ?? false,
      'isReCaptchaEnabled' => acadlix()->authentications()->recaptchav3()->is_enabled(),
    ];
  }

  public function localize_front_button_listener_js_options()
  {
    return [
      'api_url' => esc_url_raw(rest_url('acadlix/v1')),
      'ajax_url' => esc_url(admin_url('admin-ajax.php')),
      'user_id' => get_current_user_id() ?? 0,
      'isActive' => acadlix()->license()->isActive ?? false,
    ];
  }

  public function enqueue_common_assets()
  {
    wp_enqueue_script('acadlix-global-hooks');

    $content_protection_enabled = acadlix()->helper()->acadlix_get_option('acadlix_enable_content_protection') === 'yes';
    if ($content_protection_enabled && !is_admin()) {
      wp_enqueue_script('acadlix-content-protection');
    }
  }

  public function enqueue_front_react_assets()
  {
    if (is_admin()) {
      return;
    }
    $dashboard_page_id = acadlix()->helper()->acadlix_get_option('acadlix_dashboard_page_id');
    if ($dashboard_page_id && is_page($dashboard_page_id) && function_exists('wp_enqueue_editor')) {
      wp_enqueue_editor();
    }
    if (function_exists('wp_enqueue_media')) {
      wp_enqueue_media();
      wp_enqueue_script('wp-mediaelement');
      wp_enqueue_style('wp-mediaelement');
    }
    wp_enqueue_script('acadlix-katex-js');
    wp_enqueue_script('acadlix-katex-auto-render-js');
    wp_enqueue_script('wp-date');
    wp_enqueue_script('acadlix-plyr-js');
    wp_enqueue_editor();

    wp_localize_script('acadlix-plyr-js', 'acadlixPlyr', [
      'iconUrl' => ACADLIX_ASSETS_JS_URL . 'plyr/plyr.svg',
      'blankVideo' => ACADLIX_ASSETS_JS_URL . 'plyr/blank.mp4',
    ]);

    acadlix()->assets()->manager()->load_assets('front', $this->localize_front_js_options());

    acadlix()->assets()->manager()->load_assets('front_button_listener', $this->localize_front_button_listener_js_options(), 'acadlixListeners');
  }

  public function enqueue_front_assets()
  {
    wp_enqueue_style('acadlix-front-base-style-css');

    $helper = acadlix()->helper();
    $theme = $helper->acadlix_get_option('acadlix_theme_settings') ?? [];

    /* ===============================
     * Palette
     * =============================== */
    $vars = [
      'acadlix-primary-main' => $helper->acadlix_css_color(
        $theme['palette']['primary']['main'] ?? null,
        'hsl(210, 100%, 50%)'
      ),
      'acadlix-primary-dark' => $helper->acadlix_css_color(
        $theme['palette']['primary']['dark'] ?? null,
        'hsl(210, 100%, 38%)'
      ),
      'acadlix-text-primary' => $helper->acadlix_css_color(
        $theme['palette']['text']['primary'] ?? null,
        'hsl(215, 15%, 12%)'
      ),
      'acadlix-text-secondary' => $helper->acadlix_css_color(
        $theme['palette']['text']['secondary'] ?? null,
        'hsl(218, 10%, 55%)'
      ),
      'acadlix-grey' => $helper->acadlix_css_color(
        $theme['palette']['grey']['light'] ?? null,
        'hsl(215, 15%, 97%)'
      ),
      'acadlix-border-color' => 'hsl(215, 15%, 82%)',
      'acadlix-star-color' => 'rgb(250 166 37)'
      ,
    ];

    /* ===============================
     * Typography defaults
     * =============================== */
    $defaults = [
      'h1' => ['fs' => ['2.5rem', '2rem', '1.75rem'], 'fw' => [700, 700, 700], 'lh' => ['1.25', '1.25', '1.25'], 'ls' => ['0.3px', '0.3px', '0.3px']],
      'h2' => ['fs' => ['1.875rem', '1.625rem', '1.5rem'], 'fw' => [600, 600, 600], 'lh' => ['1.25', '1.25', '1.25'], 'ls' => ['0.3px', '0.3px', '0.3px']],
      'h3' => ['fs' => ['1.5rem', '1.375rem', '1.25rem'], 'fw' => [600, 600, 600], 'lh' => ['1.25', '1.25', '1.25'], 'ls' => ['0.3px', '0.3px', '0.3px']],
      'h4' => ['fs' => ['1.25rem', '1.125rem', '1rem'], 'fw' => [600, 600, 600], 'lh' => ['1.25', '1.25', '1.25'], 'ls' => ['0.3px', '0.3px', '0.3px']],
      'h5' => ['fs' => ['1.125rem', '1rem', '0.9375rem'], 'fw' => [600, 600, 600], 'lh' => ['1.25', '1.25', '1.25'], 'ls' => ['0.3px', '0.3px', '0.3px']],
      'h6' => ['fs' => ['1rem', '0.9375rem', '0.875rem'], 'fw' => [600, 600, 600], 'lh' => ['1.25', '1.25', '1.25'], 'ls' => ['0.3px', '0.3px', '0.3px']],
      'body1' => ['fs' => ['1rem', '0.9375rem', '0.875rem'], 'fw' => [400, 400, 400], 'lh' => ['1.5', '1.5', '1.5'], 'ls' => ['0.3px', '0.3px', '0.3px']],
      'body2' => ['fs' => ['0.875rem', '0.75rem', '0.625rem'], 'fw' => [400, 400, 400], 'lh' => ['1.5', '1.5', '1.5'], 'ls' => ['0.3px', '0.3px', '0.3px']],
      'subtitle1' => ['fs' => ['1rem', '0.9375rem', '0.875rem'], 'fw' => [400, 400, 400], 'lh' => ['1.75', '1.75', '1.75'], 'ls' => ['0.3px', '0.3px', '0.3px']],
      'subtitle2' => ['fs' => ['0.875rem', '0.75rem', '0.625rem'], 'fw' => [500, 500, 500], 'lh' => ['1.5', '1.5', '1.5'], 'ls' => ['0.3px', '0.3px', '0.3px']],
    ];

    /* ===============================
     * Typography generator
     * =============================== */
    foreach ($defaults as $type => $config) {
      foreach (['desktop', 'tablet', 'mobile'] as $i => $device) {

        $vars["acadlix-{$type}-fs-{$device}"] =
          $helper->acadlix_css_size(
            $theme['typography'][$type]['fontSize'][$device] ?? null,
            $config['fs'][$i]
          );

        $vars["acadlix-{$type}-fw-{$device}"] =
          $helper->acadlix_css_number(
            $theme['typography'][$type]['fontWeight'][$device] ?? null,
            $config['fw'][$i]
          );

        $vars["acadlix-{$type}-lh-{$device}"] =
          $helper->acadlix_css_line_height(
            $theme['typography'][$type]['lineHeight'][$device] ?? null,
            $config['lh'][$i]
          );

        $vars["acadlix-{$type}-ls-{$device}"] =
          $helper->acadlix_css_size(
            $theme['typography'][$type]['letterSpacing'][$device] ?? null,
            $config['ls'][$i]
          );
      }
    }

    /* ===============================
     * Build CSS
     * =============================== */
    $css = ":root {\n";
    foreach ($vars as $name => $value) {
      $css .= "    --{$name}: {$value};\n";
    }
    $css .= "}\n";

    wp_add_inline_style('acadlix-front-base-style-css', $css);
  }

  public function acadlix_front_footer()
  {
    if (is_admin())
      return;

    wp_enqueue_script('acadlix-katex-inline-js');
  }

  public static function instance()
  {
    if (!self::$_instance) {
      self::$_instance = new self();
    }

    return self::$_instance;
  }
}
