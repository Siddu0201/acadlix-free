<?php
namespace Yuvayana\Acadlix\Common\View;

use Yuvayana\Acadlix\Common\Models\Course;

defined('ABSPATH') || exit();

class SingleCourseView
{
    protected $checkout_url = '';
    protected $dashboard_url = '';
    protected $course = null;
    protected $cart = [];
    protected $order_item = [];

    public function __construct()
    {
        $this->setup_query();
    }

    protected function setup_query()
    {
        global $post;

        $this->checkout_url = get_permalink(acadlix()->helper()->acadlix_get_option('acadlix_checkout_page_id'));
        $this->dashboard_url = get_permalink(acadlix()->helper()->acadlix_get_option('acadlix_dashboard_page_id'));
        $this->course = acadlix()->model()->course()->ofCourse()->with('sections')->find($post->ID);

        if (is_user_logged_in()) {
            $userId = get_current_user_id();
            $this->cart = acadlix()->model()->courseCart()->where([
                ['user_id', '=', $userId],
                ['course_id', '=', $post->ID],
            ])->first();
            $this->order_item = acadlix()
                ->model()
                ->orderItem()
                ->with(['order'])
                ->whereHas('order', function ($query) use ($userId) {
                    $query->where('user_id', $userId)->where('status', 'success');
                })
                ->where('course_id', $post->ID)
                ->get();
        } else {
            if (isset($_COOKIE['acadlix_cart_token'])) {
                $this->cart = acadlix()
                    ->model()
                    ->courseCart()
                    ->where('cart_token', sanitize_text_field(wp_unslash($_COOKIE['acadlix_cart_token'])))
                    ->where('course_id', $post->ID)
                    ->first();
            }
        }
    }

    /**
     * Outputs the HTML for a course breadcrumb navigation with specific display settings.
     *
     * @param bool $desktop Determines if the breadcrumb should be displayed on desktop.
     * @param bool $mobile  Determines if the breadcrumb should be displayed on mobile.
     *
     * @return array The HTML for a course breadcrumb navigation
     */
    protected function acadlix_course_breadcrumb(bool $desktop = true, bool $mobile = true)
    {
        if (!is_bool($desktop) || !is_bool($mobile)) {
            // error_log('The parameters must be boolean values.');
        }

        $unique_class = 'acadlix-course-breadcrumb-' . esc_attr(uniqid());
        ?>
            <style>
                .<?php echo esc_attr($unique_class); ?> {
                    display:
                        <?php echo $desktop ? 'flex' : 'none'; ?>
                    ;
                    padding-bottom: 0.5rem;
                }
    
                .<?php echo esc_attr($unique_class); ?> a {
                    color: var(--acadlix-text-tertiary);
                    text-decoration: none;
                }
    
                .<?php echo esc_attr($unique_class); ?> a:hover {
                    color: var(--acadlix-primary-main);
                    text-decoration: none;
                    border-bottom: 1px solid var(--acadlix-primary-main);
                }
    
                @media (max-width: 768px) {
                    .<?php echo esc_attr($unique_class); ?> {
                        display:
                            <?php echo $mobile ? 'flex' : 'none'; ?>
                        ;
                    }
                }
            </style>
            <?php
        $breadcrumb = [
            'component' => 'nav',
            'props' => [
                'class' => esc_attr($unique_class)
            ],
            'children' =>
                [
                    [
                        'component' => 'a',
                        'props' => [
                            'href' => esc_url(home_url()),
                            'class' => 'acadlix-course-breadcrumb acadlix-subtitle1'
                        ],
                        'value' => __('Home', 'acadlix')
                    ],
                    [
                        'component' => 'span',
                        'value' => '&nbsp;&gt;&nbsp;'
                    ],
                    !empty($categories = get_the_terms($this->course->ID, ACADLIX_COURSE_CATEGORY_TAXONOMY)) && !is_wp_error($categories) ? [
                        'component' => 'a',
                        'props' => [
                            'href' => esc_attr(get_term_link($categories[0]->term_id, ACADLIX_COURSE_CATEGORY_TAXONOMY)),
                            'class' => 'acadlix-course-breadcrumb acadlix-subtitle1'
                        ],
                        'value' => esc_html($categories[0]->name)
                    ] : null,
                    !empty($categories) && !is_wp_error($categories) ? [
                        'component' => 'span',
                        'value' => '&nbsp;&gt;&nbsp;'
                    ] : null,
                    [
                        'component' => 'a',
                        'props' => [
                            'href' => '#',
                            'disabled' => 'true',
                            'class' => 'acadlix-course-breadcrumb acadlix-subtitle1'
                        ],
                        'children' => [
                            [
                                'component' => 'php',
                                'value' => function () use ($mobile) {
                                    $title = $this->course->post_title;
                                    if ($mobile && strlen($title) > 15) {
                                        return esc_html(mb_substr($title, 0, 15)) . '...';
                                    }
                                    return esc_html($title);
                                }
                            ]
                        ]
                    ]
                ]
        ];
        return apply_filters('acadlix_single_course_breadcrumb', $breadcrumb, $this->course, $desktop, $mobile);
    }

