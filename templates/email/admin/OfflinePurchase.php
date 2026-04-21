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
        /* translators: %d is the order ID */
        __('New Offline Purchase for Order #%d', 'acadlix'),
        $order_id
    )); ?></title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color:
                <?php echo esc_attr($acadlix_textPrimary); ?>
            ;
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
            background:
                <?php echo esc_attr($acadlix_primaryMain); ?>
            ;
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
            background:
                <?php echo esc_attr($acadlix_primaryMain); ?>
            ;
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
            <h2><?php echo esc_html(sprintf(
                /* translators: %d is the order ID */
                __('New Offline Purchase for Order #%d', 'acadlix'),
                $order_id
            )); ?></h2>
        </div>
        <div class="content">
            <p><?php echo esc_html__('Hi admin,', 'acadlix'); ?></p>
            <p><?php echo esc_html(sprintf(
                /* translators: %s: course names, %s: username */
                __('A new offline purchase has been initiated for %1$s by %2$s. The order is pending payment verification.', 'acadlix'),
                $course_names,
                $username
            )); ?></p>

            <p><?php echo esc_html__('Please review the payment proof and update the order status as appropriate.', 'acadlix'); ?>
            </p>

            <p><strong><?php echo esc_html__('Order Details:', 'acadlix'); ?></strong></p>
            <ul>
                <li><strong><?php echo esc_html__('Order ID:', 'acadlix'); ?></strong> <?php echo esc_html($order_id); ?></li>
                <li><strong><?php echo esc_html__('Student Name:', 'acadlix'); ?></strong> <?php echo esc_html($username); ?>
                </li>
                <li><strong><?php echo esc_html__('Item Purchased:', 'acadlix'); ?></strong>
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
        <div class="footer">
            <p>&copy; <?php echo esc_html($year); ?> <?php echo esc_html($sitename); ?>.
                <?php echo esc_html__('All rights reserved.', 'acadlix'); ?></p>
        </div>
    </div>
</body>

</html>