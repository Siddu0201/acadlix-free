<?php
namespace Yuvayana\Acadlix\Common\View;

defined('ABSPATH') || exit();

class SingleCourseView
{
	protected $checkout_url = '';
	protected $dashboard_url = '';
	protected $course = null;
	protected $cart = [];
	protected $is_course_purchased = false;
	protected $user_id = null;
	protected $enable_rating_and_reviews = false;
	protected $require_admin_approval_for_reviews = false;
	protected $review_pagination_count = 10;
	protected $disable_student_enrolled = false;
	protected $average_rating = 0;
	protected $total_rating = 0;
	protected $comments = [];
	protected $user_comment = [];
	protected $rating_breakdown = [];
	protected $type = 'course';

	public function __construct()
	{
		$this->setup_query();
	}

	protected function setup_query()
	{
		global $post;

		$with = ['sections'];

		$this->enable_rating_and_reviews = acadlix()->helper()->acadlix_get_option('acadlix_enable_rating_and_reviews') === 'yes';
		$this->require_admin_approval_for_reviews = acadlix()->helper()->acadlix_get_option('acadlix_require_admin_approval_for_reviews') === 'yes';
		$this->review_pagination_count = (int) acadlix()->helper()->acadlix_get_option('acadlix_review_pagination_count') ?: 10;
		$this->disable_student_enrolled = acadlix()->helper()->acadlix_get_option('acadlix_disable_student_enrolled') === 'yes';

		$this->checkout_url = get_permalink(acadlix()->helper()->acadlix_get_option('acadlix_checkout_page_id'));
		$this->dashboard_url = get_permalink(acadlix()->helper()->acadlix_get_option('acadlix_dashboard_page_id'));
		$this->course = acadlix()->model()->course()->ofCourse()->with($with)->find($post->ID);

		if (is_null($this->course)) {
			return;
		}
		if (is_user_logged_in()) {
			$this->user_id = get_current_user_id() ?? 0;
			$this->cart = acadlix()->model()->courseCart()->where([
				['user_id', '=', $this->user_id],
				['item_id', '=', $post->ID],
			])->first();
			$this->is_course_purchased = $this->course->isPurchasedBy($this->user_id);
		} else {
			if (isset($_COOKIE['acadlix_cart_token'])) {
				$this->cart = acadlix()
					->model()
					->courseCart()
					->where('cart_token', sanitize_text_field(wp_unslash($_COOKIE['acadlix_cart_token'])))
					->where('item_id', $post->ID)
					->first();
			}
		}

		$this->average_rating = $this->course->getAverageRating() ?? 0;
		$this->total_rating = $this->course->getTotalRatings() ?? 0;

		if ($this->enable_rating_and_reviews) {
			$this->comments = acadlix()
				->model()
				->courseReview()
				->ofCourseRating()
				->ofApproved()
				->where('comment_post_ID', $post->ID)
				->orderBy('comment_date', 'DESC')
				->skip(0)
				->take($this->review_pagination_count)
				->get();
			$this->rating_breakdown = $this->course->getRatingBreakdown();
			if (is_user_logged_in()) {
				$this->user_comment = acadlix()
					->model()
					->courseReview()
					->ofCourseRating()
					->where('comment_post_ID', $post->ID)
					->where('user_id', $this->user_id)
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

		$classes = ['acadlix-course-breadcrumb'];

		if ($desktop && !$mobile) {
			$classes[] = 'acadlix-course-breadcrumb-only-desktop';
		}

		if (!$desktop && $mobile) {
			$classes[] = 'acadlix-course-breadcrumb-only-mobile';
		}

		?>
		<?php
		$breadcrumb = [
			'component' => 'nav',
			'props' => [
				'class' => esc_attr(implode(' ', $classes))
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

		$classes = ['acadlix-course-featured-item'];

		if ($desktop && !$mobile) {
			$classes[] = 'acadlix-course-featured-item-only-desktop';
		}

		if (!$desktop && $mobile) {
			$classes[] = 'acadlix-course-featured-item-only-mobile';
		}
		?>
		<?php
		$img_component = [
			'component' => 'img',
			'props' => [
				'class' => esc_attr(implode(' ', $classes)),
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

	protected function acadlix_course_tags()
	{
		if (count($this->course->course_tags) == 0) {
			return [];
		}
		$tags = [];
		foreach ($this->course->course_tags as $tag) {
			$tags[] = sprintf(
				// translators: 1: tag link 2: tag name
				'<a href="%1$s" class="acadlix-course-tag-link">%2$s</a>',
				esc_url(get_term_link($tag->term_id, ACADLIX_COURSE_TAG_TAXONOMY)),
				esc_html($tag->term->name)
			);
		}
		return apply_filters('acadlix_single_course_tags', [
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
							'value' => count($this->course->course_tags) > 1 ? esc_html__('Tags:', 'acadlix') : esc_html__('Tag:', 'acadlix'),
						]
					]
				],
				[
					'component' => 'div',
					'props' => ['class' => 'acadlix-course-tags acadlix-body1'],
					'value' => implode(', ', $tags)
				]
			]
		], $this->course);
	}

	protected function acadlix_student_enrolled()
	{
		if ($this->disable_student_enrolled) {
			return null;
		}
		return apply_filters('acadlix_single_course_students_enrolled', [
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
		], $this->course);
	}

	protected function acadlix_basic_course_details(bool $desktop = true, bool $mobile = true)
	{
		if (!is_bool($desktop) || !is_bool($mobile)) {
			// error_log('The parameters must be boolean values.');
		}

		$duration = $this->course->rendered_metas['duration']['duration'] ?? 0;
		$duration_type = $this->course->rendered_metas['duration']['type'] ?? '';
		$difficulty_level = $this->course->rendered_metas['difficulty_level'] ?? '';
		$tax = $this->course->rendered_metas['tax'] ?? 0;
		$tax_percent = $this->course->rendered_metas['tax_percent'] ?? 0;

		$classes = ['acadlix-course-aside-details'];

		if ($desktop && !$mobile) {
			$classes[] = 'acadlix-course-aside-details-only-desktop';
		}

		if (!$desktop && $mobile) {
			$classes[] = 'acadlix-course-aside-details-only-mobile';
		}
		?>
		<?php
		$basic_course_details = [
			'component' => 'div',
			'props' => [
				'class' => 'acadlix-course-aside-details acadlix-subtitle2 ' . esc_attr(implode(' ', $classes))
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
				$this->acadlix_student_enrolled(),
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
									'value' => esc_html__('Tax:', 'acadlix'),
								]
							]
						],
						[
							'component' => 'div',
							'value' => esc_html($tax ? $tax_percent : 0) . '%',
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
		], $this->course, $type);
	}

	protected function acadlix_course_go_to_course_button($type = 'desktop')
	{
		return apply_filters('acadlix_single_course_go_to_course_button', [
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
		], $this->course, $type);
	}

	protected function acadlix_course_start_now_button($type = 'desktop')
	{
		return apply_filters('acadlix_single_course_start_now_button', [
			'component' => 'button',
			'props' => [
				'class' => 'acadlix-action-button acadlix-subtitle2 acadlix-start-now',
				'data-id' => esc_attr($this->course->ID),
				'data-type' => esc_attr($this->type),
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
				'data-type' => esc_attr($this->type),
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
							'component' => 'span',
							'props' => [
								'class' => 'acadlix-action-button-buy-now-text',
							],
							'value' => __('Buy Now', 'acadlix'),
						],
					],
				],
				[
					'component' => 'div',
					'props' => [
						'class' => 'acadlix-btn-loader',
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

	protected function acadlix_course_wishlist($type = 'desktop')
	{
		$wishlist = [];
		if (is_user_logged_in() && acadlix()->helper()->acadlix_get_option('acadlix_disable_wishlist') === 'no') {
			$course_wishlist_count = acadlix()
				->model()
				->userActivityMeta()
				->ofWishlist()
				->where([
					'type_id' => $this->course->ID,
					'user_id' => get_current_user_id(),
					'type' => $this->type,
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
							'class' => 'acadlix-course-page-icon-element acadlix-add-to-wishlist ' . ($course_wishlist_count == 0 ? '' : 'acadlix-hidden'),
							'id' => 'add-to-wishlist-' . esc_attr($this->course->ID),
							'title' => __('Add to Wishlist', 'acadlix'),
							'data-id' => esc_attr($this->course->ID),
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
							'id' => 'remove-from-wishlist-' . esc_attr($this->course->ID),
							'title' => __('Remove From Wishlist', 'acadlix'),
							'data-id' => esc_attr($this->course->ID),
							'data-type' => esc_attr($this->type),
						],
						'children' => [
							['component' => 'i', 'props' => ['class' => 'fas fa-heart']],
							['component' => 'div', 'props' => ['class' => 'acadlix-btn-loader']],
						],
					],
				]
			], $this->course, $course_wishlist_count, $type);
		}
		return $wishlist;
	}

	protected function acadlix_course_button($type = 'desktop')
	{
		$course = $this->course;
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
			if ($course->isCourseFree()) {
				if ($this->is_course_purchased) {
					$button = $go_to_course_button;
				} elseif ($this->cart) {
					$button = $checkout_button;
				} else {
					$button = $start_now_button;
				}
			} else {
				if ($this->is_course_purchased) {
					$button = $go_to_course_button;
				} elseif ($this->cart) {
					$button = $checkout_button;
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
	 * @param object $course The course object.
	 *
	 * @return array The HTML for the course action buttons.
	 */
	protected function acadlix_course_action_buttons($type = 'desktop'): array
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

	protected function course_header_rating()
	{
		if (!$this->enable_rating_and_reviews) {
			return [];
		}
		return apply_filters('acadlix_single_course_header_rating', [
			'component' => 'div',
			'props' => [
				'class' => 'acadlix-course-header-rating'
			],
			'children' => [
				[
					'component' => 'div',
					'props' => [
						'class' => 'acadlix-course-rating-stars'
					],
					'children' => acadlix()->helper()->course()->courseReviewStar($this->average_rating)
				],
				[
					'component' => 'div',
					'props' => ['class' => 'acadlix-course-rating-value acadlix-body1'],
					'value' => sprintf(
						/* translators: 1: average rating 2: total ratings */
						esc_html__('%1$.2f (%2$d ratings)', 'acadlix'),
						$this->average_rating,
						$this->total_rating
					)
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

	protected function course_header_categories()
	{
		$categories = [];
		foreach ($this->course->course_categories as $category) {
			$categories[] = sprintf(
				// translators: 1: category link 2: category name
				'<a href="%1$s" class="acadlix-course-category-link">%2$s</a>',
				esc_url(get_term_link($category->term_id, ACADLIX_COURSE_CATEGORY_TAXONOMY)),
				esc_html($category->term->name)
			);
		}
		return apply_filters('acadlix_single_course_header_categories', [
			'component' => 'div',
			'props' => ['class' => 'acadlix-course-header-categories'],
			'children' => [
				[
					'component' => 'div',
					'props' => ['class' => 'acadlix-course-header-categories-text acadlix-subtitle2'],
					'value' => count($this->course->course_categories) > 1 ? esc_html__('Categories', 'acadlix') . ':' : esc_html__('Category', 'acadlix') . ':'
				],
				[
					'component' => 'div',
					'props' => ['class' => 'acadlix-course-categories acadlix-body1'],
					'value' => implode(', ', $categories)
				]
			],
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
				$this->course_header_rating(),
				$this->course_header_author(),
				$this->course_header_categories(),
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
				$this->course_main_instructor(),
				// Reviews Section
				$this->course_main_reviews(),
			]
		], $this->course);
	}

	protected function course_main_navbar()
	{
		$review_list_item = [];
		if ($this->enable_rating_and_reviews) {
			$review_list_item[] = [
				'component' => 'li',
				'children' => [
					[
						'component' => 'a',
						'props' => [
							'href' => '#reviews',
							'class' => 'acadlix-subtitle1'
						],
						'value' => esc_html__('Reviews', 'acadlix')
					]
				]
			];
		}
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
						...$review_list_item
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
													'class' => 'fas fa-caret-right'
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
				'id' => 'acadlix-curriculum-react-preview'
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

	protected function course_main_reviews_heading()
	{
		return apply_filters('acadlix_single_course_main_reviews_heading', [
			'component' => 'h2',
			'props' => [
				'class' => 'acadlix-card-header'
			],
			'value' => esc_html__('Course Reviews', 'acadlix')
		], $this->course);
	}

	protected function course_main_single_review_breakdown(
		$star_number = 5,
	) {
		$rating_count = $this->rating_breakdown[$star_number];
		$percentage = 0;
		if ($this->total_rating > 0) {
			$percentage = ($rating_count / $this->total_rating) * 100;
		}
		return [
			'component' => 'div',
			'props' => [
				'class' => 'acadlix-course-review-breakdown-item'
			],
			'children' => [
				acadlix()->helper()->course()->courseSingleReviewStar("unfilled"), // star icon
				[
					'component' => 'div',
					'props' => [
						'class' => 'acadlix-review-star-label acadlix-body1'
					],
					'value' => esc_html($star_number)
				],
				[
					'component' => 'div',
					'props' => [
						'class' => 'acadlix-progress-bar acadlix-rating-progress-bar',
						'style' => '--acadlix-progress-value: ' . esc_html($percentage) . '%;'
					],
					'children' => [
						[
							'component' => 'span',
							'props' => [
								'class' => 'acadlix-progress-value',
							]
						]
					]
				],
				[
					'component' => 'div',
					'props' => [
						'class' => 'acadlix-review-star-count acadlix-body1'
					],
					'value' => esc_html($rating_count) . ' ' . esc_html__('Rating', 'acadlix')
				]
			]
		];
	}

	protected function course_main_reviews_summary()
	{
		return [
			'component' => 'div',
			'props' => [
				'class' => 'acadlix-course-reviews-summary'
			],
			'children' => [
				// Overall Rating
				[
					'component' => 'div',
					'props' => [
						'class' => 'acadlix-course-review-basic-summary'
					],
					'children' => [
						[
							'component' => 'div',
							'props' => [
								'class' => 'acadlix-rating-value'
							],
							'value' => esc_html($this->average_rating) // Placeholder value
						],
						[
							'component' => 'div',
							'props' => [
								'class' => 'acadlix-rating-stars'
							],
							'children' => acadlix()->helper()->course()->courseReviewStar($this->average_rating, 5) // Placeholder value
						],
						[
							'component' => 'div',
							'props' => [
								'class' => 'acadlix-rating-count acadlix-body2'
							],
							'value' => sprintf(
								// translators: %d: number of ratings
								esc_html__('Based on %d ratings', 'acadlix'),
								esc_html($this->total_rating)
							) // Placeholder value
						]
					]
				],
				// Rating Breakdown
				[
					'component' => 'div',
					'props' => [
						'class' => 'acadlix-course-review-breakdown'
					],
					'children' => [
						// Individual rating bars would go here
						$this->course_main_single_review_breakdown(5),
						$this->course_main_single_review_breakdown(4),
						$this->course_main_single_review_breakdown(3),
						$this->course_main_single_review_breakdown(2),
						$this->course_main_single_review_breakdown(1),
					]
				]
			]
		];
	}

	protected function course_main_single_review($comment)
	{
		return [
			'component' => 'div',
			'props' => [
				'class' => 'acadlix-course-single-review'
			],
			'children' => [
				[
					'component' => 'div',
					'props' => [
						'class' => 'acadlix-course-review-user-info'
					],
					'children' => [
						// User Avatar
						[
							'component' => 'img',
							'props' => [
								'src' => esc_url(get_avatar_url($comment->user_id, ['size' => 60])), // Placeholder user ID
								'alt' => esc_attr__('User Avatar', 'acadlix'),
								'class' => 'acadlix-course-review-user-avatar'
							]
						],
						// User Name and Date
						[
							'component' => 'div',
							'props' => [
								'class' => 'acadlix-course-review-user-details'
							],
							'children' => [
								[
									'component' => 'a',
									'props' => [
										'href' => esc_url(get_author_posts_url($comment->user_id)), // Placeholder user ID
										'class' => 'acadlix-course-review-user-name acadlix-body1'
									],
									'value' => esc_html($comment->comment_author) // Placeholder name
								],
								[
									'component' => 'div',
									'props' => [
										'class' => 'acadlix-course-review-date acadlix-subtitle2'
									],
									'value' => esc_html(human_time_diff(strtotime($comment->comment_date_gmt))) // Placeholder date
								]
							]
						],
						$comment->comment_approved == "pending" ? [
							'component' => 'div',
							'props' => [
								'class' => 'acadlix-course-review-pending acadlix-body2'
							],
							'value' => esc_html__('Pending', 'acadlix')
						] : null
					]
				],
				// Review Rating
				[
					'component' => 'div',
					'props' => [
						'class' => 'acadlix-course-review-rating'
					],
					'children' => [
						[
							'component' => 'div',
							'props' => [
								'class' => 'acadlix-single-course-review-stars'
							],
							'children' => acadlix()->helper()->course()->courseReviewStar($comment->rating ?? 0, 6) // Placeholder rating
						],
						[
							'component' => 'div',
							'props' => [
								'class' => 'acadlix-user-review acadlix-body1'
							],
							'value' => esc_html($comment->comment_content) // Placeholder review text
						]
					]
				],
			]
		];
	}

	public function course_main_reviews_list($comments = [])
	{
		$review_list = [];
		if (count($comments) === 0) {
			return null;
		}
		foreach ($comments as $comment) {
			$review_list[] = $this->course_main_single_review($comment);
		}

		acadlix()->helper()->acadlix_render_tree($review_list);
	}

	protected function course_main_selectable_ratings($selected_rating = 0)
	{
		$selectable_stars = [];
		for ($i = 1; $i <= 5; $i++) {
			$class = $i <= $selected_rating ? 'fas fa-star' : 'far fa-star';
			$selectable_stars[] = [
				'component' => 'i',
				'props' => [
					'class' => $class . ' acadlix-fs-5 acadlix-rating-star-icon',
					'data-rating-value' => esc_attr($i),
				]
			];
		}
		return $selectable_stars;
	}

	protected function course_main_review_form()
	{
		if (!$this->is_course_purchased) {
			return null;
		}
		return [
			'component' => 'div',
			'props' => [
				'id' => 'acadlix-review-form-container',
				'class' => 'acadlix-review-form-container acadlix-hidden',
			],
			'children' => [
				// Review form elements would go here
				[
					'component' => 'form',
					'props' => [
						'method' => 'post',
					],
					'children' => [
						// Form fields (e.g., rating input, review text area, submit button)
						[
							'component' => 'input',
							'props' => [
								'type' => 'hidden',
								'name' => 'acadlix_course_id',
								'value' => esc_attr($this->course->ID)
							],
						],
						[
							'component' => 'input',
							'props' => [
								'type' => 'hidden',
								'name' => 'acadlix_user_id',
								'value' => esc_attr($this->user_id)
							],
						],
						[
							'component' => 'div',
							'props' => [
								'class' => 'acadlix-ratings-selectable acadlix-mb-8',
								'acadlix-ratings-selectable' => true,
							],
							'children' => [
								[
									'component' => 'div',
									'props' => [
										'class' => 'acadlix-rating-stars'
									],
									'children' => $this->course_main_selectable_ratings(
										$this->user_comment ? esc_attr($this->user_comment->rating) : 0
									)
								],
								[
									'component' => 'input',
									'props' => [
										'type' => 'hidden',
										'name' => 'acadlix_review_rating',
										'id' => 'acadlix_review_rating',
										'value' => $this->user_comment ? esc_attr($this->user_comment->rating) : 0
									],
								]
							]
						],
						[
							'component' => 'textarea',
							'props' => [
								'name' => 'acadlix_review_text',
								'placeholder' => esc_attr__('Write your review here...', 'acadlix'),
								'class' => 'acadlix-rating-textarea',
								'autocompolete' => 'off',
								'rows' => '4',
							],
							'value' => $this->user_comment ? esc_html($this->user_comment->comment_content) : ''
						],
						[
							'component' => 'button',
							'props' => [
								'type' => 'submit',
								'class' => 'acadlix-submit-review-btn',
							],
							'children' => [
								[
									'component' => 'div',
									'props' => [
										'class' => 'acadlix-action-button-text',
									],
									'value' => esc_html__('Submit Review', 'acadlix')
								],
								[
									'component' => 'div',
									'props' => [
										'class' => 'acadlix-btn-loader',
									],
								],
							],
						]
					]
				]
			]
		];
	}

	protected function course_main_reviews()
	{
		if (!$this->enable_rating_and_reviews) {
			return null;
		}
		$current_page = 1;
		$total_pages = ceil($this->total_rating / $this->review_pagination_count);
		$view_pagination_button = $total_pages > $current_page ? true : false;

		return apply_filters('acadlix_single_course_main_reviews', [
			'component' => 'div',
			'props' => [
				'id' => 'reviews',
				'class' => 'acadlix-card acadlix-course-reviews acadlix-mb-16 acadlix-box-shadow-2'
			],
			'children' => [
				$this->course_main_reviews_heading(),
				[
					'component' => 'div',
					'props' => [
						'class' => 'acadlix-card-body'
					],
					'children' => [
						[
							'component' => 'div',
							'props' => [
								'class' => 'acadlix-mb-16'
							],
							'children' => [
								$this->course_main_reviews_summary(),
							]
						],
						// add divider
						[
							'component' => 'hr',
						],
						// add review list                        
						[
							'component' => 'div',
							'props' => [
								'id' => 'acadlix-course-reviews-list',
							],
							'children' => [
								!empty($this->user_comment) && $this->user_comment->comment_approved == "pending"
								? $this->course_main_single_review($this->user_comment)
								: null,
								[
									'component' => 'php',
									'value' => function () {
										ob_start();
										$this->course_main_reviews_list($this->comments);
										return ob_get_clean();
									}
								]
							]
						],
						// add pagination placeholder
						[
							'component' => 'div',
							'props' => [
								'class' => 'acadlix-course-reviews-pagination',
							],
							'children' => [
								[
									'component' => 'button',
									'props' => [
										'class' => 'acadlix-load-review-button ' . ($view_pagination_button ? '' : 'acadlix-hidden'),
										'type' => 'button',
										'id' => 'acadlix-load-review-button',
										'data-pagination-count' => esc_attr($this->review_pagination_count),
										'data-course-id' => esc_attr($this->course->ID),
										'data-current-page' => esc_attr($current_page),
										'data-total-pages' => esc_attr($total_pages),
										'data-skip-count' => esc_attr($current_page * $this->review_pagination_count),
										'data-take-count' => esc_attr(($current_page + 1) * $this->review_pagination_count),
									],
									'children' => [
										[
											'component' => 'div',
											'props' => [
												'class' => 'acadlix-action-button-text',
											],
											'value' => esc_html__('Load More Reviews', 'acadlix')
										],
										[
											'component' => 'div',
											'props' => [
												'class' => 'acadlix-btn-loader',
											],
										],
									],
								],
							]
						],
						// add/edit review button
						[
							'component' => 'button',
							'props' => [
								'class' => 'acadlix-add-edit-review-button ' . ($this->is_course_purchased ? '' : 'acadlix-hidden'),
								'type' => 'button',
								'id' => 'acadlix-add-edit-review-button',
							],
							'children' => [
								[
									'component' => 'i',
									'props' => [
										'class' => 'far fa-star acadlix-mr-4'
									]
								],
								[
									'component' => 'span',
									'props' => [],
									'value' => $this->user_comment ? esc_html__('Edit Review', 'acadlix') : esc_html__('Add Review', 'acadlix')
								]
							],
						],
						// Review form placeholder
						$this->course_main_review_form(),
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
