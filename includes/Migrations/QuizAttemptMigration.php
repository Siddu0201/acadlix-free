<?php

namespace Yuvayana\Acadlix\Migrations;

use Illuminate\Database\Capsule\Manager;

defined( 'ABSPATH' ) || exit();

if(!class_exists(('QuizAttemptMigration'))){
    class QuizAttemptMigration
    {
        public function up()
        {
            if(!Manager::schema()->hasTable('quiz_attempt')){
                Manager::schema()->create('quiz_attempt', function($table){
                    $table->bigIncrements('id');
                    $table->bigInteger('quiz_id')->nullable();
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