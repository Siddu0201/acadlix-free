<?php

namespace Yuvayana\Acadlix\Migrations;

use Illuminate\Database\Capsule\Manager;

defined( 'ABSPATH' ) || exit();

if(!class_exists(('ToplistMigration'))){
    class ToplistMigration
    {
        public function up()
        {
            if(!Manager::schema()->hasTable('toplist')){
                Manager::schema()->create('toplist', function($table){
                    $table->bigIncrements('id');
                    $table->bigInteger('quiz_id')->nullable();
                    $table->string('user_token')->nullable();
                    $table->unsignedBigInteger('user_id')->nullable();
                    $table->string('name', 100)->nullable();
                    $table->string('email', 100)->nullable();
                    $table->float('points')->nullable();
                    $table->float('result')->nullable();
                    $table->string('ip', 100)->nullable();
                    $table->integer('quiz_time')->default(0);
                    $table->float('accuracy')->nullable();
                    $table->string('status', 100)->nullable();
                    $table->timestamps();
                });
            }
        }
    
        public function down()
        {
            Manager::schema()->dropIfExists('toplist');
        }
    }
}