<?php

use Yuvayana\Acadlix\Helper\CourseHelper;
use Yuvayana\Acadlix\Helper\Helper;
use Yuvayana\Acadlix\Models\Course;
use Yuvayana\Acadlix\Models\CourseCart;
use Yuvayana\Acadlix\Models\Lesson;
use Yuvayana\Acadlix\Models\OrderItem;

defined('ABSPATH') || exit();

global $post, $wp_version;

$course = Course::find($post->ID);

$courses_url = get_permalink(Helper::instance()->acadlix_get_option("acadlix_all_courses_page_id"));
$checkout_url = get_permalink(Helper::instance()->acadlix_get_option("acadlix_checkout_page_id"));
$dashboard_url = get_permalink(Helper::instance()->acadlix_get_option('acadlix_dashboard_page_id'));

$cart = [];
$order_item = [];
if (is_user_logged_in()) {
    $userId = get_current_user_id();
    $cart = CourseCart::where([
        ['user_id', '=', $userId],
        ['course_id', '=', $post->ID],
    ])->get();
    $order_item = OrderItem::whereHas('order', function ($query) use ($userId) {
        $query->where('user_id', $userId);
    })->where('course_id', $post->ID)
        ->get();
} else {
    if (isset($_COOKIE['acadlix_cart_token'])) {
        $cart = CourseCart::where('cart_token', sanitize_text_field(wp_unslash($_COOKIE['acadlix_cart_token'])))
            ->where('course_id', $post->ID)
            ->get();
    }
}

// echo "<pre>";
// print_r($cart);
// echo "</pre>";


if (!function_exists('acadlix_course_breadcrumb')) {
    /**
     * Outputs the HTML for a course breadcrumb navigation with specific display settings.
     *
     * @param bool $desktop Determines if the breadcrumb should be displayed on desktop.
     * @param bool $mobile  Determines if the breadcrumb should be displayed on mobile.
     *
     * @return string The HTML for a course breadcrumb navigation
     */
    function acadlix_course_breadcrumb(bool $desktop = true, bool $mobile = true, Course $course = null)
    {
        if (!is_bool($desktop) || !is_bool($mobile)) {
            error_log('The parameters must be boolean values.');
        }

        $unique_class = 'acadlix-course-breadcrumb-' . uniqid();
        ob_start();
        ?>
        <style>
            .<?php echo $unique_class; ?> {
                display:
                    <?php echo $desktop ? "flex" : "none"; ?>
                ;
                padding-bottom: 0.5rem;
            }

            .<?php echo $unique_class; ?> a {
                color: var(--acadlix-text-tertiary);
                text-decoration: none;
            }

            .<?php echo $unique_class; ?> a:hover {
                color: var(--acadlix-primary-main);
                text-decoration: none;
                border-bottom: 1px solid var(--acadlix-primary-main);
            }

            @media (max-width: 768px) {
                .<?php echo $unique_class; ?> {
                    display:
                        <?php echo $mobile ? "flex" : "none"; ?>
                    ;
                }
            }
        </style>
        <nav class="<?php echo $unique_class; ?>">
            <a href="<?php echo home_url(); ?>">Home</a>&nbsp;>&nbsp;
            <?php
            if (count($course->post->categories) > 0) {
                ?>
                <a
                    href="<?php echo esc_attr(get_term_link($course->post->categories[0]->term_id, ACADLIX_COURSE_CATEGORY_TAXONOMY)); ?>">
                    <?php echo esc_html($course->post->categories[0]->name); ?>
                </a>
                &nbsp;>&nbsp;
            <?php }
            ?>
            <a href="#" disabled="true"><?php echo esc_html($course->post->post_title); ?></a>
        </nav>
        <?php
        return ob_get_clean();
    }
}

