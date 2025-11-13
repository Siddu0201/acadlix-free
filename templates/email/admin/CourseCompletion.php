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
    <title>
        <?php echo sprintf(
            /* translators: 1: username, 2: course name */
            __('🎓 %1$s completed %2$s', 'acadlix'),
            esc_html($username),
            esc_html($coursename)
        ); ?>
    </title>
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
            padding: 16px;
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
            padding: 16px;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h2><?php echo sprintf(
                /* translators: 1: username, 2: course name */
                __('🎉 %1$s has completed %2$s', 'acadlix'),
                esc_html($username),
                esc_html($coursename)
            ); ?></h2>
        </div>

        <!-- Content -->
        <div class="content">
            <p><?php echo __('Hi admin,', 'acadlix'); ?></p>
            <p><?php echo sprintf(
                /* translators: 1: username, 2: course name, 3: date */
                __('%1$s has successfully completed the course <strong>%2$s</strong> on %3$s 🎓', 'acadlix'),
                esc_html($username),
                esc_html($coursename),
                esc_html($date)
            ); ?></p>

            <p><?php echo __('You can review their progress in the admin panel.', 'acadlix'); ?></p>

        </div>

        <!-- Footer -->
        <div class="footer">
            <p>&copy; <?php echo esc_html($year); ?> <?php echo esc_html($sitename); ?>. <?php echo __('All rights reserved.', 'acadlix'); ?></p>
        </div>
    </div>
</body>
</html>
