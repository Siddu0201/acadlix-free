<?php

namespace Yuvayana\Acadlix\CPT;

use Yuvayana\Acadlix\CPT\Acadlix_Abstract;

defined('ABSPATH') || exit();

final class CourseSectionContent extends Acadlix_Abstract
{
    protected static $_instance = null;

    protected $_post_type = ACADLIX_COURSE_SECTION_CONTENT_CPT;

    /**
     * Constructor
     */
    public function __construct()
    {
        parent::__construct();
    }

    public function args_register_post_type(): array
    {
        $labels = array(
            'name' => _x('Course Section Contents', 'Post Type General Name', 'acadlix'),
            'singular_name' => _x('Course Section Content', 'Post Type Singular Name', 'acadlix'),
            'menu_name' => __('Course Section Contents', 'acadlix'),
            'parent_item_colon' => __('Parent Item:', 'acadlix'),
            'all_items' => __('All Course Section Contents', 'acadlix'),
            'view_item' => __('View Course Section Content', 'acadlix'),
            'add_new_item' => __('Add a New Course Section Content', 'acadlix'),
            'add_new' => __('Add New', 'acadlix'),
            'edit_item' => __('Edit Course Section Content', 'acadlix'),
            'update_item' => __('Update Course Section Content', 'acadlix'),
            'search_items' => __('Search Course Section Contents', 'acadlix'),
            'not_found' => __('Not Found', 'acadlix'),
            'not_found_in_trash' => __('Not found in Trash', 'acadlix'),
        );
        $args = array(
            'labels' => $labels,
            'description' => __('Course section content custom post type for acadlix', 'acadlix'),
            'public' => false,
            'query_var' => false,
            'has_archive' => false,
            'capability_type' => $this->_post_type,
            'map_meta_cap' => false,
            'show_in_menu' => false,
            'show_in_rest' => true,
            'rewrite' => false,
            'supports' => array('title', 'editor'),
        );
        return $args;
    }

    public static function instance()
    {
        if (!self::$_instance) {
            self::$_instance = new self();
        }

        return self::$_instance;
    }

}