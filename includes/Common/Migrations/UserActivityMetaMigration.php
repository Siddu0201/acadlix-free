<?php

namespace Yuvayana\Acadlix\Common\Migrations;

use Illuminate\Database\Capsule\Manager;

defined('ABSPATH') || exit();

if (!class_exists('UserActivityMetaMigration')) {
    class UserActivityMetaMigration
    {
        protected $_table_name = 'user_activity_meta';
        public function up()
        {
            if (!Manager::schema()->hasTable(acadlix()->helper()->acadlix_table_prefix($this->_table_name))) {
                Manager::schema()->create(acadlix()->helper()->acadlix_table_prefix($this->_table_name), function ($table) {
                    $table->bigIncrements('id');
                    $table->string('user_token')->nullable();
                    $table->unsignedBigInteger('user_id')->nullable();
                    $table->string("type")->nullable();
                    $table->bigInteger('type_id')->nullable();
                    $table->string('meta_key')->nullable();
                    $table->longText('meta_value')->nullable();
                    $table->timestamps();

                    $table->index(['type', 'type_id'], acadlix()->helper()->acadlix_index_prefix($this->_table_name, 'type_type_id'));
                    $table->index(['user_id', 'type_id'], acadlix()->helper()->acadlix_index_prefix($this->_table_name, 'user_id_type_id'));
                    $table->index(['user_token', 'type_id'], acadlix()->helper()->acadlix_index_prefix($this->_table_name, 'user_token_type_id'));
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
                acadlix()->helper()->acadlix_old_index_prefix($this->_table_name, 'type_type_id'), 
                ['type', 'type_id'], 
                acadlix()->helper()->acadlix_index_prefix($this->_table_name, 'type_type_id'), 
            );
            acadlix()->helper()->acadlix_udpate_index(
                acadlix()->helper()->acadlix_table_prefix($this->_table_name), 
                acadlix()->helper()->acadlix_old_index_prefix($this->_table_name, 'user_id_type_id'), 
                ['user_id', 'type_id'], 
                acadlix()->helper()->acadlix_index_prefix($this->_table_name, 'user_id_type_id'), 
            );
            acadlix()->helper()->acadlix_udpate_index(
                acadlix()->helper()->acadlix_table_prefix($this->_table_name), 
                acadlix()->helper()->acadlix_old_index_prefix($this->_table_name, 'user_token_type_id'), 
                ['user_token', 'type_id'], 
                acadlix()->helper()->acadlix_index_prefix($this->_table_name, 'user_token_type_id'), 
            );
        }
    }
}