    /**
     * Outputs the HTML for a course image with specific display settings.
     *
     * @param bool $desktop Determines if the course image should be displayed on desktop.
     * @param bool $mobile  Determines if the course image should be displayed on mobile.
     *
     * @return array The HTML for a course image
     */
    protected function acadlix_course_img(bool $desktop = true, bool $mobile = true)
    {
        if (is_null($desktop) || is_null($mobile)) {
            // error_log('The parameters must be boolean values.');
        }

        $unique_class = 'acadlix-course-featured-item-' . esc_attr(uniqid());
        ?>
            <style>
                .<?php echo esc_attr($unique_class); ?> {
                    display:
                        <?php echo $desktop ? 'block' : 'none'; ?>
                    ;
                    border-top-left-radius: var(--acadlix-border-radius);
                    border-top-right-radius: var(--acadlix-border-radius);
                    width: 100%;
                    height: 200px;
                }
    
                @media (max-width: 768px) {
                    .<?php echo esc_attr($unique_class); ?> {
                        display:
                            <?php echo $mobile ? 'block' : 'none'; ?>
                        ;
                    }
                }
            </style>
            <?php
        $img_component = [
            'component' => 'img',
            'props' => [
                'class' => esc_attr($unique_class),
                'loading' => 'lazy',
                'src' => esc_url(isset($this->course->thumbnail['url']) ? $this->course->thumbnail['url'] : ACADLIX_ASSETS_IMAGE_URL . 'demo-course.jpg'),
                'alt' => isset($this->course->thumbnail['alt']) ? esc_attr($this->course->thumbnail['alt']) : esc_attr($this->course?->post_title)
            ]
        ];
        return apply_filters('acadlix_single_course_img', $img_component, $this->course, $desktop, $mobile);
    }

    /**
     * Function to display course pricing
     *
     * @return array
     */
    protected function acadlix_course_pricing($type = 'desktop')
    {
        $enable_sale_price = $this->course->rendered_metas['enable_sale_price'] ?? false;
        $price = $this->course->rendered_metas['price'] ?? 0;
        $sale_price = $this->course->rendered_metas['sale_price'] ?? 0;
        $price_component = [
            'component' => 'div',
            'props' => [
                'class' => 'acadlix-pricing-info'
            ],
            'children' => [
                [
                    'component' => 'div',
                    'props' => [
                        'class' => 'acadlix-pricing'
                    ],
                    'children' => [
                        [
                            'component' => 'div',
                            'props' => [
                                'class' => 'acadlix-course-sale-price acadlix-h4'
                            ],
                            'value' => esc_html(acadlix()->helper()->course()->getCoursePrice($enable_sale_price ? $sale_price : $price))
                        ],
                        $enable_sale_price ? [
                            'component' => 'div',
                            'props' => [
                                'class' => 'acadlix-course-price acadlix-subtitle1'
                            ],
                            'value' => esc_html(acadlix()->helper()->course()->getCoursePrice($price))
                        ] : null
                    ]
                ],
                ($enable_sale_price && $price != 0 && $price > $sale_price) ? [
                    'component' => 'div',
                    'props' => [
                        'class' => 'acadlix-discount-tag acadlix-body1'
                    ],
                    'value' => esc_html(ceil((($price - $sale_price) / $price) * 100)) . '% ' . esc_html__('OFF', 'acadlix')
                ] : null
            ]
        ];
        return apply_filters(
            'acadlix_single_course_pricing',
            $price_component,
            $this->course,
            $type
        );
    }

    /**
     * Displays the price of a course in a mobile-friendly format.
     *
     * @return array The HTML content for the mobile price info.
     */
    protected function acadlix_mobile_course_price()
    {
        $enable_sale_price = $this->course->rendered_metas['enable_sale_price'] ?? false;
        $price = $this->course->rendered_metas['price'] ?? 0;
        $sale_price = $this->course->rendered_metas['sale_price'] ?? 0;

        $price_component = [
            'component' => 'div',
            'props' => [
                'class' => 'acadlix-mobile-price-info'
            ],
            'children' => [
                [
                    'component' => 'div',
                    'props' => [
                        'class' => 'acadlix-pricing'
                    ],
                    'children' => [
                        [
                            'component' => 'div',
                            'props' => [
                                'class' => 'acadlix-course-sale-price acadlix-h4'
                            ],
                            'value' => esc_html(acadlix()->helper()->course()->getCoursePrice($enable_sale_price ? $sale_price : $price))
                        ],
                        $enable_sale_price ? [
                            'component' => 'div',
                            'props' => [
                                'class' => 'acadlix-course-price acadlix-subtitle1'
                            ],
                            'value' => esc_html(acadlix()->helper()->course()->getCoursePrice($this->course->rendered_metas['price']))
                        ] : null
                    ]
                ],
            ]
        ];
        return apply_filters('acadlix_single_course_mobile_price', $price_component, $this->course);
    }

