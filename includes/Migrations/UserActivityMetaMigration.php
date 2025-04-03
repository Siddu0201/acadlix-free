<?php

namespace Yuvayana\Acadlix\Migrations;

use Illuminate\Database\Capsule\Manager;

defined('ABSPATH') || exit();

if (!class_exists('UserActivityMetaMigration')) {
    class UserActivityMetaMigration
    {
        public function up()
        {
            if (!Manager::schema()->hasTable('acadlix_user_activity_meta')) {
                Manager::schema()->create('acadlix_user_activity_meta', function ($table) {
                    $table->bigIncrements('id');
                    $table->string('user_token')->nullable();
                    $table->unsignedBigInteger('user_id')->nullable();
                    $table->string("type")->nullable();
                    $table->bigInteger('type_id')->nullable();
                    $table->string('meta_key')->nullable();
                    $table->longText('meta_value')->nullable();
                    $table->timestamps();

                    $table->index(['type', 'type_id']);
                    $table->index(['user_id', 'type_id']); // Optimizes user_id lookups
                    $table->index(['user_token', 'type_id']); // Optimizes user_token-based searches
                });
            }
        }

        public function down()
        {
            Manager::schema()->dropIfExists('acadlix_user_activity_meta');
        }
    }
}