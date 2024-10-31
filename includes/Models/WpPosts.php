<?php

namespace Yuvayana\Acadlix\Models;

use Illuminate\Database\Eloquent\Model;
defined('ABSPATH') || exit();

if (!class_exists('WpPosts')) {

    class WpPosts extends Model
    {
        protected $connection = 'wordpress';
        protected $table = 'posts';
        protected $primaryKey = 'ID';

        protected $with = ['author'];

        protected $appends = ['thumbnail_url'];

        public function thumbnailMeta()
        {
            return $this->hasOne(WpPostMeta::class, 'post_id', 'ID')
                ->where('meta_key', '_thumbnail_id');
        }

        public function author()
        {
            return $this->belongsTo(WpUsers::class, 'post_author', 'ID');
        }

        public function getThumbnailUrlAttribute()
        {
            $thumbnailId = $this->thumbnailMeta->meta_value ?? null;

            if ($thumbnailId) {
                return wp_get_attachment_url($thumbnailId);
            }

            return null;  // Return null if no thumbnail is found
        }

    }
}