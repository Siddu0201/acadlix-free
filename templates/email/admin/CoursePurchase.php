<?php

defined('ABSPATH') || exit();

$acadlix_theme = acadlix()->helper()->acadlix_get_option('acadlix_theme_settings');
$acadlix_primaryMain = $acadlix_theme['palette']['primary']['main'] ?? 'hsl(210, 100%, 50%)';
$acadlix_textPrimary = $acadlix_theme['palette']['text']['primary'] ?? 'hsl(215, 15%, 12%)';
?>
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title><?php echo esc_html(sprintf(
        /* translators: %d: order id */
        __('New Order Received - #%d', 'acadlix'),
        $order_id
    )); ?></title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color:
                <?php echo esc_attr($acadlix_textPrimary); ?>
            ;
            margin: 0;
            padding: 0;
        }

        .container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .header {
            background:
                <?php echo esc_attr($acadlix_primaryMain); ?>
            ;
            color: #ffffff;
            text-align: center;
            padding: 16px;
        }

        .content {
            padding: 20px;
            line-height: 1.6;
        }

        .button {
            display: inline-block;
            padding: 12px 20px;
            margin: 12px 0;
            background:
                <?php echo esc_attr($acadlix_primaryMain); ?>
            ;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 5px;
        }

        .footer {
            text-align: center;
            font-size: 14px;
            color: #777;
            padding: 16px;
        }
    </style>
</head>

<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h2><?php echo esc_html(sprintf(
                /* translators: %d: order id */
                __('✅ New Order Received - #%d', 'acadlix'),
                $order_id
            )); ?></h2>
        </div>

        <!-- Content -->
        <div class="content">
            <p><?php echo esc_html__('Hi admin,', 'acadlix'); ?></p>
            <p><?php echo esc_html(sprintf(
                /* translators: %s: sitename */
                __('A new order has been placed on %s! 🎉', 'acadlix'),
                $sitename
            )); ?></p>

            <p><strong><?php echo esc_html__('Order Details:', 'acadlix'); ?></strong></p>
            <ul>
                <li><strong><?php echo esc_html__('Order ID:', 'acadlix'); ?></strong> <?php echo esc_html($order_id); ?></li>
                <li><strong><?php echo esc_html__('Student Name:', 'acadlix'); ?></strong> <?php echo esc_html($username); ?>
                </li>
                <li><strong><?php echo esc_html__('Course Purchased:', 'acadlix'); ?></strong>
                    <?php echo esc_html($course_names); ?></li>
                <li><strong><?php echo esc_html__('Amount Paid:', 'acadlix'); ?></strong> <?php echo esc_html($order_amount); ?></li>
                <li><strong><?php echo esc_html__('Payment Method:', 'acadlix'); ?></strong>
                    <?php echo esc_html($payment_method); ?></li>
                <li><strong><?php echo esc_html__('Order Date:', 'acadlix'); ?></strong> <?php echo esc_html($order_date); ?>
                </li>
            </ul>

            <p>
                <a href="<?php echo esc_url($admin_order_url); ?>" class="button" target="_blank">
                    <?php echo esc_html__('View Order Details', 'acadlix'); ?>
                </a>
            </p>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>&copy; <?php echo esc_html($year); ?> <?php echo esc_html($sitename); ?>.
                <?php echo esc_html__('All rights reserved.', 'acadlix'); ?></p>
        </div>
    </div>
</body>

</html>