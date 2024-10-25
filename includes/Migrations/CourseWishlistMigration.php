<?php

namespace Yuvayana\Acadlix\Migrations;

use Illuminate\Database\Capsule\Manager;

defined( 'ABSPATH' ) || exit();

if(!class_exists('CourseWishlistMigration')){
    class CourseWishlistMigration
    {
        public function up()
        {
            if(!Manager::schema()->hasTable('course_wishlist')){
                Manager::schema()->create('course_wishlist', function($table){
                    $table->bigIncrements('id');
                    $table->foreignId('course_id')->constrained('courses')->cascadeOnDelete();
                    $table->unsignedBigInteger('user_id');
                    $table->timestamps();
                });
            }
        }
    
        public function down()
        {
            Manager::schema()->dropIfExists('course_wishlist');
        }
    }
}