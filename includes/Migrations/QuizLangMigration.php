<?php

namespace Yuvayana\Acadlix\Migrations;

use Illuminate\Database\Capsule\Manager;

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
                    $table->boolean('default_lang')->default(0);
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