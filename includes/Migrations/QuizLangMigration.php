<?php

namespace Yuvayana\Acadlix\Migrations;

use Illuminate\Database\Capsule\Manager;

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
} 

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

        public function update()
        {
            if(!Manager::schema()->hasColumn('quiz_lang', 'instruction1')){
                Manager::schema()->table('quiz_lang', function($table){
                    $table->after('default', function($table){
                        $table->longText('instruction1')->nullable();
                    });
                });
            }

            if(!Manager::schema()->hasColumn('quiz_lang', 'instruction2')){
                Manager::schema()->table('quiz_lang', function($table){
                    $table->after('instruction1', function($table){
                        $table->longText('instruction2')->nullable();
                    });
                });
            }

            if(!Manager::schema()->hasColumn('quiz_lang', 'term_and_condition_text')){
                Manager::schema()->table('quiz_lang', function($table){
                    $table->after('instruction2', function($table){
                        $table->longText('term_and_condition_text')->nullable();
                    });
                });
            }

            if(!Manager::schema()->hasColumn('quiz_lang', 'term_and_condition_warning_text')){
                Manager::schema()->table('quiz_lang', function($table){
                    $table->after('term_and_condition_text', function($table){
                        $table->longText('term_and_condition_warning_text')->nullable();
                    });
                });
            }
        }
    }
}