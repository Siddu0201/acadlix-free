<?php

namespace Yuvayana\Acadlix\Common\Integrations\Caches;

defined('ABSPATH') || exit();

if (!class_exists(__NAMESPACE__ . '\\Autoptimize')) {
    class Autoptimize
    {
        public function __construct()
        {
            // autoptimize_filter_js_exclude
            add_filter('autoptimize_filter_js_noptimize', [$this, 'js_exclude']);
        }

        public function js_exclude($excluded)
        {

            $excluded .= ', acadlix';
            return $excluded;
        }
    }
}
