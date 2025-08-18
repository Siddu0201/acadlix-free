<?php

defined('ABSPATH') || exit();

global $post, $wp_version;
$success = false;
$status = 'pending';

// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- payerID for paypal
$payerID = isset($_GET['payerID']) ? sanitize_text_field(wp_unslash($_GET['payerID'])) : "";

$courses_url = get_post_type_archive_link(ACADLIX_COURSE_CPT);
$dashboard_url = get_permalink(acadlix()->helper()->acadlix_get_option('acadlix_dashboard_page_id'));

if (isset($_GET['token'])) { //phpcs:ignore
    // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- token verification for payment
    $token = sanitize_text_field(wp_unslash($_GET['token']));
    $order_meta = acadlix()->model()->orderMeta()->where("meta_value", $token)->first();
    if ($order_meta) {
        $order = acadlix()->model()->order()->find($order_meta->order_id);
        $payment_method = $order->getMetaValue("payment_method");
        if ($order) {
            try {
                if (isset($_GET["cancelled"]) && !empty($_GET["cancelled"]) && $order->status != "failed") {
                    acadlix()
                        ->payments()
                        ->{$payment_method}()
                        ->failedOrder($order, "Payment Cancelled");
                    $status = $order->status;
                } else {
                    switch ($payment_method) {
                        case "razorpay":
                        case "paypal":
                        case "stripe":
                        case "payu":
                            if ($order->status == "pending") {
                                acadlix()->payments()
                                    ->{$payment_method}()
                                        ->verifyOrder($token);
                                        
                                $order = acadlix()->payments()
                                    ->{$payment_method}()
                                        ->getOrder($token);
                                $status = $order->status;
                            } else {
                                $status = $order->status;
                            }
                            break;
                            
                        default:
                            $status = $order->status;
                    }
                }
            } catch (Exception $e) {
                // error_log($e->getMessage());
            }
        }
    }
}

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

if ($status == "success") {
    ?>
            <div>
                <h2><?php esc_html_e('Payment Success', 'acadlix'); ?> ✅</h2>
                <div><?php esc_html_e('Thank you! Your payment was completed successfully.', 'acadlix'); ?></div>
                <div><?php esc_html_e('You can now access your purchased course or content.', 'acadlix'); ?></div>
                <a href="<?php echo esc_url($dashboard_url) ?>"><?php esc_html_e('Go to Dashboard', 'acadlix'); ?></a>
            </div>
            <?php
} elseif ($status == "failed") {
    ?>
            <div>
                <h2><?php esc_html_e('Payemnt Failed', 'acadlix'); ?> ❌</h2>
                <div><?php esc_html_e('Sorry, your payment could not be completed.', 'acadlix'); ?></div>
                <div>
                    <?php esc_html_e('Payment Failed. If any amount has been deducted, please contact the administrator for assistance. You may also try the payment again.', 'acadlix'); ?>
                </div>
                <a href="<?php echo esc_url($courses_url) ?>"><?php esc_html_e('Go to Courses', 'acadlix'); ?></a>
            </div>
            <?php
} elseif ($status == 'pending') {
    ?>
            <div>
                <h2><?php esc_html_e('Payment Pending', 'acadlix'); ?> ⏳</h2>
                <div>
                    <?php esc_html_e('Your payment is currently pending. In some cases, it may take a few minutes for the status to update. If any amount has been deducted, it will be confirmed once processing is complete.', 'acadlix'); ?>
                </div>
                <a href="<?php echo esc_url($courses_url) ?>"><?php esc_html_e('Go to Courses', 'acadlix'); ?></a>
            </div>
            <?php
}
?>

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