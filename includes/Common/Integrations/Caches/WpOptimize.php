<?php

namespace Yuvayana\Acadlix\Common\Integrations\Caches;

defined('ABSPATH') || exit();

class WpOptimize 
{
    public function __construct()
    {
        add_filter('wp-optimize-minify-default-exclusions', [$this, 'js_exclude']);
    }

    public function js_exclude($excluded)
    {
        if(!is_array($excluded)) {
            $excluded = [];
        }
        $excluded[] = '/wp-content/plugins/' . ACADLIX_PLUGIN_FOLDER_NAME . '/build/' . acadlix()->versionPath. '/';
        return $excluded;
    }
}