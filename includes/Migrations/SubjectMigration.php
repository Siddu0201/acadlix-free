<?php

namespace Yuvayana\Acadlix\Migrations;

use Illuminate\Database\Capsule\Manager;

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
} 

if(!class_exists('SubjectMigration')){
    class SubjectMigration
    {
        public function up()
        {
            if(!Manager::schema()->hasTable('subject')){
                Manager::schema()->create('subject', function($table){
                    $table->bigIncrements('id');
                    $table->string("subject_name");
                    $table->timestamps();
                });
            }
        }
    
        public function down()
        {
            Manager::schema()->dropIfExists('subject');
        }
    }
}