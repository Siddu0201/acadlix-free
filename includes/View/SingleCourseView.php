<?php

use Yuvayana\Acadlix\Models\Course;


defined('ABSPATH') || exit();

global $post, $wp_version;

$course = Course::find($post->ID);

/**
 * Output course breadcrumb
 *
 * @param bool $desktop  whether to display the breadcrumb on desktop
 * @param bool $mobile   whether to display the breadcrumb on mobile
 *
 * @return string the breadcrumb HTML
 */
function acadlix_course_breadcrumb(bool $desktop = true, bool $mobile = true): string
{
    if (is_null($desktop) || is_null($mobile)) {
        throw new TypeError('The parameters must be boolean values.');
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
            color: #747272;
            text-decoration: none;
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
        <a href="#">Home</a> >
        <a href="#">Web Development</a> >
        <a href="#">Webflow</a>
    </nav>
    <?php
    return ob_get_clean();
}

/**
 * Outputs the HTML for a course image with specific display settings.
 *
 * @param bool $desktop Determines if the image should be displayed on desktop.
 * @param bool $mobile  Determines if the image should be displayed on mobile.
 *
 * @throws TypeError If the parameters are not boolean values.
 *
 * @return string The HTML for the course image.
 */
function acadlix_course_img(bool $desktop = true, bool $mobile = true): string
{
    if (is_null($desktop) || is_null($mobile)) {
        throw new TypeError('The parameters must be boolean values.');
    }

    $unique_class = 'acadlix-course-featured-item-' . uniqid();
    ob_start();
    ?>
    <style>
        .<?php echo $unique_class; ?> {
            display:
                <?php echo $desktop ? "block" : "none"; ?>
            ;
            border-top-left-radius: 0.5rem;
            border-top-right-radius: 0.5rem;
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
        src="<?php echo esc_url(ACADLIX_ASSETS_IMAGE_URL . "demo-course.jpg"); ?>" alt="Course Image">
    <?php
    return ob_get_clean();
}

/**
 * Outputs the HTML for the course action buttons.
 *
 * @param object $course The course object.
 *
 * @return string The HTML for the course action buttons.
 */
function acadlix_course_action_buttons(object $course): string
{
    ob_start();
    ?>
    <button class="acadlix-action-button acadlix-buy-now" data-id="<?php echo esc_attr($course?->id); ?>">
        <div class="acadlix-action-button-text">
            <i class="fa fa-shopping-cart"></i> Buy Now
        </div>
        <div class="acadlix-btn-loader" style="display: none;"></div>
    </button>

    <div class="acadlix-product-page-icon-element acadlix-add-to-wishlist"
        id="add-to-wishlist-<?php echo esc_attr($course?->id); ?>" title="Add to Wishlist"
        data-id="<?php echo esc_attr($course?->id); ?>"
        style="display: <?php echo $course?->wishlist_count == 0 ? 'flex' : 'none'; ?>">
        <i class="la la-heart-o"></i>
        <div class="acadlix-btn-loader" style="display: none;"></div>
    </div>
    <div class="acadlix-product-page-icon-element acadlix-remove-from-wishlist"
        id="remove-from-wishlist-<?php echo esc_attr($course?->id); ?>" title="Remove From Wishlist"
        data-id="<?php echo esc_attr($course?->id); ?>"
        style="display: <?php echo $course?->wishlist_count > 0 ? 'flex' : 'none'; ?>">
        <i class="fa-solid fa-heart"></i>
        <div class="acadlix-btn-loader" style="display: none;"></div>
    </div>
    <?php
    return ob_get_clean();
}

/**
 * Function to display course pricing
 *
 * @return string
 */
function acadlix_course_pricing()
{
    ?>
    <div class="acadlix-pricing-info">
        <div class="acadlix-pricing">
            <div class="acadlix-course-sale-price"> $14.00 </div>
            <div class="acadlix-course-price">$26.00</div>
        </div>

        <div class="acadlix-discount-tag">56% OFF</div>
    </div>
    <?php
}

if (version_compare($wp_version, '5.9', '>=') && function_exists('wp_is_block_theme') && wp_is_block_theme()) {
    ?>
    <!doctype html>
    <html <?php language_attributes(); ?>>

    <head>
        <meta charset="<?php bloginfo('charset'); ?>">
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
        <main class="acadlix-course-page acadlix-my-16">
            <?php echo acadlix_course_breadcrumb(false, true); ?>
            <section class="acadlix-card acadlix-course-header-section acadlix-box-shadow-2">
                <?php echo acadlix_course_img(false, true); ?>
                <div class="acadlix-card-body acadlix-course-header-body">
                    <?php echo acadlix_course_breadcrumb(true, false); ?>
                    <h1 class="acadlix-course-header-title acadlix-fs-4 acadlix-my-8 acadlix-text-primary">
                        Complete Website Responsive Design: from Figma to Webflow to Website Design</h1>
                    <div class="acadlix-course-header-last-updated acadlix-mb-8">
                        <i class="fa fa-exclamation-circle"></i>
                        Last updated 9/2024
                    </div>
                    <div class="acadlix-course-header-author">
                        <div class="acadlix-course-header-created-at-text acadlix-text-tertiary">Created by:</div>
                        <strong>Dianne Russell</strong> + <strong>Kristin Watson</strong>
                    </div>

                    <div class="acadlix-mobile-price-info">
                        <?php echo acadlix_course_pricing(); ?>
                    </div>
                </div>

                <div class="acadlix-course-aside acadlix-card">
                    <?php echo acadlix_course_img(true, false); ?>
                    <div class="acadlix-card-body acadlix-course-aside-body">
                        <!-- acadlix aside pricing  -->
                        <?php echo acadlix_course_pricing(); ?>

                        <!-- acadlix aside details  -->
                        <div class="acadlix-course-aside-details">
                            <div class="acadlix-course-aside-details-option">
                                <div><strong>Course Duration:</strong></div>
                                <div> 6 Months</div>
                            </div>
                            <div class="acadlix-course-aside-details-option">
                                <div><strong>Course Level:</strong></div>
                                <div> Beginner</div>
                            </div>
                            <div class="acadlix-course-aside-details-option">
                                <div><strong>Students Enrolled:</strong></div>
                                <div> 69,419,618</div>
                            </div>
                        </div>

                        <!-- acadlix aside button for purchase and whishlist -->
                        <div class="acadlix-course-aside-purchase-options">
                            <?php echo acadlix_course_action_buttons($course); ?>
                        </div>
                    </div>
                </div>
            </section>
            <section class="acadlix-course-main-section">
                <!-- navbar tabs  -->
                <nav class="acadlix-course-main-navbar">
                    <ul class="acadlix-course-main-navbar-list">
                        <li><a href="#overview">Overview</a></li>
                        <li><a href="#curriculum">Curriculum</a></li>
                        <li><a href="#instructor">Instructor</a></li>
                    </ul>
                </nav>

                <div id="overview" class="acadlix-course-overview acadlix-mb-16">
                    <div class="acadlix-card acadlix-box-shadow-2">
                        <div class="acadlix-card-header acadlix-fs-4 acadlix-fw-bold">
                            What you will learn in this course
                        </div>
                        <div class="acadlix-card-body">
                            <div class="acadlix-row">
                                <div
                                    class="acadlix-col-12 acadlix-col-lg-6 acadlix-d-flex acadlix-align-center acadlix-gap-1 acadlix-py-8">
                                    <div
                                        class="acadlix-button-icon acadlix-bg-warning-main acadlix-text-white acadlix-p-4">
                                        <i class="fa fa-check"></i>
                                    </div>
                                    <div class="acadlix-fs-7 acadlix-fw-lighter">You will learn how to take your
                                        designs and build them into powerful
                                        websites using Webflow, a state of the art site builder used by teams at
                                        Dell, NASA and more.</div>
                                </div>
                                <div
                                    class="acadlix-col-12 acadlix-col-lg-6 acadlix-d-flex acadlix-align-center acadlix-gap-1 acadlix-py-8">
                                    <div
                                        class="acadlix-button-icon acadlix-bg-warning-main acadlix-text-white acadlix-p-4">
                                        <i class="fa fa-check"></i>
                                    </div>
                                    <div class="acadlix-fs-7 acadlix-fw-lighter">You will learn how to take your
                                        designs and build them into powerful
                                        websites using Webflow, a state of the art site builder used by teams at
                                        Dell, NASA and more.</div>
                                </div>
                                <div
                                    class="acadlix-col-12 acadlix-col-lg-6 acadlix-d-flex acadlix-align-center acadlix-gap-1 acadlix-py-8">
                                    <div
                                        class="acadlix-button-icon acadlix-bg-warning-main acadlix-text-white acadlix-p-4">
                                        <i class="fa fa-check"></i>
                                    </div>
                                    <div class="acadlix-fs-7 acadlix-fw-lighter"> Get an understanding of how to
                                        create GUIs in the Jupyter Notebook
                                        system!.</div>
                                </div>
                                <div
                                    class="acadlix-col-12 acadlix-col-lg-6 acadlix-d-flex acadlix-align-center acadlix-gap-1 acadlix-py-8">
                                    <div
                                        class="acadlix-button-icon acadlix-bg-warning-main acadlix-text-white acadlix-p-4">
                                        <i class="fa fa-check"></i>
                                    </div>
                                    <div class="acadlix-fs-7 acadlix-fw-lighter"> Get an understanding of how to
                                        create GUIs in the Jupyter Notebook
                                        system!.</div>
                                </div>
                                <div
                                    class="acadlix-col-12 acadlix-col-lg-6 acadlix-d-flex acadlix-align-center acadlix-gap-1 acadlix-py-8">
                                    <div
                                        class="acadlix-button-icon acadlix-bg-warning-main acadlix-text-white acadlix-p-4">
                                        <i class="fa fa-check"></i>
                                    </div>
                                    <div class="acadlix-fs-7 acadlix-fw-lighter"> Get an understanding of how to
                                        create GUIs in the Jupyter Notebook
                                        system!.</div>
                                </div>
                                <div
                                    class="acadlix-col-12 acadlix-col-lg-6 acadlix-d-flex acadlix-align-center acadlix-gap-1 acadlix-py-8">
                                    <div
                                        class="acadlix-button-icon acadlix-bg-warning-main acadlix-text-white acadlix-p-4">
                                        <i class="fa fa-check"></i>
                                    </div>
                                    <div class="acadlix-fs-7 acadlix-fw-lighter"> Get an understanding of how to
                                        create GUIs in the Jupyter Notebook
                                        system!.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="acadlix-card acadlix-box-shadow-2">
                        <div class="acadlix-card-header acadlix-fs-4 acadlix-fw-bold">
                            Description
                        </div>
                        <div class="acadlix-card-body acadlix-fs-7 acadlix-fw-lighter">
                            In this course, you'll master the entire process of turning
                            a concept into a fully functional, visually stunning website. You'll begin by designing
                            a responsive layout in Figma, a powerful and intuitive design tool. From there, you'll
                            seamlessly transition to Webflow, where you'll bring your design to life without needing
                            to write a single line of code.In this course, you'll master the entire process of
                            turning
                            a concept into a fully functional, visually stunning website. You'll begin by designing
                            a responsive layout in Figma, a powerful and intuitive design tool. From there, you'll
                            seamlessly transition to Webflow, where you'll bring your design to life without needing
                            to write a single line of code.In this course, you'll master the entire process of
                            turning
                            a concept into a fully functional, visually stunning website. You'll begin by designing
                            a responsive layout in Figma, a powerful and intuitive design tool. From there, you'll
                            seamlessly transition to Webflow, where you'll bring your design to life without needing
                            to write a single line of code.In this course, you'll master the entire process of
                            turning
                            a concept into a fully functional, visually stunning website. You'll begin by designing
                            a responsive layout in Figma, a powerful and intuitive design tool. From there, you'll
                            seamlessly transition to Webflow, where you'll bring your design to life without needing
                            to write a single line of code.
                        </div>
                    </div>
                </div>
                <div id="curriculum" class="acadlix-course-curriculum acadlix-card acadlix-mb-16 acadlix-box-shadow-2">
                    <div class="acadlix-card-header acadlix-fs-4 acadlix-fw-bold">
                        Curriculum
                    </div>
                    <div class="acadlix-d-flex acadlix-flex-column acadlix-gap-1 acadlix-card-body">
                        <div>
                            <details class="acadlix-curriculum-details" open>
                                <summary class="acadlix-curriculum-summary">
                                    <span role="term" aria-details="pure-css">Click to open and close smoothly with
                                        pure CSS</span>
                                </summary>
                            </details>
                            <div class="acadlix-curriculum-content">
                                <div class="acadlix-curriculum-content-item">
                                    <div class="acadlix-d-flex acadlix-align-center acadlix-gap-1">
                                        <span><i class="fas fa-video"></i></span>
                                        <h5 class="acadlix-content-text acadlix-fs-6">
                                            What's Webflow?
                                        </h5>
                                    </div>
                                    <div class="acadlix-content-duration">
                                        00:00:00
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <details class="acadlix-curriculum-details">
                                <summary class="acadlix-curriculum-summary">
                                    <span role="term" aria-details="pure-css">Click to open and close smoothly with
                                        pure CSS</span>
                                </summary>
                            </details>
                            <div class="acadlix-curriculum-content">
                                <div class="acadlix-curriculum-content-item">
                                    <div class="acadlix-d-flex acadlix-align-center acadlix-gap-1">
                                        <span><i class="fas fa-video"></i></span>
                                        <h5 class="acadlix-content-text acadlix-fs-6">
                                            What's Webflow?
                                        </h5>
                                    </div>
                                    <div class="acadlix-content-duration">
                                        00:00:00
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="instructor" class="acadlix-course-instructor">
                    <div class="acadlix-fs-4 acadlix-fw-bold">Course Instructor (02)</div>

                    <div class="acadlix-card">
                        <div class="acadlix-card-body acadlix-d-flex acadlix-align-center">
                            <img src="<?php echo ACADLIX_ASSETS_IMAGE_URL . "demo-course.jpg"; ?>" alt="Vako Shvili"
                                class="acadlix-card-img acadlix-course-instructor-img">
                            <div class="acadlix-course-instructor-detail">
                                <div class="acadlix-fs-5 acadlix-fw-bold">Vako Shvili</div>
                                <p>Web Designer & Best-Selling Instructor</p>
                                <div class="acadlix-course-instructor-stats">
                                    <span>⭐ 4.9 Course Rating</span> |
                                    <span>👥 236,568 Students</span> |
                                    <span>🎓 09 Courses</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <div class="acadlix-mobile-sticky-footer">
                <div class="acadlix-pricing">
                    <div class="acadlix-course-sale-price"> $16.00 </div>
                    <div class="acadlix-course-price">$26.00</div>
                </div>
                <?php echo acadlix_course_action_buttons($course); ?>
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