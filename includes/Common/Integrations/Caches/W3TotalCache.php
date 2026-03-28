<?php

namespace Yuvayana\Acadlix\Common\Integrations\Caches;

defined('ABSPATH') || exit();

if (!class_exists(__NAMESPACE__ . '\\W3TotalCache')) {
  class W3TotalCache
  {
    public function __construct()
    {
      // add_filter('w3tc_minify_js_do_excluded_tag_script_minification', [$this, 'minify_exclude']);
    }

    public function minify_exclude($excluded)
    {
      $excluded[] = 'acadlix';
      return $excluded;
    }
  }
}
