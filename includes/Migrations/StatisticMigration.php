<?php

namespace Yuvayana\Acadlix\Migrations;

use Illuminate\Database\Capsule\Manager;

defined( 'ABSPATH' ) || exit();

if(!class_exists('StatisticMigration')){
    class StatisticMigration
    {
        public function up()
        {
            if(!Manager::schema()->hasTable('acadlix_statistic')){
                Manager::schema()->create('acadlix_statistic', function($table){
                    $table->bigIncrements('id');
                    $table->foreignId('statistic_ref_id')->constrained('acadlix_statistic_ref')->cascadeOnDelete();
                    $table->foreignId('question_id')->constrained('acadlix_question')->cascadeOnDelete();
                    $table->boolean('correct_count');
                    $table->boolean('incorrect_count');
                    $table->boolean('hint_count');
                    $table->boolean('solved_count');
                    $table->float('points')->nullable();
                    $table->float('negative_points')->nullable();
                    $table->integer("question_time")->nullable();
                    $table->text("answer_data")->nullable();
                    $table->timestamps();
                });
            }
        }
    
        public function down()
        {
            Manager::schema()->dropIfExists('acadlix_statistic');
        }
    }
}