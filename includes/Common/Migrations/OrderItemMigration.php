<?php

namespace Yuvayana\Acadlix\Common\Migrations;

use Illuminate\Database\Capsule\Manager;

defined( 'ABSPATH' ) || exit();

if(!class_exists('OrderItemMigration')){
    class OrderItemMigration
    {
        public function up()
        {
            if(!Manager::schema()->hasTable('acadlix_order_items')){
                Manager::schema()->create('acadlix_order_items', function($table){
                    $table->bigIncrements('id');
                    $table->bigInteger('course_id')->nullable()->index();
                    $table->foreignId('order_id')->constrained('acadlix_orders')->cascadeOnDelete();
                    $table->string('course_title')->nullable();
                    $table->integer('quantity')->nullable()->default(1);
                    $table->float('price')->nullable()->default(0);
                    $table->float('discount')->nullable()->default(0);
                    $table->float('price_after_discount')->nullable()->default(0);
                    $table->float('tax')->nullable()->default(0);
                    $table->float('price_after_tax')->nullable()->default(0);
                    $table->timestamps();
                });
            }
        }
    
        public function down()
        {
            Manager::schema()->dropIfExists('acadlix_order_items');
        }
    }
}