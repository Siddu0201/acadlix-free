<?php

namespace Yuvayana\Acadlix\Migrations;

use Illuminate\Database\Capsule\Manager;

defined( 'ABSPATH' ) || exit();

if(!class_exists(('CourseSectionContentMigration'))){
    class CourseSectionContentMigration
    {
        public function up()
        {
            if(!Manager::schema()->hasTable('course_section_contents')){
                Manager::schema()->create('course_section_contents', function($table){
                    $table->bigIncrements('id');
                    $table->foreignId('course_id')->constrained('courses')->cascadeOnDelete();
                    $table->foreignId('course_section_id')->constrained('course_sections')->cascadeOnDelete();
                    $table->morphs('contentable');
                    $table->integer('sort')->unsigned()->nullable()->default(0);
                    $table->timestamps();
                });
            }
        }
    
        public function down()
        {
            Manager::schema()->dropIfExists('course_section_contents');
        }
    }
}