<?php

namespace Yuvayana\Acadlix\Migrations;

use Illuminate\Database\Capsule\Manager;

defined('ABSPATH') || exit();

if (!class_exists(('CourseStatisticMigration'))) {
    class CourseStatisticMigration
    {
        public function up()
        {
            if (!Manager::schema()->hasTable('acadlix_course_statistics')) {
                Manager::schema()->create('acadlix_course_statistics', function ($table) {
                    $table->bigIncrements('id');
                    $table->foreignId('order_item_id')->constrained('acadlix_order_items')->cascadeOnDelete();
                    $table->bigInteger('course_section_content_id')->nullable()->index(); // Index for faster lookups
                    $table->integer('user_id')->unsigned()->nullable()->default(0)->index(); // Index for filtering users
                    $table->boolean('is_active')->nullable()->default(false); 
                    $table->boolean('is_completed')->nullable()->default(false); 
                });
            }
        }

        public function down()
        {
            Manager::schema()->dropIfExists('acadlix_course_statistics');
        }
    }
}