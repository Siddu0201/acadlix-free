<?php

namespace Yuvayana\Acadlix\Migrations;

use Illuminate\Database\Capsule\Manager;

defined( 'ABSPATH' ) || exit();

if(!class_exists('SubjectTimeMigration')){
    class SubjectTimeMigration
    {
        public function up()
        {
            if(!Manager::schema()->hasTable('acadlix_subject_time')){
                Manager::schema()->create('acadlix_subject_time', function($table){
                    $table->bigIncrements('id');
                    $table->bigInteger('quiz_id')->nullable()->index();
                    $table->foreignId('subject_id')->nullable()->constrained('acadlix_subject')->nullOnDelete();
                    $table->integer('time')->unsigned();
                    $table->integer('specific_number_of_questions')->default(0);
                    $table->boolean('optional')->default(0);
                    $table->timestamps();
                });
            }
        }
    
        public function down()
        {
            Manager::schema()->dropIfExists('acadlix_subject_time');
        }
    }
}