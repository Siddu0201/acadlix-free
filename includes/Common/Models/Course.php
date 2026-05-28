<?php

namespace Yuvayana\Acadlix\Common\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Capsule\Manager as DB;

defined('ABSPATH') || exit();

if (!class_exists('Course')) {
  class Course extends Model
  {
    protected $table;
    protected $primaryKey = 'ID';

    protected $with = [
      'author',
      'metas',
      'course_categories',
      'course_tags',
      // 'sections',
    ];

    protected $appends = [
      'rendered_post_content',
      'rendered_metas',
      'thumbnail',
      'users',
      'student_count',
      'rendered_categories',
      'rendered_tags',
    ];

    protected static $postType = ACADLIX_COURSE_CPT;
    protected $contentTypeCounts = null;

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

    // public function getStudentCountAttribute()
    // {
    //   return acadlix()
    //     ->model()
    //     ->orderItem()
    //     ->ofCourse()
    //     ->where('item_id', $this->ID)
    //     ->whereHas('order', function ($query) {
    //       $query->where('status', 'success');
    //     })
    //     ->count();
    // }

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
      acadlix()->model()->orderItem()->softDeleteByItemId($postId);

      // Remove cart items course
      acadlix()->model()->courseCart()->where('item_id', $postId)->delete();

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
      return $this->hasMany(acadlix()->model()->orderItem(), 'item_id', 'ID')->where('type', 'course');
    }

    public function cart()
    {
      return $this->hasMany(acadlix()->model()->courseCart(), 'item_id', 'ID')->where('type', 'course');
    }

    public function course_categories()
    {
      return $this->belongsToMany(
        acadlix()->model()->wpTermTaxonomy(),
        acadlix()->helper()->acadlix_wp_prefix('term_relationships'),
        'object_id',
        'term_taxonomy_id'
      )
        ->where('taxonomy', ACADLIX_COURSE_CATEGORY_TAXONOMY)
        ->with('term');
    }

    public function getRenderedCategoriesAttribute()
    {
      return $this->course_categories->map(function ($cat) {
        return [
          'id' => $cat->term_id,
          'name' => $cat->term->name,
          'slug' => $cat->term->slug,
        ];
      })->values();
    }

    public function course_tags()
    {
      return $this->belongsToMany(
        acadlix()->model()->wpTermTaxonomy(),
        acadlix()->helper()->acadlix_wp_prefix('term_relationships'),
        'object_id',
        'term_taxonomy_id'
      )
        ->where('taxonomy', ACADLIX_COURSE_TAG_TAXONOMY)
        ->with('term');
    }

    public function getRenderedTagsAttribute()
    {
      return $this->course_tags->map(function ($tag) {
        return [
          'id' => $tag->term_id,
          'name' => $tag->term->name,
          'slug' => $tag->term->slug,
        ];
      })->values();
    }

    public function comments()
    {
      return $this->hasMany(acadlix()->model()->courseReview(), 'comment_post_ID', 'ID')
        ->ofCourseRating();
    }

    public function getTotalRatings()
    {
      return $this->comments()
        ->ofApproved()
        ->count();
    }

    public function getAverageRating()
    {
      $totalRatings = $this->getTotalRatings();
      if ($totalRatings === 0) {
        return 0;
      }
      $totalRatingValue = 0;
      $this->comments()
        ->ofApproved()
        ->each(function ($comment) use (&$totalRatingValue) {
          $ratingValue = (int) $comment->getMetaValue('acadlix_rating') ?? 0;
          $totalRatingValue += $ratingValue;
        });
      $average = $totalRatingValue / $totalRatings;
      return $average ? round(floatval($average), 2) : 0;
    }

    public function getRatingBreakdown()
    {
      $breakdown = [];
      for ($i = 5; $i >= 1; $i--) {
        $count = 0;
        $this->comments()
          ->ofApproved()
          ->each(function ($comment) use (&$count, $i) {
            $ratingValue = (int) $comment->getMetaValue('acadlix_rating') ?? 0;
            if ($ratingValue == $i) {
              $count++;
            }
          });
        $breakdown[$i] = $count;
      }
      return $breakdown;
    }

    public function isFree()
    {
      $price = $this->rendered_metas['price'] ?? 0;
      $enable_sale_price = $this->rendered_metas['enable_sale_price'] ?? false;
      $sale_price = $this->rendered_metas['sale_price'] ?? 0;
      return $enable_sale_price ? 0 == $sale_price : 0 == $price;
    }

    public function getContentTypeCounts()
    {
      if ($this->contentTypeCounts !== null) {
        return $this->contentTypeCounts;
      }

      $counts = [];

      $metas = $this->sections
        ->flatMap->contents
        ->flatMap->metas
        ->where('meta_key', '_acadlix_course_section_content_type');

      foreach ($metas as $meta) {

        $type = $meta->meta_value;

        $counts[$type] = ($counts[$type] ?? 0) + 1;
      }

      $this->contentTypeCounts = $counts;

      return $counts;
    }

    public function getTotalLessons()
    {
      return $this->getContentTypeCounts()['lesson'] ?? 0;
    }

    public function getTotalQuizzes()
    {
      return $this->getContentTypeCounts()['quiz'] ?? 0;
    }

    public function isPurchasedBy($userId = '')
    {
      if (empty($userId)) {
        return false;
      }
      return acadlix()
        ->model()
        ->orderItem()
        ->ofCourse()
        ->where('item_id', $this->ID)
        ->whereHas('order', function ($q) use ($userId) {
          $q
            ->where('user_id', $userId)
            ->where('status', 'success');
        })
        ->whereNull('subscription_id')
        ->exists();
    }

    public function getPurchasedCourses($userId = '', $search = null, $skip = 0, $take = 10, $with = [], $categoryId = null)
    {
      if (empty($userId)) {
        return [
          'total' => 0,
          'courses' => collect(),
          'category_ids' => collect(),
        ];
      }
      $orderItemTable = acadlix()->model()->orderItem()->getTable();
      $ordersTable = acadlix()->model()->order()->getTable();

      $purchaseMap = DB::table($orderItemTable)
        ->join($ordersTable, "$ordersTable.id", '=', "$orderItemTable.order_id")
        ->whereNull("$orderItemTable.subscription_id")
        ->where("$ordersTable.user_id", $userId)
        ->where("$ordersTable.status", 'success')
        ->where("$orderItemTable.type", 'course')
        ->selectRaw("$orderItemTable.item_id as course_id, MAX($ordersTable.created_at) as purchased_at")
        ->groupBy("$orderItemTable.item_id")
        ->pluck('purchased_at', 'course_id');


      $purchaseMap = $purchaseMap
        ->filter()
        ->sortByDesc(fn($date) => $date);

      $courseIds = $purchaseMap->keys()->values();

      if ($courseIds->isEmpty()) {
        return [
          'total' => 0,
          'courses' => collect(),
          'category_ids' => collect(),
        ];
      }

      $termRelationshipsTable = acadlix()->model()->wpTermRelationship()->getTable();
      $categoryIds = DB::table($termRelationshipsTable)
        ->whereIn('object_id', $courseIds)
        ->pluck('term_taxonomy_id')
        ->unique()
        ->values();

      $idsString = $courseIds->implode(',');

      $query = self::ofPublish()
        ->whereIn('ID', $courseIds)
        ->orderByRaw("FIELD(ID, $idsString)");
      // Apply eager loading if any
      if (!empty($with)) {
        $query->with($with);
      }

      // Apply search before fetching
      if (!empty($search)) {
        $query->where("post_title", 'like', "%$search%");
      }

      if (!is_null($categoryId)) {
        $query->whereHas('course_categories', function ($q) use ($categoryId) {
          $q->where('term_id', $categoryId);
        });
      }

      // Get total count before pagination
      $total = $query->count();

      if ($total <= $skip) {
        $skip = 0;
      }

      // Apply skip/take for pagination
      $paginatedCourses = $query->skip($skip)->take($take)->get();

      // Add completion percentage
      $paginatedCourses->each(function ($course) use ($userId) {
        $course->completion_percentage = $course->getCourseCompletionPercentage($userId);
      });

      return [
        'total' => $total,
        'courses' => $paginatedCourses,
        'category_ids' => $categoryIds,
      ];
    }

    public function getTopCourses($limit = 5)
    {
      $courseTable = $this->getTable();
      $orderItemTable = acadlix()->model()->orderItem()->getTable();
      $ordersTable = acadlix()->model()->order()->getTable();

      $topCourses = DB::table($courseTable)
        ->join($orderItemTable, "$orderItemTable.item_id", '=', "$courseTable.ID")
        ->join($ordersTable, "$ordersTable.id", '=', "$orderItemTable.order_id")
        ->where("$orderItemTable.type", 'course')
        ->where("$ordersTable.status", 'success')
        ->select(
          "$courseTable.ID",
          "$courseTable.post_title as course_name",
          DB::raw("COUNT(DISTINCT $ordersTable.user_id) as total_users")
        )
        ->groupBy("$courseTable.ID")
        ->orderByDesc('total_users')
        ->limit($limit)
        ->get()
        ->map(function ($course) {
          $course->average_rating = $this->find($course->ID)->getAverageRating();
          $course->total_revenue = $this->find($course->ID)->getRevenue();
          return $course;
        });

      return $topCourses;
    }

    public function getRevenue()
    {
      $courseTable = $this->getTable();
      $orderItemTable = acadlix()->model()->orderItem()->getTable();
      $ordersTable = acadlix()->model()->order()->getTable();
      $totalRevenue = DB::table($courseTable)
        ->join(
          $orderItemTable,
          "$orderItemTable.item_id",
          '=',
          "$courseTable.ID"
        )
        ->join(
          $ordersTable,
          "$ordersTable.id",
          '=',
          "$orderItemTable.order_id"
        )
        ->whereNull("$orderItemTable.subscription_id")
        ->where("$orderItemTable.type", 'course')
        ->where("$ordersTable.status", 'success')
        ->where("$courseTable.ID", $this->ID)
        ->sum("$ordersTable.total_amount");
      return $totalRevenue;
    }

    public function course_statistics()
    {
      return $this->hasMany(acadlix()->model()->courseStatistic(), 'course_id', 'ID');
    }

    public function getCourseCompletionPercentage($userId)
    {
      global $wpdb;
      // $statistics = $this->course_statistics()->where('user_id', $userId)->get();

      // if ($statistics->isEmpty()) {
      //   return 0;
      // }
      if (!$userId) {
        return 0;
      }

      $sectionIds = DB::table($wpdb->posts)
        ->where('post_parent', $this->ID)
        ->where('post_type', ACADLIX_COURSE_SECTION_CPT)
        ->pluck('ID');

      $total_count = 0;

      if ($sectionIds->isNotEmpty()) {
        $total_count = DB::table($wpdb->posts)
          ->whereIn('post_parent', $sectionIds)
          ->where('post_type', ACADLIX_COURSE_SECTION_CONTENT_CPT)
          ->where('post_status', 'publish')
          ->count();
      }

      // $total_count = $this->sections->flatMap->contents->count();
      if ($total_count === 0) {
        return 0;
      }

      $courseStatisticTable = acadlix()->model()->courseStatistic()->getTable();
      $completed_count = DB::table($courseStatisticTable)
        ->where('course_id', $this->ID)
        ->where('user_id', $userId)
        ->where('is_completed', 1)
        ->count();

      // $completed_count = $statistics->where('is_completed', 1)->count();

      return round(($completed_count / $total_count) * 100, 0);
    }

    public function getStudentCountAttribute()
    {
      return $this->getStudentUsers()->unique()->count();
    }

    public function getStudentsAttribute()
    {
      return $this->getStudentUsers()->unique()->values();
    }

    protected function getStudentUsers()
    {
      return acadlix()
        ->model()
        ->orderItem()
        ->ofCourse()
        ->where('item_id', $this->ID)
        ->whereNull('subscription_id')
        ->whereHas('order', function ($q) {
          $q->where('status', 'success');
        })
        ->with('order:id,user_id')
        ->get()
        ->pluck('order.user_id')
        ->filter();
    }

    // public function wishlist()
    // {
    //     return $this->hasOne(CourseWishlist::class, 'course_id', 'id');
    // }
  }
}
