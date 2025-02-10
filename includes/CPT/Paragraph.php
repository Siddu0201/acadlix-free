<?php

namespace Yuvayana\Acadlix\CPT;

use Yuvayana\Acadlix\CPT\Acadlix_Abstract;

defined('ABSPATH') || exit();

final class Paragraph extends Acadlix_Abstract
{
    protected static $_instance = null;

    protected $_post_type = ACADLIX_PARAGRAPH_CPT;

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
            'name' => _x('Paragraphs', 'Post Type General Name', 'acadlix'),
            'singular_name' => _x('Paragraph', 'Post Type Singular Name', 'acadlix'),
            'menu_name' => __('Paragraphs', 'acadlix'),
            'parent_item_colon' => __('Parent Item:', 'acadlix'),
            'all_items' => __('All Paragraphs', 'acadlix'),
            'view_item' => __('View Paragraph', 'acadlix'),
            'add_new_item' => __('Add a New Paragraph', 'acadlix'),
            'add_new' => __('Add New', 'acadlix'),
            'edit_item' => __('Edit Paragraph', 'acadlix'),
            'update_item' => __('Update Paragraph', 'acadlix'),
            'search_items' => __('Search Paragraphs', 'acadlix'),
            'not_found' => __('Not Found', 'acadlix'),
            'not_found_in_trash' => __('Not found in Trash', 'acadlix'),
        );
        $args = array(
            'labels' => $labels,
            'description' => __('Paragraph custom post type for acadlix', 'acadlix'),
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