<?php

use Yuvayana\Acadlix\Helper\CourseHelper;
use Yuvayana\Acadlix\Helper\Helper;
use Yuvayana\Acadlix\Models\Course;
use Yuvayana\Acadlix\Models\CourseCart;
use Yuvayana\Acadlix\Models\OrderItem;
use Yuvayana\Acadlix\Models\UserActivityMeta;

defined('ABSPATH') || exit();

global $post, $wp_version;

// $course = Course::withCount(['users', 'cart'])->find($post->ID);
$course = Course::ofCourse()->find($post->ID);

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
        $query->where('user_id', $userId)->where('status', 'success');
    })->where('course_id', $post->ID)
        ->get();
} else {
    if (isset($_COOKIE['acadlix_cart_token'])) {
        $cart = CourseCart::where('cart_token', sanitize_text_field(wp_unslash($_COOKIE['acadlix_cart_token'])))
            ->where('course_id', $post->ID)
            ->get();
    }
}


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
            <a href="<?php echo home_url(); ?>"><?php esc_html_e('Home', 'acadlix'); ?></a>&nbsp;>&nbsp;
            <?php
            $categories = get_the_terms($course->ID, ACADLIX_COURSE_CATEGORY_TAXONOMY);
            if ($categories && !is_wp_error($categories)) {
                ?>
                <a href="<?php echo esc_attr(get_term_link($categories[0]->term_id, ACADLIX_COURSE_CATEGORY_TAXONOMY)); ?>">
                    <?php echo esc_html($categories[0]->name); ?>
                </a>
                &nbsp;>&nbsp;
            <?php }
            ?>
            <a href="#" disabled="true"><?php echo esc_html($course->post_title); ?></a>
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
            src="<?php echo isset($course->thumbnail['url']) ? esc_html($course->thumbnail['url']) : ACADLIX_ASSETS_IMAGE_URL . "demo-course.jpg"; ?>"
            alt="<?php echo isset($course->thumbnail['alt']) ? esc_attr($course->thumbnail['alt']) : esc_attr($course?->post_title); ?>" />
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
        $enable_sale_price = $course->rendered_metas['enable_sale_price'] ?? false;
        $price = $course->rendered_metas['price'] ?? 0;
        $sale_price = $course->rendered_metas['sale_price'] ?? 0;
        ?>
        <div class="acadlix-pricing-info">
            <div class="acadlix-pricing">
                <div class="acadlix-course-sale-price">
                    <?php echo esc_html(CourseHelper::instance()->getCoursePrice($enable_sale_price ? $sale_price : $price)); ?>
                </div>
                <?php
                if ($enable_sale_price) {
                    ?>
                    <div class="acadlix-course-price">
                        <?php echo esc_html(CourseHelper::instance()->getCoursePrice($course->rendered_metas['price'])); ?>
                    </div>
                    <?php
                }
                ?>
            </div>
            <?php
            if ($enable_sale_price && $price != 0 && $price > $sale_price) {
                ?>
                <div class="acadlix-discount-tag">
                    <?php echo ceil((($price - $sale_price) / $price) * 100); ?>%
                    <?php esc_html_e('OFF', 'acadlix'); ?>
                </div>
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
        $enable_sale_price = $course->rendered_metas['enable_sale_price'] ?? false;
        $price = $course->rendered_metas['price'] ?? 0;
        $sale_price = $course->rendered_metas['sale_price'] ?? 0;
        ?>
        <div class="acadlix-mobile-price-info">
            <div class="acadlix-pricing">
                <div class="acadlix-course-sale-price">
                    <?php echo esc_html(CourseHelper::instance()->getCoursePrice($enable_sale_price ? $sale_price : $price)); ?>
                </div>
                <?php
                if ($enable_sale_price) {
                    ?>
                    <div class="acadlix-course-price">
                        <?php echo esc_html(CourseHelper::instance()->getCoursePrice($price)); ?>
                    </div>
                    <?php
                }
                ?>
            </div>

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
        $duration = $course->rendered_metas['duration']['duration'] ?? 0;
        $duration_type = $course->rendered_metas['duration']['type'] ?? '';
        $difficulty_level = $course->rendered_metas['difficulty_level'] ?? '';
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
                <div><strong><?php esc_html_e('Course Duration:', 'acadlix'); ?></strong></div>
                <div>
                    <?php echo esc_html("{$duration} {$duration_type}"); ?>
                </div>
            </div>
            <div class="acadlix-course-aside-details-option">
                <div><strong><?php esc_html_e('Course Level:', 'acadlix'); ?></strong></div>
                <div>
                    <?php echo esc_html(CourseHelper::instance()->getCourseLevelName($difficulty_level)); ?>
                </div>
            </div>
            <div class="acadlix-course-aside-details-option">
                <div><strong><?php esc_html_e('Students Enrolled:', 'acadlix'); ?></strong></div>
                <div> <?php echo esc_html($course->student_count); ?></div>
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
        $enable_sale_price = $course->rendered_metas['enable_sale_price'] ?? false;
        $price = $course->rendered_metas['price'] ?? 0;
        $sale_price = $course->rendered_metas['sale_price'] ?? 0;
        $start_date = $course->rendered_metas['start_date'] ?? null;
        $end_date = $course->rendered_metas['end_date'] ?? null;
        if ($course->post_status != 'publish') {
            return "";
        }
        ?>
        <div class="acadlix-course-action-buttons">

            <?php
            $check_registration_date = CourseHelper::instance()->checkRegistrationDate($start_date, $end_date);
            if ($check_registration_date['status']) {
                if (CourseHelper::instance()->isCourseFree($price, $enable_sale_price, $sale_price)) {
                    if (count($cart) > 0) {
                        ?>
                        <a href="<?php echo esc_url($checkout_url); ?>"
                            class="acadlix-action-button"><?php esc_html_e('Go to Checkout', 'acadlix'); ?></a>
                        <?php
                    } elseif (count($order_item) > 0) {
                        ?>
                        <a href="<?php echo esc_url($dashboard_url); ?>" class="acadlix-action-button">
                            <?php esc_html_e('Go to Course', 'acadlix'); ?>
                        </a>
                        <?php
                    } else {
                        ?>
                        <button class="acadlix-action-button acadlix-start-now" data-id="<?php echo esc_attr($course->ID); ?>">
                            <div class="acadlix-action-button-text">
                                <?php esc_html_e('Start Now', 'acadlix'); ?>
                            </div>
                            <div class="acadlix-btn-loader" style="display: none;"></div>
                        </button>
                        <?php
                    }
                } else {
                    if (count($cart) > 0) {
                        ?>
                        <a href="<?php echo esc_url($checkout_url); ?>"
                            class="acadlix-action-button"><?php esc_html_e('Go to Checkout', 'acadlix'); ?></a>
                        <?php
                    } elseif (count($order_item) > 0) {
                        ?>
                        <a href="<?php echo esc_url($dashboard_url); ?>" class="acadlix-action-button">
                            <?php esc_html_e('Go to Course', 'acadlix'); ?>
                        </a>
                        <?php
                    } else {
                        ?>
                        <button class="acadlix-action-button acadlix-buy-now" data-id="<?php echo esc_attr($course->ID); ?>">
                            <div class="acadlix-action-button-text">
                                <i class="fa fa-shopping-cart"></i> <?php esc_html_e('Buy Now', 'acadlix'); ?>
                            </div>
                            <div class="acadlix-btn-loader" style="display: none;"></div>
                        </button>
                        <?php
                    }
                }
            } else {
                ?>
                <div class="acadlix-action-error-message">
                    <?php echo wp_kses($check_registration_date['message'], ["br" => []]); ?>
                </div>
                <?php
            }

            if (is_user_logged_in()) {
                $course_wishlist_count = UserActivityMeta::ofCourse()
                    ->ofCourseWishlist()
                    ->where([
                        'type_id' => $course->ID,
                        'user_id' => get_current_user_id(),
                    ])->count();
                ?>
                <div class="acadlix-course-wishlist">
                    <div class="acadlix-course-page-icon-element acadlix-add-to-wishlist"
                        id="add-to-wishlist-<?php echo esc_attr($course?->ID); ?>" title="<?php esc_attr_e('Add to Wishlist', 'acadlix'); ?>"
                        data-id="<?php echo esc_attr($course?->ID); ?>"
                        style="display: <?php echo $course_wishlist_count == 0 ? 'flex' : 'none'; ?>">
                        <i class="fa-regular fa-heart"></i>
                        <div class="acadlix-btn-loader" style="display: none;"></div>
                    </div>
                    <div class="acadlix-course-page-icon-element acadlix-remove-from-wishlist"
                        id="remove-from-wishlist-<?php echo esc_attr($course?->ID); ?>" title="<?php esc_attr_e('Remove From Wishlist', 'acadlix'); ?>"
                        data-id="<?php echo esc_attr($course?->ID); ?>"
                        style="display: <?php echo $course_wishlist_count > 0 ? 'flex' : 'none'; ?>">
                        <i class="fa-solid fa-heart"></i>
                        <div class="acadlix-btn-loader" style="display: none;"></div>
                    </div>
                </div>
                <?php
            }
            ?>


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
                        <?php echo esc_html($course->post_title); ?>
                    </h1>
                    <div class="acadlix-course-header-last-updated acadlix-mb-8">
                        <i class="fa fa-exclamation-circle"></i>
                        <?php esc_html_e('Last updated', 'acadlix'); ?>: <?php echo esc_html(Helper::instance()->formatDate($course->post_date)); ?>
                    </div>
                    <div class="acadlix-course-header-author">
                        <div class="acadlix-course-header-created-at-text">
                            <?php esc_html_e('Created by', 'acadlix'); ?>:
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
                        <li><a href="#overview" class="acadlix-fs-6"><?php esc_html_e('Overview', 'acadlix'); ?></a></li>
                        <li><a href="#curriculum" class="acadlix-fs-6"><?php esc_html_e('Curriculum', 'acadlix'); ?></a></li>
                        <li><a href="#instructor" class="acadlix-fs-6"><?php esc_html_e('Instructor', 'acadlix'); ?></a></li>
                    </ul>
                </nav>
                <div id="overview" class="acadlix-course-overview acadlix-mb-16">
                    <!-- Add detailed outcomes for this course to enhance understanding and expectations -->
                    <?php
                    $outcomes = $course->rendered_metas['outcomes'] ?? [];
                    if (isset($outcomes) && count($outcomes) > 0) {
                        ?>
                        <div class="acadlix-card acadlix-box-shadow-2">
                            <h2 class="acadlix-card-header acadlix-fs-4 acadlix-fw-bold">
                                <?php esc_html_e('What you will learn in this course', 'acadlix'); ?>
                            </h2>
                            <div class="acadlix-card-body">
                                <div class="acadlix-row">
                                    <?php
                                    foreach ($outcomes as $outcome) {
                                        ?>
                                        <div
                                            class="acadlix-col-12 acadlix-col-lg-6 acadlix-d-flex acadlix-align-center acadlix-gap-1 acadlix-mt-8">
                                            <div class="acadlix-button-icon acadlix-p-4">
                                                <i class="fa fa-check"></i>
                                            </div>
                                            <span class="acadlix-fs-6">
                                                <?php echo esc_html($outcome); ?>
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
                            <?php esc_html_e('Description', 'acadlix'); ?>
                        </h2>
                        <div class="acadlix-card-body acadlix-fs-6">
                            <?php
                            echo $course->rendered_post_content; // phpcs:ignore
                            ?>
                        </div>
                    </div>
                </div>

                <!-- Add Curriculum to course -->
                <div id="curriculum" class="acadlix-course-curriculum acadlix-card acadlix-mb-16 acadlix-box-shadow-2">
                    <h2 class="acadlix-card-header acadlix-fs-4 acadlix-fw-bold">
                        <?php esc_html_e('Curriculum', 'acadlix'); ?>
                    </h2>
                    <div class="acadlix-d-flex acadlix-flex-column acadlix-gap-1 acadlix-card-body">
                        <div id="acadlix-curriculam-react-preview"></div>
                        <?php
                        $sections = $course->sections;
                        if ($sections->count() > 0) {
                            foreach ($sections as $i => $section) {
                                ?>
                                <div class="acadlix-curriculum-item">
                                    <details class="acadlix-curriculum-details" <?php echo $i == 0 ? 'open' : ''; ?>>
                                        <summary class="acadlix-curriculum-summary">
                                            <h3 role="term" aria-details="pure-css">
                                                <i class="fa-solid fa-caret-right"></i>
                                                <?php echo esc_html($section->post_title); ?>
                                            </h3>
                                        </summary>
                                    </details>
                                    <div class="acadlix-curriculum-content">
                                        <?php
                                        $contents = $section->contents;
                                        if ($contents->count() > 0) {
                                            foreach ($contents as $c_index => $content) {
                                                // Helper::instance()->acadlix_dd($content->contentable_data?->rendered_metas);
                                                $preview = $content->rendered_metas['preview'] ?? false;
                                                ?>
                                                <div class="acadlix-curriculum-content-item acadlix-curriculum-content-section-item"
                                                    data-section-index="<?php echo esc_attr($i); ?>"
                                                    data-content-index="<?php echo esc_attr($c_index); ?>"
                                                    data-is-preview="<?php echo esc_attr($preview); ?>">
                                                    <div class="acadlix-d-flex acadlix-align-center acadlix-gap-1">
                                                        <span class="acadlix-content-icon">
                                                            <?php echo $content->contentable['type'] == "lesson"
                                                                ? $content->contentable_data?->rendered_metas['type'] == 'video'
                                                                ? '<i class="fas fa-video"></i>'
                                                                : '<i class="fas fa-file"></i>'
                                                                : '<i class="fas fa-question"></i>'
                                                            ; ?>
                                                        </span>
                                                        <span class="acadlix-content-text acadlix-fs-6">
                                                            <?php echo $content->contentable['title']; ?>
                                                        </span>
                                                    </div>
                                                    <div
                                                        class="acadlix-content-duration-icon acadlix-d-flex acadlix-gap-1 acadlix-justify-center acadlix-align-center">
                                                        <div class="acadlix-content-duration">
                                                            <?php echo $content->contentable['type'] == "lesson"
                                                                ? $content->contentable_data?->rendered_metas['type'] == 'video'
                                                                ? CourseHelper::instance()->intToTimeFormat(
                                                                    $content->contentable_data?->rendered_metas['hours'] ?? 0,
                                                                    $content->contentable_data?->rendered_metas['minutes'] ?? 0,
                                                                    $content->contentable_data?->rendered_metas['seconds'] ?? 0,
                                                                )
                                                                : ''
                                                                : ''
                                                            ; ?>
                                                            <?php
                                                            ?>
                                                        </div>
                                                        <?php echo isset($content->rendered_metas['preview']) && $content->rendered_metas['preview'] ?
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
                    <h2 class="acadlix-card-header acadlix-fs-4 acadlix-fw-bold"><?php esc_html_e('Course Instructor', 'acadlix'); ?></h2>
                    <div class="acadlix-card-body">
                        <div class="acadlix-row">
                            <?php
                            if (count($course->users) === 0) {
                                ?>
                                <div class="acadlix-col-12">
                                    <div class="acadlix-card">
                                        <div class="acadlix-card-body acadlix-d-flex acadlix-align-center">
                                            <img src="<?php echo get_avatar_url($course->post_author, ['size' => 80]); ?>"
                                                alt="<?php echo esc_attr(get_userdata($course->post_author)->display_name); ?>"
                                                class="acadlix-card-img acadlix-course-instructor-img">
                                            <div class="acadlix-course-instructor-detail">
                                                <div class="acadlix-course-author acadlix-fs-5 acadlix-fw-bold">
                                                    <?php echo CourseHelper::instance()->getUserLinkHtml($course->post_author); ?>
                                                </div>
                                                <p>
                                                    <?php echo esc_html(get_user_meta($course->post_author, 'description', true)); ?>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <?php
                            }
                            // Helper::instance()->acadlix_dd(count($course->users));
                            
                            foreach ($course->users as $user) {
                                ?>
                                <div class="acadlix-col-12">
                                    <div class="acadlix-card">
                                        <div class="acadlix-card-body acadlix-d-flex acadlix-align-center">
                                            <img src="<?php echo get_avatar_url($user->ID, ['size' => 80]); ?>"
                                                alt="<?php echo esc_attr(get_userdata($user->ID)->display_name); ?>"
                                                class="acadlix-card-img acadlix-course-instructor-img">
                                            <div class="acadlix-course-instructor-detail">
                                                <div class="acadlix-course-author acadlix-fs-5 acadlix-fw-bold">
                                                    <?php echo CourseHelper::instance()->getUserLinkHtml($user->ID); ?>
                                                </div>
                                                <p>
                                                    <?php echo esc_html(get_user_meta($user->ID, 'description', true)); ?>
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