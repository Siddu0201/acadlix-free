<?php

namespace Yuvayana\Acadlix\Migrations;

use Illuminate\Database\Capsule\Manager;

defined( 'ABSPATH' ) || exit();

if(!class_exists(('CourseOutcomeMigration'))){
    class CourseOutcomeMigration
    {
        public function up()
        {
            if(!Manager::schema()->hasTable('course_outcomes')){
                Manager::schema()->create('course_outcomes', function($table){
                    $table->bigIncrements('id');
                    $table->foreignId('course_id')->constrained('courses')->cascadeOnDelete();
                    $table->text('outcome')->nullable();
                    $table->timestamps();
                });
            }
        }
    
        public function down()
        {
            Manager::schema()->dropIfExists('course_outcomes');
        }
    }
}