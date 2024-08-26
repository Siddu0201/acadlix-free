<?php

namespace Yuvayana\Acadlix\Migrations;

use Illuminate\Database\Capsule\Manager;

defined( 'ABSPATH' ) || exit();

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
                    $table->integer('specific_number_of_questions')->default(0);
                    $table->boolean('optional')->default(0);
                    $table->timestamps();
                });
            }
        }
    
        public function down()
        {
            Manager::schema()->dropIfExists('subject_time');
        }

        public function update()
        {
            if(!Manager::schema()->hasColumn('subject_time', 'specific_number_of_questions')){
                Manager::schema()->table('subject_time', function($table){
                    $table->after('time', function($table){
                        $table->integer('specific_number_of_questions')->default(0);
                    });
                });
            }

            if(!Manager::schema()->hasColumn('subject_time', 'optional')){
                Manager::schema()->table('subject_time', function($table){
                    $table->after('specific_number_of_questions', function($table){
                        $table->integer('optional')->default(0);
                    });
                });
            }
        }
    }
}