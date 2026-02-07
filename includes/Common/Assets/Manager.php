<?php

namespace Yuvayana\Acadlix\Common\Assets;

use Yuvayana\Acadlix\Common\Models\Quiz;

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
            acadlix()->helper()->queryLogger()->enable();
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
        // return [];
        // $runtime_dependency = require_once ACADLIX_BUILD_PATH . acadlix()->versionPath . '/runtime.asset.php';
        // $vendors_dependency = require_once ACADLIX_BUILD_PATH . acadlix()->versionPath . '/vendors.asset.php';
        // $admin_course_dependency = require_once ACADLIX_BUILD_PATH . acadlix()->versionPath . '/admin_course.asset.php';
        // $admin_home_dependency = require_once ACADLIX_BUILD_PATH . acadlix()->versionPath . '/admin_home.asset.php';
        // $admin_lesson_dependency = require_once ACADLIX_BUILD_PATH . acadlix()->versionPath . '/admin_lesson.asset.php';
        // $admin_order_dependency = require_once ACADLIX_BUILD_PATH . acadlix()->versionPath . '/admin_order.asset.php';
        // $admin_quiz_dependency = require_once ACADLIX_BUILD_PATH . acadlix()->versionPath . '/admin_quiz.asset.php';
        // $admin_setting_dependency = require_once ACADLIX_BUILD_PATH . acadlix()->versionPath . '/admin_setting.asset.php';
        // $admin_tool_dependency = require_once ACADLIX_BUILD_PATH . acadlix()->versionPath . '/admin_tool.asset.php';
        // $admin_addon_dependency = require_once ACADLIX_BUILD_PATH . acadlix()->versionPath . '/admin_addon.asset.php';
        // $admin_student_dependency = require_once ACADLIX_BUILD_PATH . acadlix()->versionPath . '/admin_student.asset.php';
        // $admin_design_studio_dependency = require_once ACADLIX_BUILD_PATH . acadlix()->versionPath . '/admin_design_studio.asset.php';

        // $front_dependency = require_once ACADLIX_BUILD_PATH . acadlix()->versionPath . '/front.asset.php';
        // $front_checkout_dependency = require_once ACADLIX_BUILD_PATH . acadlix()->versionPath . '/front_checkout.asset.php';
        // $front_single_course_dependency = require_once ACADLIX_BUILD_PATH . acadlix()->versionPath . '/front_single_course.asset.php';

        $paypal_client_id = acadlix()->helper()->acadlix_get_option('acadlix_paypal_client_id');

        return [
            'acadlix-global-hooks' => [
                'src' => ACADLIX_ASSETS_JS_URL . 'modules/hooks.js',
                'version' => ACADLIX_VERSION,
                'deps' => ['wp-hooks'],
                'in_footer' => true,
            ],
            // 'acadlix-runtime-js' => [
            //     'src' => ACADLIX_BUILD_URL . acadlix()->versionPath . '/runtime.js',
            //     'version' => $runtime_dependency['version'],
            //     'deps' => $runtime_dependency['dependencies'],
            //     'in_footer' => true,
            // ],
            // 'acadlix-vendors-js' => [
            //     'src' => ACADLIX_BUILD_URL . acadlix()->versionPath . '/vendors.js',
            //     'version' => $vendors_dependency['version'],
            //     'deps' => $vendors_dependency['dependencies'],
            //     'in_footer' => true,
            // ],
            // 'acadlix-admin-course' => [
            //     'src' => ACADLIX_BUILD_URL . acadlix()->versionPath . '/admin_course.js',
            //     'version' => $admin_course_dependency['version'],
            //     'deps' => [...$admin_course_dependency['dependencies'], 'acadlix-global-hooks'],
            //     'in_footer' => true,
            // ],
            // 'acadlix-admin-home' => [
            //     'src' => ACADLIX_BUILD_URL . acadlix()->versionPath . '/admin_home.js',
            //     'version' => $admin_home_dependency['version'],
            //     'deps' => [...$admin_home_dependency['dependencies'], 'acadlix-global-hooks'],
            //     'in_footer' => true,
            // ],
            // 'acadlix-admin-lesson' => [
            //     'src' => ACADLIX_BUILD_URL . acadlix()->versionPath . '/admin_lesson.js',
            //     'version' => $admin_lesson_dependency['version'],
            //     'deps' => [...$admin_lesson_dependency['dependencies'], 'acadlix-global-hooks'],
            //     'in_footer' => true,
            // ],
            // 'acadlix-admin-order' => [
            //     'src' => ACADLIX_BUILD_URL . acadlix()->versionPath . '/admin_order.js',
            //     'version' => $admin_order_dependency['version'],
            //     'deps' => [...$admin_order_dependency['dependencies'], 'acadlix-global-hooks'],
            //     'in_footer' => true,
            // ],
            // 'acadlix-admin-quiz' => [
            //     'src' => ACADLIX_BUILD_URL . acadlix()->versionPath . '/admin_quiz.js',
            //     'version' => $admin_quiz_dependency['version'],
            //     'deps' => [...$admin_quiz_dependency['dependencies'], 'acadlix-global-hooks'],
            //     'in_footer' => true,
            // ],
            // 'acadlix-admin-setting' => [
            //     'src' => ACADLIX_BUILD_URL . acadlix()->versionPath . '/admin_setting.js',
            //     'version' => $admin_setting_dependency['version'],
            //     'deps' => [...$admin_setting_dependency['dependencies'], 'acadlix-global-hooks'],
            //     'in_footer' => true,
            // ],
            // 'acadlix-admin-tool' => [
            //     'src' => ACADLIX_BUILD_URL . acadlix()->versionPath . '/admin_tool.js',
            //     'version' => $admin_tool_dependency['version'],
            //     'deps' => [...$admin_tool_dependency['dependencies'], 'acadlix-global-hooks'],
            //     'in_footer' => true,
            // ],
            // 'acadlix-admin-addon' => [
            //     'src' => ACADLIX_BUILD_URL . acadlix()->versionPath . '/admin_addon.js',
            //     'version' => $admin_addon_dependency['version'],
            //     'deps' => [...$admin_addon_dependency['dependencies'], 'acadlix-global-hooks'],
            //     'in_footer' => true,
            // ],
            // 'acadlix-admin-student' => [
            //     'src' => ACADLIX_BUILD_URL . acadlix()->versionPath . '/admin_student.js',
            //     'version' => $admin_student_dependency['version'],
            //     'deps' => [...$admin_student_dependency['dependencies'], 'acadlix-global-hooks'],
            //     'in_footer' => true,
            // ],
            // 'acadlix-admin-design-studio' => [
            //     'src' => ACADLIX_BUILD_URL . acadlix()->versionPath . '/admin_design_studio.js',
            //     'version' => $admin_design_studio_dependency['version'],
            //     'deps' => [...$admin_design_studio_dependency['dependencies'], 'acadlix-global-hooks'],
            //     'in_footer' => true,
            // ],
            // 'acadlix-front-js' => [
            //     'src' => ACADLIX_BUILD_URL . acadlix()->versionPath . '/front.js',
            //     'version' => $front_dependency['version'],
            //     'deps' => [...$front_dependency['dependencies'], 'acadlix-global-hooks'],
            //     'in_footer' => true,
            // ],
            // 'acadlix-front-checkout-js' => [
            //     'src' => ACADLIX_BUILD_URL . acadlix()->versionPath . '/front_checkout.js',
            //     'version' => $front_checkout_dependency['version'],
            //     'deps' => [...$front_checkout_dependency['dependencies'], 'acadlix-global-hooks'],
            //     'in_footer' => true,
            // ],
            // 'acadlix-front-single-course-js' => [
            //     'src' => ACADLIX_BUILD_URL . acadlix()->versionPath . '/front_single_course.js',
            //     'version' => $front_single_course_dependency['version'],
            //     'deps' => [...$front_single_course_dependency['dependencies'], 'acadlix-global-hooks'],
            //     'in_footer' => true,
            // ],
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
            'logout_url' => esc_url(wp_logout_url(acadlix()->helper()->acadlix_get_option('acadlix_logout_redirect_url') !== '' ? acadlix()->helper()->acadlix_get_option('acadlix_logout_redirect_url') : home_url())),
            'nonce' => wp_create_nonce('wp_rest'),
            'nonces' => [
                'auth' => wp_create_nonce('acadlix_auth_nonce'),
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

        if (is_singular(ACADLIX_COURSE_CPT) || is_post_type_archive(ACADLIX_COURSE_CPT)) {
            acadlix()->assets()->manager()->load_assets('front_button_listener', $this->localize_front_button_listener_js_options(), 'acadlixListeners');
        }
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

    // public function enqueue_front_assets()
    // {
    //     wp_enqueue_style('acadlix-front-base-style-css');
    //     $theme = acadlix()->helper()->acadlix_get_option('acadlix_theme_settings');
    //     // acadlix()->helper()->acadlix_ddd($theme['typography']['h1']['lineHeight']['desktop']);
    //     $primaryMain = $theme['palette']['primary']['main'] ?? 'hsl(210, 100%, 50%)';
    //     $primaryDark = $theme['palette']['primary']['dark'] ?? 'hsl(210, 100%, 38%)';
    //     $textPrimary = $theme['palette']['text']['primary'] ?? 'hsl(215, 15%, 12%)';
    //     $textSecondary = $theme['palette']['text']['secondary'] ?? 'hsl(218, 10%, 55%)';
    //     $grey = $theme['palette']['grey']['light'] ?? 'hsl(215, 15%, 97%)';
    //     $borderColor = 'hsl(215, 15%, 82%)';
    //     // H1
    //     $h1_fs_desktop = $theme['typography']['h1']['fontSize']['desktop'] ?? '2.5rem';
    //     $h1_fs_tablet = $theme['typography']['h1']['fontSize']['tablet'] ?? '2rem';
    //     $h1_fs_mobile = $theme['typography']['h1']['fontSize']['mobile'] ?? '1.75rem';
    //     $h1_fw_desktop = $theme['typography']['h1']['fontWeight']['desktop'] ?? 700;
    //     $h1_fw_tablet = $theme['typography']['h1']['fontWeight']['tablet'] ?? 700;
    //     $h1_fw_mobile = $theme['typography']['h1']['fontWeight']['mobile'] ?? 700;
    //     $h1_lh_desktop = $theme['typography']['h1']['lineHeight']['desktop'] ?? '1.25';
    //     $h1_lh_tablet = $theme['typography']['h1']['lineHeight']['tablet'] ?? '1.25';
    //     $h1_lh_mobile = $theme['typography']['h1']['lineHeight']['mobile'] ?? '1.25';
    //     $h1_ls_desktop = $theme['typography']['h1']['letterSpacing']['desktop'] ?? '0.3px';
    //     $h1_ls_tablet = $theme['typography']['h1']['letterSpacing']['tablet'] ?? '0.3px';
    //     $h1_ls_mobile = $theme['typography']['h1']['letterSpacing']['mobile'] ?? '0.3px';
    //     // H2
    //     $h2_fs_desktop = $theme['typography']['h2']['fontSize']['desktop'] ?? '1.875rem';
    //     $h2_fs_tablet = $theme['typography']['h2']['fontSize']['tablet'] ?? '1.625rem';
    //     $h2_fs_mobile = $theme['typography']['h2']['fontSize']['mobile'] ?? '1.5rem';
    //     $h2_fw_desktop = $theme['typography']['h2']['fontWeight']['desktop'] ?? 600;
    //     $h2_fw_tablet = $theme['typography']['h2']['fontWeight']['tablet'] ?? 600;
    //     $h2_fw_mobile = $theme['typography']['h2']['fontWeight']['mobile'] ?? 600;
    //     $h2_lh_desktop = $theme['typography']['h2']['lineHeight']['desktop'] ?? '1.25';
    //     $h2_lh_tablet = $theme['typography']['h2']['lineHeight']['tablet'] ?? '1.25';
    //     $h2_lh_mobile = $theme['typography']['h2']['lineHeight']['mobile'] ?? '1.25';
    //     $h2_ls_desktop = $theme['typography']['h2']['letterSpacing']['desktop'] ?? '0.3px';
    //     $h2_ls_tablet = $theme['typography']['h2']['letterSpacing']['tablet'] ?? '0.3px';
    //     $h2_ls_mobile = $theme['typography']['h2']['letterSpacing']['mobile'] ?? '0.3px';
    //     // H3
    //     $h3_fs_desktop = $theme['typography']['h3']['fontSize']['desktop'] ?? '1.5rem';
    //     $h3_fs_tablet = $theme['typography']['h3']['fontSize']['tablet'] ?? '1.375rem';
    //     $h3_fs_mobile = $theme['typography']['h3']['fontSize']['mobile'] ?? '1.25rem';
    //     $h3_fw_desktop = $theme['typography']['h3']['fontWeight']['desktop'] ?? 600;
    //     $h3_fw_tablet = $theme['typography']['h3']['fontWeight']['tablet'] ?? 600;
    //     $h3_fw_mobile = $theme['typography']['h3']['fontWeight']['mobile'] ?? 600;
    //     $h3_lh_desktop = $theme['typography']['h3']['lineHeight']['desktop'] ?? '1.25';
    //     $h3_lh_tablet = $theme['typography']['h3']['lineHeight']['tablet'] ?? '1.25';
    //     $h3_lh_mobile = $theme['typography']['h3']['lineHeight']['mobile'] ?? '1.25';
    //     $h3_ls_desktop = $theme['typography']['h3']['letterSpacing']['desktop'] ?? '0.3px';
    //     $h3_ls_tablet = $theme['typography']['h3']['letterSpacing']['tablet'] ?? '0.3px';
    //     $h3_ls_mobile = $theme['typography']['h3']['letterSpacing']['mobile'] ?? '0.3px';
    //     // H4
    //     $h4_fs_desktop = $theme['typography']['h4']['fontSize']['desktop'] ?? '1.25rem';
    //     $h4_fs_tablet = $theme['typography']['h4']['fontSize']['tablet'] ?? '1.125rem';
    //     $h4_fs_mobile = $theme['typography']['h4']['fontSize']['mobile'] ?? '1rem';
    //     $h4_fw_desktop = $theme['typography']['h4']['fontWeight']['desktop'] ?? 600;
    //     $h4_fw_tablet = $theme['typography']['h4']['fontWeight']['tablet'] ?? 600;
    //     $h4_fw_mobile = $theme['typography']['h4']['fontWeight']['mobile'] ?? 600;
    //     $h4_lh_desktop = $theme['typography']['h4']['lineHeight']['desktop'] ?? '1.25';
    //     $h4_lh_tablet = $theme['typography']['h4']['lineHeight']['tablet'] ?? '1.25';
    //     $h4_lh_mobile = $theme['typography']['h4']['lineHeight']['mobile'] ?? '1.25';
    //     $h4_ls_desktop = $theme['typography']['h4']['letterSpacing']['desktop'] ?? '0.3px';
    //     $h4_ls_tablet = $theme['typography']['h4']['letterSpacing']['tablet'] ?? '0.3px';
    //     $h4_ls_mobile = $theme['typography']['h4']['letterSpacing']['mobile'] ?? '0.3px';
    //     // H5
    //     $h5_fs_desktop = $theme['typography']['h5']['fontSize']['desktop'] ?? '1.125rem';
    //     $h5_fs_tablet = $theme['typography']['h5']['fontSize']['tablet'] ?? '1rem';
    //     $h5_fs_mobile = $theme['typography']['h5']['fontSize']['mobile'] ?? '0.9375rem';
    //     $h5_fw_desktop = $theme['typography']['h5']['fontWeight']['desktop'] ?? 600;
    //     $h5_fw_tablet = $theme['typography']['h5']['fontWeight']['tablet'] ?? 600;
    //     $h5_fw_mobile = $theme['typography']['h5']['fontWeight']['mobile'] ?? 600;
    //     $h5_lh_desktop = $theme['typography']['h5']['lineHeight']['desktop'] ?? '1.25';
    //     $h5_lh_tablet = $theme['typography']['h5']['lineHeight']['tablet'] ?? '1.25';
    //     $h5_lh_mobile = $theme['typography']['h5']['lineHeight']['mobile'] ?? '1.25';
    //     $h5_ls_desktop = $theme['typography']['h5']['letterSpacing']['desktop'] ?? '0.3px';
    //     $h5_ls_tablet = $theme['typography']['h5']['letterSpacing']['tablet'] ?? '0.3px';
    //     $h5_ls_mobile = $theme['typography']['h5']['letterSpacing']['mobile'] ?? '0.3px';
    //     // H6
    //     $h6_fs_desktop = $theme['typography']['h6']['fontSize']['desktop'] ?? '1rem';
    //     $h6_fs_tablet = $theme['typography']['h6']['fontSize']['tablet'] ?? '0.9375rem';
    //     $h6_fs_mobile = $theme['typography']['h6']['fontSize']['mobile'] ?? '0.875rem';
    //     $h6_fw_desktop = $theme['typography']['h6']['fontWeight']['desktop'] ?? 600;
    //     $h6_fw_tablet = $theme['typography']['h6']['fontWeight']['tablet'] ?? 600;
    //     $h6_fw_mobile = $theme['typography']['h6']['fontWeight']['mobile'] ?? 600;
    //     $h6_lh_desktop = $theme['typography']['h6']['lineHeight']['desktop'] ?? '1.25';
    //     $h6_lh_tablet = $theme['typography']['h6']['lineHeight']['tablet'] ?? '1.25';
    //     $h6_lh_mobile = $theme['typography']['h6']['lineHeight']['mobile'] ?? '1.25';
    //     $h6_ls_desktop = $theme['typography']['h6']['letterSpacing']['desktop'] ?? '0.3px';
    //     $h6_ls_tablet = $theme['typography']['h6']['letterSpacing']['tablet'] ?? '0.3px';
    //     $h6_ls_mobile = $theme['typography']['h6']['letterSpacing']['mobile'] ?? '0.3px';
    //     // body1
    //     $body1_fs_desktop = $theme['typography']['body1']['fontSize']['desktop'] ?? '1rem';
    //     $body1_fs_tablet = $theme['typography']['body1']['fontSize']['tablet'] ?? '0.9375rem';
    //     $body1_fs_mobile = $theme['typography']['body1']['fontSize']['mobile'] ?? '0.875rem';
    //     $body1_fw_desktop = $theme['typography']['body1']['fontWeight']['desktop'] ?? 400;
    //     $body1_fw_tablet = $theme['typography']['body1']['fontWeight']['tablet'] ?? 400;
    //     $body1_fw_mobile = $theme['typography']['body1']['fontWeight']['mobile'] ?? 400;
    //     $body1_lh_desktop = $theme['typography']['body1']['lineHeight']['desktop'] ?? '1.5';
    //     $body1_lh_tablet = $theme['typography']['body1']['lineHeight']['tablet'] ?? '1.5';
    //     $body1_lh_mobile = $theme['typography']['body1']['lineHeight']['mobile'] ?? '1.5';
    //     $body1_ls_desktop = $theme['typography']['body1']['letterSpacing']['desktop'] ?? '0.3px';
    //     $body1_ls_tablet = $theme['typography']['body1']['letterSpacing']['tablet'] ?? '0.3px';
    //     $body1_ls_mobile = $theme['typography']['body1']['letterSpacing']['mobile'] ?? '0.3px';
    //     // body2
    //     $body2_fs_desktop = $theme['typography']['body2']['fontSize']['desktop'] ?? '0.875rem';
    //     $body2_fs_tablet = $theme['typography']['body2']['fontSize']['tablet'] ?? '0.75rem';
    //     $body2_fs_mobile = $theme['typography']['body2']['fontSize']['mobile'] ?? '0.625rem';
    //     $body2_fw_desktop = $theme['typography']['body2']['fontWeight']['desktop'] ?? 400;
    //     $body2_fw_tablet = $theme['typography']['body2']['fontWeight']['tablet'] ?? 400;
    //     $body2_fw_mobile = $theme['typography']['body2']['fontWeight']['mobile'] ?? 400;
    //     $body2_lh_desktop = $theme['typography']['body2']['lineHeight']['desktop'] ?? '1.5';
    //     $body2_lh_tablet = $theme['typography']['body2']['lineHeight']['tablet'] ?? '1.5';
    //     $body2_lh_mobile = $theme['typography']['body2']['lineHeight']['mobile'] ?? '1.5';
    //     $body2_ls_desktop = $theme['typography']['body2']['letterSpacing']['desktop'] ?? '0.3px';
    //     $body2_ls_tablet = $theme['typography']['body2']['letterSpacing']['tablet'] ?? '0.3px';
    //     $body2_ls_mobile = $theme['typography']['body2']['letterSpacing']['mobile'] ?? '0.3px';
    //     // subtitle1
    //     $subtitle1_fs_desktop = $theme['typography']['subtitle1']['fontSize']['desktop'] ?? '1rem';
    //     $subtitle1_fs_tablet = $theme['typography']['subtitle1']['fontSize']['tablet'] ?? '0.9375rem';
    //     $subtitle1_fs_mobile = $theme['typography']['subtitle1']['fontSize']['mobile'] ?? '0.875rem';
    //     $subtitle1_fw_desktop = $theme['typography']['subtitle1']['fontWeight']['desktop'] ?? 400;
    //     $subtitle1_fw_tablet = $theme['typography']['subtitle1']['fontWeight']['tablet'] ?? 400;
    //     $subtitle1_fw_mobile = $theme['typography']['subtitle1']['fontWeight']['mobile'] ?? 400;
    //     $subtitle1_lh_desktop = $theme['typography']['subtitle1']['lineHeight']['desktop'] ?? '1.75';
    //     $subtitle1_lh_tablet = $theme['typography']['subtitle1']['lineHeight']['tablet'] ?? '1.75';
    //     $subtitle1_lh_mobile = $theme['typography']['subtitle1']['lineHeight']['mobile'] ?? '1.75';
    //     $subtitle1_ls_desktop = $theme['typography']['subtitle1']['letterSpacing']['desktop'] ?? '0.3px';
    //     $subtitle1_ls_tablet = $theme['typography']['subtitle1']['letterSpacing']['tablet'] ?? '0.3px';
    //     $subtitle1_ls_mobile = $theme['typography']['subtitle1']['letterSpacing']['mobile'] ?? '0.3px';
    //     // subtitle2
    //     $subtitle2_fs_desktop = $theme['typography']['subtitle2']['fontSize']['desktop'] ?? '0.875rem';
    //     $subtitle2_fs_tablet = $theme['typography']['subtitle2']['fontSize']['tablet'] ?? '0.75rem';
    //     $subtitle2_fs_mobile = $theme['typography']['subtitle2']['fontSize']['mobile'] ?? '0.625rem';
    //     $subtitle2_fw_desktop = $theme['typography']['subtitle2']['fontWeight']['desktop'] ?? 500;
    //     $subtitle2_fw_tablet = $theme['typography']['subtitle2']['fontWeight']['tablet'] ?? 500;
    //     $subtitle2_fw_mobile = $theme['typography']['subtitle2']['fontWeight']['mobile'] ?? 500;
    //     $subtitle2_lh_desktop = $theme['typography']['subtitle2']['lineHeight']['desktop'] ?? '1.5';
    //     $subtitle2_lh_tablet = $theme['typography']['subtitle2']['lineHeight']['tablet'] ?? '1.5';
    //     $subtitle2_lh_mobile = $theme['typography']['subtitle2']['lineHeight']['mobile'] ?? '1.5';
    //     $subtitle2_ls_desktop = $theme['typography']['subtitle2']['letterSpacing']['desktop'] ?? '0.3px';
    //     $subtitle2_ls_tablet = $theme['typography']['subtitle2']['letterSpacing']['tablet'] ?? '0.3px';
    //     $subtitle2_ls_mobile = $theme['typography']['subtitle2']['letterSpacing']['mobile'] ?? '0.3px';
    //     $custom_css = "
    //                 :root {
    //                     --acadlix-primary-main: {$primaryMain}; 
    //                     --acadlix-primary-dark: {$primaryDark};
    //                     --acadlix-text-primary: {$textPrimary};
    //                     --acadlix-text-secondary: {$textSecondary};
    //                     --acadlix-grey: {$grey};
    //                     --acadlix-border-color: {$borderColor};
    //                     --acadlix-h1-fs-desktop: {$h1_fs_desktop};
    //                     --acadlix-h1-fs-tablet: {$h1_fs_tablet};
    //                     --acadlix-h1-fs-mobile: {$h1_fs_mobile};
    //                     --acadlix-h1-fw-desktop: {$h1_fw_desktop};
    //                     --acadlix-h1-fw-tablet: {$h1_fw_tablet};
    //                     --acadlix-h1-fw-mobile: {$h1_fw_mobile};
    //                     --acadlix-h1-lh-desktop: {$h1_lh_desktop};
    //                     --acadlix-h1-lh-tablet: {$h1_lh_tablet};
    //                     --acadlix-h1-lh-mobile: {$h1_lh_mobile};
    //                     --acadlix-h1-ls-desktop: {$h1_ls_desktop};
    //                     --acadlix-h1-ls-tablet: {$h1_ls_tablet};
    //                     --acadlix-h1-ls-mobile: {$h1_ls_mobile};
    //                     --acadlix-h2-fs-desktop: {$h2_fs_desktop};
    //                     --acadlix-h2-fs-tablet: {$h2_fs_tablet};
    //                     --acadlix-h2-fs-mobile: {$h2_fs_mobile};
    //                     --acadlix-h2-fw-desktop: {$h2_fw_desktop};
    //                     --acadlix-h2-fw-tablet: {$h2_fw_tablet};
    //                     --acadlix-h2-fw-mobile: {$h2_fw_mobile};
    //                     --acadlix-h2-lh-desktop: {$h2_lh_desktop};
    //                     --acadlix-h2-lh-tablet: {$h2_lh_tablet};
    //                     --acadlix-h2-lh-mobile: {$h2_lh_mobile};
    //                     --acadlix-h2-ls-desktop: {$h2_ls_desktop};
    //                     --acadlix-h2-ls-tablet: {$h2_ls_tablet};
    //                     --acadlix-h2-ls-mobile: {$h2_ls_mobile};
    //                     --acadlix-h3-fs-desktop: {$h3_fs_desktop};
    //                     --acadlix-h3-fs-tablet: {$h3_fs_tablet};
    //                     --acadlix-h3-fs-mobile: {$h3_fs_mobile};
    //                     --acadlix-h3-fw-desktop: {$h3_fw_desktop};
    //                     --acadlix-h3-fw-tablet: {$h3_fw_tablet};
    //                     --acadlix-h3-fw-mobile: {$h3_fw_mobile};
    //                     --acadlix-h3-lh-desktop: {$h3_lh_desktop};
    //                     --acadlix-h3-lh-tablet: {$h3_lh_tablet};
    //                     --acadlix-h3-lh-mobile: {$h3_lh_mobile};
    //                     --acadlix-h3-ls-desktop: {$h3_ls_desktop};
    //                     --acadlix-h3-ls-tablet: {$h3_ls_tablet};
    //                     --acadlix-h3-ls-mobile: {$h3_ls_mobile};
    //                     --acadlix-h4-fs-desktop: {$h4_fs_desktop};
    //                     --acadlix-h4-fs-tablet: {$h4_fs_tablet};
    //                     --acadlix-h4-fs-mobile: {$h4_fs_mobile};
    //                     --acadlix-h4-fw-desktop: {$h4_fw_desktop};
    //                     --acadlix-h4-fw-tablet: {$h4_fw_tablet};
    //                     --acadlix-h4-fw-mobile: {$h4_fw_mobile};
    //                     --acadlix-h4-lh-desktop: {$h4_lh_desktop};
    //                     --acadlix-h4-lh-tablet: {$h4_lh_tablet};
    //                     --acadlix-h4-lh-mobile: {$h4_lh_mobile};
    //                     --acadlix-h4-ls-desktop: {$h4_ls_desktop};
    //                     --acadlix-h4-ls-tablet: {$h4_ls_tablet};
    //                     --acadlix-h4-ls-mobile: {$h4_ls_mobile};
    //                     --acadlix-h5-fs-desktop: {$h5_fs_desktop};
    //                     --acadlix-h5-fs-tablet: {$h5_fs_tablet};
    //                     --acadlix-h5-fs-mobile: {$h5_fs_mobile};
    //                     --acadlix-h5-fw-desktop: {$h5_fw_desktop};
    //                     --acadlix-h5-fw-tablet: {$h5_fw_tablet};
    //                     --acadlix-h5-fw-mobile: {$h5_fw_mobile};
    //                     --acadlix-h5-lh-desktop: {$h5_lh_desktop};
    //                     --acadlix-h5-lh-tablet: {$h5_lh_tablet};
    //                     --acadlix-h5-lh-mobile: {$h5_lh_mobile};
    //                     --acadlix-h5-ls-desktop: {$h5_ls_desktop};
    //                     --acadlix-h5-ls-tablet: {$h5_ls_tablet};
    //                     --acadlix-h5-ls-mobile: {$h5_ls_mobile};
    //                     --acadlix-h6-fs-desktop: {$h6_fs_desktop};
    //                     --acadlix-h6-fs-tablet: {$h6_fs_tablet};
    //                     --acadlix-h6-fs-mobile: {$h6_fs_mobile};
    //                     --acadlix-h6-fw-desktop: {$h6_fw_desktop};
    //                     --acadlix-h6-fw-tablet: {$h6_fw_tablet};
    //                     --acadlix-h6-fw-mobile: {$h6_fw_mobile};
    //                     --acadlix-h6-lh-desktop: {$h6_lh_desktop};
    //                     --acadlix-h6-lh-tablet: {$h6_lh_tablet};
    //                     --acadlix-h6-lh-mobile: {$h6_lh_mobile};
    //                     --acadlix-h6-ls-desktop: {$h6_ls_desktop};
    //                     --acadlix-h6-ls-tablet: {$h6_ls_tablet};
    //                     --acadlix-h6-ls-mobile: {$h6_ls_mobile};
    //                     --acadlix-body1-fs-desktop: {$body1_fs_desktop};
    //                     --acadlix-body1-fs-tablet: {$body1_fs_tablet};
    //                     --acadlix-body1-fs-mobile: {$body1_fs_mobile};
    //                     --acadlix-body1-fw-desktop: {$body1_fw_desktop};
    //                     --acadlix-body1-fw-tablet: {$body1_fw_tablet};
    //                     --acadlix-body1-fw-mobile: {$body1_fw_mobile};
    //                     --acadlix-body1-lh-desktop: {$body1_lh_desktop};
    //                     --acadlix-body1-lh-tablet: {$body1_lh_tablet};
    //                     --acadlix-body1-lh-mobile: {$body1_lh_mobile};
    //                     --acadlix-body1-ls-desktop: {$body1_ls_desktop};
    //                     --acadlix-body1-ls-tablet: {$body1_ls_tablet};
    //                     --acadlix-body1-ls-mobile: {$body1_ls_mobile};
    //                     --acadlix-body2-fs-desktop: {$body2_fs_desktop};
    //                     --acadlix-body2-fs-tablet: {$body2_fs_tablet};
    //                     --acadlix-body2-fs-mobile: {$body2_fs_mobile};
    //                     --acadlix-body2-fw-desktop: {$body2_fw_desktop};
    //                     --acadlix-body2-fw-tablet: {$body2_fw_tablet};
    //                     --acadlix-body2-fw-mobile: {$body2_fw_mobile};
    //                     --acadlix-body2-lh-desktop: {$body2_lh_desktop};
    //                     --acadlix-body2-lh-tablet: {$body2_lh_tablet};
    //                     --acadlix-body2-lh-mobile: {$body2_lh_mobile};
    //                     --acadlix-body2-ls-desktop: {$body2_ls_desktop};
    //                     --acadlix-body2-ls-tablet: {$body2_ls_tablet};
    //                     --acadlix-body2-ls-mobile: {$body2_ls_mobile};
    //                     --acadlix-subtitle1-fs-desktop: {$subtitle1_fs_desktop};
    //                     --acadlix-subtitle1-fs-tablet: {$subtitle1_fs_tablet};
    //                     --acadlix-subtitle1-fs-mobile: {$subtitle1_fs_mobile};
    //                     --acadlix-subtitle1-fw-desktop: {$subtitle1_fw_desktop};
    //                     --acadlix-subtitle1-fw-tablet: {$subtitle1_fw_tablet};
    //                     --acadlix-subtitle1-fw-mobile: {$subtitle1_fw_mobile};
    //                     --acadlix-subtitle1-lh-desktop: {$subtitle1_lh_desktop};
    //                     --acadlix-subtitle1-lh-tablet: {$subtitle1_lh_tablet};
    //                     --acadlix-subtitle1-lh-mobile: {$subtitle1_lh_mobile};
    //                     --acadlix-subtitle1-ls-desktop: {$subtitle1_ls_desktop};
    //                     --acadlix-subtitle1-ls-tablet: {$subtitle1_ls_tablet};
    //                     --acadlix-subtitle1-ls-mobile: {$subtitle1_ls_mobile};
    //                     --acadlix-subtitle2-fs-desktop: {$subtitle2_fs_desktop};
    //                     --acadlix-subtitle2-fs-tablet: {$subtitle2_fs_tablet};
    //                     --acadlix-subtitle2-fs-mobile: {$subtitle2_fs_mobile};
    //                     --acadlix-subtitle2-fw-desktop: {$subtitle2_fw_desktop};
    //                     --acadlix-subtitle2-fw-tablet: {$subtitle2_fw_tablet};
    //                     --acadlix-subtitle2-fw-mobile: {$subtitle2_fw_mobile};
    //                     --acadlix-subtitle2-lh-desktop: {$subtitle2_lh_desktop};
    //                     --acadlix-subtitle2-lh-tablet: {$subtitle2_lh_tablet};
    //                     --acadlix-subtitle2-lh-mobile: {$subtitle2_lh_mobile};
    //                     --acadlix-subtitle2-ls-desktop: {$subtitle2_ls_desktop};
    //                     --acadlix-subtitle2-ls-tablet: {$subtitle2_ls_tablet};
    //                     --acadlix-subtitle2-ls-mobile: {$subtitle2_ls_mobile};
    //                 }
    //             ";

    //     wp_add_inline_style('acadlix-front-base-style-css', $custom_css);

    //     // wp_enqueue_script('acadlix-front-action-button-course-js');
    //     // wp_localize_script('acadlix-front-action-button-course-js', 'acadlixButton', $this->localize_front_action_button_course_js_options());
    // }

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
