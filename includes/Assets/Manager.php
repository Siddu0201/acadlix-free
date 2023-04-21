<?php

namespace Yuvayana\Acadlix\Assets;

/**
 * Asset Manager class.
 *
 * Responsible for managing all of the assets (CSS, JS, Images, Locales).
 */
class Manager {

    public function __construct() {
        add_action( 'init', [ $this, 'register_all_scripts' ] );
        add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_admin_assets' ] );
        add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_front_assets']);
        add_shortcode( 'Acadlix_Quiz', [ $this, 'add_shortcode_quiz'] );
    }

    public function add_shortcode_quiz($atts){
        $id = $atts[0];
        $content = '';

        if(is_numeric($id)){
            ob_start();
            ?>
            <div class="acadlix-front" id="<?php echo $id; ?>"></div>
            <?php
            $content = ob_get_contents();
            ob_get_clean();
        }
        return $content;
    }

    public function register_all_scripts() {
        // $this->register_styles( $this->get_styles() );
        $this->register_scripts( $this->get_scripts() );
    }

    // public function get_styles(): array {
    //     return [
    //         'acadlix-css' => [
    //             'src'     => ACADLIX_BUILD . '/index.css',
    //             'version' => ACADLIX_VERSION,
    //             'deps'    => [],
    //         ],
    //     ];
    // }

    public function get_scripts(): array {
        $dependency = require_once ACADLIX_DIR . '/build/index.asset.php';
        $front_dependency = require_once ACADLIX_DIR. '/build/front.asset.php';

        return [
            'acadlix-app' => [
                'src'       => ACADLIX_BUILD . '/index.js',
                'version'   => $dependency['version'],
                'deps'      => $dependency['dependencies'],
                'in_footer' => true,
            ],
            'acadlix-front-app' => [
                'src'       => ACADLIX_BUILD . '/front.js',
                'version'   => $front_dependency['version'],
                'deps'      => $front_dependency['dependencies'],
                'in_footer' => true,
            ]
        ];
    }

    public function register_styles( array $styles ) {
        foreach ( $styles as $handle => $style ) {
            wp_register_style( $handle, $style['src'], $style['deps'], $style['version'] );
        }
    }

    public function register_scripts( array $scripts ) {
        foreach ( $scripts as $handle =>$script ) {
            wp_register_script( $handle, $script['src'], $script['deps'], $script['version'], $script['in_footer'] );
        }
    }

    public function enqueue_admin_assets() {
        // Check if we are on the admin page and page=acadlix.
        if ( ! is_admin() || ! isset( $_GET['page'] ) || sanitize_text_field( wp_unslash( $_GET['page'] ) ) !== ACADLIX_SLUG ) {
            return;
        }

        // wp_enqueue_style( 'acadlix-css' );
        wp_enqueue_script( 'acadlix-app' );
    }

    public function enqueue_front_assets() {
        if(is_admin()){
            return;
        }
        wp_enqueue_script( 'acadlix-front-app');
    }
}
