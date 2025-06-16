<?php

namespace Yuvayana\Acadlix\Common\Assets;

defined('ABSPATH') || exit();

if (!class_exists("Assets")) {
    class Assets
    {
        protected static $_instance = null;


        public function __construct()
        {
            $this->manager();
        }

        public function manager(){
            $instance = new Manager();
            return $instance;
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
