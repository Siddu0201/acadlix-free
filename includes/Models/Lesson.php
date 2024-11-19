<?php

namespace Yuvayana\Acadlix\Models;

use Illuminate\Database\Eloquent\Model;
use Yuvayana\Acadlix\Helper\Helper;

defined('ABSPATH') || exit();

if (!class_exists('Lesson')) {
    class Lesson extends Model
    {
        protected $helper;

        protected $table = "lessons";

        protected $fillable = [
            "title",
            "type",
            "content",
            "video",
            "hours",
            "minutes",
            "seconds",
            "preview",
        ];

        protected $with = ['lesson_resources'];

        protected $appends = ['rendered_content'];

        protected $renderShortcode = false;

        public function __construct()
        {
            $this->helper = new Helper();
        }

        public function lesson_resources()
        {
            return $this->hasMany(LessonResource::class, 'lesson_id', 'id');
        }

        public function setVideoAttribute($value)
        {
            $this->attributes['video'] = maybe_serialize( $value );
        }

        public function getVideoAttribute($value)
        {
            return maybe_unserialize( $value );
        }

        public function getRenderedContentAttribute()
        {
            return $this->helper->renderShortCode($this->content);
        }

        public function contents()
        {
            return $this->morphMany(CourseSectionContent::class, 'contentable');
        }
    }
}