<?php

namespace Yuvayana\Acadlix\Migrations;

use Illuminate\Database\Capsule\Manager;

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
} 

if(!class_exists(('ToplistMigration'))){
    class ToplistMigration
    {
        public function up()
        {
            if(!Manager::schema()->hasTable('toplist')){
                Manager::schema()->create('toplist', function($table){
                    $table->bigIncrements('id');
                    $table->foreignId('quiz_id')->constrained('quiz')->cascadeOnDelete();
                    $table->unsignedBigInteger('user_id');
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

        public function update()
        {
            if(!Manager::schema()->hasColumns('toplist', ['quiz_time', 'accuracy', 'status'])){
                Manager::schema()->table('toplist', function($table){
                    $table->after('ip', function($table){
                        $table->integer('quiz_time')->default(0);
                        $table->float('accuracy')->nullable();
                        $table->string('status', 100)->nullable();
                    });
                });
            }
        }
    }
}