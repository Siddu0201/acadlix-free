<?php

namespace Yuvayana\Acadlix\CPT;
use Yuvayana\Acadlix\CPT\Acadlix_Abstract;

defined( 'ABSPATH' ) || exit();

final class Course extends Acadlix_Abstract{
    protected static $_instance = null;

    /**
     * @var string
     */
    protected $_post_type = ACADLIX_COURSE_CPT;

    public function __construct() {
        parent::__construct();
    }

    public function args_register_post_type(): array
	{
        $labels           = array(
            'name'               => _x( 'Courses', 'Post Type General Name', ACADLIX_TEXT_DOMAIN ),
            'singular_name'      => _x( 'Course', 'Post Type Singular Name', ACADLIX_TEXT_DOMAIN ),
            'menu_name'          => __( 'Courses', ACADLIX_TEXT_DOMAIN ),
            'parent_item_colon'  => __( 'Parent Item:', ACADLIX_TEXT_DOMAIN ),
            'all_items'          => __( 'All Courses', ACADLIX_TEXT_DOMAIN ),
            'view_item'          => __( 'View Course', ACADLIX_TEXT_DOMAIN ),
            'add_new_item'       => __( 'Add a New Course', ACADLIX_TEXT_DOMAIN ),
            'add_new'            => __( 'Add New', ACADLIX_TEXT_DOMAIN ),
            'edit_item'          => __( 'Edit Course', ACADLIX_TEXT_DOMAIN ),
            'update_item'        => __( 'Update Course', ACADLIX_TEXT_DOMAIN ),
            'search_items'       => __( 'Search Courses', ACADLIX_TEXT_DOMAIN ),
            'not_found'          => sprintf( __( 'You have not had any courses yet. Click <a href="%s">Add new</a> to start', ACADLIX_TEXT_DOMAIN ), admin_url( 'post-new.php?post_type=acadlix_course' ) ),
            'not_found_in_trash' => __( 'There was no course found in the trash', ACADLIX_TEXT_DOMAIN ),
        );
        $course_base      = '';
        $course_permalink = empty( $course_base ) ? 'courses' : $course_base;
        $show_in_rest = false; // show in rest disable for classic editor

        $args = array(
            'labels'             => $labels,
            'description'        => __('Course custom post type for acadlix', ACADLIX_TEXT_DOMAIN),
            'public'             => true,
            'query_var'          => true,
            'publicly_queryable' => true,
            'show_ui'            => true,
            'has_archive'        => true,
            'capability_type'    => $this->_post_type,
            'map_meta_cap'       => true,
            'show_in_menu'       => false,
            'show_in_admin_bar'  => false,
            'show_in_nav_menus'  => true,
            'show_in_rest'       => $show_in_rest,
            // 'taxonomies'         => array( 'course_category', 'course_tag' ),
            'supports'           => array( 'title', 'editor', 'thumbnail', 'revisions', 'comments', 'excerpt' ),
            'hierarchical'       => false,
            'rewrite'            => ! empty( $course_permalink ) ? array(
                'slug'       => untrailingslashit( $course_permalink ),
                'with_front' => false,
            ) : false,
        );

        return $args;
	}

    public static function instance() {
        if ( ! self::$_instance ) {
            self::$_instance = new self();
        }

        return self::$_instance;
    }
}