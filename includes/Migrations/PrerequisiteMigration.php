<?php

namespace Yuvayana\Acadlix\Migrations;

use Illuminate\Database\Capsule\Manager;

defined( 'ABSPATH' ) || exit();

if(!class_exists('PrerequisiteMigration')){
    class PrerequisiteMigration
    {
        public function up()
        {
            if(!Manager::schema()->hasTable('prerequisite')){
                Manager::schema()->create('prerequisite', function($table){
                    $table->bigIncrements('id');
                    $table->bigInteger('quiz_id')->nullable();
                    $table->bigInteger('prerequisite_quiz_id')->nullable();
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