<?php

namespace Yuvayana\Acadlix\Migrations;

use Illuminate\Database\Capsule\Manager;

defined( 'ABSPATH' ) || exit();

if(!class_exists('LessonResouceMigration')){
    class LessonResourceMigration
    {
        public function up()
        {
            if(!Manager::schema()->hasTable('lesson_resources')){
                Manager::schema()->create('lesson_resources', function($table){
                    $table->bigIncrements('id');
                    $table->foreignId('lesson_id')->nullable()->constrained('lessons')->cascadeOnDelete();
                    $table->text("title");
                    $table->string("type")->nullable();
                    $table->string("filename")->nullable();
                    $table->text("file_url")->nullable();
                    $table->text("link")->nullable();
                    $table->timestamps();
                });
            }
        }
    
        public function down()
        {
            Manager::schema()->dropIfExists('lesson_resources');
        }
    }
}