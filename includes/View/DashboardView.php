<?php
    global $post;
?>

<html <?php language_attributes(); ?>>
    <head>
        <meta charset="<?php bloginfo( 'charset' ); ?>" />
        <title>
        <?php wp_title( '|', true, 'right' ); ?>
        </title>
        <link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>" />
        <?php wp_head(); ?>
    </head>
    <body <?php body_class(); ?>>
        <div id="acadlix_dashboard"></div>
    <?php
        wp_footer();
    ?>
    </body>
</html>