<?php

namespace Yuvayana\Acadlix\Common\Admin;

use WP_User;

defined('ABSPATH') || exit;

class Core
{
    private static $_instance = null;
    public function __construct()
    {
        add_action('wp_login', [$this, 'acadlix_sync_data_on_login'], 10, 2);
        add_filter('use_block_editor_for_post_type', array($this, 'acadlix_gutenberg_disable_cpt'), 10, 2);

        add_action('init', [$this, 'acadlix_flush_rewrite_rules']);

        add_filter('plugin_action_links_' . ACADLIX_PLUGIN_BASENAME, [$this, 'acadlix_plugin_action_links']);

        add_action('admin_bar_menu', [$this, 'add_toolbar_menu'], 100);
    }

    public function acadlix_sync_data_on_login($user_login, WP_User $user)
    {
        // Sync user cart
        $cookie_name = 'acadlix_cart_token'; // Replace with your actual cookie name

        // Check if the cookie exists
        if (isset($_COOKIE[$cookie_name])) {
            $cookie = sanitize_text_field(wp_unslash($_COOKIE[$cookie_name]));
            $carts = acadlix()->model()->courseCart()->where('cart_token', $cookie)->get();
            if ($carts->count() > 0) {
                foreach ($carts as $cart) {
                    if (acadlix()->model()->courseCart()->where("course_id", $cart->course_id)->where('user_id', $user->ID)->first()) {
                        $cart->delete();
                    } else {
                        $cart->update([
                            'cart_token' => null,
                            'token_expiry' => 0,
                            'user_id' => $user->ID
                        ]);
                    }
                }
            }
            // Unset the cookie by setting its expiration time to a past time
            setcookie($cookie_name, '', time() - 3600, "/");

            // Optionally, unset it from the $_COOKIE superglobal to ensure it's gone during this request
            if (array_key_exists($cookie_name, $_COOKIE)) {
                unset($cookie);
            }
        }

        // Sync user quiz data
        $user_cookie_name = 'acadlix_user_token';
        if (isset($_COOKIE[$user_cookie_name])) {
            $cookie = sanitize_text_field(wp_unslash($_COOKIE[$user_cookie_name]));
            $userActivityMetas = acadlix()->model()->userActivityMeta()->ofQuiz()
                ->ofQuizAttempt()
                ->where('user_token', $cookie)
                ->first();
            if ($userActivityMetas) {
                $userQuiz = acadlix()->model()->userActivityMeta()->ofQuiz()
                    ->ofQuizAttempt()
                    ->where('type_id', $userActivityMetas->type_id)
                    ->where('user_id', $user->ID)
                    ->first();
                if ($userQuiz) {
                    $userQuiz->update([
                        'meta_value' => $userQuiz->meta_value + $userActivityMetas->meta_value // phpcs:ignore
                    ]);
                    $userActivityMetas->delete();
                } else {
                    $userActivityMetas->update([
                        'user_token' => null,
                        'user_id' => $user->ID
                    ]);
                }
            }

            $statisticRefs = acadlix()->model()->statisticRef()->where('user_token', $cookie)->get();
            if ($statisticRefs->count() > 0) {
                foreach ($statisticRefs as $statisticRef) {
                    $statisticRef->update([
                        'user_token' => null,
                        'user_id' => $user->ID
                    ]);
                }
            }

            $toplists = acadlix()->model()->toplist()->where('user_token', $cookie)->get();
            if ($toplists->count() > 0) {
                foreach ($toplists as $toplist) {
                    $toplist->update([
                        'user_token' => null,
                        'user_id' => $user->ID,
                        'name' => $user->display_name,
                        'email' => $user->user_email
                    ]);
                }
            }

            // Unset the cookie by setting its expiration time to a past time
            setcookie($user_cookie_name, '', time() - 3600, "/");

            // Optionally, unset it from the $_COOKIE superglobal to ensure it's gone during this request
            if (array_key_exists($user_cookie_name, $_COOKIE)) {
                unset($cookie);
            }
        }
    }

    public function acadlix_gutenberg_disable_cpt($use_block_editor, $post_type)
    {
        if ($post_type === ACADLIX_COURSE_CPT) {
            $use_block_editor = false;
        }
        return $use_block_editor;
    }

