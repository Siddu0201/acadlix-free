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
use Yuvayana\Acadlix\Migrations\ToplistMigration;
use Yuvayana\Acadlix\Migrations\QuizAttemptMigration;
use Yuvayana\Acadlix\Migrations\AnswerOptionMigration;
use Yuvayana\Acadlix\Migrations\QuizOptionMigration;
use Yuvayana\Acadlix\Migrations\ParagraphMigration;
use Yuvayana\Acadlix\Migrations\ParagraphLangMigration;
use Yuvayana\Acadlix\Migrations\LessonMigration;
use Yuvayana\Acadlix\Migrations\LessonResourceMigration;
use Yuvayana\Acadlix\Migrations\CourseMigration;
use Yuvayana\Acadlix\Migrations\CourseSectionMigration;
use Yuvayana\Acadlix\Migrations\CourseSectionContentMigration;
use Yuvayana\Acadlix\Migrations\CourseUserMigration;
use Yuvayana\Acadlix\Migrations\CourseOutcomeMigration;
use Yuvayana\Acadlix\Migrations\CourseFaqMigration;
use Yuvayana\Acadlix\Migrations\CourseCartMigration;
use Yuvayana\Acadlix\Migrations\OrderMigration;
use Yuvayana\Acadlix\Migrations\OrderItemMigration;
use Yuvayana\Acadlix\Migrations\OrderMetaMigration;
use Yuvayana\Acadlix\Migrations\CourseWishlistMigration;
use Yuvayana\Acadlix\Migrations\CourseStatisticMigration;
use Yuvayana\Acadlix\Migrations\UserActivityMetaMigration;

defined( 'ABSPATH' ) || exit();

if(!class_exists('Migration')){
    class Migration 
    {   
        protected static $_tables = [
            // LanguageMigration::class,
            // CategoryMigration::class,
            SubjectMigration::class,
            TemplateMigration::class,
            // QuizMigration::class,
            // QuizLangMigration::class,
            SubjectTimeMigration::class,
            // ParagraphMigration::class,
            QuestionMigration::class,
            QuestionLangMigration::class,
            // PrerequisiteMigration::class,
            StatisticRefMigration::class,
            StatisticMigration::class,
            ToplistMigration::class,
            // QuizAttemptMigration::class,
            // AnswerOptionMigration::class,
            // QuizOptionMigration::class,
            // ParagraphLangMigration::class,
            // LessonMigration::class,
            // LessonResourceMigration::class,
            // CourseMigration::class,
            // CourseSectionMigration::class,
            // CourseSectionContentMigration::class,
            // CourseUserMigration::class,
            // CourseOutcomeMigration::class,
            // CourseFaqMigration::class,
            CourseCartMigration::class,
            OrderMigration::class,
            OrderItemMigration::class,
            OrderMetaMigration::class,
            // CourseWishlistMigration::class,
            CourseStatisticMigration::class,
            UserActivityMetaMigration::class
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
