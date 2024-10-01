<?php

namespace Yuvayana\Acadlix\Migrations;

use Illuminate\Database\Capsule\Manager;

defined( 'ABSPATH' ) || exit();

if(!class_exists('TemplateMigration')){
    class TemplateMigration
    {
        public function up()
        {
            if(!Manager::schema()->hasTable('template')){
                Manager::schema()->create('template', function($table){
                    $table->bigIncrements('id');
                    $table->string("name")->nullable();
                    $table->string('type')->default("quiz");
                    $table->longText('data')->nullable();
                    $table->timestamps();
                });
            }
        }
    
        public function down()
        {
            Manager::schema()->dropIfExists('template');
        }
    }
}