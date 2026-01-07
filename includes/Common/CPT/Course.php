<?php

namespace Yuvayana\Acadlix\Common\CPT;

use WP_Post;

defined('ABSPATH') || exit();

final class Course extends CPT_Abstract
{
    protected static $_instance = null;

    /**
     * @var string
     */
    protected $_post_type = ACADLIX_COURSE_CPT;

    protected $_course_category_taxonomy = ACADLIX_COURSE_CATEGORY_TAXONOMY;
    protected $_course_tag_taxonomy = ACADLIX_COURSE_TAG_TAXONOMY;

    public function __construct()
    {
        parent::__construct();

        add_action('init', [$this, 'register_taxonomy']);
        add_action('admin_enqueue_scripts', [$this, 'acadlix_admin_enqueue_scripts']);

        add_filter('wp_insert_post_empty_content', [$this, 'update_title'], 10, 2);
        add_action('edit_form_after_title', [$this, 'add_nonce_field_to_edit_form']);
    }

    public function get_post_type()
    {
        return $this->_post_type;
    }

    public function get_course_category_taxonomy()
    {
        return $this->_course_category_taxonomy;
    }

    public function get_course_tag_taxonomy()
    {
        return $this->_course_tag_taxonomy;
    }

    public function args_register_post_type(): array
    {
        $labels = array(
            'name' => _x('Courses', 'Post Type General Name', 'acadlix'),
            'singular_name' => _x('Course', 'Post Type Singular Name', 'acadlix'),
            'menu_name' => __('Courses', 'acadlix'),
            'parent_item_colon' => __('Parent Item:', 'acadlix'),
            'all_items' => __('All Courses', 'acadlix'),
            'view_item' => __('View Course', 'acadlix'),
            'add_new_item' => __('Add a New Course', 'acadlix'),
            'add_new' => __('Add New', 'acadlix'),
            'edit_item' => __('Edit Course', 'acadlix'),
            'update_item' => __('Update Course', 'acadlix'),
            'search_items' => __('Search Courses', 'acadlix'),
            /* translators: %s is the URL to add a new course if no course found */
            'not_found' => sprintf(__('You have not had any courses yet. Click <a href="%s">Add new</a> to start', 'acadlix'), esc_url(admin_url('post-new.php?post_type=acadlix_course'))),
            'not_found_in_trash' => __('There was no course found in the trash', 'acadlix'),
        );
        $course_permalink = acadlix()->helper()->acadlix_get_option('acadlix_course_base');
        $show_in_rest = false; // show in rest disable for classic editor
        $args = array(
            'labels' => $labels,
            'description' => __('Course custom post type for acadlix', 'acadlix'),
            'public' => true,
            'query_var' => true,
            'publicly_queryable' => true,
            'show_ui' => true,
            'has_archive' => true,
            'capability_type' => 'acadlix_course',
            'map_meta_cap' => true,
            'show_in_menu' => false,
            'show_in_admin_bar' => true,
            'show_in_nav_menus' => true,
            'show_in_rest' => $show_in_rest,
            'taxonomies' => array($this->get_course_category_taxonomy(), $this->get_course_tag_taxonomy()),
            'supports' => array('title', 'editor', 'thumbnail', 'revisions', 'excerpt'),
            'hierarchical' => false,
            'rewrite' => !empty($course_permalink) ? array(
                'slug' => untrailingslashit($course_permalink),
                'with_front' => false,
            ) : false,
            'capabilities' => array(
                'edit_post' => 'edit_acadlix_course',
                'read_post' => 'read_acadlix_course',
                'delete_post' => 'delete_acadlix_course',
                'edit_posts' => 'edit_acadlix_courses',
                'edit_others_posts' => 'edit_others_acadlix_courses',
                'publish_posts' => 'publish_acadlix_courses',
                'read_private_posts' => 'read_private_acadlix_courses',
                'delete_posts' => 'delete_acadlix_courses',
                'delete_private_posts' => 'delete_private_acadlix_courses',
                'delete_published_posts' => 'delete_published_acadlix_courses',
                'delete_others_posts' => 'delete_others_acadlix_courses',
                'edit_private_posts' => 'edit_private_acadlix_courses',
                'edit_published_posts' => 'edit_published_acadlix_courses',
            ),
        );

        return $args;
    }

