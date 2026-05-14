<?php

namespace Yuvayana\Acadlix\Common\Integrations\Caches;

defined('ABSPATH') || exit();

if (!class_exists('Caches')) {
  class Caches
  {
    protected $litespeed;
    protected $autoptimize;
    protected $w3totalcache;
    protected $wpoptimize;
    protected $prefmatters;

    public function __construct()
    {
      $this->litespeed();
      $this->autoptimize();
      $this->w3totalcache();
      $this->wpoptimize();
      $this->prefmatters();
    }

    public function litespeed(): LiteSpeedCache
    {
      if (is_null($this->litespeed)) {
        $this->litespeed = new LiteSpeedCache();
      }
      return $this->litespeed;
    }

    public function autoptimize(): Autoptimize
    {
      if (is_null($this->autoptimize)) {
        $this->autoptimize = new Autoptimize();
      }
      return $this->autoptimize;
    }

    public function w3totalcache(): W3TotalCache
    {
      if (is_null($this->w3totalcache)) {
        $this->w3totalcache = new W3TotalCache();
      }
      return $this->w3totalcache;
    }

    public function wpoptimize(): WpOptimize
    {
      if (is_null($this->wpoptimize)) {
        $this->wpoptimize = new WpOptimize();
      }
      return $this->wpoptimize;
    }

    public function prefmatters(): Prefmatters
    {
      if (is_null($this->prefmatters)) {
        $this->prefmatters = new Prefmatters();
      }
      return $this->prefmatters;
    }

    public function clearAll()
    {
      $this->litespeed()->clear();
      $this->autoptimize()->clear();
      $this->w3totalcache()->clear();
      $this->wpoptimize()->clear();
      $this->prefmatters()->clear();

      // WP Rocket
      if (function_exists('rocket_clean_domain')) {
        rocket_clean_domain();
      }

      // WP Super Cache
      if (function_exists('wp_cache_clear_cache')) {
        global $file_prefix;
        wp_cache_clear_cache($file_prefix);
      }

      // SG Optimizer
      if (function_exists('sg_cachepress_purge_cache')) {
        sg_cachepress_purge_cache();
      }

      // Elementor CSS cache
      if (class_exists('\Elementor\Plugin')) {
        \Elementor\Plugin::$instance->files_manager->clear_cache();
      }

      // WordPress object cache
      if (function_exists('wp_cache_flush')) {
        wp_cache_flush();
      }
    }
  }
}
