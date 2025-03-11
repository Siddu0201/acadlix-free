<?php

namespace Yuvayana\Acadlix\Migrations;

use Illuminate\Database\Capsule\Manager;

defined( 'ABSPATH' ) || exit();

if(!class_exists('PrerequisiteMigration')){
    class PrerequisiteMigration
    {
        public function up()
        {
            if(!Manager::schema()->hasTable('acadlix_prerequisite')){
                Manager::schema()->create('acadlix_prerequisite', function($table){
                    $table->bigIncrements('id');
                    $table->string('type')->nullable();
                    $table->bigInteger('type_id')->nullable();
                    $table->string('prerequisite_type')->nullable();
                    $table->bigInteger('prerequisite_id')->nullable();
                    $table->text("meta")->nullable();
                    $table->timestamps();
                });
            }
        }
    
        public function down()
        {
            Manager::schema()->dropIfExists('acadlix_prerequisite');
        }
    }
}