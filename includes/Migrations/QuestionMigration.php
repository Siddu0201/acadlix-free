<?php

namespace Yuvayana\Acadlix\Migrations;

use Illuminate\Database\Capsule\Manager;

if(!class_exists('QuestionMigration')){
    class QuestionMigration
    {
        public function up()
        {
            if(!Manager::schema()->hasTable('question')){
                Manager::schema()->create('question', function($table){
                    $table->bigIncrements('id');
                    $table->foreignId('subject_id')->nullable()->constrained('subject')->nullOnDelete();
                    $table->foreignId('topic_id')->nullable()->constrained('topic')->nullOnDelete();
                    $table->boolean('online')->default(1)->comment('0 => offline, 1 => online');
                    $table->float('points')->default(0);
                    $table->float('negative_points')->default(0);
                    $table->boolean('correct_same_text')->default(0);
                    $table->boolean('tip_enabled')->default(0)->comment('0 => hint inactive, 1 =>  hint active');
                    $table->string('answer_type');
                    $table->tinyInteger('matrix_sort_answer_criteria')->default(20);
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