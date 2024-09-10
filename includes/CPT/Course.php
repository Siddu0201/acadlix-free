<?php

namespace Yuvayana\Acadlix\CPT;
use Yuvayana\Acadlix\CPT\Acadlix_Abstract;

defined('ABSPATH') || exit();

final class Course extends Acadlix_Abstract
{
    protected static $_instance = null;

    /**
     * @var string
     */
    protected $_post_type = ACADLIX_COURSE_CPT;

    public function __construct()
    {
        parent::__construct();

        add_action( 'init', [$this, 'register_taxonomy']);
    }

    public function args_register_post_type(): array
    {
        $labels = array(
            'name' => _x('Courses', 'Post Type General Name', ACADLIX_TEXT_DOMAIN),
            'singular_name' => _x('Course', 'Post Type Singular Name', ACADLIX_TEXT_DOMAIN),
            'menu_name' => __('Courses', ACADLIX_TEXT_DOMAIN),
            'parent_item_colon' => __('Parent Item:', ACADLIX_TEXT_DOMAIN),
            'all_items' => __('All Courses', ACADLIX_TEXT_DOMAIN),
            'view_item' => __('View Course', ACADLIX_TEXT_DOMAIN),
            'add_new_item' => __('Add a New Course', ACADLIX_TEXT_DOMAIN),
            'add_new' => __('Add New', ACADLIX_TEXT_DOMAIN),
            'edit_item' => __('Edit Course', ACADLIX_TEXT_DOMAIN),
            'update_item' => __('Update Course', ACADLIX_TEXT_DOMAIN),
            'search_items' => __('Search Courses', ACADLIX_TEXT_DOMAIN),
            'not_found' => sprintf(__('You have not had any courses yet. Click <a href="%s">Add new</a> to start', ACADLIX_TEXT_DOMAIN), admin_url('post-new.php?post_type=acadlix_course')),
            'not_found_in_trash' => __('There was no course found in the trash', ACADLIX_TEXT_DOMAIN),
        );
        $course_base = '';
        $course_permalink = empty($course_base) ? 'courses' : $course_base;
        $show_in_rest = false; // show in rest disable for classic editor

        $args = array(
            'labels' => $labels,
            'description' => __('Course custom post type for acadlix', ACADLIX_TEXT_DOMAIN),
            'public' => true,
            'query_var' => true,
            'publicly_queryable' => true,
            'show_ui' => true,
            'has_archive' => true,
            'capability_type' => $this->_post_type,
            'map_meta_cap' => true,
            'show_in_menu' => false,
            'show_in_admin_bar' => false,
            'show_in_nav_menus' => true,
            'show_in_rest' => $show_in_rest,
            'taxonomies'         => array( ACADLIX_COURSE_CATEGORY_TAXONOMY, ACADLIX_COURSE_TAG_TAXONOMY ),
            'supports' => array('title', 'editor', 'thumbnail', 'revisions', 'comments', 'excerpt'),
            'hierarchical' => false,
            'rewrite' => !empty($course_permalink) ? array(
                'slug' => untrailingslashit($course_permalink),
                'with_front' => false,
            ) : false,
        );

        return $args;
    }

