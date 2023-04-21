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
                    $table->string("name");
                    $table->string("description");
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