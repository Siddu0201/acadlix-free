<?php

namespace Yuvayana\Acadlix\Migrations;

use Illuminate\Database\Capsule\Manager;

defined( 'ABSPATH' ) || exit();

if(!class_exists('QuizLangMigration')){
    class QuizLangMigration
    {
        public function up()
        {
            if(!Manager::schema()->hasTable('quiz_lang')){
                Manager::schema()->create('quiz_lang', function($table){
                    $table->bigIncrements('id');
                    $table->foreignId('quiz_id')->constrained('quiz')->onDelete('cascade');
                    $table->foreignId('language_id')->nullable()->constrained('language')->nullOnDelete();
                    $table->boolean('default')->default(false);
                    $table->longText('instruction1')->nullable();
                    $table->longText('instruction2')->nullable();
                    $table->text('term_and_condition_text')->nullable();
                    $table->text('term_and_condition_warning_text')->nullable();
                    $table->timestamps();
                });
            }
        }
    
        public function down()
        {
            Manager::schema()->dropIfExists('quiz_lang');
        }
    }
}