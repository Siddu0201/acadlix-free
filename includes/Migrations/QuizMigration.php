<?php

namespace Yuvayana\Acadlix\Migrations;

use Illuminate\Database\Capsule\Manager;

if(!class_exists('QuizMigration')){
    class QuizMigration
    {
        public function up()
        {
            if(!Manager::schema()->hasTable('quiz')){
                Manager::schema()->create('quiz', function($table){
                    $table->bigIncrements('id');
                    $table->string('name');
                    $table->string('description')->nullable();
                    $table->boolean('calculator')->default(0)->comment('0 => inactive, 1 => active');
                    $table->tinyInteger('time_type')->default(0);
                    $table->unsignedInteger('time')->default(0);
                    $table->boolean('question_random')->default(0);
                    $table->boolean('answer_random')->default(0);
                    $table->boolean('sort_category')->default(0);
                    $table->boolean('hide_quiz_title')->default(0);
                    $table->boolean('hide_restart_button')->default(0);
                    $table->boolean('hide_view_answer_button')->default(0);
                    $table->timestamps();
                });
            }
        }
    
        public function down()
        {
            Manager::schema()->dropIfExists('quiz');
        }
    }
}