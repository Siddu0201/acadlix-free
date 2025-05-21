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
                    $table->string('meta_type')->nullable();
                    $table->longText('meta_value')->nullable();
                    $table->timestamps();
                });
            }
        }

        public function down()
        {
            Manager::schema()->dropIfExists('acadlix_course_statistics');
        }

        public function update()
        {
            if (!Manager::schema()->hasColumn('acadlix_course_statistics', 'meta_type')) {
                Manager::schema()->table('acadlix_course_statistics', function ($table) {
                    $table->string('meta_type')->nullable();
                });
            }
            if (!Manager::schema()->hasColumn('acadlix_course_statistics', 'meta_value')) {
                Manager::schema()->table('acadlix_course_statistics', function ($table) {
                    $table->longText('meta_value')->nullable();
                });
            }          

            if (!Manager::schema()->hasColumn('acadlix_course_statistics', 'created_at')) {
                Manager::schema()->table('acadlix_course_statistics', function ($table) {
                    $table->timestamp('created_at')->nullable()->default(Manager::raw('CURRENT_TIMESTAMP'));
                });
            }
            if (!Manager::schema()->hasColumn('acadlix_course_statistics', 'updated_at')) {
                Manager::schema()->table('acadlix_course_statistics', function ($table) {
                    $table->timestamp('updated_at')->nullable()->default(Manager::raw('CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP'));
                });
            }            

        }
    }
}