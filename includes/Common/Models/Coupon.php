<?php

namespace Yuvayana\Acadlix\Common\Models;

use Illuminate\Database\Eloquent\Model;

defined('ABSPATH') || exit();

if (!class_exists('Coupon')) {

  class Coupon extends Model
  {
    protected $table;
    protected $primaryKey = 'ID';

    protected $with = ['author', 'metas'];

    protected $appends = [
      // 'rendered_post_content',
      'rendered_metas',
      'coupon_usage',
    ];

    protected static $postType = ACADLIX_COUPON_CPT; // Custom post type identifier 

    public function __construct(array $attributes = [])
    {
      parent::__construct($attributes);

      $this->table = acadlix()->helper()->acadlix_wp_prefix('posts');
    }

    /**
     * Boot method to automatically apply the post type condition.
     */
    public function scopeOfCoupon($query)
    {
      return $query->where('post_type', self::$postType);
    }

    public function getRenderedPostContentAttribute()
    {
      return acadlix()->helper()->renderShortCode($this->post_content);
    }

    public function metas()
    {
      return $this->hasMany(acadlix()->model()->wpPostMeta(), 'post_id', 'ID');
    }

    public function getRenderedMetasAttribute()
    {
      $metas = $this->metas;
      if (empty($metas)) {
        return [];
      }
      $keyValueArray = [];

      foreach ($metas as $meta) {
        // Ensure meta_key and meta_value exist in the object
        if (isset($meta['meta_key'], $meta['meta_value'])) {
          $key = $meta['meta_key'];
          $value = $meta['meta_value'];

          // Decode JSON if applicable
          if (is_string($value) && $decoded = json_decode($value, true)) {
            $value = $decoded;
          }

          $keyValueArray[$key] = $value;
        }
      }
      $renderedMetas = !empty($keyValueArray) && is_array($keyValueArray)
        ? acadlix()->helper()->cpt()->acadlix_remome_prefix_meta_keys($keyValueArray, 'coupon')
        : [];

      return $renderedMetas;
    }

    public function getCouponUsageAttribute()
    {
      return acadlix()->model()->order()->where('coupon_id', $this->ID)->where('status', 'success')->count();
    }

    public function getCouponUsageByUser($userId)
    {
      return acadlix()->model()->order()->where('coupon_id', $this->ID)->where('user_id', $userId)->where('status', 'success')->count();
    }

    public function author()
    {
      return $this->belongsTo(acadlix()->model()->wpUsers(), 'post_author', 'ID');
    }

    public static function insertCoupon(array $data, array $meta = [])
    {
      $data['post_content'] = wp_slash($data['post_content'] ?? "");
      $data = wp_parse_args($data, [
        'post_title' => '',
        'post_content' => '',
        'post_status' => 'publish',
        'post_type' => self::$postType,
        'post_author' => 1,
      ]);

      // Add meta data to the 'meta_input' argument for wp_insert_post.
      if (!empty($meta)) {
        $data['meta_input'] = $meta;
      }

      // Insert the post and return the ID or WP_Error.
      $postId = wp_insert_post($data);

      return $postId;
    }

    public static function updateCoupon(int $postId, array $data = [], array $meta = [])
    {
      $data['post_content'] = wp_slash($data['post_content'] ?? "");
      // Parse default arguments for the coupon update.
      $data = wp_parse_args($data, [
        'ID' => $postId,
      ]);

      // Add meta data to the 'meta_input' argument for wp_update_post.
      if (!empty($meta)) {
        $data['meta_input'] = $meta;
      }

      // Update the post and return the result or WP_Error.
      $result = wp_update_post($data, true);

      return $result;
    }

    public static function deleteCoupon(int $postId)
    {
      // Check if post exists
      $post = get_post($postId);
      if (!$post || $post->post_type !== self::$postType) {
        return new \WP_Error('invalid_post', 'Invalid post ID or not a coupon post type.');
      }

        // Delete post
      $result = wp_delete_post($postId, true);

      if (!$result) {
        return new \WP_Error('delete_failed', 'Failed to delete coupon.');
      }

      return true;
    }
  }
}