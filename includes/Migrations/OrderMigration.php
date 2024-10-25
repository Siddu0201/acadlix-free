<?php

namespace Yuvayana\Acadlix\Migrations;

use Illuminate\Database\Capsule\Manager;

defined( 'ABSPATH' ) || exit();

if(!class_exists('OrderMigration')){
    class OrderMigration
    {
        public function up()
        {
            if(!Manager::schema()->hasTable('orders')){
                Manager::schema()->create('orders', function($table){
                    $table->bigIncrements('id');
                    $table->unsignedBigInteger('user_id');
                    $table->string('status')->nullable()->default('pending');
                    $table->float('extra_charges')->nullable()->default(0);
                    $table->float('total_amount')->nullable()->default(0);
                    $table->timestamps();
                });
            }
        }
    
        public function down()
        {
            Manager::schema()->dropIfExists('orders');
        }
    }
}