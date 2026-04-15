<?php

namespace Yuvayana\Acadlix\Common\View;

use Yuvayana\Acadlix\Common\Models\WpTerm;

defined('ABSPATH') || exit();

class AllCourseView
{
  protected $checkout_url = '';
  protected $dashboard_url = '';
  protected $search = '';
  protected $categories = [];
  protected $page = 1;
  protected $per_page = 10;
  protected $courses = [];
  protected $course_count = 0;
  protected $cart = [];
  protected $order_item = [];
  protected $enable_rating_and_reviews = false;
  protected $context = ACADLIX_COURSE_CPT;
  protected $term = null;
  protected $enable_course_filters = false;
  protected $type = 'course';

  public function __construct()
  {
    $this->context = apply_filters(
      'acadlix_course_page_context',
      ACADLIX_COURSE_CPT
    );

    if (
      in_array($this->context, [
        ACADLIX_COURSE_CATEGORY_TAXONOMY,
        ACADLIX_COURSE_TAG_TAXONOMY
      ])
    ) {
      $this->term = get_queried_object();
    }
    $this->checkout_url = get_permalink(acadlix()->helper()->acadlix_get_option('acadlix_checkout_page_id'));
    $this->dashboard_url = get_permalink(acadlix()->helper()->acadlix_get_option('acadlix_dashboard_page_id'));
    $this->search = isset($_GET['search']) ? sanitize_text_field($_GET['search']) : ''; // phpcs:ignore
    $this->page = max(1, (isset($_GET['page']) ? intval($_GET['page']) : 1));
    $this->per_page = acadlix()->helper()->acadlix_get_option('acadlix_no_of_courses_per_page');

    $request_taxonomy_categories = [];
    if (isset($_GET['taxonomy']) && is_array($_GET['taxonomy'])) { // phpcs:ignore
      $taxonomy = wp_unslash($_GET['taxonomy']); // phpcs:ignore
      if (is_array($taxonomy) && isset($taxonomy['course-category'])) {
        $request_taxonomy_categories = (array) $taxonomy['course-category'];
      }
    }

    if (!empty($request_taxonomy_categories)) {
      $this->categories = array_values(array_filter(array_map('intval', $request_taxonomy_categories)));
    } else {
      $this->categories = isset($_GET['categories']) ? array_values(array_filter(array_map('intval', (array) $_GET['categories']))) : []; // phpcs:ignore
    }

    $this->enable_rating_and_reviews = acadlix()->helper()->acadlix_get_option('acadlix_enable_rating_and_reviews') === 'yes';
    $this->enable_course_filters = acadlix()->helper()->acadlix_get_option('acadlix_enable_course_filters') === 'yes';

    if (is_user_logged_in()) {
      $userId = get_current_user_id();
      $this->cart = acadlix()->model()->courseCart()->where('user_id', $userId)->pluck('item_id')->toArray();
      $this->order_item = acadlix()->model()->orderItem()->with(['order'])->whereHas('order', function ($query) use ($userId) {
        $query->where('user_id', $userId)->where('status', 'success');
      })->pluck('item_id')->toArray();
    } else {
      if (isset($_COOKIE['acadlix_cart_token'])) {
        $this->cart = acadlix()->model()->courseCart()->where('cart_token', sanitize_text_field(wp_unslash($_COOKIE['acadlix_cart_token'])))->pluck('item_id')->toArray();
      }
    }

    $query = $this->setup_query(
      $this->search,
      $this->categories,
      $this->term->term_id ?? null,
      $this->context,
      $this->page,
      $this->per_page
    );
    $this->courses = $query['courses'];
    $this->course_count = $query['course_count'];
  }

  public function setup_query(
    $search = '',
    $categories = [],
    $term_id = null,
    $context = null,
    $page = 1,
    $per_page = 10
  ) {
    $query = acadlix()
      ->model()
      ->course()
      ->ofCourse()
      ->when(!empty($search), function ($query) use ($search) {
        $query->where('post_title', 'like', '%' . $search . '%');
      })
      ->where('post_status', 'publish')
      ->orderBy('ID', 'desc');

    if ($context === ACADLIX_COURSE_CPT) {
      $query->when(!empty($categories), function ($query) use ($categories) {
        $query->whereHas('course_categories', function ($q) use ($categories) {
          $q->whereIn('term_id', $categories);
        });
      });
    }

    if ($context === ACADLIX_COURSE_CATEGORY_TAXONOMY && $term_id) {
      $query->whereHas('course_categories', function ($q) use ($term_id) {
        $q->where('term_id', $term_id);
      });
    }

    if ($context === ACADLIX_COURSE_TAG_TAXONOMY && $term_id) {
      $query->whereHas('course_tags', function ($q) use ($term_id) {
        $q->where('term_id', $term_id);
      });
    }

    $course_count = $query->count();
    if ($course_count <= $per_page) {
      $page = 1;
    }

    $courses = $query
      ->skip(($page - 1) * $per_page)
      ->take($per_page)
      ->get();
    return [
      'courses' => $courses,
      'course_count' => $course_count,
    ];
    // $this->courses = apply_filters('acadlix_all_courses_list', $this->courses, $this->page, $this->search);
  }

