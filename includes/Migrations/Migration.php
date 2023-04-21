<?php

namespace Yuvayana\Acadlix\Migrations;

use Illuminate\Database\Capsule\Manager;
use Yuvayana\Acadlix\Migrations\QuizMigration;
use Yuvayana\Acadlix\Migrations\LanguageMigration;
use Yuvayana\Acadlix\Migrations\CategoryMigration;
use Yuvayana\Acadlix\Migrations\SubjectMigration;
use Yuvayana\Acadlix\Migrations\TopicMigration;
use Yuvayana\Acadlix\Migrations\QuestionMigration;
use Yuvayana\Acadlix\Migrations\QuestionLangMigration;
use Yuvayana\Acadlix\Migrations\QuizQuestionMigration;
use Yuvayana\Acadlix\Migrations\TemplateMigration;
use Yuvayana\Acadlix\Migrations\PrerequisiteMigration;
use Yuvayana\Acadlix\Migrations\SubjectTimeMigration;
use Yuvayana\Acadlix\Migrations\StatisticRefMigration;
use Yuvayana\Acadlix\Migrations\StatisticMigration;

if(!class_exists('Migration')){
    class Migration 
    {   
        protected static $_tables = [
            QuizMigration::class,
            LanguageMigration::class,
            CategoryMigration::class,
            SubjectMigration::class,
            TopicMigration::class,
            QuestionMigration::class,
            QuestionLangMigration::class,
            QuizQuestionMigration::class,
            TemplateMigration::class,
            PrerequisiteMigration::class,
            SubjectTimeMigration::class,
            StatisticRefMigration::class,
            StatisticMigration::class,
        ];
    
    
        public static function createTable()
        {
            foreach(self::$_tables as $table){
                (new $table())->up();
            }
        }
    
        public static function removeTable()
        {
            Manager::schema()->disableForeignKeyConstraints();
            foreach(self::$_tables as $table){
                (new $table())->down();
            }
            Manager::schema()->enableForeignKeyConstraints();
        }
    }
}
