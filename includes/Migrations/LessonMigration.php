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
                    $table->longText("content")->nullable();
                    $table->string("type")->nullable();
                    $table->integer('duration')->unsigned()->nullable()->default(0);
                    $table->string("duration_type")->nullable();
                    $table->boolean('preview')->default(false);
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