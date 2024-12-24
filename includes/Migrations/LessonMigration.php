<?php

namespace Yuvayana\Acadlix\Migrations;

use Illuminate\Database\Capsule\Manager;

defined( 'ABSPATH' ) || exit();

if(!class_exists('LessonMigration')){
    class LessonMigration
    {
        public function up()
        {
            if(!Manager::schema()->hasTable('lessons')){
                Manager::schema()->create('lessons', function($table){
                    $table->bigIncrements('id');
                    $table->text("title");
                    $table->string("type")->nullable();
                    $table->longText("content")->nullable();
                    $table->longText("video")->nullable();
                    $table->integer('hours')->unsigned()->nullable()->default(0);
                    $table->integer('minutes')->unsigned()->nullable()->default(0);
                    $table->integer('seconds')->unsigned()->nullable()->default(0);
                    $table->timestamps();
                });
            }
        }
    
        public function down()
        {
            Manager::schema()->dropIfExists('lessons');
        }
    }
}