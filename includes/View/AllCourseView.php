<?php

use Yuvayana\Acadlix\Helper\CourseHelper;
use Yuvayana\Acadlix\Helper\Helper;
use Yuvayana\Acadlix\Models\Course;
use Yuvayana\Acadlix\Models\CourseCart;
use Yuvayana\Acadlix\Models\CourseWishlist;
use Yuvayana\Acadlix\Models\OrderItem;
use Yuvayana\Acadlix\Models\UserActivityMeta;
use Yuvayana\Acadlix\Models\WpPosts;

defined('ABSPATH') || exit();

// $system_languages = Helper::instance()->acadlix_get_system_languages();
// Helper::instance()->acadlix_dd($system_languages);

global $post, $wp_version;
$page = (get_query_var('paged')) ? get_query_var('paged') : 1;
$per_page = Helper::instance()->acadlix_get_option("acadlix_no_of_courses_per_page");
$one_click_checkout = Helper::instance()->acadlix_get_option('acadlix_one_click_checkout');

// $publishedPostIds = WpPosts::where('post_status', 'publish')->where('post_type', ACADLIX_COURSE_CPT)->pluck('ID');
// $courses = Course::withCount(['users', 'cart'])->whereIn("id", $publishedPostIds)->orderBy("created_at", "desc");
$courses = Course::ofCourse()->where("post_status", 'publish')->orderBy("ID", "desc");
$course_count = $courses->count();
$courses = $courses->skip(($page - 1) * $per_page)->take($per_page);
$courses = $courses->get();
$courses_url = get_permalink(Helper::instance()->acadlix_get_option("acadlix_all_courses_page_id"));
$checkout_url = get_permalink(Helper::instance()->acadlix_get_option("acadlix_checkout_page_id"));
$dashboard_url = get_permalink(Helper::instance()->acadlix_get_option('acadlix_dashboard_page_id'));

