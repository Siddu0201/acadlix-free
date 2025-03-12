<?php

namespace Yuvayana\Acadlix\Models;

use Illuminate\Database\Eloquent\Model;

defined('ABSPATH') || exit();

if (!class_exists('UserActivityMeta')) {
    class UserActivityMeta extends Model
    {
        protected $table = "acadlix_user_activity_meta";

        protected $fillable = [
            "user_token",
            "user_id",
            "type",
            "type_id",
            "meta_key",
            "meta_value"
        ];

        protected $casts = [
            "user_id" => "integer",
            "type_id" => "integer",
        ];

        public function scopeOfQuiz($query)
        {
            return $query->where("type", "quiz");
        }

        public function scopeOfQuizAttempt($query)
        {
            return $query->where("meta_key", "quiz_attempt");
        }

        public function scopeOfCourse($query)
        {
            return $query->where("type", "course");
        }

        public function scopeOfCourseWishlist($query)
        {
            return $query->where("meta_key", "wishlist");
        }

        public function scopeOfQuestion($query)
        {
            return $query->where("type", "question");
        }

        public function setUserIdAttribute($value){
            $this->attributes['user_id'] = $value == 0 ? NULL : $value ;
        }

        public function setUserTokenAttribute($value){
            $this->attributes['user_token'] = empty($value) ? NULL : $value ;
        }

        public function user()
        {
            return $this->belongsTo(WpUsers::class, 'user_id', 'ID');
        }

    }
}