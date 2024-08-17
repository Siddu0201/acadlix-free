<?php

namespace Yuvayana\Acadlix\Assets;
use Yuvayana\Acadlix\Models\Quiz;

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

/**
 * Asset Manager class.
 *
 * Responsible for managing all of the assets (CSS, JS, Images, Locales).
 */
class Manager
{

    public function __construct()
    {
        add_action('init', [$this, 'register_all_scripts']);
        add_action('wp_enqueue_scripts', [$this, 'enqueue_front_assets']);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_admin_assets']);
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
            $page_template = ACADLIX_TEMPLATE_PATH . '/dashboard.php';
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
            'acadlix-css' => [
                'src' => ACADLIX_BUILD . '/index.css',
                'version' => ACADLIX_VERSION,
                'deps' => [],
            ],
            'acadlix-front-css' => [
                'src' => ACADLIX_BUILD . '/front.css',
                'version' => ACADLIX_VERSION,
                'deps' => [],
            ],
        ];
    }

    public function get_scripts(): array
    {
        $dependency = require_once ACADLIX_DIR . '/build/index.asset.php';
        $front_dependency = require_once ACADLIX_DIR . '/build/front.asset.php';

        return [
            'acadlix-app' => [
                'src' => ACADLIX_BUILD . '/index.js',
                'version' => $dependency['version'],
                'deps' => $dependency['dependencies'],
                'in_footer' => true,
            ],
            'acadlix-front-app' => [
                'src' => ACADLIX_BUILD . '/front.js',
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

    public function enqueue_admin_assets($hook)
    {
        // Check if we are on the admin page and page=acadlix.
        if (!is_admin() || 'toplevel_page_' . ACADLIX_SLUG != $hook || !isset($_GET['page']) || sanitize_text_field(wp_unslash($_GET['page'])) !== ACADLIX_SLUG) {
            return;
        }
        wp_enqueue_editor();
        wp_enqueue_media();
        wp_enqueue_style('acadlix-css');
        wp_enqueue_script('acadlix-app');
        wp_localize_script('acadlix-app', 'acadlixOptions', array(
            'api_url' => esc_url_raw(rest_url('acadlix/v1')),
            'nonce' => wp_create_nonce('wp_rest'),
        ));
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
            'advance_quiz_url' => get_option('acadlix_advance_quiz_page'),
            'user' => get_current_user_id() > 0 ? get_userdata(get_current_user_id())?->data : [],
        ));
    }
}