$cart = [];
$order_item = [];
if (is_user_logged_in()) {
    $userId = get_current_user_id();
    $cart = CourseCart::where("user_id", $userId)->pluck("course_id")->toArray();
    $order_item = OrderItem::whereHas('order', function ($query) use ($userId) {
        $query->where('user_id', $userId)->where('status', 'success');
    })->pluck('course_id')->toArray();
} else {
    if (isset($_COOKIE['acadlix_cart_token'])) {
        $cart = CourseCart::where('cart_token', sanitize_text_field(wp_unslash($_COOKIE['acadlix_cart_token'])))->pluck("course_id")->toArray();
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
        <main id="acadlix-all-course-page" class="acadlix-all-course-page">
            <section class="acadlix-card acadlix-my-8">
                <div class="acadlix-course-filter-bar-body acadlix-card-body">
                    <div class="acadlix-course-filter-text">
                        <h4 class="acadlix-fs-6 acadlix-fw-semibold">
                            We found <span><?php echo esc_html($course_count); ?></span> courses
                            available
                            for you
                        </h4>
                    </div>
                    <div class="acadlix-d-flex">
                        <select class="acadlix-course-filter-select" aria-label="Course Filter">
                            <option value="">All Category</option>
                            <option value="newest">Newest courses</option>
                            <option value="oldest">Oldest courses</option>
                            <option value="popular-courses">Popular courses</option>
                            <option value="high-to-low">Price: high to low</option>
                            <option value="low-to-high">Price: low to high</option>
                        </select>
                    </div>
                </div>
            </section>

            <section class="acadlix-row" id="acadlix-all-course-page">
                <?php
                foreach ($courses as $key => $course) {
                    // Helper::instance()->acadlix_ddd($course->rendered_metas);
                    ?>
                    <div class="acadlix-col-lg-3 acadlix-col-md-6 acadlix-col-sm-12">
                        <div class="acadlix-card acadlix-all-course-card">
                            <a href="<?php echo esc_url(get_permalink($course->ID)); ?>">
                                <img class="acadlix-card-img-top acadlix-course-page-img" loading="lazy"
                                    src="<?php echo isset($course->thumbnail['url']) ? esc_url($course->thumbnail['url']) : ACADLIX_ASSETS_IMAGE_URL . "demo-course.jpg"; ?>"
                                    alt="<?php echo isset($course->thumbnail['alt']) ? esc_attr($course->thumbnail['alt']) : esc_attr($course->post_title); ?>" />
                            </a>
                            <div class="acadlix-card-body">
                                <div class="acadlix-course-page-chip acadlix-fs-7 acadlix-fw-medium">
                                    <?php echo esc_html(CourseHelper::instance()->getCourseLevelName($course->rendered_metas['difficulty_level'])); ?>
                                </div>
                                <h3 class="acadlix-course-page-card-title acadlix-mt-12 acadlix-fs-6 acadlix-fw-700"><a
                                        href="<?php echo esc_url(get_permalink($course->ID)); ?>"><?php echo esc_html($course?->post_title); ?></a>
                                </h3>
                                <div class="acadlix-course-user acadlix-fs-8 acadlix-fw-500 acadlix-pb-8">
                                    <?php echo CourseHelper::instance()->getCourseUserHtml($course); // phpcs:ignore ?>
                                </div>
                                <div class="acadlix-d-flex acadlix-justify-between acadlix-align-center">

                                    <div class="acadlix-course-page-card-price ">
                                        <?php echo esc_html(CourseHelper::instance()->getCoursePrice($course->rendered_metas['enable_sale_price'] ? $course->rendered_metas['sale_price'] : $course->rendered_metas['price'])); ?>
                                        <?php
                                        if ($course->rendered_metas['enable_sale_price']) {
                                            ?>
                                            <span class="acadlix-course-page-before-price ">
                                                <?php echo esc_html(CourseHelper::instance()->getCoursePrice($course->rendered_metas['price'])); ?>
                                            </span>
                                            <?php
                                        } ?>
                                    </div>

                                    <div
                                        class="acadlix-d-flex acadlix-justify-end acadlix-align-content-end acadlix-course-action-buttons">
                                        <?php
                                        $check_registration_date = CourseHelper::instance()->checkRegistrationDate($course->rendered_metas['start_date'] ?? null, $course->rendered_metas['end_date'] ?? null);
                                        if ($check_registration_date['status']) {
                                            if (CourseHelper::instance()->isCourseFree($course->rendered_metas['price'], $course->rendered_metas['enable_sale_price'], $course->rendered_metas['sale_price'])) {
                                                if (in_array($course->ID, $cart, true)) {
                                                    ?>
                                                    <a href="<?php echo esc_url($checkout_url); ?>" class="acadlix-action-button">Go to
                                                        Checkout</a>
                                                    </>
                                                    <?php
                                                } elseif (in_array($course->ID, $order_item, true)) {
                                                    ?>
                                                    <a href="<?php echo esc_url($dashboard_url); ?>" class="acadlix-action-button">Go to
                                                        Course</a>
                                                    </>
                                                    <?php
                                                } else {
                                                    ?>
                                                    <button class="acadlix-action-button acadlix-start-now"
                                                        data-id="<?php echo esc_attr($course->ID); ?>">
                                                        <div class="acadlix-action-button-text">
                                                            Start Now
                                                        </div>
                                                        <div class="acadlix-btn-loader" style="display: none;"></div>
                                                    </button>
                                                    <?php
                                                }
                                            } else {
                                                if (in_array($course->ID, $cart, true)) {
                                                    ?>
                                                    <a href="<?php echo esc_url($checkout_url); ?>" class="acadlix-action-button">Go to
                                                        Checkout</a>
                                                    </>
                                                    <?php
                                                } elseif (in_array($course->ID, $order_item, true)) {
                                                    ?>
                                                    <a href="<?php echo esc_url($dashboard_url); ?>" class="acadlix-action-button">Go to
                                                        Course</a>
                                                    <?php
                                                } else {
                                                    ?>
                                                    <button class="acadlix-action-button acadlix-buy-now"
                                                        data-id="<?php echo esc_attr($course->ID); ?>">
                                                        <div class="acadlix-action-button-text">
                                                            <i class="fa fa-shopping-cart"></i> Buy Now
                                                        </div>
                                                        <div class="acadlix-btn-loader" style="display: none;"></div>
                                                    </button>
                                                    <?php
                                                }
                                            }
                                        }
                                        ?>
                                        <?php
                                        if (is_user_logged_in()) {
                                            $course_wishlist_count = UserActivityMeta::ofCourse()
                                                ->ofCourseWishlist()
                                                ->where([
                                                    'type_id' => $course->ID,
                                                    'user_id' => get_current_user_id(),
                                                ])->count();
                                            ?>
                                            <div class="acadlix-course-page-icon-element acadlix-add-to-wishlist"
                                                id="add-to-wishlist-<?php echo esc_attr($course->ID); ?>"
                                                title="Add to Wishlist" data-id="<?php echo esc_attr($course->ID); ?>"
                                                style="display: <?php echo $course_wishlist_count == 0 ? 'flex' : 'none'; ?>">
                                                <i class="la la-heart-o"></i>
                                                <div class="acadlix-btn-loader" style="display: none;"></div>
                                            </div>
                                            <div class="acadlix-course-page-icon-element acadlix-remove-from-wishlist"
                                                id="remove-from-wishlist-<?php echo esc_attr($course->ID); ?>"
                                                title="Remove From Wishlist" data-id="<?php echo esc_attr($course->ID); ?>"
                                                style="display: <?php echo $course_wishlist_count > 0 ? 'flex' : 'none'; ?>">
                                                <i class="fa-solid fa-heart"></i>
                                                <div class="acadlix-btn-loader" style="display: none;"></div>
                                            </div>
                                            <?php
                                        }
                                        ?>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                    <?php
                }
                ?>

            </section>
            <section class="acadlix-course-pagination-container">
                <nav class="acadlix-course-pagination-nav">
                    <ul class="acadlix-course-pagination-list acadlix-box-shadow-2">
                        <li class="acadlix-course-pagination-item">
                            <a class="acadlix-course-pagination-link" href="#" aria-label="Previous">
                                <span aria-hidden="true"
                                    class="acadlix-course-pagination-arrow-left acadlix-fs-6">&#8592;</span>
                            </a>
                        </li>
                        <?php
                        for ($i = 1; $i <= ceil($course_count / $per_page); $i++) {
                            ?>
                            <li
                                class="acadlix-course-pagination-item <?php echo $i == $page ? "acadlix-course-pagination-active" : ""; ?> ">
                                <a class="acadlix-course-pagination-link"
                                    href="<?php echo esc_url(add_query_arg('paged', $i, $courses_url)); ?>"><?php echo esc_html($i); ?></a>
                            </li>
                            <?php
                        }
                        ?>
                        <li class="acadlix-course-pagination-item">
                            <a class="acadlix-course-pagination-link" href="#" aria-label="Next">
                                <span aria-hidden="true"
                                    class="acadlix-course-pagination-arrow-right acadlix-fs-6">&#8594;</span>

                            </a>
                        </li>
                    </ul>
                </nav>
                <p class="acadlix-course-pagination-info acadlix-fs-7">Showing
                    <?php
                    $start = (($page - 1) * $per_page) + 1;
                    $end = ($page * $per_page) > $course_count ? $course_count : $page * $per_page;
                    echo esc_html($start) . '-' . esc_html($end); ?>
                    of <?php echo esc_html($course_count); ?> results
                </p>
            </section>
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