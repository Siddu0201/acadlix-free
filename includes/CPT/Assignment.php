<?php 

namespace Yuvayana\Acadlix\CPT;

final class Assignment extends Acadlix_Abstract
{
    protected static $_instance = null;

    protected $_post_type = ACADLIX_ASSIGNMENT_CPT;

    public function __construct()
    {
        parent::__construct();
    }

    public function args_register_post_type(): array
    {
        $labels = array(
            'name' => _x('Assignments', 'Post Type General Name', 'acadlix'),
            'singular_name' => _x('Assignment', 'Post Type Singular Name', 'acadlix'),
            'menu_name' => __('Assignments', 'acadlix'),
            'parent_item_colon' => __('Parent Item:', 'acadlix'),
            'all_items' => __('All Assignments', 'acadlix'),
            'view_item' => __('View Assignment', 'acadlix'),
            'add_new_item' => __('Add a New Assignment', 'acadlix'),
            'add_new' => __('Add New', 'acadlix'),
            'edit_item' => __('Edit Assignment', 'acadlix'),
            'update_item' => __('Update Assignment', 'acadlix'),
            'search_items' => __('Search Assignment', 'acadlix'),
            'not_found' => __('Not found', 'acadlix'),
            'not_found_in_trash' => __('Not found in Trash', 'acadlix'),
        );

        $args = array(
            'labels' => $labels,
            'description' => __('Assignment custom post type for acadlix', 'acadlix'),
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
        if (self::$_instance === null) {
            self::$_instance = new self();
        }

        return self::$_instance;
    }
}