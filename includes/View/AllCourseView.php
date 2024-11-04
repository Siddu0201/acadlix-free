<?php

use Yuvayana\Acadlix\Helper\Helper;
use Yuvayana\Acadlix\Models\Course;
use Yuvayana\Acadlix\Models\CourseCart;
use Yuvayana\Acadlix\Models\OrderItem;
use Yuvayana\Acadlix\Models\WpPosts;

defined('ABSPATH') || exit();

global $post, $wp_version;
$page = (get_query_var('paged')) ? get_query_var('paged') : 1;
$per_page = Helper::instance()->acadlix_get_option("acadlix_no_of_courses_per_page");
$one_click_checkout = Helper::instance()->acadlix_get_option('acadlix_one_click_checkout');

$publishedPostIds = WpPosts::where('post_status', 'publish')->where('post_type', ACADLIX_COURSE_CPT)->pluck('ID');
$courses = Course::withCount(['users', 'wishlist', 'cart'])->whereIn("id", $publishedPostIds)->orderBy("created_at", "desc");
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
        $query->where('user_id', $userId);
    })->pluck('course_id')->toArray();
} else {
    if (isset($_COOKIE['acadlix_cart_token'])) {
        $cart = CourseCart::where('cart_token', sanitize_text_field(wp_unslash( $_COOKIE['acadlix_cart_token'])))->pluck("course_id")->toArray();
    }
}
// echo "<pre>";
// print_r(COOKIEPATH);
// echo "</pre";

if (!function_exists('get_course_level')) {
    function get_course_level($level = "")
    {
        switch ($level) {
            case "all_level":
                return "All Level";
            case "beginner":
                return "Beginner";
            case "intermediate":
                return "Intermediate";
            case "advance":
                return "Advance";
            default:
                return "All Level";
        }
    }
}

if (!function_exists('get_course_user')) {
    function get_course_user($course_id = 0)
    {
        $course = Course::withCount('users')->find($course_id);
        if ($course->users_count > 0) {
            $i = 0;
            $user_html = '';
            foreach ($course->users as $user) {
                $user_info = get_userdata($user->user_id);
                if ($i == 0) {
                    $user_html = "<a href='" . esc_url(get_author_posts_url($user->user_id)) . "'>".esc_html($user_info?->display_name)."</a>";
                } else {
                    $user_html .= ", <a href='" . esc_url(get_author_posts_url($user->user_id)) . "'>".esc_html($user_info?->display_name)."</a>";
                }
                $i++;
            }
            return $user_html;
        } else {
            $user_info = get_userdata($course->post->post_author);
            return "<a href='" . esc_url(get_author_posts_url($course->post->post_author)) . "'>".esc_html($user_info?->display_name)."</a>";
        }
    }
}

if (!function_exists("get_course_price")) {
    function get_course_price($price = 0)
    {
        $currency = Helper::instance()->acadlix_get_option("acadlix_currency");
        $currency_symbol = Helper::instance()->acadlix_currency_symbols()[$currency];
        $curreny_position = Helper::instance()->acadlix_get_option("acadlix_currency_position");
        switch ($curreny_position) {
            case "Left ( $99.99 )":
                return "$currency_symbol$price";
            case "Right ( 99.99$ )":
                return "$price$currency_symbol";
            case "Left with space ( $ 99.99 )":
                return "$currency_symbol $price";
            case "Right with space ( 99.99 $ )":
                return "$price $currency_symbol ";
            default:
                return "$currency_symbol$price";
        }
    }
}

