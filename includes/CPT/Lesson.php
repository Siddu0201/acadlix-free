<?php

namespace Yuvayana\Acadlix\CPT;

use Yuvayana\Acadlix\CPT\Acadlix_Abstract;

defined('ABSPATH') || exit();

final class Lesson extends Acadlix_Abstract
{
    protected static $_instance = null;

    protected $_post_type = ACADLIX_LESSON_CPT;

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
            'name' => _x('Lessons', 'Post Type General Name', 'acadlix'),
            'singular_name' => _x('Lesson', 'Post Type Singular Name', 'acadlix'),
            'menu_name' => __('Lessons', 'acadlix'),
            'parent_item_colon' => __('Parent Item:', 'acadlix'),
            'all_items' => __('All Lessons', 'acadlix'),
            'view_item' => __('View Lesson', 'acadlix'),
            'add_new_item' => __('Add a New Lesson', 'acadlix'),
            'add_new' => __('Add New', 'acadlix'),
            'edit_item' => __('Edit Lesson', 'acadlix'),
            'update_item' => __('Update Lesson', 'acadlix'),
            'search_items' => __('Search Lessons', 'acadlix'),
            'not_found' => __('Not Found', 'acadlix'),
            'not_found_in_trash' => __('Not found in Trash', 'acadlix'),
        );
        $args = array(
            'labels' => $labels,
            'description' => __('Lesson custom post type for acadlix', 'acadlix'),
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