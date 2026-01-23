<?php

namespace Yuvayana\Acadlix\Common\View;

defined('ABSPATH') || exit();

class ThankyouView
{
    protected $status;
    protected $courses_url;
    protected $dashboard_url;
    protected $token;
    protected $is_payment_offline = false;
    protected $is_cancelled = false;
    protected $order_id = 0;
    protected $nonce = '';

    public function __construct()
    {
        $this->nonce = isset($_GET['nonce']) ? sanitize_text_field(wp_unslash($_GET['nonce'])) : '';

        if (!wp_verify_nonce($this->nonce, 'acadlix_payment_nonce')) {
            $this->status = 'failed';
            return;
        }

        $this->status = 'pending';
        $this->courses_url = get_post_type_archive_link(ACADLIX_COURSE_CPT);
        $this->dashboard_url = get_permalink(acadlix()->helper()->acadlix_get_option('acadlix_dashboard_page_id'));
        $this->token = isset($_GET['token']) ? sanitize_text_field(wp_unslash($_GET['token'])) : '';
        $this->is_payment_offline = isset($_GET['offline']) ? true : false; 
        $this->is_cancelled = isset($_GET['cancelled']) && !empty($_GET['cancelled']) ? true : false;
        $this->order_id = isset($_GET['order_id']) ? intval($_GET['order_id']) : 0;
        $this->setup_query();
    }

    protected function setup_query()
    {
        if ($this->token) {
            $order_meta = acadlix()->model()->orderMeta()->where('meta_value', $this->token)->first();
            if ($order_meta) {
                $order = acadlix()->model()->order()->find($order_meta->order_id);
                $payment_method = $order->getMetaValue('payment_method');

                if ($order) {
                    try {
                        if ($this->is_cancelled && $order->status != 'failed') {
                            acadlix()
                                        ->payments()
                                ->{$payment_method}()
                                    ->failedOrder($order, 'Payment Cancelled');
                            $this->status = $order->status;
                        } else {
                            if ($order->status == 'pending') {
                                // acadlix()
                                //             ->payments()
                                //     ->{$payment_method}()
                                //         ->verifyOrder($this->token);
                                $order = acadlix()
                                            ->payments()
                                    ->{$payment_method}()
                                        ->getOrder($this->token);
                            }
                            $this->status = $order->status ?? 'pending';
                        }
                    } catch (\Exception $e) {
                        // error_log($e->getMessage());
                        $this->status = 'failed';
                    }
                }
            }
        }else{
            if ($this->order_id) {
                $order = acadlix()->model()->order()->find($this->order_id);
                if ($order) {
                    $this->status = $order->status;
                }
            }
        }
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
        $content = apply_filters('acadlix_thankyou_content', [
            [
                'component' => 'div',
                'props' => [
                    'class' => 'acadlix-thankyou-content-wrapper',
                    'style' => 'width: 100%;',
                ],
                'children' => [
                    $this->render_status(),
                    [
                        'component' => 'php',
                        'value' => function () {
                            return apply_filters('the_content', get_the_content());
                        }
                    ]
                ]
            ]
        ], $this->status);

        acadlix()->helper()->acadlix_render_tree($content);
    }

    protected function render_status()
    {
        switch ($this->status) {
            case 'success':
                return $this->render_order_success();
            case 'failed':
                return $this->render_order_failed();
            case 'pending':
                return $this->render_order_pending();
        }
    }

