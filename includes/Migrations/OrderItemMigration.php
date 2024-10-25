<?php

namespace Yuvayana\Acadlix\Migrations;

use Illuminate\Database\Capsule\Manager;

defined( 'ABSPATH' ) || exit();

if(!class_exists('OrderItemMigration')){
    class OrderItemMigration
    {
        public function up()
        {
            if(!Manager::schema()->hasTable('order_items')){
                Manager::schema()->create('order_items', function($table){
                    $table->bigIncrements('id');
                    $table->foreignId('course_id')->constrained('courses')->cascadeOnDelete();
                    $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
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
            Manager::schema()->dropIfExists('order_items');
        }
    }
}