    public function acadlix_delete_post_type_data()
    {
        global $wpdb;
        $post_types = [
            ACADLIX_COURSE_CPT,
            ACADLIX_QUIZ_CPT,
            ACADLIX_LESSON_CPT,
        ];
        foreach ($post_types as $post_type) {
            // Get all post IDs of this post type
            $post_ids = $wpdb->get_col($wpdb->prepare("SELECT ID FROM {$wpdb->posts} WHERE post_type = %s", $post_type)); // phpcs:ignore

            if (!empty($post_ids)) {
                foreach ($post_ids as $post_id) {
                    switch ($post_type) {
                        case ACADLIX_COURSE_CPT:
                            acadlix()->model()->course()->deleteCourse($post_id);
                            wp_delete_post($post_id, true);
                            break;
                        case ACADLIX_QUIZ_CPT:
                            acadlix()->model()->quiz()->deleteQuiz($post_id);
                            break;
                        case ACADLIX_LESSON_CPT:
                            acadlix()->model()->lesson()->deleteLesson($post_id);
                            break;
                        default:
                            break;
                    }
                }
            }

            unregister_post_type($post_type);
        }

        $this->delete_taxonomy();
    }

    protected function delete_taxonomy()
    {
        $taxonomies = [
            ACADLIX_COURSE_CATEGORY_TAXONOMY,
            ACADLIX_COURSE_TAG_TAXONOMY,
            ACADLIX_QUIZ_CATEGORY_TAXONOMY,
            ACADLIX_QUIZ_LANGUAGE_TAXONOMY
        ];
        foreach ($taxonomies as $taxonomy) {
            $terms = get_terms([
                'taxonomy' => $taxonomy,
                'hide_empty' => false,
            ]);

            if (!is_wp_error($terms) && !empty($terms)) {
                foreach ($terms as $term) {
                    wp_delete_term($term->term_id, $taxonomy);
                }
            }
            unregister_taxonomy($taxonomy);
        }
    }

    public function acadlix_flush_rewrite_rules()
    {
        if (acadlix()->helper()->acadlix_get_option('acadlix_flush_rewrite')) {
            flush_rewrite_rules();
            acadlix()->helper()->acadlix_delete_option('acadlix_flush_rewrite'); // prevent repeated flushing
        }
    }

    public function acadlix_plugin_action_links($links)
    {
        $setting_link = sprintf('<a href="%s">%s</a>', admin_url('admin.php?page=acadlix_setting'), __('Settings', "acadlix"));
        array_unshift($links, $setting_link);

        if (!acadlix()->pro) {
            $links['go_pro'] = sprintf('<a href="%s" target="_blank" style="color: #00a3a3; font-weight: bold;">%s</a>', ACADLIX_MARKETPLACE_URL . 'pricing', __('Get Acadlix Pro', "acadlix"));
        }
        return $links;
    }

    public function add_toolbar_menu($admin_bar)
    {
        $admin_bar->add_menu([
            'id' => 'acadlix-menu',
            'title' => 'Acadlix',
            'href' => admin_url('admin.php?page=acadlix'),
        ]);

        $admin_bar->add_menu([
            'id' => 'acadlix-courses',
            'parent' => 'acadlix-menu',
            'title' => 'Create Courses',
            'href' => admin_url('post-new.php?post_type=acadlix_course'),
        ]);
        $admin_bar->add_menu([
            'id' => 'acadlix-lessons',
            'parent' => 'acadlix-menu',
            'title' => 'Create Lessons',
            'href' => admin_url('admin.php?page=acadlix_lesson#/create'),
        ]);
        $admin_bar->add_menu([
            'id' => 'acadlix-quizzes',
            'parent' => 'acadlix-menu',
            'title' => 'Create Quizzes',
            'href' => admin_url('admin.php?page=acadlix_quiz#/create'),
        ]);
        $admin_bar->add_menu([
            'id' => 'acadlix-settings',
            'parent' => 'acadlix-menu',
            'title' => 'Settings',
            'href' => admin_url('admin.php?page=acadlix_setting'),
        ]);
    }

    public static function instance()
    {
        if (is_null(self::$_instance)) {
            self::$_instance = new self();
        }

        return self::$_instance;
    }
}