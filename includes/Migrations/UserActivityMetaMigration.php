<?php

namespace Yuvayana\Acadlix\Migrations;

use Illuminate\Database\Capsule\Manager;

defined( 'ABSPATH' ) || exit();

if(!class_exists('UserActivityMetaMigration')){
    class UserActivityMetaMigration
    {
        public function up()
        {
            if(!Manager::schema()->hasTable('user_activity_meta')){
                Manager::schema()->create('user_activity_meta', function($table){
                    $table->bigIncrements('id');
                    $table->string('user_token')->nullable();
                    $table->unsignedBigInteger('user_id')->nullable();
                    $table->string("type")->nullable();
                    $table->bigInteger('type_id')->nullable();
                    $table->string('meta_key')->nullable();
                    $table->longText('meta_value')->nullable();
                    $table->timestamps();
                });
            }
        }
    
        public function down()
        {
            Manager::schema()->dropIfExists('user_activity_meta');
        }
    }
}