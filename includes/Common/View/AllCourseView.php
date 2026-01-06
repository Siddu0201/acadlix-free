<?php

namespace Yuvayana\Acadlix\Common\View;

defined('ABSPATH') || exit();

class AllCourseView
{
    protected $checkout_url = '';
    protected $dashboard_url = '';
    protected $search = '';
    protected $page = 1;
    protected $per_page = 10;
    protected $courses = [];
    protected $course_count = 0;
    protected $cart = [];
    protected $order_item = [];

    public function __construct()
    {
        $this->setup_query();
    }

    protected function setup_query()
    {
        $this->checkout_url = get_permalink(acadlix()->helper()->acadlix_get_option('acadlix_checkout_page_id'));
        $this->dashboard_url = get_permalink(acadlix()->helper()->acadlix_get_option('acadlix_dashboard_page_id'));
        $this->search = isset($_GET['search']) ? sanitize_text_field($_GET['search']) : ''; // phpcs:ignore
        $this->page = max(1, (get_query_var('paged')) ? get_query_var('paged') : 1);
        $this->per_page = acadlix()->helper()->acadlix_get_option('acadlix_no_of_courses_per_page');

        $query = acadlix()
            ->model()
            ->course()
            ->ofCourse()
            ->where('post_status', 'publish')
            ->orderBy('ID', 'desc');

        if (!empty($this->search)) {
            $query->where('post_title', 'like', "%{$this->search}%");
        }

        $this->course_count = $query->count();
        if ($this->course_count <= $this->per_page) {
            $this->page = 1;
        }

        $this->courses = $query
            ->skip(($this->page - 1) * $this->per_page)
            ->take($this->per_page)
            ->get();

        // Allow Pro or addons to modify query results
        // $this->courses = apply_filters('acadlix_all_courses_list', $this->courses, $this->page, $this->search);
        if (is_user_logged_in()) {
            $userId = get_current_user_id();
            $this->cart = acadlix()->model()->courseCart()->where('user_id', $userId)->pluck('course_id')->toArray();
            $this->order_item = acadlix()->model()->orderItem()->with(['order'])->whereHas('order', function ($query) use ($userId) {
                $query->where('user_id', $userId)->where('status', 'success');
            })->pluck('course_id')->toArray();
        } else {
            if (isset($_COOKIE['acadlix_cart_token'])) {
                $this->cart = acadlix()->model()->courseCart()->where('cart_token', sanitize_text_field(wp_unslash($_COOKIE['acadlix_cart_token'])))->pluck('course_id')->toArray();
            }
        }
    }

    public function render()
    {
        $this->render_header();
        $this->render_courses();
        $this->render_footer();
    }

    public function render_header()
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

    public function render_courses()
    {
        $course_children = [];
        if (!empty($this->courses)) {
            foreach ($this->courses as $course) {
                $course_children[] = [
                    'component' => 'php',
                    'value' => function () use ($course) {
                        ob_start();
                        $this->render_single_course($course);
                        return ob_get_clean();
                    },
                ];
            }
        }
        $all_course_page = [
            [
                'component' => 'main',
                'props' => [
                    'id' => 'acadlix-all-course-page',
                    'class' => 'acadlix-all-course-page',
                ],
                'children' => [
                    $this->render_search(),
                    $this->course_listener(),
                    [
                        'component' => 'section',
                        'props' => ['class' => 'acadlix-row'],
                        'children' => $course_children,
                    ],
                    $this->render_pagination(),
                ],
            ]
        ];

        $all_course_page = apply_filters('acadlix_all_courses_page', $all_course_page);
        acadlix()->helper()->acadlix_render_tree($all_course_page);
    }

    protected function course_listener()
    {
        return apply_filters('acadlix_all_course_listener', [
            'component' => 'div',
            'props' => [
                'id' => 'acadlix-course-listener',
            ],
        ]);
    }

