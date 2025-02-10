<?php

namespace Yuvayana\Acadlix\Migrations;

use Illuminate\Database\Capsule\Manager;

defined( 'ABSPATH' ) || exit();

if(!class_exists(('CourseStatisticMigration'))){
    class CourseStatisticMigration
    {
        public function up()
        {
            if(!Manager::schema()->hasTable('course_statistics')){
                Manager::schema()->create('course_statistics', function($table){
                    $table->bigIncrements('id');
                    $table->foreignId('order_item_id')->constrained('order_items')->cascadeOnDelete();
                    $table->bigInteger('course_section_content_id')->nullable();
                    $table->integer('user_id')->unsigned()->nullable()->default(0);
                    $table->boolean('is_active')->nullable()->default(false);
                    $table->boolean('is_completed')->nullable()->default(false);
                    $table->timestamps();
                });
            }
        }
    
        public function down()
        {
            Manager::schema()->dropIfExists('course_statistics');
        }
    }
}