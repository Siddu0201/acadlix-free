<?php

namespace Yuvayana\Acadlix\Migrations;

use Illuminate\Database\Capsule\Manager;

if(!class_exists('QuizQuestionMigration')){
    class QuizQuestionMigration
    {
        public function up()
        {
            if(!Manager::schema()->hasTable('quiz_question')){
                Manager::schema()->create('quiz_question', function($table){
                    $table->bigIncrements('id');
                    $table->foreignId('quiz_id')->constrained('quiz')->cascadeOnDelete();
                    $table->foreignId('question_id')->constrained('question')->cascadeOnDelete();
                    $table->integer('sort')->unsigned()->nullable();
                    $table->timestamps();
                });
            }
        }
    
        public function down()
        {
            Manager::schema()->dropIfExists('quiz_question');
        }
    }
}