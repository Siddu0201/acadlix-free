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
		add_action('init', array($this, '_acadlix_register'));
		add_action('before_delete_post', array($this, '_acadlix_before_delete_post'));

		add_filter('manage_edit-' . $this->_post_type . '_sortable_columns', array($this, 'sortable_columns'));
		add_filter('manage_' . $this->_post_type . '_posts_columns', array($this, 'columns_head'));
		add_filter('manage_' . $this->_post_type . '_posts_custom_column', array($this, 'custom_column_content'), 10, 2);

		add_action('add_meta_boxes_' . $this->_post_type, array($this, 'render_meta_box'));
	}

	public function _acadlix_register()
	{
		$args = $this->args_register_post_type();

		if ($args) {
			// print_r($args);
			register_post_type($this->_post_type, $args);
		}
	}

	final function _acadlix_before_delete_post(int $post_id, $post = null)
	{
		try {
			$this->before_delete($post_id);
		} catch (Throwable $e) {
			if (defined('WP_DEBUG') && WP_DEBUG) {
				error_log(__METHOD__ . ': ' . $e->getMessage());
			}
		}
	}

	public function before_delete(int $post_id)
	{
		// Implement from child
	}

	public function check_post()
	{
		return true;
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

	public function custom_column_content($column, $post_id = 0)
	{
		// Implement from child
	}

	public function render_meta_box()
	{
		// Implement from child
	}
}

