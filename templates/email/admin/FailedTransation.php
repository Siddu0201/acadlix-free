<?php
$theme = acadlix()->helper()->acadlix_get_option('acadlix_theme_settings');
$primaryMain = $theme['palette']['primary']['main'] ?? 'hsl(210, 100%, 50%)';
$textPrimary = $theme['palette']['text']['primary'] ?? 'hsl(215, 15%, 12%)';
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title><?php echo sprintf(
        /* translators: %d: order id */
        __('Payment failed for order #%d', 'acadlix'), $order_id); ?></title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: <?php echo esc_attr($textPrimary); ?>;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: #fff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: <?php echo esc_attr($primaryMain); ?>;
            color: #fff;
            padding: 16px;
            text-align: center;
        }
        .content {
            padding: 20px;
        }
        .button {
            display: inline-block;
            padding: 10px 18px;
            background: <?php echo esc_attr($primaryMain); ?>;
            color: #fff !important;
            text-decoration: none;
            border-radius: 4px;
        }
        .footer {
            text-align: center;
            color: #777;
            font-size: 14px;
            padding: 16px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2><?php echo sprintf(
                /* translators: %d: order id */
                __('Payment failed for order #%d', 'acadlix'), $order_id); ?></h2>
        </div>
        <div class="content">
            <p><?php echo __('Hi admin,', 'acadlix'); ?></p>
            <p><?php echo sprintf(
                /* translators: %s: course names, %s: username */
                __('A payment attempt for %1$s by %2$s has failed.', 'acadlix'),
                esc_html($course_names),
                esc_html($username)
            ); ?></p>

            <p><strong><?php echo __('Order Details:', 'acadlix'); ?></strong></p>
            <ul>
                <li><strong><?php echo __('Order ID:', 'acadlix'); ?></strong> <?php echo $order_id; ?></li>
                <li><strong><?php echo __('Student Name:', 'acadlix'); ?></strong> <?php echo esc_html($username); ?></li>
                <li><strong><?php echo __('Course Purchased:', 'acadlix'); ?></strong> <?php echo esc_html($course_names); ?></li>
                <li><strong><?php echo __('Amount Paid:', 'acadlix'); ?></strong> <?php echo $order_amount; ?></li>
                <li><strong><?php echo __('Payment Method:', 'acadlix'); ?></strong> <?php echo esc_html($payment_method); ?></li>
                <li><strong><?php echo __('Order Date:', 'acadlix'); ?></strong> <?php echo esc_html($order_date); ?></li>
            </ul>

            <p>
                <a href="<?php echo esc_url($admin_order_url); ?>" class="button" target="_blank">
                    <?php echo __('View Order Details', 'acadlix'); ?>
                </a>
            </p>
        </div>
        <div class="footer">
            <p>&copy; <?php echo $year; ?> <?php echo esc_html($sitename); ?>. <?php echo __('All rights reserved.', 'acadlix'); ?></p>
        </div>
    </div>
</body>
</html>

