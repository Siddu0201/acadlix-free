<?php

namespace Yuvayana\Acadlix\Models;

use Illuminate\Database\Eloquent\Model;
use Yuvayana\Acadlix\Helper\Helper;
defined('ABSPATH') || exit();

if (!class_exists('WpPosts')) {

    class WpPosts extends Model
    {
        protected $helper;

        protected $connection = 'wordpress';
        protected $table = 'posts';
        protected $primaryKey = 'ID';

        protected $with = ['author'];

        protected $appends = ['thumbnail_url', 'thumbnail_alt', 'rendered_post_content'];

        public function __construct()
        {
            $this->helper = new Helper();
        }

        public function getRenderedPostContentAttribute()
        {
            return $this->helper->renderShortCode($this->post_content);
        }

        public function thumbnailMeta()
        {
            return $this->hasOne(WpPostMeta::class, 'post_id', 'ID')
                ->where('meta_key', '_thumbnail_id');
        }

        public function author()
        {
            return $this->belongsTo(WpUsers::class, 'post_author', 'ID');
        }

        public function getThumbnailAltAttribute()
        {
            $thumbnailId = $this->thumbnailMeta->meta_value ?? null;
            if($thumbnailId){
                return get_post_meta($thumbnailId, '_wp_attachment_image_alt', true);
            }
            return null;
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