    public function register_taxonomy()
    {
        register_taxonomy(
            ACADLIX_COURSE_CATEGORY_TAXONOMY,
            array(ACADLIX_COURSE_CPT),
            array(
                'label' => __('Course Categories', ACADLIX_TEXT_DOMAIN),
                'labels' => array(
                    'name' => __('Course Categories', ACADLIX_TEXT_DOMAIN),
                    'menu_name' => __('Course Category', ACADLIX_TEXT_DOMAIN),
                    'singular_name' => __('Category', ACADLIX_TEXT_DOMAIN),
                    'add_new_item' => __('Add A New Course Category', ACADLIX_TEXT_DOMAIN),
                    'all_items' => __('All Categories', ACADLIX_TEXT_DOMAIN),
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
                    'slug' => get_option('acadlix_course_category_base', 'course-category'),
                    'hierarchical' => true,
                    'with_front' => false,
                ),
            )
        );

        register_taxonomy(
            ACADLIX_COURSE_TAG_TAXONOMY,
            array(ACADLIX_COURSE_CPT),
            array(
                'labels' => array(
                    'name' => __('Course Tags', ACADLIX_TEXT_DOMAIN),
                    'singular_name' => __('Tag', ACADLIX_TEXT_DOMAIN),
                    'search_items' => __('Search Course Tags', ACADLIX_TEXT_DOMAIN),
                    'popular_items' => __('Popular Course Tags', ACADLIX_TEXT_DOMAIN),
                    'all_items' => __('All Course Tags', ACADLIX_TEXT_DOMAIN),
                    'parent_item' => null,
                    'parent_item_colon' => null,
                    'edit_item' => __('Edit Course Tag', ACADLIX_TEXT_DOMAIN),
                    'update_item' => __('Update Course Tag', ACADLIX_TEXT_DOMAIN),
                    'add_new_item' => __('Add A New Course Tag', ACADLIX_TEXT_DOMAIN),
                    'new_item_name' => __('New Course Tag Name', ACADLIX_TEXT_DOMAIN),
                    'separate_items_with_commas' => __('Separate tags with commas', ACADLIX_TEXT_DOMAIN),
                    'add_or_remove_items' => __('Add or remove tags', ACADLIX_TEXT_DOMAIN),
                    'choose_from_most_used' => __('Choose from the most used tags', ACADLIX_TEXT_DOMAIN),
                    'menu_name' => __('Course Tags', ACADLIX_TEXT_DOMAIN),
                ),
                'public' => true,
                'hierarchical' => false,
                'show_ui' => true,
                'show_in_menu' => false,
                'update_count_callback' => '_update_post_term_count',
                'query_var' => true,
                'show_in_rest' => true,
                'rewrite' => array(
                    'slug' => get_option('acadlix_course_tag_base', 'course-tag'),
                    'with_front' => false,
                ),
            )
        );
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
        $new_order['author'] = esc_html__('Author', ACADLIX_TEXT_DOMAIN);
        $new_order['taxonomy-'.ACADLIX_COURSE_CATEGORY_TAXONOMY] = esc_html__('Categories', ACADLIX_TEXT_DOMAIN);
        $new_order['taxonomy-'.ACADLIX_COURSE_TAG_TAXONOMY] = esc_html__('Tags', ACADLIX_TEXT_DOMAIN);
        $new_order['students'] = esc_html__('Students', ACADLIX_TEXT_DOMAIN);
        $new_order['price'] = esc_html__('Price', ACADLIX_TEXT_DOMAIN);
        $new_order['review'] = esc_html__('Review', ACADLIX_TEXT_DOMAIN);
        $new_order['date'] = $columns['date'];
        return $new_order;
    }

    public function custom_column_content($column, $post_id = 0)
	{
		switch ( $column ) {
            case 'students':
                $count = 0;
                echo $count;
                break;
            case 'price':
                echo 200;
                break;
            case 'review':
                echo 1;
                break;
        }
	}

    public function render_meta_box()
    {
        add_meta_box(
            'acadlix-course-content',          // Unique ID
            esc_html__( 'Course Curriculam', ACADLIX_TEXT_DOMAIN ),      // Box title
            array($this, 'admin_course_editor'),        // Content callback
            $this->_post_type,          // Post type
            'normal',                    // Context (normal, side, advanced)
            'high'                  // Priority
        );
    }

    public function admin_course_editor($post)
    {
        ?>
        <script type="text/javascript">
            window.acadlixCourseList = window.acadlixCourseList || [];

            window.acadlixCourseList = <?php echo json_encode($post); ?>
        </script>
        <?php
        echo '<div id="acadlix-admin-course-editor">Loading...</div>';
    }

    public static function instance()
    {
        if (!self::$_instance) {
            self::$_instance = new self();
        }

        return self::$_instance;
    }
}