    protected function acadlix_basic_course_details(bool $desktop = true, bool $mobile = true)
    {
        if (!is_bool($desktop) || !is_bool($mobile)) {
            // error_log('The parameters must be boolean values.');
        }

        $unique_class = 'acadlix-course-aside-details-' . esc_attr(uniqid());
        $duration = $this->course->rendered_metas['duration']['duration'] ?? 0;
        $duration_type = $this->course->rendered_metas['duration']['type'] ?? '';
        $difficulty_level = $this->course->rendered_metas['difficulty_level'] ?? '';
        ?>
            <style>
                .<?php echo esc_attr($unique_class); ?> {
                    display:
                        <?php echo $desktop ? 'flex' : 'none'; ?>
                    ;
                }
    
                @media (max-width: 768px) {
                    .<?php echo esc_attr($unique_class); ?> {
                        display:
                            <?php echo $mobile ? 'flex' : 'none'; ?>
                        ;
                    }
                }
            </style>
            <?php
        $basic_course_details = [
            'component' => 'div',
            'props' => [
                'class' => 'acadlix-course-aside-details acadlix-subtitle2 ' . esc_attr($unique_class)
            ],
            'children' => [
                [
                    'component' => 'div',
                    'props' => [
                        'class' => 'acadlix-course-aside-details-option'
                    ],
                    'children' => [
                        [
                            'component' => 'div',
                            'children' => [
                                [
                                    'component' => 'strong',
                                    'value' => esc_html__('Course Duration:', 'acadlix'),
                                ]
                            ]
                        ],
                        [
                            'component' => 'div',
                            'value' => esc_html("{$duration} {$duration_type}"),
                        ]
                    ]
                ],
                [
                    'component' => 'div',
                    'props' => [
                        'class' => 'acadlix-course-aside-details-option'
                    ],
                    'children' => [
                        [
                            'component' => 'div',
                            'children' => [
                                [
                                    'component' => 'strong',
                                    'value' => esc_html__('Course Level:', 'acadlix'),
                                ]
                            ]
                        ],
                        [
                            'component' => 'div',
                            'value' => esc_html(acadlix()->helper()->course()->getCourseLevelName($difficulty_level ?? '')),
                        ],
                    ]
                ],
                [
                    'component' => 'div',
                    'props' => [
                        'class' => 'acadlix-course-aside-details-option'
                    ],
                    'children' => [
                        [
                            'component' => 'div',
                            'children' => [
                                [
                                    'component' => 'strong',
                                    'value' => esc_html__('Students Enrolled:', 'acadlix'),
                                ]
                            ]
                        ],
                        [
                            'component' => 'div',
                            'value' => esc_html($this->course->student_count),
                        ]
                    ]
                ]
            ]
        ];
        return apply_filters('acadlix_single_course_basic_course_details', $basic_course_details, $this->course, $desktop, $mobile);
    }

    protected function acadlix_course_checkout_button($type = 'desktop')
    {
        return apply_filters('acadlix_single_course_checkout_button', [
            'component' => 'a',
            'props' => [
                'href' => esc_url($this->checkout_url),
                'class' => 'acadlix-action-button acadlix-subtitle2',
            ],
            'value' => __('Go to Checkout', 'acadlix'),
        ], $this->course, $type);
    }

    protected function acadlix_course_go_to_course_button($type = 'desktop')
    {
        return apply_filters('acadlix_single_course_go_to_course_button', [
            'component' => 'a',
            'props' => [
                'href' => esc_url($this->dashboard_url),
                'class' => 'acadlix-action-button acadlix-subtitle2',
            ],
            'value' => __('Go to Course', 'acadlix'),
        ], $this->course, $type);
    }

    protected function acadlix_course_start_now_button($type = 'desktop')
    {
        return apply_filters('acadlix_single_course_start_now_button', [
            'component' => 'button',
            'props' => [
                'class' => 'acadlix-action-button acadlix-subtitle2 acadlix-start-now',
                'data-id' => esc_attr($this->course->ID),
            ],
            'children' => [
                [
                    'component' => 'div',
                    'props' => [
                        'class' => 'acadlix-action-button-text',
                    ],
                    'value' => __('Start Now', 'acadlix'),
                ],
                [
                    'component' => 'div',
                    'props' => [
                        'class' => 'acadlix-btn-loader',
                        'style' => 'display: none;',
                    ],
                ],
            ],
        ], $this->course, $type);
    }

    protected function acadlix_course_buy_now_button($type = 'desktop')
    {
        return apply_filters('acadlix_single_course_buy_now_button', [
            'component' => 'button',
            'props' => [
                'class' => 'acadlix-action-button acadlix-subtitle2 acadlix-buy-now',
                'data-id' => esc_attr($this->course->ID),
            ],
            'children' => [
                [
                    'component' => 'div',
                    'props' => [
                        'class' => 'acadlix-action-button-text',
                    ],
                    'children' => [
                        [
                            'component' => 'i',
                            'props' => [
                                'class' => 'fa fa-shopping-cart',
                            ],
                        ],
                        [
                            'component' => 'php',
                            'value' => __('Buy Now', 'acadlix'),
                        ],
                    ],
                ],
                [
                    'component' => 'div',
                    'props' => [
                        'class' => 'acadlix-btn-loader',
                        'style' => 'display: none;',
                    ],
                ],
            ],
        ], $this->course, $type);
    }

