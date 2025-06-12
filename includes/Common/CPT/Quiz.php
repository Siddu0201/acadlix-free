<?php

namespace Yuvayana\Acadlix\Common\CPT;

use Yuvayana\Acadlix\Common\CPT\Acadlix_Abstract;
use Yuvayana\Acadlix\Common\Helper\Helper;

defined('ABSPATH') || exit();

final class Quiz extends Acadlix_Abstract
{
    protected static $_instance = null;

    protected $_post_type = ACADLIX_QUIZ_CPT;

    /**
     * Constructor
     */
    public function __construct()
    {
        parent::__construct();

        add_action('init', [$this, 'register_taxonomy']);
    }

    public function args_register_post_type(): array
    {
        $labels = array(
            'name' => _x('Quizzes', 'Post Type General Name', 'acadlix'),
            'singular_name' => _x('Quiz', 'Post Type Singular Name', 'acadlix'),
            'menu_name' => __('Quizzes', 'acadlix'),
            'parent_item_colon' => __('Parent Item:', 'acadlix'),
            'all_items' => __('All Quizzes', 'acadlix'),
            'view_item' => __('View Quiz', 'acadlix'),
            'add_new_item' => __('Add a New Quiz', 'acadlix'),
            'add_new' => __('Add New', 'acadlix'),
            'edit_item' => __('Edit Quiz', 'acadlix'),
            'update_item' => __('Update Quiz', 'acadlix'),
            'search_items' => __('Search Quizzes', 'acadlix'),
            'not_found' => __('Not Found', 'acadlix'),
            'not_found_in_trash' => __('Not found in Trash', 'acadlix'),
        );
        $args = array(
            'labels' => $labels,
            'description' => __('Quiz custom post type for acadlix', 'acadlix'),
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

    public function register_taxonomy()
    {
        register_taxonomy(
            ACADLIX_QUIZ_CATEGORY_TAXONOMY,
            array(ACADLIX_QUIZ_CPT),
            array(
                'label' => __('Quiz Categories', "acadlix"),
                'labels' => array(
                    'name' => __('Quiz Categories', "acadlix"),
                    'menu_name' => __('Quiz Category', "acadlix"),
                    'singular_name' => __('Category', "acadlix"),
                    'add_new_item' => __('Add A New Quiz Category', "acadlix"),
                    'all_items' => __('All Categories', "acadlix"),
                ),
                'query_var' => false,
                'public' => false,
                'show_in_menu' => false,
                'show_in_rest' => true,
                'rewrite' => false,
                'default_term' => array(
                    'name' => 'Uncategorized',
                    'slug' => sanitize_title('Uncategorized'),
                )
            )
        );

        $language_map = Helper::instance()->acadlix_get_system_languages();
        $current_locale = get_locale();
        $current_language = $language_map[$current_locale] ?? 'English';

        register_taxonomy(
            ACADLIX_QUIZ_LANGUAGE_TAXONOMY,
            array(ACADLIX_QUIZ_CPT),
            array(
                'label' => __('Quiz Languages', "acadlix"),
                'labels' => array(
                    'name' => __('Quiz Languages', "acadlix"),
                    'menu_name' => __('Quiz Langauge', "acadlix"),
                    'singular_name' => __('Langauge', "acadlix"),
                    'add_new_item' => __('Add A New Quiz Language', "acadlix"),
                    'all_items' => __('All Languages', "acadlix"),
                ),
                'query_var' => false,
                'public' => false,
                'show_in_menu' => false,
                'show_in_rest' => true,
                'rewrite' => false,
                'default_term' => array(
                    'name' => $current_language,
                    'slug' => sanitize_title($current_language),
                )
            )
        );
    }

    public static function instance()
    {
        if (!self::$_instance) {
            self::$_instance = new self();
        }

        return self::$_instance;
    }

}