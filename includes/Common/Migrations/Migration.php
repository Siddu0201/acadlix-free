<?php

namespace Yuvayana\Acadlix\Common\Migrations;

use Illuminate\Database\Capsule\Manager;

defined('ABSPATH') || exit();

if (!class_exists('Migration')) {
    class Migration
    {
        protected array $_migrations = [];

        public function __construct()
        {
            $this->subject();
            $this->subjectTime();
            $this->template();
            $this->question();
            $this->questionLang();
            $this->statisticRef();
            $this->statistic();
            $this->toplist();
            $this->prerequisite();
            $this->courseCart();
            $this->order();
            $this->orderItem();
            $this->orderMeta();
            $this->courseStatistic();
            $this->userActivityMeta();
            $this->quizShortcode();
        }

        public function subject()
        {
            $instance = new SubjectMigration();
            $this->_migrations[] = $instance;
            return $instance;
        }

        public function subjectTime()
        {
            $instance = new SubjectTimeMigration();
            $this->_migrations[] = $instance;
            return $instance;
        }

        public function template()
        {
            $instance = new TemplateMigration();
            $this->_migrations[] = $instance;
            return $instance;
        }

        public function question()
        {
            $instance = new QuestionMigration();
            $this->_migrations[] = $instance;
            return $instance;
        }

        public function questionLang()
        {
            $instance = new QuestionLangMigration();
            $this->_migrations[] = $instance;
            return $instance;
        }

        public function statisticRef()
        {
            $instance = new StatisticRefMigration();
            $this->_migrations[] = $instance;
            return $instance;
        }

        public function statistic()
        {
            $instance = new StatisticMigration();
            $this->_migrations[] = $instance;
            return $instance;
        }

        public function toplist()
        {
            $instance = new ToplistMigration();
            $this->_migrations[] = $instance;
            return $instance;
        }

        public function prerequisite()
        {
            $instance = new PrerequisiteMigration();
            $this->_migrations[] = $instance;
            return $instance;
        }

        public function courseCart()
        {
            $instance = new CourseCartMigration();
            $this->_migrations[] = $instance;
            return $instance;
        }

        public function order()
        {
            $instance = new OrderMigration();
            $this->_migrations[] = $instance;
            return $instance;
        }

        public function orderItem()
        {
            $instance = new OrderItemMigration();
            $this->_migrations[] = $instance;
            return $instance;
        }

        public function orderMeta()
        {
            $instance = new OrderMetaMigration();
            $this->_migrations[] = $instance;
            return $instance;
        }

        public function courseStatistic()
        {
            $instance = new CourseStatisticMigration();
            $this->_migrations[] = $instance;
            return $instance;
        }

        public function userActivityMeta()
        {
            $instance = new UserActivityMetaMigration();
            $this->_migrations[] = $instance;
            return $instance;
        }

        public function quizShortcode()
        {
            $instance = new QuizShortcodeMigration();
            $this->_migrations[] = $instance;
            return $instance;
        }

        public function createTable()
        {
            foreach ($this->_migrations as $migration) {
                method_exists($migration, 'up') && $migration->up();
                method_exists($migration, 'update') && $migration->update();
            }
        }

        public function removeTable()
        {
            Manager::schema()->disableForeignKeyConstraints();
            foreach ($this->_migrations as $migration) {
                method_exists($migration, 'down') && $migration->down();
            }
            Manager::schema()->enableForeignKeyConstraints();
        }
    }
}
