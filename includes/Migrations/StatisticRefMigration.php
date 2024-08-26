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
                    $table->foreignId('quiz_id')->constrained('quiz')->cascadeOnDelete();
                    $table->unsignedBigInteger('user_id');
                    $table->float('points')->nullable();
                    $table->float('result')->nullable();
                    $table->integer("quiz_time")->nullable();
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