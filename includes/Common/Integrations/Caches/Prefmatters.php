<?php

namespace Yuvayana\Acadlix\Common\Integrations\Caches;

defined('ABSPATH') || exit();

if (!class_exists(__NAMESPACE__ . '\\Prefmatters')) {
  class Prefmatters
  {
    public function __construct()
    {
      add_filter('perfmatters_minify_js_exclusions', [$this, 'js_exclude']);
      add_filter('perfmatters_defer_js_exclusions', [$this, 'defer_js_exclude']);
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

    public function defer_js_exclude($excluded)
    {
      if (!is_array($excluded)) {
        $excluded = [];
      }
      $excluded[] = 'wp';
      return $excluded;
    }
  }
}