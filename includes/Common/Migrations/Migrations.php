<?php

namespace Yuvayana\Acadlix\Common\Migrations;

use Illuminate\Database\Capsule\Manager;

defined('ABSPATH') || exit();

if (!class_exists('Migrations')) {
    class Migrations
    {
        protected array $_migrations = [];

        protected $subjectMigration = null;
        protected $templateMigration = null;
        protected $questionMigration = null;
        protected $questionLangMigration = null;
        protected $statisticRefMigration = null;
        protected $statisticMigration = null;
        protected $toplistMigration = null;
        protected $courseCartMigration = null;
        protected $orderMigration = null;
        protected $orderItemMigration = null;
        protected $orderMetaMigration = null;
        protected $courseStatisticMigration = null;
        protected $userActivityMetaMigration = null;
        protected $quizShortcodeMigration = null;

        public function __construct()
        {
            $this->subject();
            $this->template();
            $this->question();
            $this->questionLang();
            $this->statisticRef();
            $this->statistic();
            $this->toplist();
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
            if(is_null($this->subjectMigration)){
                $this->subjectMigration = new SubjectMigration();
            }
            $this->_migrations[] = $this->subjectMigration;
            return $this->subjectMigration;
        }

        public function template()
        {
            if(is_null($this->templateMigration)){
                $this->templateMigration = new TemplateMigration();
            }
            $this->_migrations[] = $this->templateMigration;
            return $this->templateMigration;
        }

        public function question()
        {
            if(is_null($this->questionMigration)){
                $this->questionMigration = new QuestionMigration();
            }
            $this->_migrations[] = $this->questionMigration;
            return $this->questionMigration;
        }

        public function questionLang()
        {
            if(is_null($this->questionLangMigration)){
                $this->questionLangMigration = new QuestionLangMigration();
            }
            $this->_migrations[] = $this->questionLangMigration;
            return $this->questionLangMigration;
        }

        public function statisticRef()
        {
            if(is_null($this->statisticRefMigration)){
                $this->statisticRefMigration = new StatisticRefMigration();
            }
            $this->_migrations[] = $this->statisticRefMigration;
            return $this->statisticRefMigration;
        }

        public function statistic()
        {
            if(is_null($this->statisticMigration)){
                $this->statisticMigration = new StatisticMigration();
            }
            $this->_migrations[] = $this->statisticMigration;
            return $this->statisticMigration;
        }

        public function toplist()
        {
            if(is_null($this->toplistMigration)){
                $this->toplistMigration = new ToplistMigration();
            }
            $this->_migrations[] = $this->toplistMigration;
            return $this->toplistMigration;
        }

        public function courseCart()
        {
            if(is_null($this->courseCartMigration)){
                $this->courseCartMigration = new CourseCartMigration();
            }
            $this->_migrations[] = $this->courseCartMigration;
            return $this->courseCartMigration;
        }

        public function order()
        {
            if(is_null($this->orderMigration)){
                $this->orderMigration = new OrderMigration();
            }
            $this->_migrations[] = $this->orderMigration;
            return $this->orderMigration;
        }

        public function orderItem()
        {
            if(is_null($this->orderItemMigration)){
                $this->orderItemMigration = new OrderItemMigration();
            }
            $this->_migrations[] = $this->orderItemMigration;
            return $this->orderItemMigration;
        }

        public function orderMeta()
        {
            if(is_null($this->orderMetaMigration)){
                $this->orderMetaMigration = new OrderMetaMigration();
            }
            $this->_migrations[] = $this->orderMetaMigration;
            return $this->orderMetaMigration;
        }

        public function courseStatistic()
        {
            if(is_null($this->courseStatisticMigration)){
                $this->courseStatisticMigration = new CourseStatisticMigration();
            }
            $this->_migrations[] = $this->courseStatisticMigration;
            return $this->courseStatisticMigration;
        }

        public function userActivityMeta()
        {
            if(is_null($this->userActivityMetaMigration)){
                $this->userActivityMetaMigration = new UserActivityMetaMigration();
            }
            $this->_migrations[] = $this->userActivityMetaMigration;
            return $this->userActivityMetaMigration;
        }

        public function quizShortcode()
        {
            if(is_null($this->quizShortcodeMigration)){
                $this->quizShortcodeMigration = new QuizShortcodeMigration();
            }
            $this->_migrations[] = $this->quizShortcodeMigration;
            return $this->quizShortcodeMigration;
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