    public function register_taxonomy()
    {
        $course_category_permalink = acadlix()->helper()->acadlix_get_option("acadlix_course_category_base");
        $course_tag_permalink = acadlix()->helper()->acadlix_get_option("acadlix_course_tag_base");
        register_taxonomy(
            $this->get_course_category_taxonomy(),
            array($this->get_post_type()),
            array(
                'label' => __('Course Categories', "acadlix"),
                'labels' => array(
                    'name' => __('Course Categories', "acadlix"),
                    'menu_name' => __('Course Category', "acadlix"),
                    'singular_name' => __('Category', "acadlix"),
                    'add_new_item' => __('Add A New Course Category', "acadlix"),
                    'all_items' => __('All Categories', "acadlix"),
                ),
                'query_var' => true,
                'public' => true,
                'hierarchical' => true,
                'show_ui' => true,
                'show_in_menu' => false,
                'show_admin_column' => true,
                'show_in_admin_bar' => true,
                'show_in_nav_menus' => true,
                'show_in_rest' => true,
                'rewrite' => array(
                    'slug' => $course_category_permalink,
                    'hierarchical' => true,
                    'with_front' => false,
                ),
                'default_term' => array(
                    'name' => 'Uncategorized',
                    'slug' => sanitize_title('Uncategorized'),
                ),
                'capabilities' => array(
                    'manage_terms' => 'acadlix_manage_course_categories', // Edit in admin
                    'edit_terms' => 'acadlix_edit_course_categories',   // Assign/edit
                    'delete_terms' => 'acadlix_delete_course_categories', // Delete
                    'assign_terms' => 'acadlix_assign_course_categories', // Assign to posts
                ),
            )
        );

        register_taxonomy(
            $this->get_course_tag_taxonomy(),
            array($this->get_post_type()),
            array(
                'labels' => array(
                    'name' => __('Course Tags', 'acadlix'),
                    'singular_name' => __('Tag', 'acadlix'),
                    'search_items' => __('Search Course Tags', 'acadlix'),
                    'popular_items' => __('Popular Course Tags', 'acadlix'),
                    'all_items' => __('All Course Tags', 'acadlix'),
                    'parent_item' => null,
                    'parent_item_colon' => null,
                    'edit_item' => __('Edit Course Tag', 'acadlix'),
                    'update_item' => __('Update Course Tag', 'acadlix'),
                    'add_new_item' => __('Add A New Course Tag', 'acadlix'),
                    'new_item_name' => __('New Course Tag Name', 'acadlix'),
                    'separate_items_with_commas' => __('Separate tags with commas', 'acadlix'),
                    'add_or_remove_items' => __('Add or remove tags', 'acadlix'),
                    'choose_from_most_used' => __('Choose from the most used tags', 'acadlix'),
                    'menu_name' => __('Course Tags', 'acadlix'),
                ),
                'public' => true,
                'hierarchical' => false,
                'show_ui' => true,
                'show_in_menu' => false,
                'update_count_callback' => '_update_post_term_count',
                'query_var' => true,
                'show_in_rest' => true,
                'rewrite' => array(
                    'slug' => $course_tag_permalink,
                    'with_front' => false,
                ),
                'capabilities' => array(
                    'manage_terms' => 'acadlix_manage_course_tag', // Edit in admin
                    'edit_terms' => 'acadlix_edit_course_tag',   // Assign/edit
                    'delete_terms' => 'acadlix_delete_course_tag', // Delete
                    'assign_terms' => 'acadlix_assign_course_tag', // Assign to posts
                ),
            )
        );
    }

    public function save_post(int $postId = 0, WP_Post $post = null, bool $isUpdate = false): void
    {
        if ($post->post_type !== $this->get_post_type()) {
            return;
        }

        if (!empty($post->post_title) && $postId) {
            acadlix()->model()->orderItem()->where("course_id", $postId)->update(["course_title" => $post->post_title]);
        }
    }

    public function sortable_columns($columns)
    {
        $columns['author'] = 'author';
        $columns['price'] = 'price';
        return $columns;
    }

    public function columns_head($columns)
    {
        $new_order['cb'] = $columns['cb'];
        $new_order['title'] = $columns['title'];
        $new_order['author'] = esc_html__('Author', "acadlix");
        $new_order['taxonomy-' . $this->get_course_category_taxonomy()] = esc_html__('Categories', "acadlix");
        $new_order['taxonomy-' . $this->get_course_tag_taxonomy()] = esc_html__('Tags', "acadlix");
        $new_order['students'] = esc_html__('Students', "acadlix");
        $new_order['price'] = esc_html__('Price', "acadlix");
        // $new_order['review'] = esc_html__('Review', "acadlix");
        $new_order['date'] = $columns['date'];
        return $new_order;
    }

