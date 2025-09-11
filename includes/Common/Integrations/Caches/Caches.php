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

        public function __construct()
        {
            $this->litespeed();
            $this->autoptimize();
            $this->w3totalcache();
            $this->wpoptimize();
        }   

        public function litespeed(): LiteSpeedCache
        {
            if ($this->litespeed === null) {
                $this->litespeed = new LiteSpeedCache();
            }
            return $this->litespeed;
        }

        public function autoptimize(): Autoptimize
        {
            if ($this->autoptimize === null) {
                $this->autoptimize = new Autoptimize();
            }
            return $this->autoptimize;
        }

        public function w3totalcache(): W3TotalCache
        {
            if ($this->w3totalcache === null) {
                $this->w3totalcache = new W3TotalCache();
            }
            return $this->w3totalcache;
        }

        public function wpoptimize(): WpOptimize
        {
            if ($this->wpoptimize === null) {
                $this->wpoptimize = new WpOptimize();
            }
            return $this->wpoptimize;
        }
    }
}
