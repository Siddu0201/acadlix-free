<?php

namespace Yuvayana\Acadlix\Common\Integrations\Caches;

defined('ABSPATH') || exit();

if (!class_exists(__NAMESPACE__ . '\\LiteSpeedCache')) {
    class LiteSpeedCache
    {
        public function __construct()
        {
            add_filter('litespeed_optimize_js_excludes', [$this, 'js_exclude']);
            add_filter('litespeed_optimize_css_excludes ', [$this, 'css_exclude']);
        }

        public function js_exclude($excluded)
        {
            if (!is_array($excluded)) {
                $excluded = [];
            }
            $excluded[] = 'wp';
            $excluded[] = 'acadlix';
            return $excluded;
        }

        public function css_exclude($excluded)
        {
            if (!is_array($excluded)) {
                $excluded = [];
            }
            $excluded[] = 'acadlix';
            return $excluded;
        }
    }
}