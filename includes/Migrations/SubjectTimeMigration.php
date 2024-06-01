<?php

namespace Yuvayana\Acadlix\Migrations;

use Illuminate\Database\Capsule\Manager;

if(!class_exists('SubjectTimeMigration')){
    class SubjectTimeMigration
    {
        public function up()
        {
            if(!Manager::schema()->hasTable('subject_time')){
                Manager::schema()->create('subject_time', function($table){
                    $table->bigIncrements('id');
                    $table->foreignId('quiz_id')->constrained('quiz')->cascadeOnDelete();
                    $table->foreignId('subject_id')->nullable()->constrained('subject')->nullOnDelete();
                    $table->integer('time')->unsigned();
                    $table->timestamps();
                });
            }
        }
    
        public function down()
        {
            Manager::schema()->dropIfExists('subject_time');
        }
    }
}