    protected function acadlix_course_error_button($check_registration_date)
    {
        return apply_filters('acadlix_single_course_error_button', [
            'component' => 'div',
            'props' => [
                'class' => 'acadlix-action-error-message',
            ],
            'value' => wp_kses($check_registration_date['message'], ['br' => []]),
        ], $this->course);
    }

    protected function acadlix_course_wishlist($type = "desktop")
    {
        $wishlist = [];
        if (is_user_logged_in() && acadlix()->helper()->acadlix_get_option('acadlix_disable_wishlist') === 'no') {
            $course_wishlist_count = acadlix()
                ->model()
                ->userActivityMeta()
                ->ofCourse()
                ->ofCourseWishlist()
                ->where([
                    'type_id' => $this->course->ID,
                    'user_id' => get_current_user_id(),
                ])
                ->count();
            $wishlist = apply_filters('acadlix_single_course_whishlist', [
                'component' => 'div',
                'props' => [
                    'class' => 'acadlix-course-wishlist',
                ],
                'children' => [
                    [
                        'component' => 'div',
                        'props' => [
                            'class' => 'acadlix-course-page-icon-element acadlix-add-to-wishlist',
                            'id' => 'add-to-wishlist-' . esc_attr($this->course->ID),
                            'title' => __('Add to Wishlist', 'acadlix'),
                            'data-id' => esc_attr($this->course->ID),
                            'style' => 'display: ' . ($course_wishlist_count == 0 ? 'flex' : 'none'),
                        ],
                        'children' => [
                            ['component' => 'i', 'props' => ['class' => 'fa-regular fa-heart']],
                            ['component' => 'div', 'props' => ['class' => 'acadlix-btn-loader', 'style' => 'display: none;']],
                        ],
                    ],
                    [
                        'component' => 'div',
                        'props' => [
                            'class' => 'acadlix-course-page-icon-element acadlix-remove-from-wishlist',
                            'id' => 'remove-from-wishlist-' . esc_attr($this->course->ID),
                            'title' => __('Remove From Wishlist', 'acadlix'),
                            'data-id' => esc_attr($this->course->ID),
                            'style' => 'display: ' . ($course_wishlist_count > 0 ? 'flex' : 'none'),
                        ],
                        'children' => [
                            ['component' => 'i', 'props' => ['class' => 'fa-solid fa-heart']],
                            ['component' => 'div', 'props' => ['class' => 'acadlix-btn-loader', 'style' => 'display: none;']],
                        ],
                    ],
                ]
            ], $this->course, $course_wishlist_count, $type);
        }
        return $wishlist;
    }

    protected function acadlix_course_button($type = "desktop")
    {
        $course = $this->course;
        $enable_sale_price = $course->rendered_metas['enable_sale_price'] ?? false;
        $price = $course->rendered_metas['price'] ?? 0;
        $sale_price = $course->rendered_metas['sale_price'] ?? 0;
        $start_date = $course->rendered_metas['start_date'] ?? null;
        $end_date = $course->rendered_metas['end_date'] ?? null;
        if ($course->post_status != 'publish') {
            return [];
        }
        $check_registration_date = acadlix()->helper()->course()->checkRegistrationDate($start_date, $end_date);
        $button = [];
        $checkout_button = $this->acadlix_course_checkout_button($type);
        $go_to_course_button = $this->acadlix_course_go_to_course_button($type);
        $start_now_button = $this->acadlix_course_start_now_button($type);
        $buy_now_button = $this->acadlix_course_buy_now_button($type);
        $error_button = $this->acadlix_course_error_button($check_registration_date);
        if ($check_registration_date['status']) {
            if (acadlix()->helper()->course()->isCourseFree($price, $enable_sale_price, $sale_price)) {
                if ($this->cart) {
                    $button = $checkout_button;
                } elseif (count($this->order_item) > 0) {
                    $button = $go_to_course_button;
                } else {
                    $button = $start_now_button;
                }
            } else {
                if ($this->cart) {
                    $button = $checkout_button;
                } elseif (count($this->order_item) > 0) {
                    $button = $go_to_course_button;
                } else {
                    $button = $buy_now_button;
                }
            }
        } else {
            $button = $error_button;
        }
        return $button;
    }

    /**
     * Outputs the HTML for the course action buttons.
     *
     * @param object $cart The cart object.
     * @param object $order_item The order item object.
     * @param object $course The course object.
     *
     * @return array The HTML for the course action buttons.
     */
    protected function acadlix_course_action_buttons($type = "desktop"): array
    {
        $course = $this->course;

        $button = $this->acadlix_course_button($type);
        $wishlist = $this->acadlix_course_wishlist($type);

        $action_button_component = [
            'component' => 'div',
            'props' => [
                'class' => 'acadlix-course-action-buttons',
            ],
            'children' => [
                $button,
                $wishlist,
            ],
        ];
        return apply_filters(
            'acadlix_single_course_action_buttons',
            $action_button_component,
            $course,
            $button,
            $wishlist,
            $type
        );
    }

