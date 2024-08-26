<?php

namespace Yuvayana\Acadlix\Migrations;

use Illuminate\Database\Capsule\Manager;

defined( 'ABSPATH' ) || exit();

if(!class_exists('QuestionMigration')){
    class QuestionMigration
    {
        public function up()
        {
            if(!Manager::schema()->hasTable('question')){
                Manager::schema()->create('question', function($table){
                    $table->bigIncrements('id');
                    $table->foreignId('quiz_id')->constrained('quiz')->cascadeOnDelete();
                    $table->foreignId('subject_id')->nullable()->constrained('subject')->nullOnDelete();
                    $table->boolean('online')->default(1)->comment('0 => offline, 1 => online');
                    $table->integer('sort')->unsigned()->default(1);
                    $table->string('title')->nullable();
                    $table->float('points')->default(1);
                    $table->float('negative_points')->default(0);
                    $table->boolean('different_points_for_each_answer')->default(0);
                    $table->boolean('different_incorrect_msg')->default(0);
                    $table->boolean('hint_enabled')->default(0);
                    $table->boolean('paragraph_enabled')->default(0);
                    $table->foreignId('paragraph_id')->nullable()->constrained('paragraph')->nullOnDelete();
                    $table->string('answer_type');
                    $table->timestamps();
                });
            }
        }
    
        public function down()
        {
            Manager::schema()->dropIfExists('question');
        }

        public function update()
        {
            if(!Manager::schema()->hasColumn('question', 'paragraph_enabled')){
                Manager::schema()->table('question', function($table){
                    $table->after('hint_enabled', function($table){
                        $table->boolean('paragraph_enabled')->default(0);
                    });
                });
            }
            if(!Manager::schema()->hasColumn('question', 'paragraph_id')){
                Manager::schema()->table('question', function($table){
                    $table->after('paragraph_enabled', function($table){
                        $table->foreignId('paragraph_id')->nullable()->constrained('paragraph')->nullOnDelete();
                    });
                });
            }
        }
    }
}