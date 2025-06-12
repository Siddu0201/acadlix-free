<?php

namespace Yuvayana\Acadlix\Common\Migrations;

use Illuminate\Database\Capsule\Manager;
use Yuvayana\Acadlix\Common\Migrations\SubjectMigration;
use Yuvayana\Acadlix\Common\Migrations\SubjectTimeMigration;
use Yuvayana\Acadlix\Common\Migrations\TemplateMigration;
use Yuvayana\Acadlix\Common\Migrations\QuestionMigration;
use Yuvayana\Acadlix\Common\Migrations\QuestionLangMigration;
use Yuvayana\Acadlix\Common\Migrations\PrerequisiteMigration;
use Yuvayana\Acadlix\Common\Migrations\StatisticRefMigration;
use Yuvayana\Acadlix\Common\Migrations\StatisticMigration;
use Yuvayana\Acadlix\Common\Migrations\ToplistMigration;
use Yuvayana\Acadlix\Common\Migrations\CourseCartMigration;
use Yuvayana\Acadlix\Common\Migrations\OrderMigration;
use Yuvayana\Acadlix\Common\Migrations\OrderItemMigration;
use Yuvayana\Acadlix\Common\Migrations\OrderMetaMigration;
use Yuvayana\Acadlix\Common\Migrations\CourseStatisticMigration;
use Yuvayana\Acadlix\Common\Migrations\UserActivityMetaMigration;
use Yuvayana\Acadlix\Common\Migrations\QuizShortcodeMigration;
use Yuvayana\Acadlix\Common\Migrations\AssignmentUserStatsMigration;
use Yuvayana\Acadlix\Common\Migrations\AssignmentSubmissionsMigration;

defined( 'ABSPATH' ) || exit();

if(!class_exists('Migration')){
    class Migration 
    {   
        protected static $_tables = [
            SubjectMigration::class,
            SubjectTimeMigration::class,
            TemplateMigration::class,
            QuestionMigration::class,
            QuestionLangMigration::class,
            StatisticRefMigration::class,
            StatisticMigration::class,
            ToplistMigration::class,
            PrerequisiteMigration::class,
            CourseCartMigration::class,
            OrderMigration::class,
            OrderItemMigration::class,
            OrderMetaMigration::class,
            CourseStatisticMigration::class,
            UserActivityMetaMigration::class,
            QuizShortcodeMigration::class,
            AssignmentUserStatsMigration::class,
            AssignmentSubmissionsMigration::class
        ];
    
        public static function createTable()
        {
            foreach(self::$_tables as $table_class){
                if(method_exists($table_class, 'up')){
                    $table = new $table_class();
                    $table->up();
                }

                if(method_exists($table_class, 'update')){
                    $table = new $table_class();
                    $table->update();
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