    public function custom_column_content($column, $post_id = 0)
    {
        $course = acadlix()->model()->course()->find($post_id);
        $enable_sale_price = $course->rendered_metas['enable_sale_price'] ?? false;
        $sale_price = $course->rendered_metas['sale_price'] ?? 0;
        $price = $course->rendered_metas['price'] ?? 0;
        $final_price = $enable_sale_price
            ? ($sale_price == 0 ? "Free" : acadlix()->helper()->course()->getCoursePrice($sale_price) . " <del>" . acadlix()->helper()->course()->getCoursePrice($price) . "</del>")
            : ($price == 0 ? "Free" : acadlix()->helper()->course()->getCoursePrice($price));
        $order_items = acadlix()->model()->orderItem()->with(["order"])
            ->where("course_id", $post_id)
            ->whereHas("order", function ($query) {
                $query->where("status", "success");
            })->count();

        switch ($column) {
            case 'students':
                echo esc_html($order_items);
                break;
            case 'price':
                echo wp_kses($final_price, array('del' => array()));
                break;
            // case 'review':
            //     echo 0;
            //     break;
        }
    }

    public function render_meta_box()
    {

        // Course Builder
        add_meta_box(
            'acadlix-course-content',          // Unique ID
            esc_html__('Course Builder', "acadlix"),      // Box title
            array($this, 'admin_course_editor'),        // Content callback
            $this->_post_type,          // Post type
            'normal',                    // Context (normal, side, advanced)
            'high'                  // Priority
        );
        // Course Setting
        add_meta_box(
            'acadlix-course-settings',          // Unique ID
            esc_html__('Course Settings', "acadlix"),      // Box title
            array($this, 'admin_course_settings'),        // Content callback
            $this->_post_type,          // Post type
            'normal',                    // Context (normal, side, advanced)
            'high'                  // Priority
        );
    }

    public function acadlix_admin_enqueue_scripts()
    {
        global $post;

        if (!$post || $post->post_type !== $this->get_post_type()) {
            return;
        }

        wp_enqueue_script('acadlix-admin-course-editor-js');
    }

    public function admin_course_editor($post)
    {
        $args = array(
            'role__in' => array('Administrator', 'Author'), // Specify roles
            'orderby' => 'user_nicename',
            'order' => 'ASC'
        );

        $users = get_users($args);
        $course = acadlix()->model()->course()->with('sections')->find($post->ID);
        wp_localize_script(
            'acadlix-admin-course-editor-js',
            'acadlixCourseList',
            [
                'user_id' => get_current_user_id(),
                'course' => $course,
                'users' => $users,
            ]
        );
        echo '<div id="acadlix-admin-course-editor">Loading...</div>';
    }

    public function admin_course_settings($post)
    {
        echo '<div id="acadlix-admin-course-settings">Loading...</div>';
    }

    public function add_nonce_field_to_edit_form($post)
    {
        if ($post->post_type !== $this->get_post_type())
            return;
        echo '<div id="acadlix-admin-course-ai-content" style="padding-bottom: 4px;">
                </div>';
        wp_nonce_field('acadlix_course_action', 'acadlix_course_field'); // Creates a nonce
    }

    public function update_title($maybe_empty, $post_acc)
    {
        if (!isset($_POST['acadlix_course_field']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['acadlix_course_field'])), 'acadlix_course_action')) {
            return $maybe_empty; // If nonce verification fails, do nothing
        }

        $action = isset($_POST['action']) ? sanitize_text_field(wp_unslash($_POST['action'])) : '';
        if ($action === 'editpost' || $action === 'inline-save') {
            if ($post_acc['post_type'] === $this->_post_type) {
                if ($maybe_empty && empty($post_acc['post_title'])) {
                    $post_title = __('Draft Course', "acadlix");
                    wp_update_post(array(
                        'ID' => $post_acc['ID'],
                        'post_title' => $post_title,
                        'post_status' => $post_acc['post_status'],
                        'post_author' => $post_acc['post_author'],
                    ));
                }
            }
        }
        return $maybe_empty;
    }

    public function before_delete(int $post_id)
    {
        global $post_type;

        if ($post_type !== $this->_post_type) {
            return;
        }
        $course = acadlix()->model()->course()->find($post_id);
        if ($course) {
            acadlix()->model()->course()->deleteCourse($post_id);
        }
    }

    public static function instance()
    {
        if (!self::$_instance) {
            self::$_instance = new self();
        }

        return self::$_instance;
    }
}