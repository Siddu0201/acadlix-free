<?php

namespace Yuvayana\Acadlix\Common\Models;

use Illuminate\Database\Eloquent\Model;

defined('ABSPATH') || exit();

if (!class_exists('CourseSection')) {
  class CourseSection extends Model
  {
    protected $table;
    protected $primaryKey = 'ID';
    protected $with = ['author', 'metas', 'contents'];
    protected $appends = [
      'rendered_post_content',
      'rendered_metas',
    ];

    protected static $postType = ACADLIX_COURSE_SECTION_CPT;

    public function __construct(array $attributes = [])
    {
      parent::__construct($attributes);

      $this->table = acadlix()->helper()->acadlix_wp_prefix('posts');
    }

    public function scopeOfCourseSection($query)
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
        ? acadlix()->helper()->cpt()->acadlix_remome_prefix_meta_keys($keyValueArray, 'course_section')
        : [];

      return $renderedMetas;
    }

    public function author()
    {
      return $this->belongsTo(acadlix()->model()->wpUsers(), 'post_author', 'ID');
    }

    public static function insertCourseSection(array $data, array $meta = [])
    {
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

    public static function updateCourseSection(int $postId, array $data = [], array $meta = [])
    {
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

    public static function deleteCourseSection(int $postId)
    {
      // Check if post exists
      $post = get_post($postId);
      if (!$post || $post->post_type !== self::$postType) {
        return new \WP_Error(
          'invalid_post',
          __('Invalid post ID or not a course section post type.', 'acadlix'),
        );
      }

      // Delete Course Section Content
      $courseSectionContents = acadlix()->model()->courseSectionContent()->where('post_parent', $postId)->get();
      foreach ($courseSectionContents as $courseSectionContent) {
        acadlix()->model()->courseSectionContent()->deleteCourseSectionContent($courseSectionContent->ID);
      }

      // Delete post
      $result = wp_delete_post($postId, true);

      if (!$result) {
        return new \WP_Error(
          'delete_failed',
          __('Failed to delete course section.', 'acadlix'),
        );
      }

      return true;
    }

    public function contents()
    {
      return $this->hasMany(acadlix()->model()->courseSectionContent(), 'post_parent', 'ID')
        ->ofCourseSectionContent()
        ->orderBy("menu_order");
    }
  }
}