<?php

namespace Yuvayana\Acadlix\Migrations;

use Illuminate\Database\Capsule\Manager;

defined( 'ABSPATH' ) || exit();

if(!class_exists(('CourseMigration'))){
    class CourseMigration
    {
        public function up()
        {
            if(!Manager::schema()->hasTable('courses')){
                Manager::schema()->create('courses', function($table){
                    $table->bigInteger('id')->unsigned()->primary();
                    $table->integer('duration')->unsigned()->nullable()->default(0);
                    $table->string('duration_type', 100)->nullable()->default('minute');
                    $table->string('start_date')->nullable();
                    $table->string('end_date')->nullable();
                    $table->string('difficulty_level', 100)->nullable()->default('all_levels');
                    $table->boolean('question_and_answer')->nullable()->default(false);
                    $table->integer('price')->unsigned()->nullable()->default(0);
                    $table->integer('sale_price')->unsigned()->nullable()->default(0);
                    $table->integer('validity')->unsigned()->nullable()->default(0);
                    $table->string('validity_type', 100)->nullable()->default('day');
                    $table->boolean('tax')->nullable()->default(false);
                    $table->float('tax_percent')->nullable()->default(0.00);
                    $table->boolean('allow_repurchase')->nullable()->default(false);
                    $table->text('featured_video')->nullable();
                    $table->timestamps();
                });
            }
        }
    
        public function down()
        {
            Manager::schema()->dropIfExists('courses');
        }
    }
}