    protected function render_order_success()
    {
        return apply_filters('acadlix_thankyou_success', [
            'component' => 'div',
            'props' => [
                'class' => 'acadlix-thankyou-container'
            ],
            'children' => [
                [
                    'component' => 'img',
                    'props' => [
                        'src' => esc_url(ACADLIX_ASSETS_IMAGE_URL . 'success-icon.svg'),
                        'alt' => esc_attr__('Payment Success', 'acadlix'),
                        'class' => 'acadlix-thankyou-img',
                    ],
                ],
                [
                    'component' => 'h2',
                    'props' => [
                        // 'class' => 'acadlix-thankyou-title',
                    ],
                    'value' => esc_html__('Payment Success', 'acadlix'),
                ],
                [
                    'component' => 'div',
                    'props' => [
                        'class' => 'acadlix-thankyou-text',
                    ],
                    'value' => esc_html__('Thank you! Your payment was completed successfully.', 'acadlix'),
                ],
                [
                    'component' => 'div',
                    'props' => [
                        'class' => 'acadlix-thankyou-text',
                    ],
                    'value' => esc_html__('You can now access your purchased course or content.', 'acadlix'),
                ],
                [
                    'component' => 'a',
                    'props' => [
                        'href' => esc_url($this->dashboard_url),
                        'class' => 'acadlix-thankyou-btn',
                    ],
                    'value' => esc_html__('Go to Dashboard', 'acadlix'),
                ],
            ]
        ]);
    }

    protected function render_order_failed()
    {
        return apply_filters('acadlix_thankyou_failed', [
            'component' => 'div',
            'props' => [
                'class' => 'acadlix-thankyou-container'
            ],
            'children' => [
                [
                    'component' => 'img',
                    'props' => [
                        'src' => esc_url(ACADLIX_ASSETS_IMAGE_URL . 'failed-icon.svg'),
                        'alt' => esc_attr__('Payment Failed', 'acadlix'),
                        'class' => 'acadlix-thankyou-img',
                    ],
                ],
                [
                    'component' => 'h2',
                    'props' => [
                        // 'class' => 'acadlix-thankyou-title',
                    ],
                    'value' => esc_html__('Payment Failed', 'acadlix'),
                ],
                [
                    'component' => 'div',
                    'props' => [
                        'class' => 'acadlix-thankyou-text',
                    ],
                    'value' => esc_html__('Sorry, your payment could not be completed.', 'acadlix'),
                ],
                [
                    'component' => 'div',
                    'props' => [
                        'class' => 'acadlix-thankyou-text',
                    ],
                    'value' => esc_html__('Payment Failed. If any amount has been deducted, please contact the administrator for assistance. You may also try the payment again.', 'acadlix'),
                ],
                [
                    'component' => 'a',
                    'props' => [
                        'href' => esc_url($this->courses_url),
                        'class' => 'acadlix-thankyou-btn',
                    ],
                    'value' => esc_html__('Go to Courses', 'acadlix'),
                ],
            ]
        ]);
    }

    protected function render_order_pending()
    {
        return apply_filters('acadlix_thankyou_pending', [
            'component' => 'div',
            'props' => [
                'class' => 'acadlix-thankyou-container'
            ],
            'children' => [
                [
                    'component' => 'img',
                    'props' => [
                        'src' => esc_url(ACADLIX_ASSETS_IMAGE_URL . 'pending-icon.svg'),
                        'alt' => esc_attr__('Payment Pending', 'acadlix'),
                        'class' => 'acadlix-thankyou-img',
                    ],
                ],
                [
                    'component' => 'h2',
                    'props' => [
                        // 'class' => 'acadlix-thankyou-title',
                    ],
                    'value' => $this->is_payment_offline
                        ? esc_html__('Thanks for your order!', 'acadlix')
                        : esc_html__('Payment Pending', 'acadlix'),
                ],
                [
                    'component' => 'div',
                    'props' => [
                        'class' => 'acadlix-thankyou-text',
                    ],
                    'value' => $this->is_payment_offline
                        ? esc_html__('Your payment information has been submitted successfully. We’ll review it and activate your access as soon as the payment is verified.', 'acadlix')
                        : esc_html__('Your payment is currently pending. In some cases, it may take a few minutes for the status to update. If any amount has been deducted, it will be confirmed once processing is complete.', 'acadlix'),
                ],
                [
                    'component' => 'a',
                    'props' => [
                        'href' => esc_url($this->courses_url),
                        'class' => 'acadlix-thankyou-btn',
                    ],
                    'value' => esc_html__('Go to Courses', 'acadlix'),
                ],
            ]
        ]);
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
