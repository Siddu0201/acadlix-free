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
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?php echo esc_html(sprintf(
    /* translators: %s: username */
    __('🎉 Congratulations, %s!', 'acadlix'),
    $username
  )); ?></title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
      color:
        <?php echo esc_attr($acadlix_textPrimary); ?>
      ;
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
      background:
        <?php echo esc_attr($acadlix_primaryMain); ?>
      ;
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
      padding: 15px;
    }
  </style>
</head>

<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h2><?php echo esc_html(sprintf(
        /* translators: %s: username */
        __('🎉 Congratulations, %s!', 'acadlix'),
        $username
      )); ?></h2>
    </div>

    <!-- Content -->
    <div class="content">
      <p>
        <?php
        echo wp_kses(
          sprintf(
            /* translators: %s: coursename */
            __('You have successfully completed <strong>%s</strong>! Your dedication and hard work have paid off. 🎓', 'acadlix'),
            esc_html($coursename)
          ),
          array('strong' => array())
        );
        ?>
      </p>

      <p>
        <?php
        echo esc_html(sprintf(
          /* translators: %s: sitename */
          __('Thank you for choosing %s. Keep learning and growing! 🚀', 'acadlix'),
          $sitename
        ));
        ?>
      </p>
      <?php
      if (
        acadlix()->helper()->acadlix_get_option('acadlix_certificate_show_certificate_link_in_email') == 'yes' &&
        acadlix()->helper()->acadlix_get_option('acadlix_certificate_page_id') !== null &&
        $certificate_url
      ) {
        ?>
        <p>
          <a href="<?php echo esc_url($certificate_url); ?>" class="button" target="_blank">
            <?php echo esc_html__('View Certificate', 'acadlix'); ?>
          </a>
        </p>
        <?php
      }
      ?>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>&copy; <?php echo esc_html($year); ?> <?php echo esc_html($sitename); ?>.
        <?php echo esc_html__('All rights reserved.', 'acadlix'); ?>
      </p>
    </div>
  </div>
</body>

</html>