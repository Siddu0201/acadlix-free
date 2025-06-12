<?php

namespace Yuvayana\Acadlix\Common\Assets;

defined('ABSPATH') || exit();

if (!class_exists("Assets")) {
    class Assets
    {
        protected static $_instance = null;

        public $manager = null;

        public function __construct()
        {
            $this->manager = new Manager();
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
