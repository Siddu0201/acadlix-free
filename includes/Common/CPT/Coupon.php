<?php

namespace Yuvayana\Acadlix\Common\CPT;

defined('ABSPATH') || exit();

final class Coupon extends CPT_Abstract
{
  protected static $_instance = null;

  protected $_post_type = ACADLIX_COUPON_CPT;

  public function __construct()
  {
    parent::__construct();
  }

  public function args_register_post_type(): array
  {
    $labels = array(
      'name' => _x('Coupons', 'Post Type General Name', 'acadlix'),
      'singular_name' => _x('Coupon', 'Post Type Singular Name', 'acadlix'),
      'menu_name' => __('Coupons', 'acadlix'),
      'parent_item_colon' => __('Parent Item:', 'acadlix'),
      'all_items' => __('All Coupons', 'acadlix'),
      'view_item' => __('View Coupon', 'acadlix'),
      'add_new_item' => __('Add a New Coupon', 'acadlix'),
      'add_new' => __('Add New', 'acadlix'),
      'edit_item' => __('Edit Coupon', 'acadlix'),
      'update_item' => __('Update Coupon', 'acadlix'),
      'search_items' => __('Search Coupons', 'acadlix'),
      'not_found' => __('Not Found', 'acadlix'),
      'not_found_in_trash' => __('Not found in Trash', 'acadlix'),
    );
    $args = array(
      'labels' => $labels,
      'description' => __('Coupon custom post type for acadlix', 'acadlix'),
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