<?php

namespace Yuvayana\Acadlix\Common\Seeder;

use Yuvayana\Acadlix\Common\Seeder\SubjectSeeder;

defined('ABSPATH') || exit();

if (!class_exists('Seeder')) {
    class Seeder
    {
        protected static $_instance = null;

        protected array $_seeders = [];

        protected ?SubjectSeeder $subjectSeeder = null;

        public static function instance()
        {
            if (is_null(self::$_instance)) {
                self::$_instance = new self();
            }

            return self::$_instance;
        }

        public function subjectSeeder(): SubjectSeeder
        {
            if (is_null($this->subjectSeeder)) {
                $this->subjectSeeder = new SubjectSeeder();
            }
            $this->_seeders[] = $this->subjectSeeder;
            return $this->subjectSeeder;
        }

        public function seed()
        {
            foreach ($this->_seeders as $seeder) {
                method_exists($seeder, 'run') && $seeder->run();
            }
        }
    }
}