    public function render_single_course($course)
    {
        $single_course_ui = [
            'component' => 'div',
            'props' => [
                'class' => 'acadlix-col-lg-3 acadlix-col-md-6 acadlix-col-sm-12'
            ],
            'children' => [
                [
                    'component' => 'div',
                    'props' => [
                        'class' => 'acadlix-card acadlix-all-course-card'
                    ],
                    'children' => [
                        $this->render_course_image($course),
                        [
                            'component' => 'div',
                            'props' => [
                                'class' => 'acadlix-card-body acadlix-all-course-card-body'
                            ],
                            'children' => [
                                $this->render_course_level($course),
                                $this->render_course_title($course),
                                $this->render_course_user($course),
                                $this->render_course_footer($course),
                            ]
                        ]
                    ]
                ]
            ]
        ];
        $single_course_ui = apply_filters('acadlix_single_course_ui', $single_course_ui, $course);
        acadlix()->helper()->acadlix_render_component($single_course_ui);
    }

    /**
     * Image section
     */
    protected function render_course_image($course)
    {
        return apply_filters('acadlix_all_course_single_course_image', [
            'component' => 'a',
            'props' => [
                'href' => esc_url(get_permalink($course->ID)),
            ],
            'children' => [
                [
                    'component' => 'img',
                    'props' => [
                        'class' => 'acadlix-card-img-top acadlix-course-page-img',
                        'loading' => 'lazy',
                        'src' => esc_url(isset($course->thumbnail['url']) ? $course->thumbnail['url'] : ACADLIX_ASSETS_IMAGE_URL . 'demo-course.jpg'),
                        'alt' => isset($course->thumbnail['alt'])
                            ? esc_attr($course->thumbnail['alt'])
                            : esc_attr($course->post_title),
                    ]
                ]
            ]
        ], $course);
    }

    /**
     * Difficulty chip
     */
    protected function render_course_level($course)
    {
        return apply_filters('acadlix_all_course_single_course_level', [
            'component' => 'div',
            'props' => [
                'class' => 'acadlix-course-page-chip acadlix-body2'
            ],
            'value' => esc_html(
                acadlix()->helper()->course()->getCourseLevelName($course->rendered_metas['difficulty_level'] ?? '')
            )
        ], $course);
    }

    /**
     * Title
     */
    protected function render_course_title($course)
    {
        return apply_filters('acadlix_all_course_single_course_title', [
            'component' => 'h4',
            'props' => [
                'class' => 'acadlix-course-page-card-title'
            ],
            'children' => [
                [
                    'component' => 'a',
                    'props' => [
                        'href' => esc_url(get_permalink($course->ID))
                    ],
                    'value' => esc_html($course?->post_title)
                ]
            ]
        ], $course);
    }

    /**
     * User info
     */
    protected function render_course_user($course)
    {
        return apply_filters('acadlix_all_course_single_course_user', [
            'component' => 'div',
            'props' => [
                'class' => 'acadlix-course-user acadlix-body2'
            ],
            'value' => acadlix()->helper()->course()->getCourseUserHtml($course)  // Already returns safe HTML
        ], $course);
    }

    protected function render_course_footer($course)
    {
        return apply_filters('acadlix_all_course_single_course_footer', [
            'component' => 'div',
            'props' => [
                'class' => 'acadlix-course-page-card-footer'
            ],
            'children' => [
                $this->render_course_price($course),
                [
                    'component' => 'div',
                    'props' => [
                        'class' => 'acadlix-d-flex acadlix-justify-end acadlix-align-content-end acadlix-course-action-buttons'
                    ],
                    'children' => [
                        $this->render_course_buttons($course),
                        $this->render_course_wishlist($course),
                    ]
                ]
            ]
        ], $course);
    }

