<?php

namespace Yuvayana\Acadlix\Migrations;

use Illuminate\Database\Capsule\Manager;

defined( 'ABSPATH' ) || exit();

if(!class_exists(('CourseUserMigration'))){
    class CourseUserMigration
    {
        public function up()
        {
            if(!Manager::schema()->hasTable('course_users')){
                Manager::schema()->create('course_users', function($table){
                    $table->bigIncrements('id');
                    $table->foreignId('course_id')->constrained('courses')->cascadeOnDelete();
                    $table->integer('user_id')->unsigned()->nullable()->default(0);
                    $table->timestamps();
                });
            }
        }
    
        public function down()
        {
            Manager::schema()->dropIfExists('course_users');
        }
    }
}