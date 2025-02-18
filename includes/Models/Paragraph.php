<?php

namespace Yuvayana\Acadlix\Models;

use Illuminate\Database\Eloquent\Model;
use Yuvayana\Acadlix\Helper\CptHelper;
use Yuvayana\Acadlix\Helper\Helper;

defined('ABSPATH') || exit();

if (!class_exists('Paragraph')) {
    class Paragraph extends Model
    {
        protected $helper;

        protected $connection = 'wordpress';
        protected $table = 'posts'; // Posts table is used for all post types
        protected $primaryKey = 'ID';

        protected $with = ['author', 'metas'];

        protected $appends = [
            'rendered_post_content',
            'rendered_metas',
            'questions_count',
        ];

        protected static $postType = ACADLIX_PARAGRAPH_CPT;

        public function __construct()
        {
            $this->helper = new Helper();
        }

        public function scopeOfParagraph($query)
        {
            return $query->where('post_type', self::$postType);
        }

        public function getRenderedPostContentAttribute()
        {
            return $this->helper->renderShortCode($this->post_content);
        }

        public function getQuestionsCountAttribute()
        {
            return Question::where('paragraph_id', $this->ID)->count();
        }

        public function metas()
        {
            return $this->hasMany(WpPostMeta::class, 'post_id', 'ID');
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
                ? CptHelper::instance()->acadlix_remome_prefix_meta_keys($keyValueArray, 'paragraph')
                : [];

            return $renderedMetas;
        }

        public function author()
        {
            return $this->belongsTo(WpUsers::class, 'post_author', 'ID');
        }

        public static function insertParagraph(array $data, array $meta = [])
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

        public static function updateParagraph(int $postId, array $data = [], array $meta = [])
        {
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

        public static function deleteParagraph(int $postId)
        {
            // Check if post exists
            $post = get_post($postId);
            if (!$post || $post->post_type !== self::$postType) {
                return new \WP_Error('invalid_post', __('Invalid post ID or not a paragraph post type.', 'acadlix'));
            }

            // Delete post
            $result = wp_delete_post($postId, true);

            if (!$result) {
                return new \WP_Error('delete_failed', __('Failed to delete paragraph.', 'acadlix'));
            }

            // unassign questions from this paragraph
            $result = Question::where('paragraph_id', $postId)->get();
            if ($result->count() > 0) {
                foreach ($result as $question) {
                    $question->update([
                        'paragraph_enabled' => 0,
                        'paragraph_id' => NULL,
                    ]);
                }
            }

            return true;
        }

        // public function quiz(){
        //     return $this->belongsTo(Quiz::class, 'quiz_id', 'id');
        // }


        // public function questions(){
        //     return $this->hasMany(Question::class, 'paragraph_id', 'id');
        // }

        public function createNewLanguage($language_id, $copy_default_language = false)
        {
            $metas = $this->rendered_metas;

            if (is_array($metas) && count($metas) > 0) {
                $hasLanguageId = array_filter($metas['language_data'], function ($meta) use ($language_id) {
                    return $meta['language_id'] == $language_id;
                });
                if (count($hasLanguageId) > 0) {
                    return new \WP_Error(
                        'language_exist',
                        __('Language already exists for this paragraph.', 'acadlix'),
                        ['status' => 400]
                    );
                }

                $defaultLanguage = array_filter($metas['language_data'], function ($meta) {
                    return $meta['default'] == true;
                });
                if (count($defaultLanguage) == 0) {
                    return new \WP_Error(
                        'default_language_doesnt_exist',
                        __('Default language data not found for this paragraph.', 'acadlix'),
                        ['status' => 400]
                    );
                }

                $newLanguageData = [
                    'language_id' => $language_id,
                    'default' => false,
                    'selected' => false,
                    'content' => $copy_default_language ? $defaultLanguage[0]['content'] : ""
                ];

                $meta = [
                    "language_data" => [
                        ...$metas['language_data'],
                        $newLanguageData
                    ]
                ];

                $meta = !empty($meta) && is_array($meta)
                    ? CptHelper::instance()->acadlix_add_prefix_meta_keys($meta, 'paragraph')
                    : [];

                self::updateParagraph(
                    $this->ID,
                    [],
                    $meta
                );

            }
        }

        public function setDefaultLanguage($language_id)
        {
            $metas = $this->rendered_metas;
            if (is_array($metas) && count($metas) > 0) {
                $meta = [
                    "language_data" => array_map(function ($meta) use ($language_id) {
                        if($meta['default'] == true){
                            $meta['default'] = false;
                            $meta['selected'] = false;
                        }
                        if($meta['language_id'] == $language_id){
                            $meta['default'] = true;
                            $meta['selected'] = true;
                        }

                        return $meta;
                    }, $metas['language_data'])
                ];

                $meta = !empty($meta) && is_array($meta)
                    ? CptHelper::instance()->acadlix_add_prefix_meta_keys($meta, 'paragraph')
                    : [];

                self::updateParagraph(
                    $this->ID,
                    [],
                    $meta
                );
            }
        }

        public function deleteLanguageParagraph($language_id)
        {
            $metas = $this->rendered_metas;

            if (is_array($metas) && count($metas) > 0) {
                $language_data = array_filter($metas['language_data'], function ($meta) use ($language_id) {
                    return $meta['language_id'] != $language_id;
                });
                $meta = [
                    "language_data" => $language_data
                ];

                $meta = !empty($meta) && is_array($meta)
                    ? CptHelper::instance()->acadlix_add_prefix_meta_keys($meta, 'paragraph')
                    : [];

                self::updateParagraph(
                    $this->ID,
                    [],
                    $meta
                );

            }
        }
    }
}