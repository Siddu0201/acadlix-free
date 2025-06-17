<?php
use Yuvayana\Acadlix\Common\Models\CourseCart;
use Yuvayana\Acadlix\Common\Models\Order;
use Yuvayana\Acadlix\Common\Models\OrderMeta;

defined('ABSPATH') || exit();

global $post, $wp_version;
$success = false;

// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- payerID for paypal
$payerID = isset($_GET['payerID']) ? sanitize_text_field(wp_unslash($_GET['payerID'])) : "";

function capture_paypal_order($order_id)
{
    $client_id = acadlix()->helper()->acadlix_get_option("acadlix_paypal_client_id"); // Your PayPal Client ID
    $secret = acadlix()->helper()->acadlix_get_option("acadlix_paypal_secret_key");        // Your PayPal Secret
    $is_sandbox = acadlix()->helper()->acadlix_get_option("acadlix_paypal_sandbox") == "yes";                          // Use sandbox for testing

    // Set PayPal URL for live or sandbox environment
    $url = $is_sandbox
        ? "https://api-m.sandbox.paypal.com/v2/checkout/orders/{$order_id}/capture"
        : "https://api-m.paypal.com/v2/checkout/orders/{$order_id}/capture";

    // Base64 encode your credentials
    $credentials = base64_encode($client_id . ':' . $secret);

    // Setup the HTTP request
    $args = [
        'headers' => [
            'Authorization' => 'Basic ' . $credentials,
            'Content-Type' => 'application/json',
        ],
        'method' => 'POST',
    ];

    // Send the request to PayPal
    $response = wp_remote_post($url, $args);
    $order_meta = acadlix()->model()->orderMeta()->where("meta_value", $order_id)->first();
    $order = acadlix()->model()->order()->find($order_meta->order_id);
    if (is_wp_error($response)) {
        // Handle the error if the request fails
        $order->updateOrCreateMeta('message', $response->get_error_message());
        return 'Error: ' . $response->get_error_message();
    }

    // Get the response body
    $response_body = wp_remote_retrieve_body($response);
    $data = json_decode($response_body, true);

    // Check if the payment was captured successfully
    if (isset($data['status']) && $data['status'] === 'COMPLETED') {
        if ($order && $order->status == 'success') {
            return true;
        }
        if ($order && $order->status == 'pending') {
            $order->update([
                'status' => 'success'
            ]);
            if ($order->order_items()->count() > 0) {
                foreach ($order->order_items as $item) {
                    $cart = acadlix()->model()->courseCart()->where("user_id", $order->user_id)->where("course_id", $item->course_id)->first();
                    $cart->delete();
                }
            }
            if (!empty($payerID)) {
                $order->updateOrCreateMeta('payer_id', $payerID);
            }
            // send mail on success
            acadlix()->helper()->course()->handleCoursePurchaseEmail($order->id);
        }
        return true; // Success message
    } else {
        if (isset($data['error'])) {
            $error_message = $data['error']['message'];
            $order->update([
                'status' => 'failed'
            ]);
            $order->updateOrCreateMeta('message', $error_message);
            // send mail on failed
            acadlix()->helper()->course()->handleFailedTransationEmail($order->id);
        }
        return false; // Handle capture error
    }
}

function capture_payu_order($txnid)
{
    $merchant_key = acadlix()->helper()->acadlix_get_option("acadlix_payu_merchant_key");
    ;
    $salt = acadlix()->helper()->acadlix_get_option("acadlix_payu_salt");
    ;
    $is_sandbox = acadlix()->helper()->acadlix_get_option("acadlix_payu_sandbox") == "yes";  // Use sandbox for testing

    // Set the URL based on the environment
    $url = $is_sandbox ? 'https://test.payu.in/merchant/postservice?form=2' : 'https://info.payu.in/merchant/postservice?form=2';

    // Payload for PayU Verification API
    $params = [
        'key' => $merchant_key,
        'command' => 'verify_payment',
        'var1' => $txnid,
    ];

    // Generate hash for security
    $hash_string = $merchant_key . '|verify_payment|' . $txnid . '|' . $salt;
    $hash = strtolower(hash('sha512', $hash_string));
    $params['hash'] = $hash;
    // Use wp_remote_post to send the request to PayU
    $response = wp_remote_post($url, [
        'method' => 'POST',
        'body' => $params,
        'timeout' => 45,
    ]);

    $order_meta = acadlix()->model()->orderMeta()->where("meta_value", $txnid)->first();
    $order = acadlix()->model()->order()->find($order_meta->order_id);
    if (is_wp_error($response)) {
        $order->updateOrCreateMeta('message', $response->get_error_message());
        return 'Error: ' . $response->get_error_message();
    }

    // Decode the response
    $body = wp_remote_retrieve_body($response);
    $data = json_decode($body, true);

    // Check if payment status is successful
    if (isset($data['transaction_details'][$txnid]['status'])) {
        if ($order && $order->status == 'success') {
            return true;
        }

        $status = $data['transaction_details'][$txnid]['status'];
        $error_message = $data['transaction_details'][$txnid]['error_Message'] ?? __('Unknown error', 'acadlix');
        if ($status === 'success') {
            if ($order && $order->status == 'pending') {
                $order->update([
                    'status' => 'success'
                ]);
                if ($order->order_items()->count() > 0) {
                    foreach ($order->order_items as $item) {
                        $cart = acadlix()->model()->courseCart()->where("user_id", $order->user_id)->where("course_id", $item->course_id)->first();
                        $cart->delete();
                    }
                }
                // send mail on success
                acadlix()->helper()->course()->handleCoursePurchaseEmail($order->id);
            }
            return true;
        } else {
            $order->update([
                'status' => 'failed'
            ]);
            // Log failed transaction with error message
            $order->updateOrCreateMeta('message', $error_message);
            // send mail on failure
            acadlix()->helper()->course()->handleFailedTransationEmail($order->id);
            return false;
        }
    }
}

if (isset($_GET['token'])) { //phpcs:ignore
    // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- token verification for payment
    $token = sanitize_text_field(wp_unslash($_GET['token']));
    $order_meta = acadlix()->model()->orderMeta()->where("meta_value", $token)->first();
    if ($order_meta) {
        $order = acadlix()->model()->order()->find($order_meta->order_id);
        if ($order) {
            switch ($order->getMetaValue("payment_method")) {
                case "razorpay":
                    $success = $order->status == "success" ? true : false;
                    break;
                case "paypal":
                    if ($order->status == "success") {
                        $success = true;
                    } elseif ($order->status == "pending") {
                        if (capture_paypal_order($token)) {
                            $success = true;
                        } else {
                            $success = false;
                        }
                    } else {
                        $success = false;
                    }
                    break;
                case "payu":
                    if ($order->status == "success") {
                        $success = true;
                    } elseif ($order->status == "pending") {
                        if (capture_payu_order($token)) {
                            $success = true;
                        } else {
                            $success = false;
                        }
                    } else {
                        $success = false;
                    }
                    break;
                default:
                    $success = false;
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

if ($success) {
    ?>
            <div><?php esc_html_e('Payment Success', 'acadlix'); ?></div>
            <?php
} else {
    ?>
            <div><?php esc_html_e('Payemnt Failed', 'acadlix'); ?></div>
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