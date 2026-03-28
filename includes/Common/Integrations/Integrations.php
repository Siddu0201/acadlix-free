<?php

namespace Yuvayana\Acadlix\Common\Integrations;

use Yuvayana\Acadlix\Common\Integrations\Caches\Caches;

defined('ABSPATH') || exit();

if (!class_exists('Integrations')) {
  class Integrations
  {
    protected $caches = null;
    public function __construct()
    {
      $this->caches();
    }

    public function caches(): Caches
    {
      if (is_null($this->caches)) {
        $this->caches = new Caches();
      }
      return $this->caches;
    }


  }
}
