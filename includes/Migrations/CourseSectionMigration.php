<?php

namespace Yuvayana\Acadlix\Migrations;

use Illuminate\Database\Capsule\Manager;

defined( 'ABSPATH' ) || exit();

if(!class_exists(('CourseSectionMigration'))){
    class CourseSectionMigration
    {
        public function up()
        {
            if(!Manager::schema()->hasTable('course_sections')){
                Manager::schema()->create('course_sections', function($table){
                    $table->bigIncrements('id');
                    $table->foreignId('course_id')->constrained('courses')->cascadeOnDelete();
                    $table->text('title')->nullable();
                    $table->text('description')->nullable();
                    $table->integer('sort')->unsigned()->nullable()->default(0);
                    $table->timestamps();
                });
            }
        }
    
        public function down()
        {
            Manager::schema()->dropIfExists('course_sections');
        }
    }
}