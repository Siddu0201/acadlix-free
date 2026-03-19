<?php

defined('ABSPATH') || exit();

global $post, $wp_version;

if (is_user_logged_in()) {
    ?>
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
} else {
    if (version_compare($wp_version, '5.9', '>=') && function_exists('wp_is_block_theme') && wp_is_block_theme()) {
        ?>
            <!doctype html>
            <html <?php language_attributes(); ?>>

            <head>
                <meta charset="<?php bloginfo('charset'); ?>">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <?php wp_head(); ?>
            </head>

            <body <?php body_class(); ?>>
                <?php wp_body_open(); ?>
                <div class="wp-site-blocks">
                    <?php
                    $acadlix_theme = wp_get_theme();
                    $acadlix_theme_slug = $acadlix_theme->get('TextDomain');
                    echo wp_kses_post(do_blocks('<!-- wp:template-part {"slug":"header","theme":"' . esc_attr($acadlix_theme_slug) . '","tagName":"header","className":"site-header","layout":{"inherit":true}} /-->'));
    } else {
        get_header();
    }
}
?>
    <div id="acadlix_certificate" class="acadlix-certificate"></div>   

<?php 

if (is_user_logged_in()) {
    wp_footer();
    echo '</body>';
    echo '</html>';
} else {
    if (version_compare($wp_version, '5.9', '>=') && function_exists('wp_is_block_theme') && true === wp_is_block_theme()) {
        $acadlix_theme = wp_get_theme();
        $acadlix_theme_slug = $acadlix_theme->get('TextDomain');
        echo wp_kses_post(do_blocks('<!-- wp:template-part {"slug":"footer","theme":"' . esc_attr($acadlix_theme_slug) . '","tagName":"footer","className":"site-footer","layout":{"inherit":true}} /-->'));
        echo '</div>';
        wp_footer();
        echo '</body>';
        echo '</html>';
    } else {
        get_footer();
    }
}
?>