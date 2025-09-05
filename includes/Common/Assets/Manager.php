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
                ?>
                <style>
                    .acadlix-front-quiz-button {
                        height: 32px;
                        width: 93px;
                        display: block;
                        background-color: rgba(0, 0, 0, 0.11);
                        border-radius: 4px;
                        animation: 2s ease-in-out 0.5s infinite normal none running animation-c7515d;
                    }

                    @keyframes animation-c7515d {
                        0% {
                            opacity: 1;
                        }

                        50% {
                            opacity: 0.4;
                        }

                        100% {
                            opacity: 1;
                        }
                    }

                    .acadlix-front-quiz-button:hover {
                        background-color: #f1f1f1;
                    }

                    .acadlix-front-quiz-button:active {
                        background-color: #ddd;
                    }
                </style>
                <div class="acadlix-front-quiz-container">
                    <h2 class="acadlix-front-quiz-title" id="acadlix_front_quiz_title_<?php echo esc_html($quiz->ID); ?>"
                        style="display: <?php echo $quiz->rendered_metas['quiz_settings']['hide_quiz_title'] ? 'none' : 'block'; ?>;">
                        <?php echo esc_html($quiz->post_title); ?>
                    </h2>
                    <div class="acadlix-front-quiz-description" id="acadlix_front_quiz_description_<?php echo esc_html($quiz->ID); ?>">
                        <?php echo do_shortcode(apply_filters('comment_text', $quiz->post_content)); ?>
                    </div>
                    <div class="acadlix-front" id="<?php echo esc_html($quiz->ID); ?>">
                        <div class="acadlix-front-quiz-button">
                        </div>
                    </div>
                </div>
                <script>
                    document.addEventListener("DOMContentLoaded", function () {
                        document.dispatchEvent(new Event('shortcodeLoaded'));
                    });
                </script>
                <?php
            } else {
                echo "[Acadlix_Quiz " . esc_html($id) . "]";
            }
            $content = ob_get_contents();
            ob_get_clean();
        }
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
                'src' => 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css',
                'version' => ACADLIX_VERSION,
                'deps' => [],
            ],
            'acadlix-front-line-awesome-css' => [
                'src' => 'https://cdnjs.cloudflare.com/ajax/libs/line-awesome/1.3.0/line-awesome/css/line-awesome.min.css',
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

                wp_enqueue_script($handle, $src, $deps, null, true);
                wp_set_script_translations($handle, 'acadlix', ACADLIX_PLUGIN_DIR . 'languages/' . acadlix()->versionPath . '/');

                if (!empty($localized_options)) {
                    wp_localize_script($handle, $localized_name, $localized_options);
                }
            }
            if (isset($entry['assets']['css']) && $entry['assets']['css']) {
                foreach ($entry['assets']['css'] as $css_file) {
                    if (is_rtl()) {
                        if (str_contains($css_file, 'rtl')) {
                            $handle = 'acadlix-' . pathinfo($css_file, PATHINFO_FILENAME);
                            $src = ACADLIX_BUILD_URL . acadlix()->versionPath . '/' . $css_file;
                            wp_enqueue_style($handle, $src);
                        }
                    } else {
                        if (!str_contains($css_file, 'rtl')) {
                            $handle = 'acadlix-' . pathinfo($css_file, PATHINFO_FILENAME);
                            $src = ACADLIX_BUILD_URL . acadlix()->versionPath . '/' . $css_file;
                            wp_enqueue_style($handle, $src);
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
                        wp_enqueue_script($handle, $src, $deps, null, true);
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
                'src' => ACADLIX_ASSETS_JS_URL. 'plyr/plyr.js',
                'version' => ACADLIX_VERSION,
                'deps' => ['jquery'],
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
            'logout_url' => esc_url(wp_logout_url(acadlix()->helper()->acadlix_get_option('acadlix_logout_redirect_url') !== "" ? acadlix()->helper()->acadlix_get_option('acadlix_logout_redirect_url') : home_url())),
            'nonce' => wp_create_nonce('wp_rest'),
            'advance_quiz_url' => get_permalink(acadlix()->helper()->acadlix_get_option('acadlix_advance_quiz_page_id')),
            'user' => get_current_user_id() > 0 ?
                acadlix()->model()->wpUsers()
                    ->select([
                        'ID',
                        'user_email',
                        'display_name',
                        'user_url'
                    ])
                    ->where('ID', get_current_user_id())
                    ->first() : [],
            'user_avatar_url' => get_current_user_id() > 0 ?
                get_user_meta(get_current_user_id(), '_acadlix_profile_photo', true) : '',
            'settings' => acadlix()->helper()->acadlix_get_all_options(),
            'theme_settings' => acadlix()->helper()->acadlix_get_option('acadlix_theme_settings'),
            'logo_url' => $logo_url,
            'blog_name' => get_bloginfo('name'),
            'currency_symbol' => acadlix()->helper()->acadlix_currency_symbols()[acadlix()->helper()->acadlix_get_option('acadlix_currency')],
            'currency_symbols' => acadlix()->helper()->acadlix_currency_symbols(),
            'date_time_format' => acadlix()->helper()->acadlix_get_date_time_format(),
            'default_img_url' => esc_url(ACADLIX_ASSETS_IMAGE_URL . "demo-course.jpg"),
            'users_can_register' => acadlix()->helper()->acadlix_get_option("users_can_register"),
            'isActive' => acadlix()->license()->isActive ?? false,
        ];
    }

    public function localize_front_action_button_course_js_options()
    {
        return [
            'is_admin_bar_showing' => is_admin_bar_showing(),
            'api_url' => esc_url_raw(rest_url('acadlix/v1')),
            'max_execution_time' => acadlix()->helper()->acadlix_max_execution_time(),
            'nonce' => wp_create_nonce('wp_rest'),
            'home_url' => esc_url(home_url()),
            'ajax_url' => esc_url(admin_url('admin-ajax.php')),
            'checkout_url' => esc_url(get_permalink(acadlix()->helper()->acadlix_get_option('acadlix_checkout_page_id'))),
            'cart_url' => esc_url(get_permalink(acadlix()->helper()->acadlix_get_option('acadlix_cart_page_id'))),
            'user_id' => get_current_user_id() ?? 0,
            'user' => get_current_user_id() > 0 ?
                acadlix()->model()->wpUsers()
                    ->select([
                        'ID',
                        'user_email',
                        'display_name',
                        'user_url'
                    ])
                    ->where('ID', get_current_user_id())
                    ->first() : [],
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
        wp_enqueue_editor();
        if (function_exists('wp_enqueue_media')) {
            wp_enqueue_media();
            wp_enqueue_script('wp-mediaelement');
            wp_enqueue_style('wp-mediaelement');
        }
        wp_enqueue_script('acadlix-katex-js');
        wp_enqueue_script('acadlix-katex-auto-render-js');
        wp_enqueue_script('wp-date');
        wp_enqueue_script('acadlix-plyr-js');

        acadlix()->assets()->manager()->load_assets('front', $this->localize_front_js_options());

        // wp_enqueue_style('acadlix-vendor-css');
        // wp_enqueue_style('acadlix-front-css');

        // wp_enqueue_script('acadlix-vendors-js');
        // wp_enqueue_script('acadlix-runtime-js');
        // wp_enqueue_script('acadlix-front-js');
        // wp_localize_script('acadlix-front-js', 'acadlixOptions', $this->localize_front_js_options());
        // wp_set_script_translations('acadlix-front-js', 'acadlix', ACADLIX_PLUGIN_DIR . 'languages');
    }

    public function enqueue_front_assets()
    {

        wp_enqueue_style('acadlix-front-base-style-css');
        $theme = acadlix()->helper()->acadlix_get_option('acadlix_theme_settings');
        // acadlix()->helper()->acadlix_ddd($theme['typography']['h1']['lineHeight']['desktop']);
        $primaryMain = $theme['palette']['primary']['main'] ?? 'hsl(210, 100%, 50%)';
        $primaryDark = $theme['palette']['primary']['dark'] ?? 'hsl(210, 100%, 38%)';
        $textPrimary = $theme['palette']['text']['primary'] ?? 'hsl(215, 15%, 12%)';
        $textSecondary = $theme['palette']['text']['secondary'] ?? 'hsl(218, 10%, 55%)';
        // $grey            = $theme['palette']['grey']['main'] ?? 'hsl(215, 15%, 97%)';
        $grey = $theme['palette']['grey']['light'] ?? 'hsl(215, 15%, 97%)';
        // $borderColor     = $theme['palette']['grey']['light'] ?? 'hsl(215, 15%, 82%)';
        $borderColor = 'hsl(215, 15%, 82%)';
        // H1
        $h1_fs_desktop = $theme['typography']['h1']['fontSize']['desktop'] ?? '2.5rem';
        $h1_fs_tablet = $theme['typography']['h1']['fontSize']['tablet'] ?? '2rem';
        $h1_fs_mobile = $theme['typography']['h1']['fontSize']['mobile'] ?? '1.75rem';
        $h1_fw_desktop = $theme['typography']['h1']['fontWeight']['desktop'] ?? 700;
        $h1_fw_tablet = $theme['typography']['h1']['fontWeight']['tablet'] ?? 700;
        $h1_fw_mobile = $theme['typography']['h1']['fontWeight']['mobile'] ?? 700;
        $h1_lh_desktop = $theme['typography']['h1']['lineHeight']['desktop'] ?? '1.25';
        $h1_lh_tablet = $theme['typography']['h1']['lineHeight']['tablet'] ?? '1.25';
        $h1_lh_mobile = $theme['typography']['h1']['lineHeight']['mobile'] ?? '1.25';
        $h1_ls_desktop = $theme['typography']['h1']['letterSpacing']['desktop'] ?? '0.3px';
        $h1_ls_tablet = $theme['typography']['h1']['letterSpacing']['tablet'] ?? '0.3px';
        $h1_ls_mobile = $theme['typography']['h1']['letterSpacing']['mobile'] ?? '0.3px';
        // H2
        $h2_fs_desktop = $theme['typography']['h2']['fontSize']['desktop'] ?? '1.875rem';
        $h2_fs_tablet = $theme['typography']['h2']['fontSize']['tablet'] ?? '1.625rem';
        $h2_fs_mobile = $theme['typography']['h2']['fontSize']['mobile'] ?? '1.5rem';
        $h2_fw_desktop = $theme['typography']['h2']['fontWeight']['desktop'] ?? 600;
        $h2_fw_tablet = $theme['typography']['h2']['fontWeight']['tablet'] ?? 600;
        $h2_fw_mobile = $theme['typography']['h2']['fontWeight']['mobile'] ?? 600;
        $h2_lh_desktop = $theme['typography']['h2']['lineHeight']['desktop'] ?? '1.25';
        $h2_lh_tablet = $theme['typography']['h2']['lineHeight']['tablet'] ?? '1.25';
        $h2_lh_mobile = $theme['typography']['h2']['lineHeight']['mobile'] ?? '1.25';
        $h2_ls_desktop = $theme['typography']['h2']['letterSpacing']['desktop'] ?? '0.3px';
        $h2_ls_tablet = $theme['typography']['h2']['letterSpacing']['tablet'] ?? '0.3px';
        $h2_ls_mobile = $theme['typography']['h2']['letterSpacing']['mobile'] ?? '0.3px';
        // H3
        $h3_fs_desktop = $theme['typography']['h3']['fontSize']['desktop'] ?? '1.5rem';
        $h3_fs_tablet = $theme['typography']['h3']['fontSize']['tablet'] ?? '1.375rem';
        $h3_fs_mobile = $theme['typography']['h3']['fontSize']['mobile'] ?? '1.25rem';
        $h3_fw_desktop = $theme['typography']['h3']['fontWeight']['desktop'] ?? 600;
        $h3_fw_tablet = $theme['typography']['h3']['fontWeight']['tablet'] ?? 600;
        $h3_fw_mobile = $theme['typography']['h3']['fontWeight']['mobile'] ?? 600;
        $h3_lh_desktop = $theme['typography']['h3']['lineHeight']['desktop'] ?? '1.25';
        $h3_lh_tablet = $theme['typography']['h3']['lineHeight']['tablet'] ?? '1.25';
        $h3_lh_mobile = $theme['typography']['h3']['lineHeight']['mobile'] ?? '1.25';
        $h3_ls_desktop = $theme['typography']['h3']['letterSpacing']['desktop'] ?? '0.3px';
        $h3_ls_tablet = $theme['typography']['h3']['letterSpacing']['tablet'] ?? '0.3px';
        $h3_ls_mobile = $theme['typography']['h3']['letterSpacing']['mobile'] ?? '0.3px';
        // H4
        $h4_fs_desktop = $theme['typography']['h4']['fontSize']['desktop'] ?? '1.25rem';
        $h4_fs_tablet = $theme['typography']['h4']['fontSize']['tablet'] ?? '1.125rem';
        $h4_fs_mobile = $theme['typography']['h4']['fontSize']['mobile'] ?? '1rem';
        $h4_fw_desktop = $theme['typography']['h4']['fontWeight']['desktop'] ?? 600;
        $h4_fw_tablet = $theme['typography']['h4']['fontWeight']['tablet'] ?? 600;
        $h4_fw_mobile = $theme['typography']['h4']['fontWeight']['mobile'] ?? 600;
        $h4_lh_desktop = $theme['typography']['h4']['lineHeight']['desktop'] ?? '1.25';
        $h4_lh_tablet = $theme['typography']['h4']['lineHeight']['tablet'] ?? '1.25';
        $h4_lh_mobile = $theme['typography']['h4']['lineHeight']['mobile'] ?? '1.25';
        $h4_ls_desktop = $theme['typography']['h4']['letterSpacing']['desktop'] ?? '0.3px';
        $h4_ls_tablet = $theme['typography']['h4']['letterSpacing']['tablet'] ?? '0.3px';
        $h4_ls_mobile = $theme['typography']['h4']['letterSpacing']['mobile'] ?? '0.3px';
        // H5
        $h5_fs_desktop = $theme['typography']['h5']['fontSize']['desktop'] ?? '1.125rem';
        $h5_fs_tablet = $theme['typography']['h5']['fontSize']['tablet'] ?? '1rem';
        $h5_fs_mobile = $theme['typography']['h5']['fontSize']['mobile'] ?? '0.9375rem';
        $h5_fw_desktop = $theme['typography']['h5']['fontWeight']['desktop'] ?? 600;
        $h5_fw_tablet = $theme['typography']['h5']['fontWeight']['tablet'] ?? 600;
        $h5_fw_mobile = $theme['typography']['h5']['fontWeight']['mobile'] ?? 600;
        $h5_lh_desktop = $theme['typography']['h5']['lineHeight']['desktop'] ?? '1.25';
        $h5_lh_tablet = $theme['typography']['h5']['lineHeight']['tablet'] ?? '1.25';
        $h5_lh_mobile = $theme['typography']['h5']['lineHeight']['mobile'] ?? '1.25';
        $h5_ls_desktop = $theme['typography']['h5']['letterSpacing']['desktop'] ?? '0.3px';
        $h5_ls_tablet = $theme['typography']['h5']['letterSpacing']['tablet'] ?? '0.3px';
        $h5_ls_mobile = $theme['typography']['h5']['letterSpacing']['mobile'] ?? '0.3px';
        // H6
        $h6_fs_desktop = $theme['typography']['h6']['fontSize']['desktop'] ?? '1rem';
        $h6_fs_tablet = $theme['typography']['h6']['fontSize']['tablet'] ?? '0.9375rem';
        $h6_fs_mobile = $theme['typography']['h6']['fontSize']['mobile'] ?? '0.875rem';
        $h6_fw_desktop = $theme['typography']['h6']['fontWeight']['desktop'] ?? 600;
        $h6_fw_tablet = $theme['typography']['h6']['fontWeight']['tablet'] ?? 600;
        $h6_fw_mobile = $theme['typography']['h6']['fontWeight']['mobile'] ?? 600;
        $h6_lh_desktop = $theme['typography']['h6']['lineHeight']['desktop'] ?? '1.25';
        $h6_lh_tablet = $theme['typography']['h6']['lineHeight']['tablet'] ?? '1.25';
        $h6_lh_mobile = $theme['typography']['h6']['lineHeight']['mobile'] ?? '1.25';
        $h6_ls_desktop = $theme['typography']['h6']['letterSpacing']['desktop'] ?? '0.3px';
        $h6_ls_tablet = $theme['typography']['h6']['letterSpacing']['tablet'] ?? '0.3px';
        $h6_ls_mobile = $theme['typography']['h6']['letterSpacing']['mobile'] ?? '0.3px';
        // body1
        $body1_fs_desktop = $theme['typography']['body1']['fontSize']['desktop'] ?? '1rem';
        $body1_fs_tablet = $theme['typography']['body1']['fontSize']['tablet'] ?? '0.9375rem';
        $body1_fs_mobile = $theme['typography']['body1']['fontSize']['mobile'] ?? '0.875rem';
        $body1_fw_desktop = $theme['typography']['body1']['fontWeight']['desktop'] ?? 400;
        $body1_fw_tablet = $theme['typography']['body1']['fontWeight']['tablet'] ?? 400;
        $body1_fw_mobile = $theme['typography']['body1']['fontWeight']['mobile'] ?? 400;
        $body1_lh_desktop = $theme['typography']['body1']['lineHeight']['desktop'] ?? '1.5';
        $body1_lh_tablet = $theme['typography']['body1']['lineHeight']['tablet'] ?? '1.5';
        $body1_lh_mobile = $theme['typography']['body1']['lineHeight']['mobile'] ?? '1.5';
        $body1_ls_desktop = $theme['typography']['body1']['letterSpacing']['desktop'] ?? '0.3px';
        $body1_ls_tablet = $theme['typography']['body1']['letterSpacing']['tablet'] ?? '0.3px';
        $body1_ls_mobile = $theme['typography']['body1']['letterSpacing']['mobile'] ?? '0.3px';
        // body2
        $body2_fs_desktop = $theme['typography']['body2']['fontSize']['desktop'] ?? '0.875rem';
        $body2_fs_tablet = $theme['typography']['body2']['fontSize']['tablet'] ?? '0.75rem';
        $body2_fs_mobile = $theme['typography']['body2']['fontSize']['mobile'] ?? '0.625rem';
        $body2_fw_desktop = $theme['typography']['body2']['fontWeight']['desktop'] ?? 400;
        $body2_fw_tablet = $theme['typography']['body2']['fontWeight']['tablet'] ?? 400;
        $body2_fw_mobile = $theme['typography']['body2']['fontWeight']['mobile'] ?? 400;
        $body2_lh_desktop = $theme['typography']['body2']['lineHeight']['desktop'] ?? '1.5';
        $body2_lh_tablet = $theme['typography']['body2']['lineHeight']['tablet'] ?? '1.5';
        $body2_lh_mobile = $theme['typography']['body2']['lineHeight']['mobile'] ?? '1.5';
        $body2_ls_desktop = $theme['typography']['body2']['letterSpacing']['desktop'] ?? '0.3px';
        $body2_ls_tablet = $theme['typography']['body2']['letterSpacing']['tablet'] ?? '0.3px';
        $body2_ls_mobile = $theme['typography']['body2']['letterSpacing']['mobile'] ?? '0.3px';
        // subtitle1
        $subtitle1_fs_desktop = $theme['typography']['subtitle1']['fontSize']['desktop'] ?? '1rem';
        $subtitle1_fs_tablet = $theme['typography']['subtitle1']['fontSize']['tablet'] ?? '0.9375rem';
        $subtitle1_fs_mobile = $theme['typography']['subtitle1']['fontSize']['mobile'] ?? '0.875rem';
        $subtitle1_fw_desktop = $theme['typography']['subtitle1']['fontWeight']['desktop'] ?? 400;
        $subtitle1_fw_tablet = $theme['typography']['subtitle1']['fontWeight']['tablet'] ?? 400;
        $subtitle1_fw_mobile = $theme['typography']['subtitle1']['fontWeight']['mobile'] ?? 400;
        $subtitle1_lh_desktop = $theme['typography']['subtitle1']['lineHeight']['desktop'] ?? '1.75';
        $subtitle1_lh_tablet = $theme['typography']['subtitle1']['lineHeight']['tablet'] ?? '1.75';
        $subtitle1_lh_mobile = $theme['typography']['subtitle1']['lineHeight']['mobile'] ?? '1.75';
        $subtitle1_ls_desktop = $theme['typography']['subtitle1']['letterSpacing']['desktop'] ?? '0.3px';
        $subtitle1_ls_tablet = $theme['typography']['subtitle1']['letterSpacing']['tablet'] ?? '0.3px';
        $subtitle1_ls_mobile = $theme['typography']['subtitle1']['letterSpacing']['mobile'] ?? '0.3px';
        // subtitle2
        $subtitle2_fs_desktop = $theme['typography']['subtitle2']['fontSize']['desktop'] ?? '0.875rem';
        $subtitle2_fs_tablet = $theme['typography']['subtitle2']['fontSize']['tablet'] ?? '0.75rem';
        $subtitle2_fs_mobile = $theme['typography']['subtitle2']['fontSize']['mobile'] ?? '0.625rem';
        $subtitle2_fw_desktop = $theme['typography']['subtitle2']['fontWeight']['desktop'] ?? 500;
        $subtitle2_fw_tablet = $theme['typography']['subtitle2']['fontWeight']['tablet'] ?? 500;
        $subtitle2_fw_mobile = $theme['typography']['subtitle2']['fontWeight']['mobile'] ?? 500;
        $subtitle2_lh_desktop = $theme['typography']['subtitle2']['lineHeight']['desktop'] ?? '1.5';
        $subtitle2_lh_tablet = $theme['typography']['subtitle2']['lineHeight']['tablet'] ?? '1.5';
        $subtitle2_lh_mobile = $theme['typography']['subtitle2']['lineHeight']['mobile'] ?? '1.5';
        $subtitle2_ls_desktop = $theme['typography']['subtitle2']['letterSpacing']['desktop'] ?? '0.3px';
        $subtitle2_ls_tablet = $theme['typography']['subtitle2']['letterSpacing']['tablet'] ?? '0.3px';
        $subtitle2_ls_mobile = $theme['typography']['subtitle2']['letterSpacing']['mobile'] ?? '0.3px';
        $custom_css = "
                    :root {
                        --acadlix-primary-main: {$primaryMain}; 
                        --acadlix-primary-dark: {$primaryDark};
                        --acadlix-text-primary: {$textPrimary};
                        --acadlix-text-secondary: {$textSecondary};
                        --acadlix-grey: {$grey};
                        --acadlix-border-color: {$borderColor};
                        --acadlix-h1-fs-desktop: {$h1_fs_desktop};
                        --acadlix-h1-fs-tablet: {$h1_fs_tablet};
                        --acadlix-h1-fs-mobile: {$h1_fs_mobile};
                        --acadlix-h1-fw-desktop: {$h1_fw_desktop};
                        --acadlix-h1-fw-tablet: {$h1_fw_tablet};
                        --acadlix-h1-fw-mobile: {$h1_fw_mobile};
                        --acadlix-h1-lh-desktop: {$h1_lh_desktop};
                        --acadlix-h1-lh-tablet: {$h1_lh_tablet};
                        --acadlix-h1-lh-mobile: {$h1_lh_mobile};
                        --acadlix-h1-ls-desktop: {$h1_ls_desktop};
                        --acadlix-h1-ls-tablet: {$h1_ls_tablet};
                        --acadlix-h1-ls-mobile: {$h1_ls_mobile};
                        --acadlix-h2-fs-desktop: {$h2_fs_desktop};
                        --acadlix-h2-fs-tablet: {$h2_fs_tablet};
                        --acadlix-h2-fs-mobile: {$h2_fs_mobile};
                        --acadlix-h2-fw-desktop: {$h2_fw_desktop};
                        --acadlix-h2-fw-tablet: {$h2_fw_tablet};
                        --acadlix-h2-fw-mobile: {$h2_fw_mobile};
                        --acadlix-h2-lh-desktop: {$h2_lh_desktop};
                        --acadlix-h2-lh-tablet: {$h2_lh_tablet};
                        --acadlix-h2-lh-mobile: {$h2_lh_mobile};
                        --acadlix-h2-ls-desktop: {$h2_ls_desktop};
                        --acadlix-h2-ls-tablet: {$h2_ls_tablet};
                        --acadlix-h2-ls-mobile: {$h2_ls_mobile};
                        --acadlix-h3-fs-desktop: {$h3_fs_desktop};
                        --acadlix-h3-fs-tablet: {$h3_fs_tablet};
                        --acadlix-h3-fs-mobile: {$h3_fs_mobile};
                        --acadlix-h3-fw-desktop: {$h3_fw_desktop};
                        --acadlix-h3-fw-tablet: {$h3_fw_tablet};
                        --acadlix-h3-fw-mobile: {$h3_fw_mobile};
                        --acadlix-h3-lh-desktop: {$h3_lh_desktop};
                        --acadlix-h3-lh-tablet: {$h3_lh_tablet};
                        --acadlix-h3-lh-mobile: {$h3_lh_mobile};
                        --acadlix-h3-ls-desktop: {$h3_ls_desktop};
                        --acadlix-h3-ls-tablet: {$h3_ls_tablet};
                        --acadlix-h3-ls-mobile: {$h3_ls_mobile};
                        --acadlix-h4-fs-desktop: {$h4_fs_desktop};
                        --acadlix-h4-fs-tablet: {$h4_fs_tablet};
                        --acadlix-h4-fs-mobile: {$h4_fs_mobile};
                        --acadlix-h4-fw-desktop: {$h4_fw_desktop};
                        --acadlix-h4-fw-tablet: {$h4_fw_tablet};
                        --acadlix-h4-fw-mobile: {$h4_fw_mobile};
                        --acadlix-h4-lh-desktop: {$h4_lh_desktop};
                        --acadlix-h4-lh-tablet: {$h4_lh_tablet};
                        --acadlix-h4-lh-mobile: {$h4_lh_mobile};
                        --acadlix-h4-ls-desktop: {$h4_ls_desktop};
                        --acadlix-h4-ls-tablet: {$h4_ls_tablet};
                        --acadlix-h4-ls-mobile: {$h4_ls_mobile};
                        --acadlix-h5-fs-desktop: {$h5_fs_desktop};
                        --acadlix-h5-fs-tablet: {$h5_fs_tablet};
                        --acadlix-h5-fs-mobile: {$h5_fs_mobile};
                        --acadlix-h5-fw-desktop: {$h5_fw_desktop};
                        --acadlix-h5-fw-tablet: {$h5_fw_tablet};
                        --acadlix-h5-fw-mobile: {$h5_fw_mobile};
                        --acadlix-h5-lh-desktop: {$h5_lh_desktop};
                        --acadlix-h5-lh-tablet: {$h5_lh_tablet};
                        --acadlix-h5-lh-mobile: {$h5_lh_mobile};
                        --acadlix-h5-ls-desktop: {$h5_ls_desktop};
                        --acadlix-h5-ls-tablet: {$h5_ls_tablet};
                        --acadlix-h5-ls-mobile: {$h5_ls_mobile};
                        --acadlix-h6-fs-desktop: {$h6_fs_desktop};
                        --acadlix-h6-fs-tablet: {$h6_fs_tablet};
                        --acadlix-h6-fs-mobile: {$h6_fs_mobile};
                        --acadlix-h6-fw-desktop: {$h6_fw_desktop};
                        --acadlix-h6-fw-tablet: {$h6_fw_tablet};
                        --acadlix-h6-fw-mobile: {$h6_fw_mobile};
                        --acadlix-h6-lh-desktop: {$h6_lh_desktop};
                        --acadlix-h6-lh-tablet: {$h6_lh_tablet};
                        --acadlix-h6-lh-mobile: {$h6_lh_mobile};
                        --acadlix-h6-ls-desktop: {$h6_ls_desktop};
                        --acadlix-h6-ls-tablet: {$h6_ls_tablet};
                        --acadlix-h6-ls-mobile: {$h6_ls_mobile};
                        --acadlix-body1-fs-desktop: {$body1_fs_desktop};
                        --acadlix-body1-fs-tablet: {$body1_fs_tablet};
                        --acadlix-body1-fs-mobile: {$body1_fs_mobile};
                        --acadlix-body1-fw-desktop: {$body1_fw_desktop};
                        --acadlix-body1-fw-tablet: {$body1_fw_tablet};
                        --acadlix-body1-fw-mobile: {$body1_fw_mobile};
                        --acadlix-body1-lh-desktop: {$body1_lh_desktop};
                        --acadlix-body1-lh-tablet: {$body1_lh_tablet};
                        --acadlix-body1-lh-mobile: {$body1_lh_mobile};
                        --acadlix-body1-ls-desktop: {$body1_ls_desktop};
                        --acadlix-body1-ls-tablet: {$body1_ls_tablet};
                        --acadlix-body1-ls-mobile: {$body1_ls_mobile};
                        --acadlix-body2-fs-desktop: {$body2_fs_desktop};
                        --acadlix-body2-fs-tablet: {$body2_fs_tablet};
                        --acadlix-body2-fs-mobile: {$body2_fs_mobile};
                        --acadlix-body2-fw-desktop: {$body2_fw_desktop};
                        --acadlix-body2-fw-tablet: {$body2_fw_tablet};
                        --acadlix-body2-fw-mobile: {$body2_fw_mobile};
                        --acadlix-body2-lh-desktop: {$body2_lh_desktop};
                        --acadlix-body2-lh-tablet: {$body2_lh_tablet};
                        --acadlix-body2-lh-mobile: {$body2_lh_mobile};
                        --acadlix-body2-ls-desktop: {$body2_ls_desktop};
                        --acadlix-body2-ls-tablet: {$body2_ls_tablet};
                        --acadlix-body2-ls-mobile: {$body2_ls_mobile};
                        --acadlix-subtitle1-fs-desktop: {$subtitle1_fs_desktop};
                        --acadlix-subtitle1-fs-tablet: {$subtitle1_fs_tablet};
                        --acadlix-subtitle1-fs-mobile: {$subtitle1_fs_mobile};
                        --acadlix-subtitle1-fw-desktop: {$subtitle1_fw_desktop};
                        --acadlix-subtitle1-fw-tablet: {$subtitle1_fw_tablet};
                        --acadlix-subtitle1-fw-mobile: {$subtitle1_fw_mobile};
                        --acadlix-subtitle1-lh-desktop: {$subtitle1_lh_desktop};
                        --acadlix-subtitle1-lh-tablet: {$subtitle1_lh_tablet};
                        --acadlix-subtitle1-lh-mobile: {$subtitle1_lh_mobile};
                        --acadlix-subtitle1-ls-desktop: {$subtitle1_ls_desktop};
                        --acadlix-subtitle1-ls-tablet: {$subtitle1_ls_tablet};
                        --acadlix-subtitle1-ls-mobile: {$subtitle1_ls_mobile};
                        --acadlix-subtitle2-fs-desktop: {$subtitle2_fs_desktop};
                        --acadlix-subtitle2-fs-tablet: {$subtitle2_fs_tablet};
                        --acadlix-subtitle2-fs-mobile: {$subtitle2_fs_mobile};
                        --acadlix-subtitle2-fw-desktop: {$subtitle2_fw_desktop};
                        --acadlix-subtitle2-fw-tablet: {$subtitle2_fw_tablet};
                        --acadlix-subtitle2-fw-mobile: {$subtitle2_fw_mobile};
                        --acadlix-subtitle2-lh-desktop: {$subtitle2_lh_desktop};
                        --acadlix-subtitle2-lh-tablet: {$subtitle2_lh_tablet};
                        --acadlix-subtitle2-lh-mobile: {$subtitle2_lh_mobile};
                        --acadlix-subtitle2-ls-desktop: {$subtitle2_ls_desktop};
                        --acadlix-subtitle2-ls-tablet: {$subtitle2_ls_tablet};
                        --acadlix-subtitle2-ls-mobile: {$subtitle2_ls_mobile};
                    }
                ";

        wp_add_inline_style('acadlix-front-base-style-css', $custom_css);



        wp_enqueue_script('acadlix-front-action-button-course-js');
        wp_localize_script('acadlix-front-action-button-course-js', 'acadlixButton', $this->localize_front_action_button_course_js_options());

    }

    public function acadlix_front_footer()
    {
        if (is_admin())
            return;
        ?>
        <script>
            document.addEventListener("DOMContentLoaded", function () {
                renderMathInElement(document.body, {
                    delimiters: [
                        { left: "$$", right: "$$", display: true },
                        { left: "\\[", right: "\\]", display: true },
                        { left: "$", right: "$", display: false },
                        { left: "\\(", right: "\\)", display: false }
                    ],
                    throwOnError: false
                });
            });
        </script>
        <?php
    }

    public static function instance()
    {
        if (!self::$_instance) {
            self::$_instance = new self();
        }

        return self::$_instance;
    }
}
