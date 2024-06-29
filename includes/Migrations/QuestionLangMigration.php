<?php

namespace Yuvayana\Acadlix\Migrations;

use Illuminate\Database\Capsule\Manager;

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
} 

if(!class_exists('QuestionLangMigration')){
    class QuestionLangMigration
    {
        public function up()
        {
            if(!Manager::schema()->hasTable('question_lang')){
                Manager::schema()->create('question_lang', function($table){
                    $table->bigIncrements('id');
                    $table->foreignId('question_id')->constrained('question')->cascadeOnDelete();
                    $table->foreignId('language_id')->nullable()->constrained('language')->nullOnDelete();
                    $table->boolean('default')->default(0);
                    $table->text("question")->nullable();
                    $table->text("correct_msg")->nullable();
                    $table->text("incorrect_msg")->nullable();
                    $table->text("hint_msg")->nullable();
                    $table->longText("answer_data")->nullable();
                    $table->timestamps();
                });
            }
        }
    
        public function down()
        {
            Manager::schema()->dropIfExists('question_lang');
        }
    }
}