    public function render()
    {
        $this->render_header();
        $this->render_content();
        $this->render_footer();
    }

    protected function render_header()
    {
        global $wp_version;
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
    }

    protected function render_content()
    {
        // acadlix()->helper()->acadlix_dd($this->course);
        $course_content = [
            [
                'component' => 'main',
                'props' => [
                    'class' => 'acadlix-course-page acadlix-my-16',
                    'id' => 'acadlix-single-course-page'
                ],
                'children' => [
                    $this->course_listener(),
                    $this->acadlix_course_breadcrumb(false, true),
                    $this->course_header(),
                    $this->course_main(),
                    $this->course_mobile_footer(),
                ]
            ]
        ];
        $course_content = apply_filters('acadlix_single_course_content', $course_content, $this->course);
        acadlix()->helper()->acadlix_render_tree($course_content);
    }

    protected function course_listener()
    {
        return apply_filters('acadlix_single_course_listener', [
            'component' => 'div',
            'props' => [
                'id' => 'acadlix-course-listener',
            ],
        ], $this->course);
    }

    protected function course_header()
    {
        $course_header = [
            'component' => 'section',
            'props' => [
                'class' => 'acadlix-card acadlix-course-header-section acadlix-box-shadow-2'
            ],
            'children' => [
                // Main course image
                $this->acadlix_course_img(false, true),
                // Body
                $this->course_header_body(),
                // Aside
                $this->course_header_aside()
            ]
        ];
        $course_header = apply_filters('acadlix_single_course_header', $course_header, $this->course);
        return $course_header;
    }

    protected function course_header_title()
    {
        return apply_filters('acadlix_single_course_header_title', [
            'component' => 'h1',
            'props' => [
                'class' => 'acadlix-course-header-title acadlix-my-8'
            ],
            'value' => esc_html($this->course->post_title)
        ], $this->course);
    }

    protected function course_header_last_update()
    {
        return apply_filters('acadlix_single_course_header_last_update', [
            'component' => 'div',
            'props' => [
                'class' => 'acadlix-course-header-last-updated acadlix-body1 acadlix-mb-8'
            ],
            'children' => [
                [
                    'component' => 'i',
                    'props' => ['class' => 'fa fa-exclamation-circle']
                ],
                [
                    'component' => 'span',
                    'value' => esc_html__('Last updated', 'acadlix') . ': '
                        . esc_html(acadlix()->helper()->formatDate($this->course->post_date))
                ]
            ]
        ], $this->course);
    }

    protected function course_header_author()
    {
        return apply_filters('acadlix_single_course_header_author', [
            'component' => 'div',
            'props' => ['class' => 'acadlix-course-header-author'],
            'children' => [
                [
                    'component' => 'div',
                    'props' => ['class' => 'acadlix-course-header-created-at-text acadlix-subtitle2'],
                    'value' => esc_html__('Created by', 'acadlix') . ':'
                ],
                [
                    'component' => 'div',
                    'props' => ['class' => 'acadlix-course-author acadlix-body1'],
                    'value' => acadlix()->helper()->course()->getCourseUserHtml($this->course)
                ]
            ]
        ], $this->course);
    }

    protected function course_header_body()
    {
        return apply_filters('acadlix_single_course_header_body', [
            'component' => 'div',
            'props' => [
                'class' => 'acadlix-card-body acadlix-course-header-body'
            ],
            'children' => [
                $this->acadlix_course_breadcrumb(true, false),
                $this->course_header_title(),
                $this->course_header_last_update(),
                $this->course_header_author(),
                [
                    'component' => 'div',
                    'props' => [
                        'class' => 'acadlix-mobile-price-info'
                    ],
                    'children' => [
                        $this->acadlix_course_pricing('mobile')
                    ]
                ],
                $this->acadlix_basic_course_details(false, true),
            ]
        ], $this->course);
    }

    protected function course_header_aside()
    {
        return apply_filters('acadlix_single_course_header_aside', [
            'component' => 'div',
            'props' => ['class' => 'acadlix-course-aside acadlix-card'],
            'children' => [
                $this->acadlix_course_img(true, false),
                [
                    'component' => 'div',
                    'props' => ['class' => 'acadlix-card-body acadlix-course-aside-body'],
                    'children' => [
                        $this->acadlix_course_pricing('desktop'),
                        [
                            'component' => 'div',
                            'props' => ['class' => 'acadlix-course-aside-purchase-options'],
                            'children' => [
                                $this->acadlix_course_action_buttons('desktop')
                            ]
                        ],
                        $this->acadlix_basic_course_details(true, false),
                    ]
                ]
            ]
        ], $this->course);
    }

