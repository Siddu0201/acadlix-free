<?php

namespace Yuvayana\Acadlix\Common\Migrations;

use Illuminate\Database\Capsule\Manager;

defined('ABSPATH') || exit();

if (!class_exists(('ToplistMigration'))) {
    class ToplistMigration
    {
        protected $_table_name = 'toplist';
        public function up()
        {
            if (!Manager::schema()->hasTable(acadlix()->helper()->acadlix_table_prefix($this->_table_name))) {
                Manager::schema()->create(acadlix()->helper()->acadlix_table_prefix($this->_table_name), function ($table) {
                    $table->bigIncrements('id');
                    $table->bigInteger('quiz_id')->nullable();
                    $table->string('user_token')->nullable();
                    $table->unsignedBigInteger('user_id')->nullable();
                    $table->string('name', 100)->nullable();
                    $table->string('email', 100)->nullable();
                    $table->float('points')->nullable();
                    $table->float('result')->nullable();
                    $table->string('ip', 100)->nullable();
                    $table->integer('quiz_time')->default(0);
                    $table->float('accuracy')->nullable();
                    $table->string('status', 100)->nullable();
                    $table->timestamps();
                    $table->index(['quiz_id', 'result', 'quiz_time', 'created_at'], acadlix()->helper()->acadlix_index_prefix($this->_table_name, 'qid_r_qt_cat'));
                    $table->index('quiz_id', acadlix()->helper()->acadlix_index_prefix($this->_table_name, 'qid'));
                    $table->index('user_token', acadlix()->helper()->acadlix_index_prefix($this->_table_name, 'user_token'));
                    $table->index('user_id', acadlix()->helper()->acadlix_index_prefix($this->_table_name, 'user_id'));
                });
            }
        }

        public function down()
        {
            Manager::schema()->dropIfExists(acadlix()->helper()->acadlix_table_prefix($this->_table_name));
        }

        public function update()
        {
            acadlix()->helper()->acadlix_udpate_index(
                acadlix()->helper()->acadlix_table_prefix($this->_table_name), 
                acadlix()->helper()->acadlix_old_index_prefix($this->_table_name, 'quiz_id_result_quiz_time_created_at'), 
                ['quiz_id', 'result', 'quiz_time', 'created_at'], 
                acadlix()->helper()->acadlix_index_prefix($this->_table_name, 'qid_r_qt_cat'), 
            );
            acadlix()->helper()->acadlix_udpate_index(
                acadlix()->helper()->acadlix_table_prefix($this->_table_name), 
                acadlix()->helper()->acadlix_old_index_prefix($this->_table_name, 'quiz_id'), 
                'quiz_id', 
                acadlix()->helper()->acadlix_index_prefix($this->_table_name, 'quiz_id'), 
            );
            acadlix()->helper()->acadlix_udpate_index(
                acadlix()->helper()->acadlix_table_prefix($this->_table_name), 
                acadlix()->helper()->acadlix_old_index_prefix($this->_table_name, 'user_token'), 
                'user_token', 
                acadlix()->helper()->acadlix_index_prefix($this->_table_name, 'user_token'), 
            );
            acadlix()->helper()->acadlix_udpate_index(
                acadlix()->helper()->acadlix_table_prefix($this->_table_name), 
                acadlix()->helper()->acadlix_old_index_prefix($this->_table_name, 'user_id'), 
                'user_id', 
                acadlix()->helper()->acadlix_index_prefix($this->_table_name, 'user_id'), 
            );
        }
    }
}