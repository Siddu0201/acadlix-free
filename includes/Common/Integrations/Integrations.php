<?php

namespace Yuvayana\Acadlix\Common\Integrations;

use Yuvayana\Acadlix\Common\Integrations\Caches\Caches;
use Yuvayana\Acadlix\Common\Integrations\KnitPay\KnitPay;

defined('ABSPATH') || exit();

if (!class_exists('Integrations')) {
  class Integrations
  {
    protected $caches = null;
    protected $knit_pay = null;
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

    public function knit_pay(): KnitPay
    {
      if (is_null($this->knit_pay)) {
        $this->knit_pay = new KnitPay();
      }
      return $this->knit_pay;
    }
  }
}