    /**
     * Price section
     */
    protected function render_course_price($course)
    {
        $price_html = acadlix()->helper()->course()->getCoursePrice(
            $course->rendered_metas['enable_sale_price']
                ? $course->rendered_metas['sale_price']
                : $course->rendered_metas['price']
        );

        $children = [
            [
                'component' => 'span',
                'props' => [
                    'class' => 'acadlix-course-page-price acadlix-body1'
                ],
                'value' => esc_html($price_html)
            ]
        ];

        if (!empty($course->rendered_metas['enable_sale_price'])) {
            $children[] = [
                'component' => 'span',
                'props' => [
                    'class' => 'acadlix-course-page-before-price acadlix-subtitle2'
                ],
                'value' => esc_html(
                    acadlix()->helper()->course()->getCoursePrice($course->rendered_metas['price'])
                )
            ];
        }

        return apply_filters('acadlix_all_course_single_course_price', [
            'component' => 'div',
            'props' => [
                'class' => 'acadlix-course-page-card-price'
            ],
            'children' => $children
        ], $course);
    }

    protected function render_go_to_checkout_button($course)
    {
        return apply_filters('acadlix_all_course_single_course_go_to_checkout_button', [
            'component' => 'a',
            'props' => [
                'href' => esc_url($this->checkout_url),
                'class' => 'acadlix-action-button acadlix-subtitle2'
            ],
            'value' => esc_html__('Go to Checkout', 'acadlix')
        ], $course);
    }

    protected function render_go_to_course_button($course)
    {
        return apply_filters('acadlix_all_course_single_course_go_to_course_button', [
            'component' => 'a',
            'props' => [
                'href' => esc_url($this->dashboard_url),
                'class' => 'acadlix-action-button acadlix-subtitle2'
            ],
            'value' => esc_html__('Go to Course', 'acadlix')
        ], $course);
    }

    protected function render_start_now_button($course)
    {
        return apply_filters('acadlix_all_course_single_course_start_now_button', [
            'component' => 'button',
            'props' => [
                'class' => 'acadlix-action-button acadlix-subtitle2 acadlix-start-now',
                'data-id' => esc_attr($course->ID)
            ],
            'children' => [
                [
                    'component' => 'div',
                    'props' => ['class' => 'acadlix-action-button-text'],
                    'value' => esc_html__('Start Now', 'acadlix')
                ],
                [
                    'component' => 'div',
                    'props' => [
                        'class' => 'acadlix-btn-loader',
                        'style' => 'display:none;'
                    ]
                ]
            ]
        ], $course);
    }

    protected function render_buy_now_button($course)
    {
        return apply_filters('acadlix_all_course_single_course_buy_now_button', [
            'component' => 'button',
            'props' => [
                'class' => 'acadlix-action-button acadlix-subtitle2 acadlix-buy-now',
                'data-id' => esc_attr($course->ID)
            ],
            'children' => [
                [
                    'component' => 'div',
                    'props' => ['class' => 'acadlix-action-button-text'],
                    'value' => '<i class="fa fa-shopping-cart"></i> ' . esc_html__('Buy Now', 'acadlix')
                ],
                [
                    'component' => 'div',
                    'props' => [
                        'class' => 'acadlix-btn-loader',
                        'style' => 'display:none;'
                    ]
                ]
            ]
        ], $course);
    }

