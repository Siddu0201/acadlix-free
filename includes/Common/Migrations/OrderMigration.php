<?php

namespace Yuvayana\Acadlix\Common\Migrations;

use Illuminate\Database\Capsule\Manager;

defined( 'ABSPATH' ) || exit();

if(!class_exists('OrderMigration')){
    class OrderMigration
    {
        public function up()
        {
            if(!Manager::schema()->hasTable('acadlix_orders')){
                Manager::schema()->create('acadlix_orders', function($table){
                    $table->bigIncrements('id');
                    $table->unsignedBigInteger('user_id')->index();
                    $table->string('status')->nullable()->default('pending')->index();
                    $table->float('extra_charges')->nullable()->default(0);
                    $table->float('total_amount')->nullable()->default(0);
                    $table->timestamps();
                });
            }
        }
    
        public function down()
        {
            Manager::schema()->dropIfExists('acadlix_orders');
        }
    }
}