if (!function_exists('is_course_free')) {
    function is_course_free($price = 0, $sale_price = 0)
    {
        if ($price == 0 && $sale_price == 0) {
            return true;
        }
        return false;
    }
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
        <section class="acadlix_all_course_page">
            <div class="acadlix_filter_bar">
                <div class="acadlix_filter_bar_inner">
                    <h4>We found <span style="color: black;"><?php echo esc_html($course_count); ?></span> courses
                        available
                        for you</h4>
                    <div class="acadlix_filter_actions">
                        <div class="acadlix_select_container">
                            <select id="acadlix_course_filter_select" aria-label="Course Filter">
                                <option value="all-category">All Category</option>
                                <option value="newest">Newest courses</option>
                                <option value="oldest">Oldest courses</option>
                                <option value="high-rated">Highest rated</option>
                                <option value="popular-courses">Popular courses</option>
                                <option value="high-to-low">Price: high to low</option>
                                <option value="low-to-high">Price: low to high</option>
                            </select>

                        </div>
                        <!-- <div class="acadlix_filter_btn">
                            <p style="display: flex; justify-content: space-around;">Filter
                                <span>
                                    <i class="la la-angle-down "></i>
                                </span>
                            </p>
                        </div> -->
                    </div>
                </div>
            </div>

            <div class="acadlix_product_page_row">
                <?php
                foreach ($courses as $key => $course) {
                    // echo "<pre>";
                    // print_r($course->post);
                    // echo "</pre>";
                    ?>
                    <div class="acadlix_product_page_col_lg ">
                        <div class="acadlix_product_page_card  ">
                            <div class="acadlix_product_page_card_image">
                                <a href="<?php echo esc_url($course->post->guid); ?>" class="acadlix_product_page_d_block">
                                    <img class="acadlix_product_page_card_img_top " loading="lazy"
                                        src="<?php echo $course->post->getThumbnailUrlAttribute() ?? ACADLIX_ASSETS_IMAGE_URL. "demo-course.jpg"; ?>" 
                                        alt="<?php echo $course->post->getThumbnailAltAttribute() ?? $course?->post?->post_title; ?>">
                                </a>
                                <!-- <div class="acadlix_product_page_course_badge_labels">
                                    <div class="acadlix_product_page_course_badgebestseller">Bestseller</div>
                                    <div class=" acadlix_product_page_blue">-39%</div>
                                </div> -->
                            </div>
                            <div class="acadlix_product_page_card_body">
                                <Button
                                    class="acadlix_product_page_ribbon"><?php echo esc_html(get_course_level($course->difficulty_level)); ?></Button>
                                <h3 class="acadlix_product_page_card_title"><a
                                        href="<?php echo esc_url($course->post->guid); ?>"><?php echo esc_html($course?->post?->post_title); ?></a>
                                </h3>
                                <p class="acadlix_product_page_card_text"><?php echo get_course_user($course?->id); // phpcs:ignore ?></p> 
                                <div class=" acadlix_product_page_component">
                                    <div class="acadlix_product_page_review_stars">
                                        <span class="acadlix_product_page_rating_number">4.4</span>
                                        <span class="la la-star"></span>
                                        <span class="la la-star"></span>
                                        <span class="la la-star"></span>
                                        <span class="la la-star"></span>
                                        <span class="la la-star-o"></span>
                                    </div>
                                    <!-- <span class="acadlix_product_page_rating_total">(20,230)</span> -->
                                </div>
                                <div class="acadlix_product_page_add_to_cart ">
                                    <?php
                                    if (is_course_free($course->price, $course->sale_price)) {
                                        ?>
                                        <div class="acadlix_product_page_free">Free</div>
                                        <?php
                                    } else {
                                        ?>
                                        <p class="acadlix_product_page_card_price ">
                                            <?php echo esc_html(get_course_price($course->sale_price == 0 ? $course->price : $course->sale_price)); ?>
                                            <?php
                                            if ($course->sale_price != 0) {
                                                ?>
                                                <span class="acadlix_product_page_before_price ">
                                                    <?php echo esc_html(get_course_price($course->price)); ?>
                                                </span>
                                                <?php
                                            } ?>
                                        </p>
                                        <?php
                                    }
                                    ?>
                                    <div class="acadlix_actions">
                                        <?php
                                        if (is_course_free($course->price, $course->sale_price)) {
                                            if (in_array($course->id, $cart)) {
                                                ?>
                                                <button class="acadlix_action_button">
                                                    <a href="<?php echo esc_url($checkout_url); ?>">Go to
                                                        Checkout</a>
                                                </button>
                                                <?php
                                            } else {
                                                if (in_array($course->id, $order_item)) {
                                                    ?>
                                                    <button class="acadlix_action_button">
                                                        <a href="<?php echo esc_url($dashboard_url); ?>">Go to
                                                            Course</a>
                                                    </button>
                                                    <?php
                                                } else {
                                                    ?>
                                                    <button class="acadlix_action_button acadlix_start_now"
                                                        data-id="<?php echo esc_attr($course->id); ?>">
                                                        <div class="acadlix_action_button_text">
                                                            Start Now
                                                        </div>
                                                        <div class="acadlix_btn_loader" style="display: none;"></div>
                                                    </button>
                                                    <?php
                                                }
                                            }
                                            ?>

                                            <?php
                                        } else {
                                            if (in_array($course->id, $cart)) {
                                                ?>
                                                <button class="acadlix_action_button">
                                                    <a href="<?php echo esc_url($checkout_url); ?>">Go to
                                                        Checkout</a>
                                                </button>
                                                <?php
                                            } else {
                                                if (in_array($course->id, $order_item)) {
                                                    ?>
                                                    <button class="acadlix_action_button">
                                                        <a href="<?php echo esc_url($dashboard_url); ?>">Go to
                                                            Course</a>
                                                    </button>
                                                    <?php
                                                } else {
                                                    ?>
                                                    <button class="acadlix_action_button acadlix_buy_now"
                                                        data-id="<?php echo esc_attr($course->id); ?>">
                                                        <div class="acadlix_action_button_text">
                                                            <i class="fa fa-shopping-cart"></i> Buy Now
                                                        </div>
                                                        <div class="acadlix_btn_loader" style="display: none;"></div>
                                                    </button>
                                                    <?php
                                                }
                                            }

                                            ?>
                                            <!-- <button class="acadlix_action_button acadlix_add_to_cart"
                                                    data-id="<?php //echo $course->id; ?>">
                                                    <div class="acadlix_action_button_text">
                                                        <i class="fa fa-shopping-cart"></i> Add to
                                                        Cart
                                                    </div>
                                                    <div class="acadlix_btn_loader" style="display: none;"></div>
                                                </button> -->
                                            <?php
                                        }
                                        ?>
                                        <?php
                                        if (is_user_logged_in()) {
                                            ?>
                                            <div class="acadlix_product_page_icon_element acadlix_add_to_wishlist"
                                                id="add_to_wishlist_<?php echo esc_attr($course->id); ?>"
                                                title="Add to Wishlist" data-id="<?php echo esc_attr($course->id); ?>"
                                                style="display: <?php echo $course->wishlist_count == 0 ? 'flex' : 'none'; ?>">
                                                <i class="la la-heart-o"></i>
                                                <div class="acadlix_btn_loader" style="display: none;"></div>
                                            </div>
                                            <div class="acadlix_product_page_icon_element acadlix_remove_from_wishlist"
                                                id="remove_from_wishlist_<?php echo esc_attr($course->id); ?>"
                                                title="Remove From Wishlist" data-id="<?php echo esc_attr($course->id); ?>"
                                                style="display: <?php echo $course->wishlist_count > 0 ? 'flex' : 'none'; ?>">
                                                <i class="fa-solid fa-heart"></i>
                                                <div class="acadlix_btn_loader" style="display: none;"></div>
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

            </div>
            <div class="acadlix_pagination_container">
                <nav class="acadlix_pagination_nav">
                    <ul class="acadlix_pagination_list">
                        <li class="acadlix_pagination_item">
                            <a class="acadlix_pagination_link" href="#" aria-label="Previous">
                                <span aria-hidden="true" class="acadlix_arrow_left">&#8592;</span>
                            </a>
                        </li>
                        <?php
                        for ($i = 1; $i <= ceil($course_count / $per_page); $i++) {
                            ?>
                            <li class="acadlix_pagination_item <?php echo $i == $page ? "acadlix_active" : ""; ?> ">
                                <a class="acadlix_pagination_link"
                                    href="<?php echo esc_url(add_query_arg('paged', $i, $courses_url)); ?>"><?php echo esc_html($i); ?></a>
                            </li>
                            <?php
                        }
                        ?>
                        <!-- <li class="acadlix_pagination_item"><a class="acadlix_pagination_link" href="#">2</a></li>
                        <li class="acadlix_pagination_item"><a class="acadlix_pagination_link" href="#">3</a></li> -->
                        <li class="acadlix_pagination_item">
                            <a class="acadlix_pagination_link" href="#" aria-label="Next">
                                <span aria-hidden="true" class="acadlix_arrow_right">&#8594;</span>

                            </a>
                        </li>
                    </ul>
                </nav>
                <p class="acadlix_results_info">Showing
                    <?php 
                        $start = (($page - 1) * $per_page) + 1; 
                        $end = ($page * $per_page) > $course_count ? $course_count : $page * $per_page;
                        echo esc_html($start) .'-'. esc_html( $end ); ?>
                    of <?php echo esc_html($course_count); ?> results
                </p>
            </div>
        </section>

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