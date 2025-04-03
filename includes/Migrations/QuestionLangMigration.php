<?php

namespace Yuvayana\Acadlix\Migrations;

use Illuminate\Database\Capsule\Manager;

defined( 'ABSPATH' ) || exit();

if(!class_exists('QuestionLangMigration')){
    class QuestionLangMigration
    {
        public function up()
        {
            if(!Manager::schema()->hasTable('acadlix_question_lang')){
                Manager::schema()->create('acadlix_question_lang', function($table){
                    $table->bigIncrements('id');
                    $table->foreignId('question_id')->constrained('acadlix_question')->cascadeOnDelete();
                    $table->bigInteger('language_id')->nullable()->index();
                    $table->boolean('default')->default(0);
                    $table->text("question")->nullable();
                    $table->text("correct_msg")->nullable();
                    $table->text("incorrect_msg")->nullable();
                    $table->text("hint_msg")->nullable();
                    $table->longText("answer_data")->nullable();
                    $table->text("meta")->nullable();
                    $table->timestamps();
                });
            }
        }
    
        public function down()
        {
            Manager::schema()->dropIfExists('acadlix_question_lang');
        }
    }
}