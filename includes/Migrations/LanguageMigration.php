<?php

namespace Yuvayana\Acadlix\Migrations;

use Illuminate\Database\Capsule\Manager;

defined( 'ABSPATH' ) || exit();

if(!class_exists('LanguageMigration')){
    class LanguageMigration
    {
        public function up()
        {
            if(!Manager::schema()->hasTable('language')){
                Manager::schema()->create('language', function($table){
                    $table->bigIncrements('id');
                    $table->string("language_name");
                    $table->boolean('default')->default(false);
                    $table->timestamps();
                });
            }
        }
    
        public function down()
        {
            Manager::schema()->dropIfExists('language');
        }
    }
}