<?php

namespace Yuvayana\Acadlix\CPT;

defined('ABSPATH') || exit();

abstract class Acadlix_Abstract
{
	protected $_post_type = '';

	/**
	 * Metaboxes registered
	 *
	 * @var array
	 */
	protected $_meta_boxes = array();

	/**
	 * @var null
	 */
	protected $_current_meta_box = null;

	/**
	 * Sortable columns
	 *
	 * @var array
	 */
	protected $_sortable_columns = array();

	/**
	 * Map default method to a new method
	 *
	 * @var array
	 */
	// protected $_map_methods = array();

	/**
	 * @var array
	 */
	protected $_default_metas = array();

	/**
	 * @var array
	 */
	protected $_remove_features = array();

	public function __construct($post_type = '', $args = '')
	{

		if (!empty($post_type)) {
			$this->_post_type = $post_type;
		}
		add_action('init', array($this, '_do_register'));

		add_filter('manage_edit-' . $this->_post_type . '_sortable_columns', array($this, 'sortable_columns'));
		add_filter('manage_' . $this->_post_type . '_posts_columns', array($this, 'columns_head'));
	}

	public function _do_register()
	{
		$args = $this->args_register_post_type();

		if ($args) {
			// print_r($args);
			register_post_type($this->_post_type, $args);
		}
	}

	public function args_register_post_type(): array
	{
		return array();
	}

	public function sortable_columns($columns)
	{
		return $columns;
	}

	public function columns_head($columns)
	{
		return $columns;
	}
}

