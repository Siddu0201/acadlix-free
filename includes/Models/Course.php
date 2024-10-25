<?php

namespace Yuvayana\Acadlix\Models;

use Illuminate\Database\Eloquent\Model;

defined('ABSPATH') || exit();

if (!class_exists('Course')) {
    class Course extends Model
    {
        protected $table = "courses";

        protected $fillable = [
            'id',
            'duration',
            'duration_type',
            'start_date',
            'end_date',
            'difficulty_level',
            'question_and_answer',
            'price',
            'sale_price',
            'validity',
            'validity_type',
            'tax',
            'tax_percent',
            'allow_repurchase',
            'featured_video',
        ];

        protected $with = ['users', 'outcomes', 'faqs', 'sections', 'post'];

        public function faqs()
        {
            return $this->hasMany(CourseFaq::class, 'course_id', 'id');
        }

        public function users()
        {
            return $this->hasMany(CourseUser::class, 'course_id', 'id');
        }

        public function outcomes()
        {
            return $this->hasMany(CourseOutcome::class, 'course_id', 'id');
        }

        public function sections()
        {
            return $this->hasMany(CourseSection::class, 'course_id', 'id')->orderBy("sort");
        }

        public function post()
        {
            return $this->belongsTo(WpPosts::class, 'id', 'ID');
        }

        public function post_meta()
        {
            return $this->hasMany(WpPostMeta::class, 'post_id', 'id');
        }

        public function cart()
        {
            return $this->hasOne(CourseCart::class, 'course_id', 'id');
        }

        public function wishlist()
        {
            return $this->hasOne(CourseWishlist::class, 'course_id', 'id');
        }
    }
}