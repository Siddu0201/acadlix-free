<?php

namespace Yuvayana\Acadlix\Migrations;

use Illuminate\Database\Capsule\Manager;

if(!class_exists('CategoryMigration')){
    class CategoryMigration
    {
        public function up()
        {
            if(!Manager::schema()->hasTable('category')){
                Manager::schema()->create('category', function($table){
                    $table->bigIncrements('id');
                    $table->string("category_name");
                    $table->timestamps();
                });
            }
        }
    
        public function down()
        {
            Manager::schema()->dropIfExists('category');
        }
    }
}