if (!function_exists('acadlix_course_img')) {
    /**
     * Outputs the HTML for a course image with specific display settings.
     *
     * @param bool $desktop Determines if the course image should be displayed on desktop.
     * @param bool $mobile  Determines if the course image should be displayed on mobile.
     *
     * @return string The HTML for a course image
     */
    function acadlix_course_img(bool $desktop = true, bool $mobile = true, Course $course = null)
    {
        if (is_null($desktop) || is_null($mobile)) {
            error_log('The parameters must be boolean values.');
        }

        $unique_class = 'acadlix-course-featured-item-' . uniqid();
        ob_start();
        ?>
        <style>
            .<?php echo $unique_class; ?> {
                display:
                    <?php echo $desktop ? "block" : "none"; ?>
                ;
                border-top-left-radius: var(--acadlix-border-radius);
                border-top-right-radius: var(--acadlix-border-radius);
                width: 100%;
                height: 200px;
            }

            @media (max-width: 768px) {
                .<?php echo $unique_class; ?> {
                    display:
                        <?php echo $mobile ? "block" : "none"; ?>
                    ;
                }
            }
        </style>
        <img class="<?php echo $unique_class; ?>" loading="lazy"
            src="<?php echo $course->post->getThumbnailUrlAttribute() ? esc_html($course->post->getThumbnailUrlAttribute()) : ACADLIX_ASSETS_IMAGE_URL . "demo-course.jpg"; ?>"
            alt="<?php echo $course->post->getThumbnailAltAttribute() ? esc_attr($course->post->getThumbnailAltAttribute()) : esc_attr($course?->post?->post_title); ?>" />
        <?php
        return ob_get_clean();
    }
}

if (!function_exists('acadlix_course_pricing')) {
    /**
     * Function to display course pricing
     *
     * @return string
     */
    function acadlix_course_pricing(Course $course)
    {
        ob_start();
        ?>
        <div class="acadlix-pricing-info">
            <?php
            if (CourseHelper::instance()->isCourseFree($course->price, $course->sale_price)) {
                ?>
                <div class="acadlix-price-free acadlix-p-4">Free</div>
                <?php
            } else {
                ?>
                <div class="acadlix-pricing">
                    <div class="acadlix-course-sale-price">
                        <?php echo esc_html(CourseHelper::instance()->getCoursePrice($course->sale_price == 0 ? $course->price : $course->sale_price)); ?>
                    </div>
                    <?php
                    if ($course->sale_price != 0) {
                        ?>
                        <div class="acadlix-course-price">
                            <?php echo esc_html(CourseHelper::instance()->getCoursePrice($course->price)); ?>
                        </div>
                        <?php
                    }
                    ?>
                </div>
                <?php
                if ($course->sale_price != 0 && $course->price != 0 && $course->price > $course->sale_price) {
                    ?>
                    <div class="acadlix-discount-tag">
                        <?php echo ceil((($course->price - $course->sale_price) / $course->price) * 100); ?>% OFF
                    </div>
                    <?php
                }
                ?>
                <?php
            }
            ?>
        </div>
        <?php
        return ob_get_clean();
    }
}

if (!function_exists('acadlix_mobile_course_price')) {
    /**
     * Displays the price of a course in a mobile-friendly format.
     * 
     * @param Course $course The course object to display the price for.
     * 
     * @return string The HTML content for the mobile price info.
     */
    function acadlix_mobile_course_price(Course $course)
    {
        ob_start();
        ?>
        <div class="acadlix-mobile-price-info">
            <?php
            if (CourseHelper::instance()->isCourseFree($course->price, $course->sale_price)) {
                ?>
                <div class="acadlix-price-free acadlix-p-4">Free</div>
                <?php
            } else {
                ?>
                <div class="acadlix-pricing">
                    <div class="acadlix-course-sale-price">
                        <?php echo esc_html(CourseHelper::instance()->getCoursePrice($course->sale_price == 0 ? $course->price : $course->sale_price)); ?>
                    </div>
                    <?php
                    if ($course->sale_price != 0) {
                        ?>
                        <div class="acadlix-course-price">
                            <?php echo esc_html(CourseHelper::instance()->getCoursePrice($course->price)); ?>
                        </div>
                        <?php
                    }
                    ?>
                </div>
                <?php
            }
            ?>
        </div>
        <?php
        return ob_get_clean();
    }
}

if (!function_exists('acadlix_basic_course_details')) {
    function acadlix_basic_course_details(Course $course, bool $desktop = true, bool $mobile = true)
    {
        if (!is_bool($desktop) || !is_bool($mobile)) {
            error_log('The parameters must be boolean values.');
        }

        $unique_class = 'acadlix-course-aside-details-' . uniqid();
        ob_start();
        ?>
        <style>
            .<?php echo $unique_class; ?> {
                display:
                    <?php echo $desktop ? "flex" : "none"; ?>
                ;
            }

            @media (max-width: 768px) {
                .<?php echo $unique_class; ?> {
                    display:
                        <?php echo $mobile ? "flex" : "none"; ?>
                    ;
                }
            }
        </style>
        <div class="acadlix-course-aside-details <?php echo $unique_class; ?>">
            <div class="acadlix-course-aside-details-option">
                <div><strong>Course Duration:</strong></div>
                <div><?php echo esc_html(CourseHelper::instance()->getCourseDuration(
                    $course->weeks,
                    $course->days,
                    $course->hours,
                    $course->minutes
                )); ?></div>
            </div>
            <div class="acadlix-course-aside-details-option">
                <div><strong>Course Level:</strong></div>
                <div>
                    <?php echo esc_html(CourseHelper::instance()->getCourseLevelName($course->difficulty_level)); ?>
                </div>
            </div>
            <div class="acadlix-course-aside-details-option">
                <div><strong>Students Enrolled:</strong></div>
                <div> 6</div>
            </div>
        </div>
        <?php
        return ob_get_clean();
    }
}