  public function setPage($page)
  {
    $this->page = $page;
  }

  public function setCourseCount($count)
  {
    $this->course_count = $count;
  }

  protected function is_feature_enabled($feature)
  {
    $defaults = [
      'taxonomy_title' => [
        ACADLIX_COURSE_CPT => false,
        ACADLIX_COURSE_CATEGORY_TAXONOMY => true,
        ACADLIX_COURSE_TAG_TAXONOMY => true,
      ],
      'course_filters' => [
        ACADLIX_COURSE_CPT => $this->enable_course_filters,
        ACADLIX_COURSE_CATEGORY_TAXONOMY => false,
        ACADLIX_COURSE_TAG_TAXONOMY => false,
      ],
    ];

    $enabled = $defaults[$feature][$this->context] ?? false;

    /**
     * 🔥 EXTENSION POINT
     */
    return apply_filters(
      'acadlix_course_feature_enabled',
      $enabled,
      $feature,
      $this->context,
      $this
    );
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
    $enable_course_filter = $this->is_feature_enabled('course_filters');
    $all_course_page = [
      [
        'component' => 'main',
        'props' => [
          'id' => 'acadlix-all-course-page',
          'class' => 'acadlix-all-course-page',
          'data-context' => esc_attr($this->context),
          'data-term-id' => esc_attr($this->term ? $this->term->term_id : ''),
        ],
        'children' => [
          $this->render_taxonomy_title(),
          $this->render_search(),
          $this->course_listener(),
          [
            'component' => 'section',
            'props' => ['class' => 'acadlix-row'],
            'children' => [
              [
                'component' => 'div',
                'props' => ['class' => 'acadlix-col-sm-12 acadlix-col-lg-3' . ($enable_course_filter ? '' : ' acadlix-d-none')],
                'children' => [
                  $this->render_category_filter(),
                ]
              ],
              [
                'component' => 'div',
                'props' => ['class' => 'acadlix-col-sm-12 acadlix-col-lg-' . ($enable_course_filter ? '9' : '12') . ' acadlix-course-list-container'],
                'children' => [
                  [
                    'component' => 'php',
                    'value' => function () {
                      ob_start();
                      $this->render_all_courses($this->courses);
                      return ob_get_clean();
                    }
                  ]
                ]
              ],
            ],
          ],
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

  protected function render_category_filter()
  {
    if (!$this->is_feature_enabled('course_filters')) {
      return [];
    }

    $categories = acadlix()
      ->model()
      ->wpTermTaxonomy()
      ->ofCourseCategory()
      ->with('term')
      ->where('count', '>', 0)
      ->get();

    $single_category_children = [];
    foreach ($categories as $category) {
      $single_category_children[] = [
        'component' => 'div',
        'props' => [
          'class' => 'acadlix-single-category-filter'
        ],
        'children' => [
          [
            'component' => 'input',
            'props' => [
              'type' => 'checkbox',
              'name' => 'acadlix_course_category_filter',
              'value' => esc_attr($category->term_id),
              'id' => 'acadlix_course_category_filter_' . esc_attr($category->term_id),
              'class' => 'acadlix-category-filter-checkbox',
              'checked' => in_array($category->term_id, $this->categories) ? 'checked' : false,
            ]
          ],
          [
            'component' => 'label',
            'props' => [
              'for' => 'acadlix_course_category_filter_' . esc_attr($category->term_id),
              'class' => 'acadlix-category-filter-label acadlix-body2',
            ],
            'value' => esc_html($category->term->name) . ' (' . esc_html($category->count) . ')'
          ]
        ]
      ];
    }

    return apply_filters('acadlix_all_course_category_filter', [
      'component' => 'div',
      'props' => ['class' => 'acadlix-card acadlix-category-filter-card'],
      'children' => [
        [
          'component' => 'div',
          'props' => [
            'class' => 'acadlix-category-filter-header',
            'data-open' => true,
          ],
          'children' => [
            [
              'component' => 'h3',
              'props' => [
                'class' => 'acadlix-category-filter-header-title'
              ],
              'value' => esc_html__('Filter by Category', 'acadlix')
            ],
            [
              'component' => 'i',
              'props' => [
                'class' => 'fa fa-chevron-down acadlix-category-filter-toggle'
              ]
            ]
          ]
        ],
        [
          'component' => 'div',
          'props' => ['class' => 'acadlix-category-filter'],
          'children' => $single_category_children
        ]
      ]
    ]);
  }

  public function render_all_courses($courses)
  {
    $course_children = [];
    foreach ($courses as $course) {
      $course_children[] = $this->render_single_course($course);
    }
    $all_course = apply_filters('acadlix_all_courses_render_all_courses', [
      [
        'component' => 'div',
        'children' => [
          [
            'component' => 'div',
            'props' => ['class' => 'acadlix-row'],
            'children' => $course_children
          ],
          $this->render_pagination($courses),
        ]
      ],
    ], $courses);
    return acadlix()->helper()->acadlix_render_tree($all_course);
  }

  public function render_single_course($course)
  {
    $this->set_type($course);
    $single_course_ui = [
      'component' => 'div',
      'props' => [
        'class' => 'acadlix-col-lg-4 acadlix-col-md-6 acadlix-col-sm-12'
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
                $this->render_course_rating($course),
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
    return $single_course_ui;
  }

  public function set_type($course)
  {
    if ($course->post_type == ACADLIX_COURSE_CPT) {
      $this->type = 'course';
    }
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
   * Rating section
   */
  protected function render_course_rating($course)
  {
    if (!$this->enable_rating_and_reviews) {
      return [];
    }
    $average_rating = $course->getAverageRating() ?? 0;
    $total_rating = $course->getTotalRatings() ?? 0;
    return apply_filters('acadlix_all_course_single_course_rating', [
      'component' => 'div',
      'props' => [
        'class' => 'acadlix-course-rating'
      ],
      'children' => [
        [
          'component' => 'div',
          'props' => [
            'class' => 'acadlix-course-rating-stars'
          ],
          'children' => acadlix()->helper()->course()->courseReviewStar($average_rating)
        ],
        [
          'component' => 'div',
          'props' => ['class' => 'acadlix-course-rating-value acadlix-body1'],
          'value' => sprintf(
            /* translators: 1: average rating, 2: total ratings */
            esc_html__('%1$.2f (%2$d ratings)', 'acadlix'),
            $average_rating,
            $total_rating
          ),
        ]
      ]
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
    $enabled_sale_price = $course->rendered_metas['enable_sale_price'] ?? false;
    $sale_price = $course->rendered_metas['sale_price'] ?? 0;
    $price = $course->rendered_metas['price'] ?? 0;
    $price_html = acadlix()->helper()->course()->getCoursePrice(
      $enabled_sale_price
      ? $sale_price
      : $price
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
      'component' => 'button',
      'props' => [
        'data-link' => esc_url($this->checkout_url),
        'class' => 'acadlix-action-button acadlix-subtitle2 acadlix-go-to-checkout'
      ],
      'children' => [
        [
          'component' => 'div',
          'props' => [
            'class' => 'acadlix-action-button-text'
          ],
          'value' => esc_html__('Go to Checkout', 'acadlix')
        ]
      ]
    ], $course);
  }

  protected function render_go_to_course_button($course)
  {
    return apply_filters('acadlix_all_course_single_course_go_to_course_button', [
      'component' => 'button',
      'props' => [
        'data-link' => esc_url($this->dashboard_url),
        'class' => 'acadlix-action-button acadlix-subtitle2 acadlix-go-to-course'
      ],
      'children' => [
        [
          'component' => 'div',
          'props' => [
            'class' => 'acadlix-action-button-text'
          ],
          'value' => esc_html__('Go to Course', 'acadlix')
        ]
      ]
    ], $course);
  }

  protected function render_start_now_button($course)
  {
    return apply_filters('acadlix_all_course_single_course_start_now_button', [
      'component' => 'button',
      'props' => [
        'class' => 'acadlix-action-button acadlix-subtitle2 acadlix-start-now',
        'data-id' => esc_attr($course->ID),
        'data-type' => esc_attr($this->type),
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
        'data-id' => esc_attr($course->ID),
        'data-type' => esc_attr($this->type),
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
    if (is_user_logged_in()) {
      $userId = get_current_user_id();
      $is_course_purchased = $course->isPurchasedBy($userId);
      $cart = acadlix()->model()->courseCart()->where([
        ['user_id', '=', $userId],
        ['item_id', '=', $course->ID],
        ['type', '=', $this->type],
      ])->first();
    } else {
      if (isset($_COOKIE['acadlix_cart_token'])) {
        $cart = acadlix()
          ->model()
          ->courseCart()
          ->where('cart_token', sanitize_text_field(wp_unslash($_COOKIE['acadlix_cart_token'])))
          ->where('item_id', $course->ID)
          ->where('type', $this->type)
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
      ->ofWishlist()
      ->where([
        'type_id' => $course->ID,
        'user_id' => get_current_user_id(),
        'type' => $this->type,
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
            'class' => 'acadlix-course-page-icon-element acadlix-add-to-wishlist ' . ($course_wishlist_count == 0 ? '' : 'acadlix-hidden'),
            'id' => 'add-to-wishlist-' . esc_attr($course->ID),
            'title' => esc_attr__('Add to Wishlist', 'acadlix'),
            'data-id' => esc_attr($course->ID),
            'data-type' => esc_attr($this->type),
          ],
          'children' => [
            ['component' => 'i', 'props' => ['class' => 'far fa-heart']],
            ['component' => 'div', 'props' => ['class' => 'acadlix-btn-loader']],
          ],
        ],
        [
          'component' => 'div',
          'props' => [
            'class' => 'acadlix-course-page-icon-element acadlix-remove-from-wishlist ' . ($course_wishlist_count > 0 ? '' : 'acadlix-hidden'),
            'id' => 'remove-from-wishlist-' . esc_attr($course->ID),
            'title' => esc_attr__('Remove From Wishlist', 'acadlix'),
            'data-id' => esc_attr($course->ID),
            'data-type' => esc_attr($this->type),
          ],
          'children' => [
            ['component' => 'i', 'props' => ['class' => 'fas fa-heart']],
            ['component' => 'div', 'props' => ['class' => 'acadlix-btn-loader']],
          ],
        ]
      ]
    ], $course);
  }

  public function render_taxonomy_title()
  {
    if (!$this->is_feature_enabled('taxonomy_title')) {
      return [];
    }

    $title = '';
    if ($this->context === ACADLIX_COURSE_CATEGORY_TAXONOMY && $this->term) {
      $title = $this->term->name;
    }

    if ($this->context === ACADLIX_COURSE_TAG_TAXONOMY && $this->term) {
      $title = $this->term->name;
    }

    if (!empty($title)) {
      $title_ui = [
        'component' => 'h1',
        'props' => ['class' => 'acadlix-all-course-taxonomy-title acadlix-h3'],
        'value' => esc_html($title)
      ];
      return apply_filters('acadlix_all_course_taxonomy_title_ui', $title_ui);
    }
    return '';
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
                    'class' => 'acadlix-course-search-input',
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

  public function render_pagination($courses)
  {
    global $wp;

    $total_pages = (int) ceil($this->course_count / $this->per_page);

    // Previous page URL
    $base_url = home_url($wp->request) . '/';
    // $prev_url = add_query_arg(
    //   ['paged' => max(1, $this->page - 1), 'search' => $this->search],
    //   $base_url
    // );

    // // Next page URL
    // $next_url = add_query_arg(
    //   ['paged' => min($total_pages, $this->page + 1), 'search' => $this->search],
    //   $base_url
    // );

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
            'href' => "javascript:void(0)",
            'class' => 'acadlix-course-pagination-link acadlix-course-pagination-prev ' . (1 == $this->page ? 'acadlix-course-pagination-disabled' : ''),
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
      // $base_url = home_url($wp->request) . '/';
      // $url = add_query_arg(
      //   ['paged' => $i, 'search' => $this->search],
      //   $base_url
      // );

      $page_items[] = [
        'component' => 'li',
        'props' => [
          'class' => 'acadlix-course-pagination-item ' . ($i == $this->page ? 'acadlix-course-pagination-active' : ''),
          'id' => 'acadlix-course-pagination-page-' . esc_attr($i),
        ],
        'children' => [
          [
            'component' => 'a',
            'props' => [
              'href' => "javascript:void(0)",
              'class' => 'acadlix-course-pagination-link acadlix-course-pagination-page',
              'data-page' => esc_attr($i),
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
            'href' => "javascript:void(0)",
            'class' => 'acadlix-course-pagination-link acadlix-course-pagination-next ' . ($this->page >= $total_pages ? 'acadlix-course-pagination-disabled' : ''),
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
              'props' => [
                'class' => 'acadlix-course-pagination-list acadlix-box-shadow-2',
                'data-total-pages' => esc_attr($total_pages),
                'data-current-page' => esc_attr($this->page),
              ],
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