    protected function course_main()
    {
        return apply_filters('acadlix_single_course_main', [
            'component' => 'section',
            'props' => [
                'class' => 'acadlix-course-main-section'
            ],
            'children' => [
                // Navbar Tabs
                $this->course_main_navbar(),
                // Overview Section
                $this->course_main_overview(),
                // Curriculum Section
                $this->course_main_curriculum(),
                // Instructor Section
                $this->course_main_instructor()
            ]
        ], $this->course);
    }

    protected function course_main_navbar()
    {
        return apply_filters('acadlix_single_course_main_navbar', [
            'component' => 'nav',
            'props' => ['class' => 'acadlix-course-main-navbar'],
            'children' => [
                [
                    'component' => 'ul',
                    'props' => ['class' => 'acadlix-course-main-navbar-list'],
                    'children' => [
                        [
                            'component' => 'li',
                            'children' => [
                                [
                                    'component' => 'a',
                                    'props' => [
                                        'href' => '#overview',
                                        'class' => 'acadlix-subtitle1'
                                    ],
                                    'value' => esc_html__('Overview', 'acadlix')
                                ]
                            ]
                        ],
                        [
                            'component' => 'li',
                            'children' => [
                                [
                                    'component' => 'a',
                                    'props' => [
                                        'href' => '#curriculum',
                                        'class' => 'acadlix-subtitle1'
                                    ],
                                    'value' => esc_html__('Curriculum', 'acadlix')
                                ]
                            ]
                        ],
                        [
                            'component' => 'li',
                            'children' => [
                                [
                                    'component' => 'a',
                                    'props' => [
                                        'href' => '#instructor',
                                        'class' => 'acadlix-subtitle1'
                                    ],
                                    'value' => esc_html__('Instructor', 'acadlix')
                                ]
                            ]
                        ],
                    ]
                ]
            ]
        ], $this->course);
    }

    protected function course_main_overview_outcomes_heading()
    {
        return apply_filters('acadlix_single_course_main_overview_outcomes_heading', [
            'component' => 'h2',
            'props' => [
                'class' => 'acadlix-card-header'
            ],
            'value' => esc_html__('What you will learn in this course', 'acadlix')
        ], $this->course);
    }

    protected function course_main_overview_single_outcome($outcome = '')
    {
        return apply_filters('acadlix_single_course_main_overview_single_outcome', [
            'component' => 'div',
            'props' => [
                'class' => 'acadlix-col-12 acadlix-col-lg-6 acadlix-d-flex acadlix-align-center acadlix-gap-1 acadlix-mt-8'
            ],
            'children' => [
                [
                    'component' => 'div',
                    'props' => [
                        'class' => 'acadlix-button-icon acadlix-p-4'
                    ],
                    'children' => [
                        [
                            'component' => 'i',
                            'props' => [
                                'class' => 'fa fa-check'
                            ]
                        ]
                    ]
                ],
                [
                    'component' => 'span',
                    'props' => [
                        'class' => 'acadlix-body1'
                    ],
                    'value' => esc_html($outcome)
                ]
            ]
        ], $this->course);
    }

    protected function course_main_overview_outcomes()
    {
        $outcome_list = [];
        $outcomes = $this->course->rendered_metas['outcomes'] ?? [];
        if (isset($outcomes) && count($outcomes) > 0) {
            foreach ($outcomes as $outcome) {
                $outcome_list[] = $this->course_main_overview_single_outcome($outcome);
            }
            return [
                'component' => 'div',
                'props' => [
                    'class' => 'acadlix-card acadlix-box-shadow-2'
                ],
                'children' => [
                    $this->course_main_overview_outcomes_heading(),
                    [
                        'component' => 'div',
                        'props' => [
                            'class' => 'acadlix-card-body'
                        ],
                        'children' => [
                            [
                                'component' => 'div',
                                'props' => [
                                    'class' => 'acadlix-row'
                                ],
                                'children' => $outcome_list
                            ]
                        ]
                    ]
                ]
            ];
        }

        return null;
    }

    protected function course_main_overview_description_heading()
    {
        return apply_filters('acadlix_single_course_main_overview_description_heading', [
            'component' => 'h2',
            'props' => ['class' => 'acadlix-card-header'],
            'value' => esc_html__('Description', 'acadlix')
        ], $this->course);
    }

    protected function course_main_overview_description()
    {
        return apply_filters('acadlix_single_course_main_overview_description', [
            'component' => 'div',
            'props' => [
                'class' => 'acadlix-card acadlix-box-shadow-2'
            ],
            'children' => [
                $this->course_main_overview_description_heading(),
                [
                    'component' => 'div',
                    'props' => ['class' => 'acadlix-card-body'],
                    'value' => $this->course->rendered_post_content
                ]
            ]
        ], $this->course);
    }

    protected function course_main_overview()
    {
        return apply_filters('acadlix_single_course_main_overview', [
            'component' => 'div',
            'props' => [
                'id' => 'overview',
                'class' => 'acadlix-course-overview acadlix-mb-16'
            ],
            'children' => [
                $this->course_main_overview_outcomes(),
                $this->course_main_overview_description()
            ]
        ], $this->course);
    }

