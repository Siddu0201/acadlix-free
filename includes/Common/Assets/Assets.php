<?php

namespace Yuvayana\Acadlix\Common\Assets;

defined('ABSPATH') || exit();

if (!class_exists("Assets")) {
    class Assets
    {
        protected static $_instance = null;

        protected $manager = null;

        public function __construct()
        {
            $this->manager();
        }

        public function manager(): Manager {
            if (is_null($this->manager)) {
                $this->manager = new Manager();
            }
            return $this->manager;
        }


        public static function instance()
        {
            if (is_null(self::$_instance)) {
                self::$_instance = new self();
            }

            return self::$_instance;
        }
    }
}
