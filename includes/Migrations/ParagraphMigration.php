<?php

namespace Yuvayana\Acadlix\Migrations;

use Illuminate\Database\Capsule\Manager;

defined( 'ABSPATH' ) || exit();

if(!class_exists('ParagraphMigration')){
    class ParagraphMigration
    {
        public function up()
        {
            if(!Manager::schema()->hasTable('paragraph')){
                Manager::schema()->create('paragraph', function($table){
                    $table->bigIncrements('id');
                    $table->bigInteger('quiz_id')->nullable();
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