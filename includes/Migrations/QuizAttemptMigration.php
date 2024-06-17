<?php

namespace Yuvayana\Acadlix\Migrations;

use Illuminate\Database\Capsule\Manager;

if(!class_exists(('QuizAttemptMigration'))){
    class QuizAttemptMigration
    {
        public function up()
        {
            if(!Manager::schema()->hasTable('quiz_attempt')){
                Manager::schema()->create('quiz_attempt', function($table){
                    $table->bigIncrements('id');
                    $table->foreignId('quiz_id')->constrained('quiz')->cascadeOnDelete();
                    $table->unsignedBigInteger('user_id');
                    $table->timestamps();
                });
            }
        }
    
        public function down()
        {
            Manager::schema()->dropIfExists('quiz_attempt');
        }
    }
}