<?php

namespace Yuvayana\Acadlix\Migrations;

use Illuminate\Database\Capsule\Manager;
use Yuvayana\Acadlix\Models\Course;

defined('ABSPATH') || exit();

if (!class_exists(('CourseMigration'))) {
    class CourseMigration
    {
        public function up()
        {
            if (!Manager::schema()->hasTable('courses')) {
                Manager::schema()->create('courses', function ($table) {
                    $table->bigInteger('id')->unsigned()->primary();
                    $table->integer('weeks')->unsigned()->nullable()->default(0);
                    $table->integer('days')->unsigned()->nullable()->default(0);
                    $table->integer('hours')->unsigned()->nullable()->default(0);
                    $table->integer('minutes')->unsigned()->nullable()->default(0);
                    $table->dateTime('start_date')->nullable();
                    $table->dateTime('end_date')->nullable();
                    $table->string('difficulty_level', 100)->nullable()->default('all_levels');
                    $table->boolean('question_and_answer')->nullable()->default(false);
                    $table->float('price')->unsigned()->nullable()->default(0.00);
                    $table->boolean('enable_sale_price')->nullable()->default(false);
                    $table->float('sale_price')->unsigned()->nullable()->default(0.00);
                    $table->integer('validity')->unsigned()->nullable()->default(0);
                    $table->string('validity_type', 100)->nullable()->default('day');
                    $table->boolean('tax')->nullable()->default(false);
                    $table->float('tax_percent')->nullable()->default(0.00);
                    $table->boolean('allow_repurchase')->nullable()->default(false);
                    $table->longText('video')->nullable();
                    $table->timestamps();
                });
            }
        }

        public function down()
        {
            $courses = get_posts(array(
                'post_type' => "acadlix_course",
                'numberposts' => -1, // Get all posts
                'post_status' => 'any' // Include all post statuses
            ));
            foreach ($courses as $course) {
                wp_delete_post($course->ID, true);
            }
            Manager::schema()->dropIfExists('courses');
        }
    }
}