    protected function course_main_curriculum_content($i, $content, $c_index, $preview = false)
    {
        return apply_filters('acadlix_single_course_main_curriculum_content', [
            'component' => 'div',
            'props' => [
                'class' => 'acadlix-curriculum-content-item',
                'data-section-index' => esc_attr($i),
                'data-content-index' => esc_attr($c_index),
                'data-is-preview' => esc_attr($preview),
            ],
            'children' => [
                // left: icon + title
                [
                    'component' => 'div',
                    'props' => [
                        'class' => 'acadlix-d-flex acadlix-align-center acadlix-gap-1'
                    ],
                    'children' => [
                        [
                            'component' => 'span',
                            'props' => [
                                'class' => 'acadlix-content-icon'
                            ],
                            'children' => [
                                [
                                    'component' => 'php',
                                    'value' => function () use ($content) {
                                        $type = $content->contentable['type'];
                                        $icon = '';

                                        if ($type === 'lesson') {
                                            $icon = $content->contentable_data?->rendered_metas['type'] === 'video'
                                                ? '<i class="fas fa-video"></i>'
                                                : '<i class="fas fa-file"></i>';
                                        } elseif ($type === 'quiz') {
                                            $icon = '<i class="fas fa-question"></i>';
                                        } elseif ($type === 'assignment') {
                                            $icon = '<i class="fas fa-file-signature"></i>';
                                        }

                                        return apply_filters(
                                            'acadlix/single-course/content/icon',
                                            $icon,
                                            $content
                                        );
                                    }
                                ]
                            ]
                        ],
                        [
                            'component' => 'span',
                            'props' => [
                                'class' => 'acadlix-content-text acadlix-body1'
                            ],
                            'value' => esc_html($content->contentable['title'])
                        ]
                    ]
                ],
                // right: duration + lock/eye
                [
                    'component' => 'div',
                    'props' => [
                        'class' => 'acadlix-content-duration-icon acadlix-d-flex acadlix-gap-1 acadlix-justify-center acadlix-align-center'
                    ],
                    'children' => [
                        [
                            'component' => 'div',
                            'props' => [
                                'class' => 'acadlix-content-duration'
                            ],
                            'children' => [
                                [
                                    'component' => 'php',
                                    'value' => function () use ($content) {
                                        if ($content->contentable['type'] === 'lesson') {
                                            if ($content->contentable_data?->rendered_metas['type'] === 'video') {
                                                return esc_html(
                                                    acadlix()->helper()->course()->intToTimeFormat(
                                                        $content->contentable_data?->rendered_metas['hours'] ?? 0,
                                                        $content->contentable_data?->rendered_metas['minutes'] ?? 0,
                                                        $content->contentable_data?->rendered_metas['seconds'] ?? 0
                                                    )
                                                );
                                            }
                                        }
                                        return '';
                                    }
                                ]
                            ]
                        ],
                        [
                            'component' => 'php',
                            'value' => function () use ($content) {
                                return isset($content->rendered_metas['preview']) && $content->rendered_metas['preview']
                                    ? '<div><i class="fas fa-eye"></i></div>'
                                    : '<i class="fas fa-lock"></i>';
                            }
                        ]
                    ]
                ]
            ]
        ], $content, $c_index, $preview);
    }

    protected function course_main_curriculum_section($section, $i)
    {
        $contents = $section->contents;
        $content_list = [];
        if ($contents->count() > 0) {
            foreach ($contents as $c_index => $content) {
                $preview = $content->rendered_metas['preview'] ?? false;
                $content_list[] = $this->course_main_curriculum_content(
                    $i,
                    $content,
                    $c_index,
                    $preview
                );
            }
        }
        return [
            'component' => 'div',
            'props' => [
                'class' => 'acadlix-curriculum-item'
            ],
            'children' =>
                [
                    [
                        'component' => 'details',
                        'props' => [
                            'class' => 'acadlix-curriculum-details',
                            // add open attribute if first section
                            'open' => $i === 0 ? true : null,
                        ],
                        'children' => [
                            [
                                'component' => 'summary',
                                'props' => [
                                    'class' => 'acadlix-curriculum-summary'
                                ],
                                'children' => [
                                    [
                                        'component' => 'h3',
                                        'props' => [
                                            'role' => 'term',
                                            'aria-details' => 'pure-css'
                                        ],
                                        'children' => [
                                            [
                                                'component' => 'i',
                                                'props' => [
                                                    'class' => 'fa-solid fa-caret-right'
                                                ]
                                            ],
                                            [
                                                'component' => 'php',
                                                'value' => function () use ($section) {
                                                    return esc_html($section->post_title);
                                                }
                                            ]
                                        ]
                                    ]
                                ]
                            ]
                        ]
                    ],
                    [
                        'component' => 'div',
                        'props' => [
                            'class' => 'acadlix-curriculum-content'
                        ],
                        'children' => $content_list
                    ]
                ]
        ];
    }

    protected function course_main_curriculum_heading()
    {
        return apply_filters('acadlix_single_course_main_curriculum_heading', [
            'component' => 'h2',
            'props' => [
                'class' => 'acadlix-card-header'
            ],
            'value' => esc_html__('Curriculum', 'acadlix')
        ], $this->course);
    }

