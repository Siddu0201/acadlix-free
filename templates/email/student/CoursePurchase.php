<?php
$theme = acadlix()->helper()->acadlix_get_option('acadlix_theme_settings');
$primaryMain = $theme['palette']['primary']['main'] ?? 'hsl(210, 100%, 50%)';
$textPrimary = $theme['palette']['text']['primary'] ?? 'hsl(215, 15%, 12%)';
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo sprintf(
        /* translators: %d: order id */
        __('✅ Your order #%d is confirmed', 'acadlix'), $order_id); ?></title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            color: <?php echo esc_attr($textPrimary); ?>;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            background: <?php echo esc_attr($primaryMain); ?>;
            color: #ffffff;
            padding: 15px;
            border-radius: 8px 8px 0 0;
        }
        .content {
            padding: 20px;
            line-height: 1.6;
        }
        .button {
            display: inline-block;
            padding: 12px 20px;
            margin: 12px 0;
            background: <?php echo esc_attr($primaryMain); ?>;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 5px;
        }
        .footer {
            text-align: center;
            font-size: 14px;
            color: #777;
            padding: 15px;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h2><?php echo sprintf(
                /* translators: %d: order id */
                __('✅ Your order #%d is confirmed', 'acadlix'), $order_id); ?></h2>
        </div>

        <!-- Content -->
        <div class="content">
            <p><?php echo sprintf(
                /* translators: %s will be replaced with username */
                __('Hi %s,', 'acadlix'), esc_html($username)); ?></p>
            <p><?php echo sprintf(
                /* translators: %d: order id */
                __('Thank you for your purchase! Your order #%d has been successfully placed. 🎉', 'acadlix'), $order_id); ?></p>

            <p><strong><?php echo __('Order Details:', 'acadlix'); ?></strong></p>
            <ul>
                <li><strong><?php echo __('Course Purchased:', 'acadlix'); ?></strong> <?php echo esc_html($course_names); ?></li>
                <li><strong><?php echo __('Amount Paid:', 'acadlix'); ?></strong> <?php echo esc_html($order_amount); ?></li>
                <li><strong><?php echo __('Payment Method:', 'acadlix'); ?></strong> <?php echo esc_html($payment_method); ?></li>
                <li><strong><?php echo __('Order Date:', 'acadlix'); ?></strong> <?php echo esc_html($order_date); ?></li>
            </ul>

            <p><?php echo __('If you have any questions, feel free to reach out to our support team.', 'acadlix'); ?></p>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>&copy; <?php echo esc_html($year); ?> <?php echo esc_html($sitename); ?>. <?php echo __('All rights reserved.', 'acadlix'); ?></p>
        </div>
    </div>
</body>
</html>
