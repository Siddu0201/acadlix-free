<?php

namespace Yuvayana\Acadlix\Migrations;

use Illuminate\Database\Capsule\Manager;

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
} 

if(!class_exists('ParagraphLangMigration')){
    class ParagraphLangMigration
    {
        public function up()
        {
            if(!Manager::schema()->hasTable('paragraph_lang')){
                Manager::schema()->create('paragraph_lang', function($table){
                    $table->bigIncrements('id');
                    $table->foreignId('paragraph_id')->constrained('paragraph')->cascadeOnDelete();
                    $table->foreignId('language_id')->nullable()->constrained('language')->nullOnDelete();
                    $table->boolean('default')->default(0);
                    $table->longText("content")->nullable();
                    $table->timestamps();
                });
            }
        }
    
        public function down()
        {
            Manager::schema()->dropIfExists('paragraph_lang');
        }
    }
}