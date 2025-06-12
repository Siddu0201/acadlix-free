<?php

namespace Yuvayana\Acadlix\Common\Migrations;

use Illuminate\Database\Capsule\Manager;

defined( 'ABSPATH' ) || exit();

if(!class_exists('OrderMetaMigration')){
    class OrderMetaMigration
    {
        public function up()
        {
            if(!Manager::schema()->hasTable('acadlix_order_meta')){
                Manager::schema()->create('acadlix_order_meta', function($table){
                    $table->bigIncrements('id');
                    $table->foreignId('order_id')->constrained('acadlix_orders')->cascadeOnDelete();
                    $table->string('meta_key')->nullable()->index();
                    $table->longText('meta_value')->nullable();
                    $table->timestamps();
                });
            }
        }
    
        public function down()
        {
            Manager::schema()->dropIfExists('acadlix_order_meta');
        }
    }
}