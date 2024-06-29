<?php

namespace Yuvayana\Acadlix\Migrations;

use Illuminate\Database\Capsule\Manager;

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
} 

if(!class_exists('PrerequisiteMigration')){
    class PrerequisiteMigration
    {
        public function up()
        {
            if(!Manager::schema()->hasTable('prerequisite')){
                Manager::schema()->create('prerequisite', function($table){
                    $table->bigIncrements('id');
                    $table->foreignId('quiz_id')->constrained('quiz')->cascadeOnDelete();
                    $table->foreignId('prerequisite_quiz_id')->constrained('quiz')->cascadeOnDelete();
                    $table->float('min_percentage');
                    $table->timestamps();
                });
            }
        }
    
        public function down()
        {
            Manager::schema()->dropIfExists('prerequisite');
        }
    }
}