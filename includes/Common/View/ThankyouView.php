<?php

defined('ABSPATH') || exit();

global $wp_version;

$acadlix_data = isset($GLOBALS['acadlix_thankyou_data']) ? $GLOBALS['acadlix_thankyou_data'] : [];
extract($acadlix_data, EXTR_SKIP); // gives $status, $courses_url, $dashboard_url

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
            $theme = wp_get_theme();
            $theme_slug = $theme->get('TextDomain');
            echo wp_kses_post(do_blocks('<!-- wp:template-part {"slug":"header","theme":"' . esc_attr($theme_slug) . '","tagName":"header","className":"site-header","layout":{"inherit":true}} /-->'));
} else {
    get_header();
}
?>
        <div class="acadlix-thankyou-container">
            <?php

            if ($status == "success") {
                ?>
                <img src="<?php echo esc_url(ACADLIX_ASSETS_IMAGE_URL . 'success-icon.svg') ?>"
                    alt="<?php esc_attr_e('Payment Success', 'acadlix'); ?>" class="acadlix-thankyou-img">
                <h2><?php esc_html_e('Payment Success', 'acadlix'); ?></h2>
                <div class="acadlix-thankyou-text">
                    <?php esc_html_e('Thank you! Your payment was completed successfully.', 'acadlix'); ?></div>
                <div class="acadlix-thankyou-text">
                    <?php esc_html_e('You can now access your purchased course or content.', 'acadlix'); ?></div>
                <a href="<?php echo esc_url($dashboard_url) ?>"
                    class="acadlix-thankyou-btn"><?php esc_html_e('Go to Dashboard', 'acadlix'); ?></a>
                <?php
            } elseif ($status == "failed") {
                ?>
                <img src="<?php echo esc_url(ACADLIX_ASSETS_IMAGE_URL . 'failed-icon.svg') ?>"
                    alt="<?php esc_attr_e('Payment Failed', 'acadlix'); ?>" class="acadlix-thankyou-img">
                <h2><?php esc_html_e('Payemnt Failed', 'acadlix'); ?></h2>
                <div class="acadlix-thankyou-text">
                    <?php esc_html_e('Sorry, your payment could not be completed.', 'acadlix'); ?></div>
                <div class="acadlix-thankyou-text">
                    <?php esc_html_e('Payment Failed. If any amount has been deducted, please contact the administrator for assistance. You may also try the payment again.', 'acadlix'); ?>
                </div>
                <a href="<?php echo esc_url($courses_url) ?>"
                    class="acadlix-thankyou-btn"><?php esc_html_e('Go to Courses', 'acadlix'); ?></a>
                <?php
            } elseif ($status == 'pending') {
                ?>
                <img src="<?php echo esc_url(ACADLIX_ASSETS_IMAGE_URL . 'pending-icon.svg') ?>"
                    alt="<?php esc_attr_e('Payment Pending', 'acadlix'); ?>" class="acadlix-thankyou-img">
                <h2><?php esc_html_e('Payment Pending', 'acadlix'); ?></h2>
                <div class="acadlix-thankyou-text">
                    <?php esc_html_e('Your payment is currently pending. In some cases, it may take a few minutes for the status to update. If any amount has been deducted, it will be confirmed once processing is complete.', 'acadlix'); ?>
                </div>
                <a href="<?php echo esc_url($courses_url) ?>"
                    class="acadlix-thankyou-btn"><?php esc_html_e('Go to Courses', 'acadlix'); ?></a>
                <?php
            }
            ?>
        </div>
        <?php the_content(); ?>
        <?php

        if (version_compare($wp_version, '5.9', '>=') && function_exists('wp_is_block_theme') && true === wp_is_block_theme()) {
            $theme = wp_get_theme();
            $theme_slug = $theme->get('TextDomain');
            echo wp_kses_post(do_blocks('<!-- wp:template-part {"slug":"footer","theme":"' . esc_attr($theme_slug) . '","tagName":"footer","className":"site-footer","layout":{"inherit":true}} /-->'));
            echo '</div>';
            wp_footer();
            echo '</body>';
            echo '</html>';
        } else {
            get_footer();
        }