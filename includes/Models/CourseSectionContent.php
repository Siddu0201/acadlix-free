<?php

namespace Yuvayana\Acadlix\Models;

use WP_Query;
use Illuminate\Database\Eloquent\Model;
use Yuvayana\Acadlix\Helper\CptHelper;
use Yuvayana\Acadlix\Helper\Helper;

defined('ABSPATH') || exit();

if (!class_exists(class: 'CourseSectionContent')) {
    class CourseSectionContent extends Model
    {
        protected $helper;
        protected $table = 'posts'; // Posts table is used for all post types
        protected $primaryKey = 'ID';
        protected $with = ['author', 'metas'];
        protected $appends = [
            'rendered_post_content',
            'rendered_metas',
            'contentable',
            'contentable_data',
        ];

        protected static $postType = ACADLIX_COURSE_SECTION_CONTENT_CPT;

        // protected $with = ['contentable'];

        // public function contentable()
        // {
        //     return $this->morphTo();
        // }

        // public function course_statistics()
        // {
        //     return $this->hasMany(CourseStatistic::class, 'course_section_content_id', 'id');
        // }

        public function __construct()
        {
            $this->helper = new Helper();
        }

        public function scopeOfCourseSectionContent($query)
        {
            return $query->where('post_type', self::$postType);
        }

        public function getRenderedPostContentAttribute()
        {
            return $this->helper->renderShortCode($this->post_content);
        }

        public function author()
        {
            return $this->belongsTo(WpUsers::class, 'post_author', 'ID');
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
                ? CptHelper::instance()->acadlix_remome_prefix_meta_keys($keyValueArray, 'course_section_content')
                : [];

            return $renderedMetas;
        }

        public function getByQuizId($quiz_id)
        {
            $args = [
                'post_type' => self::$postType,
                'posts_per_page' => -1, // Fetch all matching posts
                'meta_query' => [
                    'relation' => 'AND',
                    [
                        'key' => '_acadlix_course_section_content_type',
                        'value' => 'quiz',
                    ],
                    [
                        'key' => '_acadlix_course_section_content_quiz_id',
                        'value' => $quiz_id,
                    ],
                ],
            ];
            $query = new WP_Query($args);
            return $query->posts;
        }

        public function getContentableAttribute()
        {
            $renderedMetas = $this->rendered_metas;
            $contentable = [];
            $contentableType = $renderedMetas['type'];
            $contentable['type'] = $contentableType;
            switch ($contentableType) {
                case 'lesson':
                    $lesson = Lesson::ofLesson()->find($renderedMetas['lesson_id']);
                    $contentableId = $renderedMetas['lesson_id'];
                    $contentableTitle = $lesson->post_title ?? "";
                    break;
                case 'quiz':
                    $quiz = Quiz::ofQuiz()->find($renderedMetas['quiz_id']);
                    $contentableId = $renderedMetas['quiz_id'];
                    $contentableTitle = $quiz->post_title ?? "";
                    break;
                case 'assignment':
                    $assignment = Assignment::ofAssignment()->find($renderedMetas['assignment_id']);
                    $contentableId = $renderedMetas['assignment_id'];
                    $contentableTitle = $assignment->post_title ?? "";
                    break;
                default:
                    $lesson = Lesson::ofLesson()->find($renderedMetas['lesson_id']);
                    $contentableId = $renderedMetas['lesson_id'];
                    $contentableTitle = $lesson->post_title ?? "";
            }
            $contentable['id'] = $contentableId;
            $contentable['title'] = $contentableTitle;
            return $contentable;
        }

        public function getContentableDataAttribute()
        {
            $renderedMetas = $this->rendered_metas;
            $contentableType = $renderedMetas['type'];
            return match ($contentableType) {
                'lesson' => Lesson::ofLesson()->find($renderedMetas['lesson_id']),
                'quiz' => Quiz::ofQuiz()->find($renderedMetas['quiz_id']),
                'assignment' => Assignment::ofAssignment()->find($renderedMetas['assignment_id']),
                default => throw new \Exception("Unknown contentable type"),
            };
        }

        public static function insertCourseSectionContent(array $data, array $meta = [])
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

        public static function updateCourseSectionContent(int $postId, array $data = [], array $meta = [])
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

        public static function deleteCourseSectionContent(int $postId)
        {
            // Check if post exists
            $post = get_post($postId);
            if (!$post || $post->post_type !== self::$postType) {
                return new \WP_Error('invalid_post', __('Invalid post ID or not a course section post type.', 'acadlix'));
            }

            // Delete post
            $result = wp_delete_post($postId, true);

            if (!$result) {
                return new \WP_Error('delete_failed', __('Failed to delete course section.', 'acadlix'));
            }

            // Delete statistic
            $courseStatistics = CourseStatistic::where('course_section_content_id', $postId)->get();
            foreach ($courseStatistics as $courseStatistic) {
                $courseStatistic->delete();
            }

            return true;
        }
    }
}