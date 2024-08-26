<?php

namespace Yuvayana\Acadlix\Migrations;

use Illuminate\Database\Capsule\Manager;

defined( 'ABSPATH' ) || exit();

if(!class_exists(('QuizOptionMigration'))){
    class QuizOptionMigration
    {
        public function up()
        {
            if(!Manager::schema()->hasTable('quiz_option')){
                Manager::schema()->create('quiz_option', function($table){
                    $table->bigIncrements('id');
                    $table->foreignId('quiz_id')->constrained('quiz')->cascadeOnDelete();
                    $table->bigInteger('user_id')->nullable();
                    $table->float('quiz_rating')->nullable();
                    $table->text('feedback_text')->nullable();
                    $table->timestamps();
                });
            }
        }
    
        public function down()
        {
            Manager::schema()->dropIfExists('quiz_option');
        }
    }
}