    protected function render_course_buttons($course)
    {
        // acadlix()->helper()->acadlix_dd($course, true);
        $check_registration_date = acadlix()->helper()->course()->checkRegistrationDate(
            $course->rendered_metas['start_date'] ?? null,
            $course->rendered_metas['end_date'] ?? null
        );

        $button = [];
        $checkout_button = $this->render_go_to_checkout_button($course);
        $go_to_course_button = $this->render_go_to_course_button($course);
        $start_now_button = $this->render_start_now_button($course);
        $buy_now_button = $this->render_buy_now_button($course);

        $is_course_purchased = false;
        $cart = [];
        if(is_user_logged_in()){
            $userId = get_current_user_id();
            $is_course_purchased = $course->isPurchasedBy($userId);
            $cart = acadlix()->model()->courseCart()->where([
                ['user_id', '=', $userId],
                ['course_id', '=', $course->ID],
            ])->first();
        }else{
            if (isset($_COOKIE['acadlix_cart_token'])) {
                $cart = acadlix()
                    ->model()
                    ->courseCart()
                    ->where('cart_token', sanitize_text_field(wp_unslash($_COOKIE['acadlix_cart_token'])))
                    ->where('course_id', $course->ID)
                    ->first();
            }
        }

        if ($check_registration_date['status']) {
            if ($course->isCourseFree()) {
                // Free course flow
                if ($is_course_purchased) {
                    $button = $go_to_course_button;
                } elseif ($cart) {
                    $button = $checkout_button;
                } else {
                    $button = $start_now_button;
                }
            } else {
                // Paid course flow
                if ($is_course_purchased) {
                    $button = $go_to_course_button;
                } elseif ($cart) {
                    $button = $checkout_button;
                } else {
                    $button = $buy_now_button;
                }
            }
        }
        return apply_filters('acadlix_all_course_single_course_buttons', $button, $course);
    }

    /**
     * Wishlist section
     */
    protected function render_course_wishlist($course)
    {
        if (!is_user_logged_in() || acadlix()->helper()->acadlix_get_option('acadlix_disable_wishlist') !== 'no') {
            return null;
        }

        $course_wishlist_count = acadlix()
            ->model()
            ->userActivityMeta()
            ->ofCourse()
            ->ofCourseWishlist()
            ->where([
                'type_id' => $course->ID,
                'user_id' => get_current_user_id(),
            ])
            ->count();

        return apply_filters('acadlix_all_course_single_course_wishlist', [
            'component' => 'div',
            'props' => [
                'class' => 'acadlix-course-wishlist'
            ],
            'children' => [
                [
                    'component' => 'div',
                    'props' => [
                        'class' => 'acadlix-course-page-icon-element acadlix-add-to-wishlist',
                        'id' => 'add-to-wishlist-' . esc_attr($course->ID),
                        'title' => esc_attr__('Add to Wishlist', 'acadlix'),
                        'data-id' => esc_attr($course->ID),
                        'style' => $course_wishlist_count == 0 ? 'display:flex;' : 'display:none;',
                    ],
                    'value' => '<i class="far fa-heart"></i><div class="acadlix-btn-loader" style="display:none;"></div>'
                ],
                [
                    'component' => 'div',
                    'props' => [
                        'class' => 'acadlix-course-page-icon-element acadlix-remove-from-wishlist',
                        'id' => 'remove-from-wishlist-' . esc_attr($course->ID),
                        'title' => esc_attr__('Remove From Wishlist', 'acadlix'),
                        'data-id' => esc_attr($course->ID),
                        'style' => $course_wishlist_count > 0 ? 'display:flex;' : 'display:none;',
                    ],
                    'value' => '<i class="fas fa-heart"></i><div class="acadlix-btn-loader" style="display:none;"></div>'
                ]
            ]
        ], $course);
    }

