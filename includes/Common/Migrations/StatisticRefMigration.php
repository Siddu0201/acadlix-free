<?php

namespace Yuvayana\Acadlix\Common\Migrations;

use Illuminate\Database\Capsule\Manager;

defined( 'ABSPATH' ) || exit();

if(!class_exists('StatisticRefMigration')){
    class StatisticRefMigration
    {
        public function up()
        {
            if(!Manager::schema()->hasTable('acadlix_statistic_ref')){
                Manager::schema()->create('acadlix_statistic_ref', function($table){
                    $table->bigIncrements('id');
                    $table->bigInteger('quiz_id')->nullable()->index();
                    $table->string('user_token')->nullable()->index();
                    $table->unsignedBigInteger('user_id')->nullable()->index();
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
            Manager::schema()->dropIfExists('acadlix_statistic_ref');
        }
    }
}