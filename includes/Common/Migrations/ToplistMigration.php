<?php

namespace Yuvayana\Acadlix\Common\Migrations;

use Illuminate\Database\Capsule\Manager;

defined('ABSPATH') || exit();

if (!class_exists(('ToplistMigration'))) {
    class ToplistMigration
    {
        public function up()
        {
            if (!Manager::schema()->hasTable('acadlix_toplist')) {
                Manager::schema()->create('acadlix_toplist', function ($table) {
                    $table->bigIncrements('id');
                    $table->bigInteger('quiz_id')->nullable()->index();
                    $table->string('user_token')->nullable()->index();
                    $table->unsignedBigInteger('user_id')->nullable()->index();
                    $table->string('name', 100)->nullable();
                    $table->string('email', 100)->nullable();
                    $table->float('points')->nullable();
                    $table->float('result')->nullable();
                    $table->string('ip', 100)->nullable();
                    $table->integer('quiz_time')->default(0);
                    $table->float('accuracy')->nullable();
                    $table->string('status', 100)->nullable();
                    $table->timestamps();
                    $table->index(['quiz_id', 'result', 'quiz_time', 'created_at']);

                });
            }
        }

        public function down()
        {
            Manager::schema()->dropIfExists('acadlix_toplist');
        }
    }
}