    public function render_search()
    {
        $search_ui = [
            'component' => 'section',
            'props' => ['class' => 'acadlix-card acadlix-my-8'],
            'children' => [
                [
                    'component' => 'div',
                    'props' => ['class' => 'acadlix-course-filter-bar-body acadlix-card-body'],
                    'children' => [
                        [
                            'component' => 'div',
                            'props' => ['class' => 'acadlix-h4'],
                            'value' => sprintf(
                                /* translators: %s: course count */
                                __('We found %s courses available for you', 'acadlix'),
                                '<span>' . esc_html($this->course_count) . '</span>'
                            )
                        ],
                        [
                            'component' => 'form',
                            'props' => ['method' => 'GET', 'class' => 'acadlix-d-flex'],
                            'children' => [
                                [
                                    'component' => 'input',
                                    'props' => [
                                        'type' => 'text',
                                        'name' => 'search',
                                        'value' => $this->search,
                                        'placeholder' => 'Search...'
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ]
        ];
        return apply_filters('acadlix_all_course_search_ui', $search_ui);
    }

    public function render_pagination()
    {
        global $wp;

        $total_pages = (int) ceil($this->course_count / $this->per_page);

        // Previous page URL
        $prev_url = add_query_arg(
            ['paged' => max(1, $this->page - 1), 'search' => $this->search],
            home_url($wp->request)
        );

        // Next page URL
        $next_url = add_query_arg(
            ['paged' => min($total_pages, $this->page + 1), 'search' => $this->search],
            home_url($wp->request)
        );

        // Page items
        $page_items = [];

        // Previous
        $page_items[] = [
            'component' => 'li',
            'props' => ['class' => 'acadlix-course-pagination-item'],
            'children' => [
                [
                    'component' => 'a',
                    'props' => [
                        'href' => $prev_url,
                        'class' => 'acadlix-course-pagination-link ' . (1 == $this->page ? 'acadlix-course-pagination-disabled' : ''),
                        'aria-label' => 'Previous',
                    ],
                    'children' => [
                        [
                            'component' => 'span',
                            'props' => [
                                'aria-hidden' => 'true',
                                'class' => 'acadlix-course-pagination-arrow-left acadlix-subtitle1'
                            ],
                            'value' => '&#8592;'
                        ]
                    ]
                ]
            ]
        ];

        // Numbered pages
        for ($i = 1; $i <= $total_pages; $i++) {
            $url = add_query_arg(
                ['paged' => $i, 'search' => $this->search],
                home_url($wp->request)
            );

            $page_items[] = [
                'component' => 'li',
                'props' => [
                    'class' => 'acadlix-course-pagination-item ' . ($i == $this->page ? 'acadlix-course-pagination-active' : '')
                ],
                'children' => [
                    [
                        'component' => 'a',
                        'props' => [
                            'href' => $url,
                            'class' => 'acadlix-course-pagination-link'
                        ],
                        'value' => esc_html($i)
                    ]
                ]
            ];
        }

        // Next
        $page_items[] = [
            'component' => 'li',
            'props' => ['class' => 'acadlix-course-pagination-item'],
            'children' => [
                [
                    'component' => 'a',
                    'props' => [
                        'href' => $next_url,
                        'class' => 'acadlix-course-pagination-link ' . ($this->page >= $total_pages ? 'acadlix-course-pagination-disabled' : ''),
                        'aria-label' => 'Next',
                    ],
                    'children' => [
                        [
                            'component' => 'span',
                            'props' => [
                                'aria-hidden' => 'true',
                                'class' => 'acadlix-course-pagination-arrow-right acadlix-subtitle1'
                            ],
                            'value' => '&#8594;'
                        ]
                    ]
                ]
            ]
        ];

        // Info text
        $start = (($this->page - 1) * $this->per_page) + 1;
        $end = min($this->course_count, $this->page * $this->per_page);

        $pagination_ui = [
            'component' => 'section',
            'props' => ['class' => 'acadlix-course-pagination-container'],
            'children' => [
                [
                    'component' => 'nav',
                    'props' => ['class' => 'acadlix-course-pagination-nav'],
                    'children' => [
                        [
                            'component' => 'ul',
                            'props' => ['class' => 'acadlix-course-pagination-list acadlix-box-shadow-2'],
                            'children' => $page_items
                        ]
                    ]
                ],
                [
                    'component' => 'div',
                    'props' => ['class' => 'acadlix-course-pagination-info acadlix-subtitle1'],
                    'value' => sprintf(
                        /* translators: %1$s: start, %2$s: end, %3$s: course count */
                        __('Showing %1$s-%2$s of %3$s results', 'acadlix'),
                        esc_html($start),
                        esc_html($end),
                        esc_html($this->course_count)
                    )
                ]
            ]
        ];

        // Render via helper
        return apply_filters('acadlix_all_course_pagination_ui', $pagination_ui);
    }

    public function render_footer()
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
