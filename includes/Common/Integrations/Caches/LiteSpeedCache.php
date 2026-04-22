<?php

namespace Yuvayana\Acadlix\Common\Integrations\Caches;

defined('ABSPATH') || exit();

if (!class_exists(__NAMESPACE__ . '\\LiteSpeedCache')) {
  class LiteSpeedCache
  {
    public function __construct()
    {
      // add_filter('litespeed_optimize_js_excludes', [$this, 'js_exclude']);
      // add_filter('litespeed_optimize_css_excludes ', [$this, 'css_exclude']);
      add_action('plugins_loaded', [$this, 'init_cache_detection'], 20);
    }

    public function init_cache_detection()
    {
      if ($this->is_litespeed_active()) {
        add_filter('litespeed_optimize_js_excludes', [$this, 'js_exclude']);
        add_filter('litespeed_optimize_css_excludes', [$this, 'css_exclude']);
        add_filter('script_loader_src', [$this, 'handle_script_loader_src'], 10, 2);
      }
    }

    public function is_litespeed_active()
    {
      return defined('LSCWP_V')
        || has_filter('litespeed_optimize_js_excludes')
        || isset($_SERVER['LSCACHE_VARY_VALUE']);
    }

    public function handle_script_loader_src($src, $handle)
    {
      if (strpos($handle, 'acadlix') !== false) {
        $src = add_query_arg('_litespeed_rm_qs', '0', $src);
      }
      return $src;
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