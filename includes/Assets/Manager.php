<?php

namespace Yuvayana\Acadlix\Assets;
use Yuvayana\Acadlix\Models\Quiz;
defined( 'ABSPATH' ) || exit();

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
        add_action('init', [$this, 'register_all_scripts']);
        add_action('wp_enqueue_scripts', [$this, 'enqueue_front_assets']);

        add_shortcode('Acadlix_Quiz', [$this, 'add_shortcode_quiz']);
        add_shortcode('Acadlix_Dashboard', [$this, 'acadlix_dashboard_shortcode']);
        add_shortcode('Acadlix_Advance_Quiz', [$this, 'acadlix_advance_quiz_shortcode']);

        add_filter('single_template', [$this, 'acadlix_template']);
        add_filter('page_template', [$this, 'acadlix_template']);
    }

    public function add_shortcode_quiz($atts)
    {
        $id = $atts[0];
        $content = '';

        if (is_numeric($id)) {
            ob_start();
            $quiz = Quiz::find($id);
            if ($quiz) {
                ?>
                <div class="acadlix-front" id="<?php echo esc_html($id); ?>"></div>
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
            'acadlix-admin-quiz-css' => [
                'src' => ACADLIX_BUILD_URL . 'admin_quiz.css',
                'version' => ACADLIX_VERSION,
                'deps' => [],
            ],
            'acadlix-front-css' => [
                'src' => ACADLIX_BUILD_URL . 'front.css',
                'version' => ACADLIX_VERSION,
                'deps' => [],
            ],

        ];
    }

    public function get_scripts(): array
    {
        $admin_course_dependency = require_once ACADLIX_BUILD_PATH . 'admin_course.asset.php';
        $admin_home_dependency = require_once ACADLIX_BUILD_PATH . 'admin_home.asset.php';
        $admin_lesson_dependency = require_once ACADLIX_BUILD_PATH . 'admin_lesson.asset.php';
        $admin_order_dependency = require_once ACADLIX_BUILD_PATH . 'admin_order.asset.php';
        $admin_quiz_dependency = require_once ACADLIX_BUILD_PATH . 'admin_quiz.asset.php';
        $admin_setting_dependency = require_once ACADLIX_BUILD_PATH . 'admin_setting.asset.php';
        $admin_tool_dependency = require_once ACADLIX_BUILD_PATH . 'admin_tool.asset.php';

        $front_dependency = require_once ACADLIX_BUILD_PATH . 'front.asset.php';

        return [
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
            'acadlix-front-app' => [
                'src' => ACADLIX_BUILD_URL . 'front.js',
                'version' => $front_dependency['version'],
                'deps' => $front_dependency['dependencies'],
                'in_footer' => true,
            ]
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

    public function enqueue_front_assets()
    {
        if (is_admin()) {
            return;
        }
        wp_enqueue_style('acadlix-front-css');
        wp_enqueue_script('acadlix-front-app');
        wp_localize_script('acadlix-front-app', 'acadlixOptions', array(
            'is_admin_bar_showing' => is_admin_bar_showing(),
            'api_url' => esc_url_raw(rest_url('acadlix/v1')),
            'nonce' => wp_create_nonce('wp_rest'),
            'advance_quiz_url' => get_permalink(get_option('acadlix_advance_quiz_page_id')),
            'user' => get_current_user_id() > 0 ? get_userdata(get_current_user_id())?->data : [],
        ));
    }

    public static function instance() {
        if ( ! self::$_instance ) {
            self::$_instance = new self();
        }

        return self::$_instance;
    }
}