    protected function course_main_curriculum()
    {
        $sections = $this->course->sections;
        $section_list = [];
        $section_list[] = [
            'component' => 'div',
            'props' => [
                'id' => 'acadlix-curriculam-react-preview'
            ]
        ];
        if ($sections->count() > 0) {
            foreach ($sections as $i => $section) {
                $section_list[] = $this->course_main_curriculum_section($section, $i);
            }
        }
        return [
            'component' => 'div',
            'props' => [
                'id' => 'curriculum',
                'class' => 'acadlix-course-curriculum acadlix-card acadlix-mb-16 acadlix-box-shadow-2'
            ],
            'children' => [
                $this->course_main_curriculum_heading(),
                [
                    'component' => 'div',
                    'props' => [
                        'class' => 'acadlix-d-flex acadlix-flex-column acadlix-gap-1 acadlix-card-body'
                    ],
                    'children' => $section_list
                ]
            ]
        ];
    }

    protected function course_single_instructor_img($user_id = 0)
    {
        $author_data = get_userdata($user_id);
        $author_name = $author_data ? $author_data->display_name : '';
        return apply_filters('acadlix_single_course_single_instructor_img', [
            'component' => 'img',
            'props' => [
                'src' => esc_url(get_avatar_url($user_id, ['size' => 80])),
                'alt' => esc_attr($author_name),
                'class' => 'acadlix-card-img acadlix-course-instructor-img',
            ]
        ], $user_id);
    }

    protected function course_single_instructor_name($user_id = 0)
    {
        return apply_filters('acadlix_single_course_single_instructor_name', [
            'component' => 'div',
            'props' => [
                'class' => 'acadlix-course-author acadlix-h3'
            ],
            'value' => acadlix()->helper()->course()->getUserLinkHtml($user_id)
        ], $user_id);
    }

    protected function course_single_instructor_desc($user_id = 0)
    {
        $author_desc = get_user_meta($user_id, 'description', true);
        return apply_filters('acadlix_single_course_single_instructor_desc', !empty($author_desc) ? [
            'component' => 'div',
            'props' => [
                'class' => 'acadlix-course-user-description acadlix-body1'
            ],
            'value' => esc_html($author_desc)
        ] : null, $user_id);
    }

    protected function course_single_instructor($user_id = 0)
    {
        return apply_filters('acadlix_single_course_single_instructor', [
            'component' => 'div',
            'props' => [
                'class' => 'acadlix-col-12'
            ],
            'children' => [
                [
                    'component' => 'div',
                    'props' => [
                        'class' => 'acadlix-card'
                    ],
                    'children' => [
                        [
                            'component' => 'div',
                            'props' => [
                                'class' => 'acadlix-card-body acadlix-d-flex acadlix-align-center'
                            ],
                            'children' => [
                                $this->course_single_instructor_img($user_id),
                                [
                                    'component' => 'div',
                                    'props' => [
                                        'class' => 'acadlix-course-instructor-detail'
                                    ],
                                    'children' => [
                                        $this->course_single_instructor_name($user_id),
                                        $this->course_single_instructor_desc($user_id)
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ]
        ], $this->course, $user_id);
    }

    protected function course_main_instructor_heading()
    {
        return apply_filters('acadlix_single_course_main_instructor_heading', [
            'component' => 'h2',
            'props' => [
                'class' => 'acadlix-card-header'
            ],
            'value' => esc_html__('Course Instructor', 'acadlix')
        ], $this->course);
    }

    protected function course_main_instructor()
    {
        $course_instructors = [];
        if (count($this->course->users) === 0) {
            $course_instructors[] = $this->course_single_instructor($this->course->post_author);
        } else {
            foreach ($this->course->users as $user) {
                $course_instructors[] = $this->course_single_instructor($user->ID);
            }
        }
        return apply_filters('acadlix_single_course_main_instructor', [
            'component' => 'div',
            'props' => [
                'id' => 'instructor',
                'class' => 'acadlix-card acadlix-course-instructor acadlix-mb-16 acadlix-box-shadow-2'
            ],
            'children' => [
                $this->course_main_instructor_heading(),
                [
                    'component' => 'div',
                    'props' => [
                        'class' => 'acadlix-card-body'
                    ],
                    'children' => [
                        [
                            'component' => 'div',
                            'props' => [
                                'class' => 'acadlix-row'
                            ],
                            'children' => $course_instructors
                        ]
                    ]
                ]
            ]
        ], $this->course);
    }

    protected function course_mobile_footer()
    {
        return apply_filters('acadlix_single_course_mobile_footer', [
            'component' => 'div',
            'props' => [
                'class' => 'acadlix-mobile-sticky-footer',
            ],
            'children' => [
                $this->acadlix_mobile_course_price(),
                $this->acadlix_course_action_buttons('mobile'),
            ],
        ], $this->course);
    }

    protected function render_footer()
    {
        global $wp_version;
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
    }
}
