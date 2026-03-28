<?php

namespace Yuvayana\Acadlix\Common\Seeder;

defined('ABSPATH') || exit();

if (!class_exists('Seeder')) {
  class Seeder
  {
    protected array $_seeders = [];

    protected $_subjectSeeder = null;

    public function __construct()
    {
      $this->subjectSeeder();
    }

    public function subjectSeeder(): SubjectSeeder
    {
      if (is_null($this->_subjectSeeder)) {
        $this->_subjectSeeder = new SubjectSeeder();
      }
      $this->_seeders[] = $this->_subjectSeeder;
      return $this->_subjectSeeder;
    }


    public function seed()
    {
      foreach ($this->_seeders as $seeder) {
        method_exists($seeder, 'run') && $seeder->run();
      }
    }
  }
}