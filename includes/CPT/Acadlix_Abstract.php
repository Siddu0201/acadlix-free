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
	 * Columns display on list table
	 *
	 * @var array
	 */
	protected $_columns = array();

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
}

