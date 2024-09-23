<?php

namespace Yuvayana\Acadlix\Migrations;

use Illuminate\Database\Capsule\Manager;

defined( 'ABSPATH' ) || exit();

if(!class_exists(('CourseFaqMigration'))){
    class CourseFaqMigration
    {
        public function up()
        {
            if(!Manager::schema()->hasTable('course_faqs')){
                Manager::schema()->create('course_faqs', function($table){
                    $table->bigIncrements('id');
                    $table->foreignId('course_id')->constrained('courses')->cascadeOnDelete();
                    $table->text('question')->nullable();
                    $table->text('answer')->nullable();
                    $table->timestamps();
                });
            }
        }
    
        public function down()
        {
            Manager::schema()->dropIfExists('course_faqs');
        }
    }
}