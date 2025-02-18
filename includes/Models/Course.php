<?php

namespace Yuvayana\Acadlix\Models;

use Illuminate\Database\Eloquent\Model;
use Yuvayana\Acadlix\Helper\CptHelper;
use Yuvayana\Acadlix\Helper\Helper;

defined('ABSPATH') || exit();

if (!class_exists('Course')) {
    class Course extends Model
    {
        protected $helper;
        protected $connection = 'wordpress';
        protected $table = 'posts'; // Posts table is used for all post types
        protected $primaryKey = 'ID';
        protected $with = ['author', 'metas', 'sections'];
        protected $appends = [
            'rendered_post_content',
            'rendered_metas',
            'thumbnail',
            'users',
        ];

        protected static $postType = ACADLIX_COURSE_CPT;

        public function __construct()
        {
            $this->helper = new Helper();
        }

        public function scopeOfCourse($query)
        {
            return $query->where('post_type', self::$postType);
        }

        public function getRenderedPostContentAttribute()
        {
            return $this->helper->renderShortCode($this->post_content);
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
                ? CptHelper::instance()->acadlix_remome_prefix_meta_keys($keyValueArray, 'course')
                : [];

            return $renderedMetas;
        }

        public function getThumbnailAttribute()
        {
            $metas = $this->rendered_metas;
            $thumbnail = [];
            if (array_key_exists('_thumbnail_id', $metas)) {
                $thumbnail_id = $metas['_thumbnail_id'];
                $thumbnail_data = wp_get_attachment_image_src($thumbnail_id, 'full');
                $thumbnail['url'] = $thumbnail_data[0];
                $thumbnail['width'] = $thumbnail_data[1];
                $thumbnail['height'] = $thumbnail_data[2];

                // Get attachment post data
                $attachment_post = get_post($thumbnail_id);

                $thumbnail['alt'] = get_post_meta($thumbnail_id, '_wp_attachment_image_alt', true);
                $thumbnail['title'] = $attachment_post->post_title;
                $thumbnail['caption'] = $attachment_post->post_excerpt;
                $thumbnail['description'] = $attachment_post->post_content;
                return $thumbnail;
            }
            return [];
        }

        /**
         * Get the author of the course.
         *
         * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
         */

        public function author()
        {
            return $this->belongsTo(WpUsers::class, 'post_author', 'ID');
        }

        public function getUsersAttribute()
        {
            $renderedMetas = $this->rendered_metas;
            return array_key_exists('user_ids', $renderedMetas)
                ? array_map(function ($userId) {
                    return WpUsers::find($userId);
                }, $renderedMetas['user_ids'])
                : [];
        }

        public static function updateCourse(int $postId, array $data = [], array $meta = [])
        {
            // Parse default arguments for the course update.
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

        public static function deleteCourse(int $postId)
        {
            // Check if post exists
            $post = get_post($postId);
            if (!$post || $post->post_type !== self::$postType) {
                return new \WP_Error('invalid_post', __('Invalid post ID or not a course post type.', 'acadlix'));
            }

            // Delete course section children
            $courseSections = CourseSection::where('post_parent', $postId)->get();
            foreach ($courseSections as $courseSection) {
                CourseSection::deleteCourseSection($courseSection->ID);
            }

            // Delete other course related data like user activity meta
            $userMetas = UserActivityMeta::ofCourse()
                ->where("type_id", $postId)
                ->get();
            foreach($userMetas as $userMeta){
                $userMeta->delete();
            }

            // Remove course id from order items
            OrderItem::softDeleteByCourseId($postId);

            // Remove cart items course
            $courseCarts = CourseCart::where('course_id', $postId)->get();
            foreach ($courseCarts as $courseCart) {
                $courseCart->delete();
            }

            return true;
        }

        // public function getStartDateAttribute($value)
        // {
        //     return $value === '0000-00-00 00:00:00' ? null : $value;

        // }


        // public function getEndDateAttribute($value)
        // {
        //     return $value === '0000-00-00 00:00:00' ? null : $value;

        // }


        public function sections()
        {
            return $this->hasMany(CourseSection::class, 'post_parent', 'ID')
                ->ofCourseSection()
                ->orderBy("menu_order");
        }


        // public function cart()
        // {
        //     return $this->hasOne(CourseCart::class, 'course_id', 'id');
        // }

        // public function wishlist()
        // {
        //     return $this->hasOne(CourseWishlist::class, 'course_id', 'id');
        // }
    }
}