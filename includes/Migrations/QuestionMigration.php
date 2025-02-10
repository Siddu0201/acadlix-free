<?php

namespace Yuvayana\Acadlix\Migrations;

use Illuminate\Database\Capsule\Manager;

defined( 'ABSPATH' ) || exit();

if(!class_exists('QuestionMigration')){
    class QuestionMigration
    {
        public function up()
        {
            if(!Manager::schema()->hasTable('question')){
                Manager::schema()->create('question', function($table){
                    $table->bigIncrements('id');
                    $table->bigInteger('quiz_id')->nullable();
                    $table->foreignId('subject_id')->nullable()->constrained('subject')->nullOnDelete();
                    $table->boolean('online')->default(1)->comment('0 => offline, 1 => online');
                    $table->integer('sort')->unsigned()->default(1);
                    $table->string('title')->nullable();
                    $table->float('points')->default(1);
                    $table->float('negative_points')->default(0);
                    $table->boolean('different_points_for_each_answer')->default(0);
                    $table->boolean('different_incorrect_msg')->default(0);
                    $table->boolean('hint_enabled')->default(0);
                    $table->boolean('paragraph_enabled')->default(0);
                    $table->bigInteger('paragraph_id')->nullable();
                    $table->string('answer_type');
                    $table->text('meta')->nullable();
                    $table->timestamps();
                });
            }
        }
    
        public function down()
        {
            Manager::schema()->dropIfExists('question');
        }
    }
}