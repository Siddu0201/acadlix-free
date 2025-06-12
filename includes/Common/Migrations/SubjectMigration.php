<?php

namespace Yuvayana\Acadlix\Common\Migrations;

use Illuminate\Database\Capsule\Manager;

defined( 'ABSPATH' ) || exit();

if(!class_exists('SubjectMigration')){
    class SubjectMigration
    {
        public function up()
        {
            if(!Manager::schema()->hasTable('acadlix_subject')){
                Manager::schema()->create('acadlix_subject', function($table){
                    $table->bigIncrements('id');
                    $table->string("subject_name");
                    $table->boolean('default')->default(false);
                    $table->timestamps();
                });
            }
        }
    
        public function down()
        {
            Manager::schema()->dropIfExists('acadlix_subject');
        }
    }
}