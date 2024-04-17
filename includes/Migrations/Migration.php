<?php

namespace Yuvayana\Acadlix\Migrations;

use Illuminate\Database\Capsule\Manager;
use Yuvayana\Acadlix\Migrations\LanguageMigration;
use Yuvayana\Acadlix\Migrations\CategoryMigration;
use Yuvayana\Acadlix\Migrations\SubjectMigration;
use Yuvayana\Acadlix\Migrations\TemplateMigration;
use Yuvayana\Acadlix\Migrations\QuizMigration;
use Yuvayana\Acadlix\Migrations\QuizLangMigration;
use Yuvayana\Acadlix\Migrations\SubjectTimeMigration;
use Yuvayana\Acadlix\Migrations\QuestionMigration;
use Yuvayana\Acadlix\Migrations\QuestionLangMigration;
use Yuvayana\Acadlix\Migrations\PrerequisiteMigration;
use Yuvayana\Acadlix\Migrations\StatisticRefMigration;
use Yuvayana\Acadlix\Migrations\StatisticMigration;

if(!class_exists('Migration')){
    class Migration 
    {   
        protected static $_tables = [
            LanguageMigration::class,
            CategoryMigration::class,
            SubjectMigration::class,
            TemplateMigration::class,
            QuizMigration::class,
            QuizLangMigration::class,
            SubjectTimeMigration::class,
            QuestionMigration::class,
            QuestionLangMigration::class,
            PrerequisiteMigration::class,
            StatisticRefMigration::class,
            StatisticMigration::class,
        ];
    
    
        public static function createTable()
        {
            foreach(self::$_tables as $table_class){
                if(method_exists($table_class, 'up')){
                    $table = new $table_class();
                    $table->up();
                }
            }
        }
    
        public static function removeTable()
        {
            Manager::schema()->disableForeignKeyConstraints();
            foreach(self::$_tables as $table_class){
                if(method_exists($table_class, 'down')){
                    $table = new $table_class();
                    $table->down();
                }
            }
            Manager::schema()->enableForeignKeyConstraints();
        }
    }
}
