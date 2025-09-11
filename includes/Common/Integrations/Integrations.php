<?php 

namespace Yuvayana\Acadlix\Common\Integrations;

use Yuvayana\Acadlix\Common\Integrations\Caches\Caches;

defined('ABSPATH') || exit();

if (!class_exists('Integrations')) {
    class Integrations
    {
        protected $caches;
        public function __construct()
        {
            $this->caches();
        }

        public function caches(): Caches
        {
            if ($this->caches === null) {
                $this->caches = new Caches();
            }
            return $this->caches;
        }


    }
}
