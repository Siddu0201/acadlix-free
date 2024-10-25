<?php

namespace Yuvayana\Acadlix\Migrations;

use Illuminate\Database\Capsule\Manager;

defined( 'ABSPATH' ) || exit();

if(!class_exists('OrderMetaMigration')){
    class OrderMetaMigration
    {
        public function up()
        {
            if(!Manager::schema()->hasTable('order_meta')){
                Manager::schema()->create('order_meta', function($table){
                    $table->bigIncrements('id');
                    $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
                    $table->string('meta_key')->nullable();
                    $table->longText('meta_value')->nullable();
                    $table->timestamps();
                });
            }
        }
    
        public function down()
        {
            Manager::schema()->dropIfExists('order_meta');
        }
    }
}