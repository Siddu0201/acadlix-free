<?php

namespace Yuvayana\Acadlix\Common\Models;

use Illuminate\Database\Eloquent\Model;

defined('ABSPATH') || exit();

if (!class_exists('UserActivityMeta')) {
  class UserActivityMeta extends Model
  {
    protected $table;

    protected $fillable = [
      'user_token',
      'user_id',
      'type',
      'type_id',
      'meta_key',
      'meta_value',
      'reference_id', // Used for certificate ID
      'created_at',
    ];

    protected $casts = [
      'user_id' => 'integer',
      'type_id' => 'integer',
    ];

    public function __construct(array $attributes = [])
    {
      parent::__construct($attributes);

      $this->table = acadlix()->helper()->acadlix_table_prefix('user_activity_meta');
    }

    public function setMetaValueAttribute($value)
    {
      $this->attributes['meta_value'] = maybe_serialize($value); // phpcs:ignore
    }

    public function getMetaValueAttribute($value)
    {
      return maybe_unserialize($value);
    }

    public function scopeOfQuiz($query)
    {
      return $query->where('type', 'quiz');
    }

    public function scopeOfCourse($query)
    {
      return $query->where('type', 'course');
    }

    public function scopeOfQuestion($query)
    {
      return $query->where('type', 'question');
    }

    public function scopeOfCourseStatistic($query)
    {
      return $query->where('type', 'course_statistic');
    }

    public function scopeOfQuizAttempt($query)
    {
      return $query->where('meta_key', 'quiz_attempt');
    }

    public function scopeOfWishlist($query)
    {
      return $query->where('meta_key', 'wishlist');
    }

    public function scopeOfCourseStatisticIncompleteTime($query)
    {
      return $query->where('meta_key', 'course_statistic_incomplete_time');
    }

    public function scopeOfCourseStatisticCompleteTime($query)
    {
      return $query->where('meta_key', 'course_statistic_complete_time');
    }

    public function scopeOfCourseStatisticsQuizAttemptTime($query)
    {
      return $query->where('meta_key', 'course_statistic_quiz_attempt_time');
    }

    public function scopeOfCertificate($query)
    {
      return $query->where('type', 'certificate');
    }

    public function setUserIdAttribute($value)
    {
      $this->attributes['user_id'] = $value == 0 ? NULL : $value;
    }

    public function setUserTokenAttribute($value)
    {
      $this->attributes['user_token'] = empty($value) ? NULL : $value;
    }

    public function course()
    {
      return $this->belongsTo(acadlix()->model()->course(), 'type_id', 'ID');
    }

    public function quiz()
    {
      return $this->belongsTo(acadlix()->model()->quiz(), 'type_id', 'ID');
    }

    public function question()
    {
      return $this->belongsTo(acadlix()->model()->question(), 'type_id', 'id');
    }

    public function order()
    {
      return $this->belongsTo(acadlix()->model()->order(), 'type_id', 'id');
    }

    public function course_statistic()
    {
      return $this->belongsTo(acadlix()->model()->courseStatistic(), 'type_id', 'id');
    }

    public function user()
    {
      return $this->belongsTo(acadlix()->model()->wpUsers(), 'user_id', 'ID');
    }

    public function resolveWishlistItem()
    {
      switch ($this->type) {

        case 'course':
          $course = acadlix()->model()->course()->ofCourse()->ofPublish()->find($this->type_id);

          if ($course) {
            return [
              'item' => $course,
              'permalink' => get_permalink($course->ID),
            ];
          }
          break;
      }

      return null;
    }
  }
}
