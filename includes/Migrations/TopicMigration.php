<?php

namespace Yuvayana\Acadlix\Migrations;

use Illuminate\Database\Capsule\Manager;

if(!class_exists('TopicMigration')){
    class TopicMigration
    {
        public function up()
        {
            if(!Manager::schema()->hasTable('topic')){
                Manager::schema()->create('topic', function($table){
                    $table->bigIncrements('id');
                    $table->foreignId('subject_id')->constrained('subject')->onDelete('cascade');
                    $table->string("topic_name");
                    $table->timestamps();
                });
            }
        }
    
        public function down()
        {
            Manager::schema()->dropIfExists('topic');
        }
    }
}