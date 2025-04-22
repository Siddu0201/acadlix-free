<?php

namespace Yuvayana\Acadlix\Assets;
use Yuvayana\Acadlix\Helper\Helper;
use Yuvayana\Acadlix\Helper\QueryLogger;
use Yuvayana\Acadlix\Models\Quiz;
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
            QueryLogger::enable();
        });
        add_action('init', [$this, 'register_all_scripts']);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_admin_scripts']);
        add_action('wp_enqueue_scripts', [$this, 'enqueue_front_assets']);

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
            $quiz = Quiz::ofQuiz()->whereHas('quiz_shortcode', function ($query) use ($id) {
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
                'src' => ACADLIX_BUILD_URL . 'vendors.css',
                'version' => ACADLIX_VERSION,
                'deps' => [],
            ],
            'acadlix-admin-quiz-css' => [
                'src' => ACADLIX_BUILD_URL . 'admin_quiz.css',
                'version' => ACADLIX_VERSION,
                'deps' => [],
            ],
            'acadlix-admin-lesson-css' => [
                'src' => ACADLIX_BUILD_URL . 'admin_lesson.css',
                'version' => ACADLIX_VERSION,
                'deps' => [],
            ],
            'acadlix-admin-order-css' => [
                'src' => ACADLIX_BUILD_URL . 'admin_order.css',
                'version' => ACADLIX_VERSION,
                'deps' => [],
            ],
            'acadlix-admin-setting-css' => [
                'src' => ACADLIX_BUILD_URL . 'admin_setting.css',
                'version' => ACADLIX_VERSION,
                'deps' => [],
            ],
            'acadlix-front-css' => [
                'src' => ACADLIX_BUILD_URL . 'front.css',
                'version' => ACADLIX_VERSION,
                'deps' => [],
            ],
            'acadlix-front-checkout-css' => [
                'src' => ACADLIX_BUILD_URL . 'front_checkout.css',
                'version' => ACADLIX_VERSION,
                'deps' => [],
            ],
            'acadlix-front-all-course-css' => [
                'src' => ACADLIX_ASSETS_CSS_URL . 'frontend/all_courses.css',
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
        ];
    }

    public function get_scripts(): array
    {
        $runtime_dependency = require_once ACADLIX_BUILD_PATH . 'runtime.asset.php';
        $vendors_dependency = require_once ACADLIX_BUILD_PATH . 'vendors.asset.php';
        $admin_course_dependency = require_once ACADLIX_BUILD_PATH . 'admin_course.asset.php';
        $admin_home_dependency = require_once ACADLIX_BUILD_PATH . 'admin_home.asset.php';
        $admin_lesson_dependency = require_once ACADLIX_BUILD_PATH . 'admin_lesson.asset.php';
        $admin_order_dependency = require_once ACADLIX_BUILD_PATH . 'admin_order.asset.php';
        $admin_quiz_dependency = require_once ACADLIX_BUILD_PATH . 'admin_quiz.asset.php';
        $admin_setting_dependency = require_once ACADLIX_BUILD_PATH . 'admin_setting.asset.php';
        $admin_tool_dependency = require_once ACADLIX_BUILD_PATH . 'admin_tool.asset.php';

        $front_dependency = require_once ACADLIX_BUILD_PATH . 'front.asset.php';
        $front_checkout_dependency = require_once ACADLIX_BUILD_PATH . 'front_checkout.asset.php';
        $front_single_course_dependency = require_once ACADLIX_BUILD_PATH . 'front_single_course.asset.php';

        $paypal_client_id = Helper::instance()->acadlix_get_option('acadlix_paypal_client_id');

        return [
            'acadlix-runtime-js' => [
                'src' => ACADLIX_BUILD_URL . 'runtime.js',
                'version' => $runtime_dependency['version'],
                'deps' => $runtime_dependency['dependencies'],
                'in_footer' => true,
            ],
            'acadlix-vendors-js' => [
                'src' => ACADLIX_BUILD_URL . 'vendors.js',
                'version' => $vendors_dependency['version'],
                'deps' => $vendors_dependency['dependencies'],
                'in_footer' => true,
            ],
            'acadlix-admin-course' => [
                'src' => ACADLIX_BUILD_URL . 'admin_course.js',
                'version' => $admin_course_dependency['version'],
                'deps' => $admin_course_dependency['dependencies'],
                'in_footer' => true,
            ],
            'acadlix-admin-home' => [
                'src' => ACADLIX_BUILD_URL . 'admin_home.js',
                'version' => $admin_home_dependency['version'],
                'deps' => $admin_home_dependency['dependencies'],
                'in_footer' => true,
            ],
            'acadlix-admin-lesson' => [
                'src' => ACADLIX_BUILD_URL . 'admin_lesson.js',
                'version' => $admin_lesson_dependency['version'],
                'deps' => $admin_lesson_dependency['dependencies'],
                'in_footer' => true,
            ],
            'acadlix-admin-order' => [
                'src' => ACADLIX_BUILD_URL . 'admin_order.js',
                'version' => $admin_order_dependency['version'],
                'deps' => $admin_order_dependency['dependencies'],
                'in_footer' => true,
            ],
            'acadlix-admin-quiz' => [
                'src' => ACADLIX_BUILD_URL . 'admin_quiz.js',
                'version' => $admin_quiz_dependency['version'],
                'deps' => $admin_quiz_dependency['dependencies'],
                'in_footer' => true,
            ],
            'acadlix-admin-setting' => [
                'src' => ACADLIX_BUILD_URL . 'admin_setting.js',
                'version' => $admin_setting_dependency['version'],
                'deps' => $admin_setting_dependency['dependencies'],
                'in_footer' => true,
            ],
            'acadlix-admin-tool' => [
                'src' => ACADLIX_BUILD_URL . 'admin_tool.js',
                'version' => $admin_tool_dependency['version'],
                'deps' => $admin_tool_dependency['dependencies'],
                'in_footer' => true,
            ],
            'acadlix-front-js' => [
                'src' => ACADLIX_BUILD_URL . 'front.js',
                'version' => $front_dependency['version'],
                'deps' => $front_dependency['dependencies'],
                'in_footer' => true,
            ],
            'acadlix-front-checkout-js' => [
                'src' => ACADLIX_BUILD_URL . 'front_checkout.js',
                'version' => $front_checkout_dependency['version'],
                'deps' => $front_checkout_dependency['dependencies'],
                'in_footer' => true,
            ],
            'acadlix-front-single-course-js' => [
                'src' => ACADLIX_BUILD_URL . 'front_single_course.js',
                'version' => $front_single_course_dependency['version'],
                'deps' => $front_single_course_dependency['dependencies'],
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
            'acadlix-global-hooks' => [
                'src' => ACADLIX_ASSETS_JS_URL . 'modules/hooks.js',
                'version' => ACADLIX_VERSION,
                'deps' => ['wp-hooks'],
                'in_footer' => true,
            ],
            // 'acadlix-front-all-course-js' => [
            //     'src' => ACADLIX_ASSETS_JS_URL . 'all-courses.js',
            //     'version' => ACADLIX_VERSION,
            //     'deps' => ['jquery'],
            //     'in_footer' => true,
            // ],
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

    public function enqueue_admin_scripts() 
    {
        if (!is_admin()) {
            return;
        }
         wp_enqueue_script( 'acadlix-global-hooks' );
    }

    public function enqueue_front_assets()
    {
        if (is_admin()) {
            return;
        }
        if (function_exists('wp_enqueue_media')) {
            wp_enqueue_media();
            wp_enqueue_script('wp-mediaelement');
            wp_enqueue_style('wp-mediaelement');
        }

        wp_enqueue_style( 'acadlix-vendor-css' );
        // wp_enqueue_style('katex-css', 'https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/katex.min.css');
        wp_enqueue_style('acadlix-front-base-style-css');
        $custom_css = "
                    :root {
                        --acadlix-primary-main: hsl(210, 100%, 45%); 
                        --acadlix-primary-dark: hsl(210, 100%, 38%);
                        --acadlix-text-primary: hsl(215, 15%, 12%);
                        --acadlix-text-tertiary: hsl(218, 10%, 55%);
                        --acadlix-grey: hsl(215, 15%, 97%);
                        --acadlix-border-color: hsl(2515, 15%, 82%);
                    }
                ";

        wp_add_inline_style('acadlix-front-base-style-css', $custom_css);

        wp_enqueue_style('acadlix-front-css');
        wp_enqueue_script('acadlix-runtime-js');
        wp_enqueue_script('acadlix-vendors-js');
        wp_enqueue_script('wp-date');
        wp_enqueue_script('acadlix-front-js');
        wp_localize_script('acadlix-front-js', 'acadlixOptions', array(
            'is_admin_bar_showing' => is_admin_bar_showing(),
            'api_url' => esc_url_raw(rest_url('acadlix/v1')),
            'max_execution_time' => Helper::instance()->acadlix_max_execution_time(),
            'ajax_url' => esc_url(admin_url('admin-ajax.php')),
            'home_url' => esc_url(home_url()),
            'nonce' => wp_create_nonce('wp_rest'),
            'advance_quiz_url' => get_permalink(get_option('acadlix_advance_quiz_page_id')),
            'user' => get_current_user_id() > 0 ? get_userdata(get_current_user_id())?->data : [],
            'settings' => Helper::instance()->acadlix_get_all_options(),
            'currency_symbol' => Helper::instance()->acadlix_currency_symbols()[Helper::instance()->acadlix_get_option('acadlix_currency')],
            'currency_symbols' => Helper::instance()->acadlix_currency_symbols(),
            'date_time_format' => Helper::instance()->acadlix_get_date_time_format(),
            'default_img_url' => esc_url(ACADLIX_ASSETS_IMAGE_URL . "demo-course.jpg"),
            'users_can_register' => Helper::instance()->acadlix_get_option("users_can_register"),
        ));
        wp_set_script_translations('acadlix-front-js', 'acadlix', ACADLIX_PLUGIN_DIR . 'languages');

        wp_enqueue_script('acadlix-katex-js', 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js', false, null, true);
        wp_enqueue_script(
            'katex-auto-render',
            'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/contrib/auto-render.min.js',
            ['acadlix-katex-js'], // depends on main katex
            null,
            true // load in footer
          );

    }

    public function acadlix_front_footer()
    {
        if(is_admin(  ))return;
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
