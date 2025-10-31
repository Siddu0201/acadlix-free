<?php

namespace Yuvayana\Acadlix\Common\Models;

use Illuminate\Database\Capsule\Manager as DB;
use Illuminate\Database\Eloquent\Model;

defined('ABSPATH') || exit();

if (!class_exists('Course')) {
    class Course extends Model
    {
        protected $table;
        protected $primaryKey = 'ID';

        protected $with = [
            'author',
            'metas',
            // 'sections',
        ];

        protected $appends = [
            'rendered_post_content',
            'rendered_metas',
            'thumbnail',
            'users',
            'student_count',
        ];

        protected static $postType = ACADLIX_COURSE_CPT;

        public function __construct(array $attributes = [])
        {
            parent::__construct($attributes);

            $this->table = acadlix()->helper()->acadlix_wp_prefix('posts');
        }

        public function scopeOfCourse($query)
        {
            return $query->where('post_type', self::$postType);
        }

        public function scopeOfPublish($query)
        {
            return $query->where('post_status', 'publish');
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
                ? acadlix()->helper()->cpt()->acadlix_remome_prefix_meta_keys($keyValueArray, 'course')
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

        public function getStudentCountAttribute()
        {
            return acadlix()
                ->model()
                ->orderItem()
                ->where('course_id', $this->ID)
                ->whereHas('order', function ($query) {
                    $query->where('status', 'success');
                })
                ->count();
        }

        /**
         * Get the author of the course.
         *
         * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
         */
        public function author()
        {
            return $this->belongsTo(acadlix()->model()->wpUsers(), 'post_author', 'ID');
        }

        public function getUsersAttribute()
        {
            $renderedMetas = $this->rendered_metas;
            return array_key_exists('user_ids', $renderedMetas)
                ? array_map(function ($userId) {
                    return acadlix()->model()->wpUsers()->find($userId);
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
            $courseSections = acadlix()->model()->courseSection()->where('post_parent', $postId)->get();
            if ($courseSections->count() > 0) {
                foreach ($courseSections as $courseSection) {
                    acadlix()->model()->courseSection()->deleteCourseSection($courseSection->ID);
                }
            }

            // Delete other course related data like user activity meta
            acadlix()
                ->model()
                ->userActivityMeta()
                ->ofCourse()
                ->where('type_id', $postId)
                ->delete();

            // Remove course id from order items
            acadlix()->model()->orderItem()->softDeleteByCourseId($postId);

            // Remove cart items course
            acadlix()->model()->courseCart()->where('course_id', $postId)->delete();

            return true;
        }

        public function sections()
        {
            return $this
                ->hasMany(acadlix()->model()->courseSection(), 'post_parent', 'ID')
                ->ofCourseSection()
                ->orderBy('menu_order');
        }

        public function order_items()
        {
            return $this->hasMany(acadlix()->model()->orderItem(), 'course_id', 'ID');
        }

        public function cart()
        {
            return $this->hasMany(acadlix()->model()->courseCart(), 'course_id', 'id');
        }

        public function isCourseFree()
        {
            $price = $this->rendered_metas['price'];
            $enable_sale_price = $this->rendered_metas['enable_sale_price'];
            $sale_price = $this->rendered_metas['sale_price'];
            return $enable_sale_price ? 0 == $sale_price : 0 == $price;
        }

        public function isPurchasedBy($userId = '')
        {
            if (empty($userId)) {
                return false;
            }
            return acadlix()
                ->model()
                ->orderItem()
                ->where('course_id', $this->ID)
                ->whereHas('order', function ($q) use ($userId) {
                    $q
                        ->where('user_id', $userId)
                        ->where('status', 'success');
                })
                ->whereNull('subscription_id')
                ->exists();
        }

        public function getPurchasedCourses($userId = '', $search = null, $skip = 0, $take = 10, $with = [])
        {
            if (empty($userId)) {
                return [];
            }
            // Base query for one-time purchases
            // $query = self::whereHas('order_items', function ($oi) use ($userId) {
            //     $oi
            //         ->whereHas('order', function ($q) use ($userId) {
            //             $q
            //                 ->where('user_id', $userId)
            //                 ->where('status', 'success')
            //                 ->orderByDesc('created_at');
            //         })
            //         ->whereNull('subscription_id');  // exclude subscription items
            // });

            $courseTable = (new static)->getTable();
            $orderItemTable = acadlix()->model()->orderItem()->getTable();
            $ordersTable = acadlix()->model()->order()->getTable();

            // Base query
            $query = self::select("{$courseTable}.*")
                ->join("{$orderItemTable} as oi", 'oi.course_id', '=', "{$courseTable}.ID")
                ->join("{$ordersTable} as o", 'o.id', '=', 'oi.order_id')
                ->where('o.user_id', $userId)
                ->where('o.status', 'success')
                ->whereNull('oi.subscription_id')
                ->groupBy("{$courseTable}.ID")
                ->orderByDesc(DB::raw('MAX(o.created_at)'));

            // Apply eager loading if any
            if (!empty($with)) {
                $query->with($with);
            }

            // Apply search before fetching
            if (!empty($search)) {
                $query->where("{$courseTable}.post_title", 'like', "%$search%");
            }

            // Fetch results
            $courses = $query->get()->unique('ID')->values();

            // Get total count before pagination
            $total = $courses->count();

            // Apply skip/take for pagination
            $paginatedCourses = $courses->slice($skip, $take);

            // Add completion percentage
            $paginatedCourses->each(function ($course) use ($userId) {
                $course->completion_percentage = $course->getCourseCompletionPercentage($userId);
            });

            return [
                'total' => $total,
                'courses' => $paginatedCourses,
            ];
        }

        public function course_statistics()
        {
            return $this->hasMany(acadlix()->model()->courseStatistic(), 'course_id', 'ID');
        }

        public function getCourseCompletionPercentage($userId)
        {
            $statistics = $this->course_statistics()->where('user_id', $userId)->get();

            if ($statistics->isEmpty()) {
                return 0;
            }

            $total_count = $this->sections->flatMap->contents->count();
            if ($total_count === 0) {
                return 0;
            }

            $completed_count = $statistics->where('is_completed', 1)->count();

            return round(($completed_count / $total_count) * 100, 0);
        }

        // public function wishlist()
        // {
        //     return $this->hasOne(CourseWishlist::class, 'course_id', 'id');
        // }
    }
}
