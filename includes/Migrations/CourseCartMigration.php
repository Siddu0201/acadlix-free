<?php

namespace Yuvayana\Acadlix\Migrations;

use Illuminate\Database\Capsule\Manager;

defined( 'ABSPATH' ) || exit();

if(!class_exists('CourseCartMigration')){
    class CourseCartMigration
    {
        public function up()
        {
            if(!Manager::schema()->hasTable('acadlix_course_cart')){
                Manager::schema()->create('acadlix_course_cart', function($table){
                    $table->bigIncrements('id');
                    $table->string('cart_token')->nullable();
                    $table->bigInteger('course_id')->nullable();
                    $table->unsignedBigInteger('user_id');
                    $table->integer('quantity')->default(1);
                    $table->bigInteger('token_expiry')->nullable()->default(0);
                    $table->timestamps();
                });
            }
        }
    
        public function down()
        {
            Manager::schema()->dropIfExists('acadlix_course_cart');
        }
    }
}