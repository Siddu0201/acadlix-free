<?php

namespace Yuvayana\Acadlix\Common\Migrations;

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
                    $table->bigInteger('type_id')->nullable()->index();
                    $table->string('prerequisite_type')->nullable();
                    $table->bigInteger('prerequisite_id')->nullable()->index();
                    $table->text("meta")->nullable();
                    $table->timestamps();

                    $table->index(['type', 'type_id']);
                    $table->index(['prerequisite_type', 'prerequisite_id']);
                });
            }
        }
    
        public function down()
        {
            Manager::schema()->dropIfExists('acadlix_prerequisite');
        }
    }
}