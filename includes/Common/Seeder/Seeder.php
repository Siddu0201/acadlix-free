<?php

namespace Yuvayana\Acadlix\Common\Seeder;

defined('ABSPATH') || exit();

if (!class_exists('Seeder')) {
    class Seeder
    {
        protected static $_instance = null;

        protected array $_seeders = [];

        public static function instance()
        {
            if (is_null(self::$_instance)) {
                self::$_instance = new self();
            }

            return self::$_instance;
        }

        public function seed()
        {
            foreach ($this->_seeders as $seeder) {
                method_exists($seeder, 'run') && $seeder->run();
            }
        }
    }
}