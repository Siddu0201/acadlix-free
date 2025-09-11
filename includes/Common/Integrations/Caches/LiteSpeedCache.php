<?php

namespace Yuvayana\Acadlix\Common\Integrations\Caches;

defined('ABSPATH') || exit();

if (!class_exists('LiteSpeedCache')) {
    class LiteSpeedCache
    {
        public function __construct()
        {
            add_filter('litespeed_optimize_js_excludes', [$this, 'js_exclude']);
        }

        public function js_exclude($excluded)
        {
            if(!is_array($excluded)) {
                $excluded = [];
            }
            $excluded[] = 'date.js';
            $excluded[] = '/wp-content/plugins/' . ACADLIX_PLUGIN_FOLDER_NAME . '/build/' . acadlix()->versionPath. '/';
            return $excluded;
        }
    }
}