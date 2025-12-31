<?php

namespace Yuvayana\Acadlix\Common\Models;

use Illuminate\Database\Eloquent\Model;
use WP_Error;

defined('ABSPATH') || exit;

class CourseReview extends Model
{
  protected $table;
  protected $primaryKey = 'comment_ID';
  protected $fillable = [
    'comment_post_ID',
    'user_id',
    'comment_author',
    'comment_author_email',
    'comment_content',
    'comment_approved',
    'comment_type',
    'comment_agent',
    'comment_date',
    'comment_date_gmt',
  ];
  public $timestamps = false;


  protected static $commentType = 'course_review';

  protected $with = [
    'author',
    'metas',
  ];

  protected $appends = [
    'rating',
  ];

  public function __construct(array $attributes = [])
  {
    parent::__construct($attributes);
    $this->table = acadlix()->helper()->acadlix_wp_prefix('comments');
  }

  public function commentType()
  {
    return self::$commentType;
  }

  public function scopeOfCourseRating($query)
  {
    return $query->where('comment_type', self::$commentType);
  }

  public function scopeOfApproved($query)
  {
    return $query->where('comment_approved', 'approved');
  }

  public function getRatingAttribute()
  {
    return $this->getMetaValue('acadlix_rating');
  }

  public function metas()
  {
    return $this->hasMany(acadlix()->model()->commentMeta(), 'comment_id', 'comment_ID');
  }

  public function author()
  {
    return $this->belongsTo(acadlix()->model()->wpUsers(), 'comment_author', 'ID');
  }

  public function course()
  {
    return $this->belongsTo(acadlix()->model()->course(), 'comment_post_ID', 'ID');
  }

  public function getMetaValue($key)
  {
    $meta = $this->metas()->where('meta_key', $key)->first();

    // Check if the meta exists and return its value or null
    return $meta?->meta_value ?? null;
  }

  public function updateStatus($status = 'pending')
  {
    return $this->update(['comment_approved' => $status]);
  }

  public function updateOrCreateMeta($metaKey, $metaValue)
  {
    return $this->metas()->updateOrCreate(
      // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key -- Its custom order meta table
      ['meta_key' => $metaKey],  // Condition to check for existing meta_key
      // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_value -- Its custom order meta table
      ['meta_value' => $metaValue]  // Values to update or create
    );
  }


  public function delete()
  {
    // Delete associated meta
    $metas = $this->metas;
    foreach ($metas as $meta) {
      $meta->delete();
    }
    return parent::delete();
  }

  public function add_or_update_review(
    $user_id,
    $course_id,
    $rating,
    $review_text,
    $review_id = 0
  ) {
    // Validate user
    $user = get_userdata($user_id);
    if (!$user) {
      return new WP_Error(
        'invalid_user',
        __('Invalid user.', 'acadlix'),
        array('status' => 400)
      );
    }

    if (!comments_open($course_id)) {
      return new WP_Error(
        'comments_closed',
        __('Comments are closed for this course.', 'acadlix'),
        array('status' => 403)
      );
    }

    $moderation = acadlix()->helper()
      ->acadlix_get_option('acadlix_require_admin_approval_for_reviews', 'no') === 'yes' ? true : false;

    $previous_rating = $this->where('user_id', $user_id)
      ->where('comment_post_ID', $course_id)
      ->first();

    if ($previous_rating) {
      $review_id = (int) $previous_rating->comment_ID;
      // Update using WP API
      $previous_rating->update([
        'comment_ID' => $review_id,
        'comment_content' => $review_text,
        'comment_approved' => $moderation ? 'pending' : 'approved',
        'comment_date' => current_time('mysql'),
        'comment_date_gmt' => current_time('mysql', 1),
      ]);
      $previous_rating->updateOrCreateMeta('acadlix_rating', (int) $rating);
    } else {
      // Insert new comment
      $review = $this->create([
        'comment_post_ID' => $course_id,
        'user_id' => $user_id,
        'comment_author' => $user->display_name,
        'comment_author_email' => $user->user_email,
        'comment_content' => $review_text,
        'comment_approved' => $moderation ? 'pending' : 'approved',
        'comment_type' => self::$commentType,
        'comment_agent' => 'AcadlixPlugin',
        'comment_date' => current_time('mysql'),
        'comment_date_gmt' => current_time('mysql', 1),
      ]);

      if (!$review) {
        return new WP_Error(
          'review_error',
          __('There was an error submitting the review.', 'acadlix'),
          array('status' => 500)
        );
      }
      $review->updateOrCreateMeta('acadlix_rating', (int) $rating);
      $review_id = (int) $review->comment_ID;
    }

    return $review;
  }



}
