<?php

namespace Yuvayana\Acadlix\Migrations;

use Illuminate\Database\Capsule\Manager;

defined( 'ABSPATH' ) || exit();

if(!class_exists('StatisticRefMigration')){
    class StatisticRefMigration
    {
        public function up()
        {
            if(!Manager::schema()->hasTable('statistic_ref')){
                Manager::schema()->create('statistic_ref', function($table){
                    $table->bigIncrements('id');
                    $table->bigInteger('quiz_id')->nullable();
                    $table->string('user_token')->nullable();
                    $table->unsignedBigInteger('user_id')->nullable();
                    $table->float('points')->nullable();
                    $table->float('result')->nullable();
                    $table->integer("quiz_time")->nullable();
                    $table->float('accuracy')->nullable();
                    $table->string('status', 100)->nullable();
                    $table->timestamps();
                });
            }
        }
    
        public function down()
        {
            Manager::schema()->dropIfExists('statistic_ref');
        }
    }
}