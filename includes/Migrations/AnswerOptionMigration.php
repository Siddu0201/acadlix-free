<?php

namespace Yuvayana\Acadlix\Migrations;

use Illuminate\Database\Capsule\Manager;

if(!class_exists(('AnswerOptionMigration'))){
    class AnswerOptionMigration
    {
        public function up()
        {
            if(!Manager::schema()->hasTable('answer_option')){
                Manager::schema()->create('answer_option', function($table){
                    $table->bigIncrements('id');
                    $table->foreignId('quiz_id')->constrained('quiz')->cascadeOnDelete();
                    $table->foreignId('question_id')->constrained('question')->cascadeOnDelete();
                    $table->unsignedBigInteger('user_id');
                    $table->text('report_text')->nullable();
                    $table->boolean('solution_helpful')->nullable();
                    $table->boolean('bookmark')->nullable()->default(false);
                    $table->timestamps();
                });
            }
        }
    
        public function down()
        {
            Manager::schema()->dropIfExists('answer_option');
        }
    }
}