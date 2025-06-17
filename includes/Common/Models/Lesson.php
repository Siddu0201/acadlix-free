<?php

namespace Yuvayana\Acadlix\Common\Models;

use Illuminate\Database\Eloquent\Model;
defined('ABSPATH') || exit();

if (!class_exists('Lesson')) {

    class Lesson extends Model
    {
        protected $table = 'posts'; // Posts table is used for all post types
        protected $primaryKey = 'ID';

        protected $with = ['author', 'metas'];

        protected $appends = [
            'rendered_post_content',
            'rendered_metas',
            'resource_count',
        ];

        protected static $postType = ACADLIX_LESSON_CPT; // Custom post type identifier

        /**
         * Boot method to automatically apply the post type condition.
         */
        public function scopeOfLesson($query)
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
                ? acadlix()->helper()->cpt()->acadlix_remome_prefix_meta_keys($keyValueArray, 'lesson')
                : [];

            return $renderedMetas;
        }


        public function getResourceCountAttribute()
        {
            $resources = $this->metas()->where('meta_key', '_acadlix_lesson_resources')->first();
            return empty($resources) ? 0 : count($resources->meta_value);
        }

        public function author()
        {
            return $this->belongsTo(acadlix()->model()->wpUsers(), 'post_author', 'ID');
        }

        public static function insertLesson(array $data, array $meta = [])
        {
            $data['post_content'] = $data['post_content'] ? wp_slash($data['post_content']) : '';
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

        public static function updateLesson(int $postId, array $data = [], array $meta = [])
        {
            $data['post_content'] = $data['post_content'] ? wp_slash($data['post_content']) : '';
            // Parse default arguments for the lesson update.
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

        public static function deleteLesson(int $postId)
        {
            // Check if post exists
            $post = get_post($postId);
            if (!$post || $post->post_type !== self::$postType) {
                return new \WP_Error('invalid_post', 'Invalid post ID or not a lesson post type.');
            }

            // Delete related course section content (cs_content) posts
            $related_contents = get_posts([
                'post_type' => ACADLIX_COURSE_SECTION_CONTENT_CPT,
                'meta_query' => [
                    [
                        'key' => '_acadlix_course_section_content_assignment_id',
                        'value' => $postId,
                        'compare' => '='
                    ]
                ],
                'posts_per_page' => -1,
                'fields' => 'ids', // only get post IDs
            ]);

            if (!empty($related_contents)) {
                foreach ($related_contents as $content_id) {
                    $content = acadlix()->model()->courseSectionContent()->deleteCourseSectionContent($content_id);
                    if (is_wp_error($content)) {
                        return $content;
                    }
                }
            }

            // Delete post
            $result = wp_delete_post($postId, true);

            if (!$result) {
                return new \WP_Error('delete_failed', 'Failed to delete lesson.');
            }

            return true;
        }
    }
}
