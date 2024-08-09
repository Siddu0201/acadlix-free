<?php

namespace Yuvayana\Acadlix\Migrations;

use Illuminate\Database\Capsule\Manager;

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
} 

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

        public function update()
        {
            if(Manager::schema()->hasColumn('template', 'type')){
                Manager::schema()->table('template', function($table){
                    $table->string('type')->default("quiz")->change();
                });
            }
        }
    }
}