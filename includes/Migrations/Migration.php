<?php

namespace Yuvayana\Acadlix\Migrations;

use Illuminate\Database\Capsule\Manager;
use Yuvayana\Acadlix\Migrations\QuizMigration;
use Yuvayana\Acadlix\Migrations\LanguageMigration;
use Yuvayana\Acadlix\Migrations\CategoryMigration;
use Yuvayana\Acadlix\Migrations\SubjectMigration;
use Yuvayana\Acadlix\Migrations\TopicMigration;

if(!class_exists('Migration')){
    class Migration 
    {   
        protected static $_tables = [
            QuizMigration::class,
            LanguageMigration::class,
            CategoryMigration::class,
            SubjectMigration::class,
            TopicMigration::class,
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