if (!function_exists('acadlix_course_action_buttons')) {
    /**
     * Outputs the HTML for the course action buttons.
     * 
     * @param object $cart The cart object.
     * @param object $order_item The order item object.
     * @param object $course The course object.
     *
     * @return string The HTML for the course action buttons.
     */
    function acadlix_course_action_buttons(Course $course, array|object $cart, array|object $order_item, string $dashboard_url, string $checkout_url): string
    {
        ob_start();
        ?>
        <div class="acadlix-course-action-buttons">
            <?php
            if (CourseHelper::instance()->isCourseFree($course->price, $course->sale_price)) {
                if (count($cart) > 0) {
                    ?>
                    <a href="<?php echo esc_url($checkout_url); ?>" class="acadlix-action-button">Go to
                        Checkout</a>
                    <?php
                } elseif (count($order_item) > 0) {
                    ?>
                    <a href="<?php echo esc_url($dashboard_url); ?>" class="acadlix-action-button">
                        Go to Course
                    </a>
                    <?php
                } else {
                    ?>
                    <button class="acadlix-action-button acadlix-start-now" data-id="<?php echo esc_attr($course->id); ?>">
                        <div class="acadlix-action-button-text">
                            Start Now
                        </div>
                        <div class="acadlix-btn-loader" style="display: none;"></div>
                    </button>
                    <?php
                }
            } else {
                if (count($cart) > 0) {
                    ?>
                    <a href="<?php echo esc_url($checkout_url); ?>" class="acadlix-action-button">Go to
                        Checkout</a>
                    <?php
                } elseif (count($order_item) > 0) {
                    ?>
                    <a href="<?php echo esc_url($dashboard_url); ?>" class="acadlix-action-button">
                        Go to Course
                    </a>
                    <?php
                } else {
                    ?>
                    <button class="acadlix-action-button acadlix-buy-now" data-id="<?php echo esc_attr($course->id); ?>">
                        <div class="acadlix-action-button-text">
                            <i class="fa fa-shopping-cart"></i> Buy Now
                        </div>
                        <div class="acadlix-btn-loader" style="display: none;"></div>
                    </button>
                    <?php
                }
            }
            ?>

            <div class="acadlix-course-page-icon-element acadlix-add-to-wishlist"
                id="add-to-wishlist-<?php echo esc_attr($course?->id); ?>" title="Add to Wishlist"
                data-id="<?php echo esc_attr($course?->id); ?>"
                style="display: <?php echo $course?->wishlist_count == 0 ? 'flex' : 'none'; ?>">
                <i class="la la-heart-o"></i>
                <div class="acadlix-btn-loader" style="display: none;"></div>
            </div>
            <div class="acadlix-course-page-icon-element acadlix-remove-from-wishlist"
                id="remove-from-wishlist-<?php echo esc_attr($course?->id); ?>" title="Remove From Wishlist"
                data-id="<?php echo esc_attr($course?->id); ?>"
                style="display: <?php echo $course?->wishlist_count > 0 ? 'flex' : 'none'; ?>">
                <i class="fa-solid fa-heart"></i>
                <div class="acadlix-btn-loader" style="display: none;"></div>
            </div>
        </div>
        <?php
        return ob_get_clean();
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
?>
        <main class="acadlix-course-page acadlix-my-16" id="acadlix-single-course-page">
            <?php echo acadlix_course_breadcrumb(false, true, $course); ?>
            <section class="acadlix-card acadlix-course-header-section acadlix-box-shadow-2">
                <?php echo acadlix_course_img(false, true, $course); ?>
                <div class="acadlix-card-body acadlix-course-header-body">
                    <?php echo acadlix_course_breadcrumb(true, false, $course); ?>
                    <h1 class="acadlix-course-header-title acadlix-fs-4 acadlix-my-8">
                        <?php echo esc_html($course->post->post_title); ?>
                    </h1>
                    <div class="acadlix-course-header-last-updated acadlix-mb-8">
                        <i class="fa fa-exclamation-circle"></i>
                        Last updated: <?php echo esc_html(Helper::instance()->formatDate($course->updated_at)); ?>
                    </div>
                    <div class="acadlix-course-header-author">
                        <div class="acadlix-course-header-created-at-text">
                            Created by:
                        </div>
                        <div class="acadlix-course-author">
                            <?php echo CourseHelper::instance()->getCourseUserHtml($course); ?>
                        </div>
                    </div>

                    <div class="acadlix-mobile-price-info">
                        <?php echo acadlix_course_pricing($course); ?>
                    </div>

                    <?php echo acadlix_basic_course_details($course, false, true); ?>
                </div>

                <div class="acadlix-course-aside acadlix-card">
                    <?php echo acadlix_course_img(true, false, $course); ?>
                    <div class="acadlix-card-body acadlix-course-aside-body">
                        <!-- acadlix aside pricing  -->
                        <?php echo acadlix_course_pricing($course); ?>

                        <!-- acadlix aside details  -->
                        <?php echo acadlix_basic_course_details($course, true, false); ?>

                        <!-- acadlix aside button for purchase and whishlist -->
                        <div class="acadlix-course-aside-purchase-options">
                            <?php echo acadlix_course_action_buttons($course, $cart, $order_item, $dashboard_url, $checkout_url); ?>
                        </div>
                    </div>
                </div>
            </section>
            <section class="acadlix-course-main-section">
                <!-- navbar tabs  -->
                <nav class="acadlix-course-main-navbar">
                    <ul class="acadlix-course-main-navbar-list">
                        <li><a href="#overview" class="acadlix-fs-6">Overview</a></li>
                        <li><a href="#curriculum" class="acadlix-fs-6">Curriculum</a></li>
                        <li><a href="#instructor" class="acadlix-fs-6">Instructor</a></li>
                    </ul>
                </nav>
                <div id="overview" class="acadlix-course-overview acadlix-mb-16">
                    <!-- Add detailed outcomes for this course to enhance understanding and expectations -->
                    <?php
                    if ($course->outcomes_count > 0) {
                        ?>
                        <div class="acadlix-card acadlix-box-shadow-2">
                            <h2 class="acadlix-card-header acadlix-fs-4 acadlix-fw-bold">
                                What you will learn in this course
                            </h2>
                            <div class="acadlix-card-body">
                                <div class="acadlix-row">
                                    <?php
                                    foreach ($course->outcomes as $outcome) {
                                        ?>
                                        <div
                                            class="acadlix-col-12 acadlix-col-lg-6 acadlix-d-flex acadlix-align-center acadlix-gap-1 acadlix-mt-8">
                                            <div class="acadlix-button-icon acadlix-p-4">
                                                <i class="fa fa-check"></i>
                                            </div>
                                            <span class="acadlix-fs-6">
                                                <?php echo esc_html($outcome->outcome); ?>
                                            </span>
                                        </div>
                                        <?php
                                    }
                                    ?>
                                </div>
                            </div>
                        </div>
                        <?php
                    }
                    ?>
                    <!-- Add Description to course page  -->
                    <div class="acadlix-card acadlix-box-shadow-2">
                        <h2 class="acadlix-card-header acadlix-fs-4 acadlix-fw-bold">
                            Description
                        </h2>
                        <div class="acadlix-card-body acadlix-fs-6">
                            <?php
                            echo $course->post->rendered_post_content; // phpcs:ignore
                            ?>
                        </div>
                    </div>
                </div>

                <!-- Add Curriculum to course -->
                <div id="curriculum" class="acadlix-course-curriculum acadlix-card acadlix-mb-16 acadlix-box-shadow-2">
                    <h2 class="acadlix-card-header acadlix-fs-4 acadlix-fw-bold">
                        Curriculum
                    </h2>
                    <div class="acadlix-d-flex acadlix-flex-column acadlix-gap-1 acadlix-card-body">
                        <?php
                        if ($course->sections_count > 0) {
                            foreach ($course->sections as $i => $section) {
                                ?>
                                <div class="acadlix-curriculum-item">
                                    <details class="acadlix-curriculum-details" <?php echo $i == 0 ? 'open' : ''; ?>>
                                        <summary class="acadlix-curriculum-summary">
                                            <h3 role="term" aria-details="pure-css">
                                                <?php echo esc_html($section->title); ?>
                                            </h3>
                                        </summary>
                                    </details>
                                    <div class="acadlix-curriculum-content">
                                        <?php
                                        if ($section->contents_count > 0) {
                                            foreach ($section->contents as $content) {
                                                ?>
                                                <div class="acadlix-curriculum-content-item">
                                                    <div class="acadlix-d-flex acadlix-align-center acadlix-gap-1">
                                                        <span class="acadlix-content-icon">
                                                            <?php echo $content->contentable_type == Lesson::class
                                                                ? $content->contentable->type == 'video'
                                                                ? '<i class="fas fa-video"></i>'
                                                                : '<i class="fas fa-file"></i>'
                                                                : '<i class="fas fa-question"></i>'
                                                            ; ?>
                                                        </span>
                                                        <span class="acadlix-content-text acadlix-fs-6">
                                                            <?php echo $content->contentable->title; ?>
                                                        </span>
                                                    </div>
                                                    <div
                                                        class="acadlix-content-duration-icon acadlix-d-flex acadlix-gap-1 acadlix-justify-center acadlix-align-center">
                                                        <div class="acadlix-content-duration">
                                                            <?php echo $content->contentable_type == Lesson::class
                                                                ? $content->contentable->type == 'video'
                                                                ? CourseHelper::instance()->intToTimeFormat(
                                                                    $content->contentable->hours,
                                                                    $content->contentable->minutes,
                                                                    $content->contentable->seconds
                                                                )
                                                                : ''
                                                                : ''
                                                            ; ?>
                                                            <?php
                                                            ?>
                                                        </div>
                                                        <?php echo $content->preview ? 
                                                            '<div><i class="fas fa-eye"></i></div>' 
                                                            : '<i class="fas fa-lock"></i>'; ?>   
                                                    </div>
                                                </div>
                                                <?php
                                            }
                                        }
                                        ?>
                                    </div>
                                </div>
                                <?php
                            }
                        }
                        ?>
                    </div>
                </div>

                <div id="instructor" class="acadlix-card acadlix-course-instructor acadlix-mb-16 acadlix-box-shadow-2">
                    <h2 class="acadlix-card-header acadlix-fs-4 acadlix-fw-bold">Course Instructor</h2>
                    <div class="acadlix-card-body">
                        <div class="acadlix-row">
                            <?php
                            if ($course->users_count === 0) {
                                ?>
                                <div class="acadlix-col-12">
                                    <div class="acadlix-card">
                                        <div class="acadlix-card-body acadlix-d-flex acadlix-align-center">
                                            <img src="<?php echo get_avatar_url($course->post->post_author, ['size' => 80]); ?>"
                                                alt="<?php echo esc_attr(get_userdata($course->post->post_author)->display_name); ?>"
                                                class="acadlix-card-img acadlix-course-instructor-img">
                                            <div class="acadlix-course-instructor-detail">
                                                <div class="acadlix-course-author acadlix-fs-5 acadlix-fw-bold">
                                                    <?php echo CourseHelper::instance()->getUserLinkHtml($course->post->post_author); ?>
                                                </div>
                                                <p>
                                                    <?php echo esc_html(get_user_meta($course->post->post_author, 'description', true)); ?>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <?php
                            }
                            foreach ($course->users as $user) {
                                ?>
                                <div class="acadlix-col-12">
                                    <div class="acadlix-card">
                                        <div class="acadlix-card-body acadlix-d-flex acadlix-align-center">
                                            <img src="<?php echo get_avatar_url($user->user_id, ['size' => 80]); ?>"
                                                alt="<?php echo esc_attr(get_userdata($user->user_id)->display_name); ?>"
                                                class="acadlix-card-img acadlix-course-instructor-img">
                                            <div class="acadlix-course-instructor-detail">
                                                <div class="acadlix-course-author acadlix-fs-5 acadlix-fw-bold">
                                                    <?php echo CourseHelper::instance()->getUserLinkHtml($user->user_id); ?>
                                                </div>
                                                <p>
                                                    <?php echo esc_html(get_user_meta($user->user_id, 'description', true)); ?>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <?php
                            }
                            ?>
                        </div>
                    </div>
                </div>
            </section>
            <div class="acadlix-mobile-sticky-footer">
                <?php echo acadlix_mobile_course_price($course); ?>
                <?php echo acadlix_course_action_buttons($course, $cart, $order_item, $dashboard_url, $checkout_url); ?>
            </div>
        </main>

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