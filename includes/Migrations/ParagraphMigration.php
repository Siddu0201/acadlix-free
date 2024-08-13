<?php

namespace Yuvayana\Acadlix\Migrations;

use Illuminate\Database\Capsule\Manager;

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
} 

if(!class_exists('ParagraphMigration')){
    class ParagraphMigration
    {
        public function up()
        {
            if(!Manager::schema()->hasTable('paragraph')){
                Manager::schema()->create('paragraph', function($table){
                    $table->bigIncrements('id');
                    $table->foreignId('quiz_id')->constrained('quiz')->cascadeOnDelete();
                    $table->string("title");
                    $table->timestamps();
                });
            }
        }
    
        public function down()
        {
            Manager::schema()->dropIfExists('paragraph');
        }
    }
}