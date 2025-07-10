<?php

namespace Yuvayana\Acadlix\Common\Migrations;

use Illuminate\Database\Capsule\Manager;

defined('ABSPATH') || exit();

if (!class_exists('OrderMetaMigration')) {
    class OrderMetaMigration
    {
        protected $_table_name = 'order_meta';
        public function up()
        {
            if (!Manager::schema()->hasTable(acadlix()->helper()->acadlix_table_prefix($this->_table_name))) {
                Manager::schema()->create(acadlix()->helper()->acadlix_table_prefix($this->_table_name), function ($table) {
                    $table->bigIncrements('id');
                    $table->foreignId('order_id')->nullable();
                    $table->foreign('order_id', acadlix()->helper()->acadlix_fk_prefix($this->_table_name, 'order_id'))
                        ->references('id')
                        ->on(acadlix()->helper()->acadlix_table_prefix('orders'))
                        ->onDelete('cascade');
                    $table->string('meta_key')->nullable();
                    $table->longText('meta_value')->nullable();
                    $table->timestamps();
                    $table->index('meta_key', acadlix()->helper()->acadlix_index_prefix($this->_table_name, 'meta_key'));
                });
            }
        }

        public function down()
        {
            Manager::schema()->dropIfExists(acadlix()->helper()->acadlix_table_prefix($this->_table_name));
        }

        public function update()
        {
            acadlix()->helper()->acadlix_udpate_fk(
                acadlix()->helper()->acadlix_table_prefix($this->_table_name),
                acadlix()->helper()->acadlix_old_fk_prefix($this->_table_name, 'order_id'),
                'order_id',
                acadlix()->helper()->acadlix_table_prefix('orders'),
                acadlix()->helper()->acadlix_fk_prefix($this->_table_name, 'order_id'),
            );
            acadlix()->helper()->acadlix_udpate_index(
                acadlix()->helper()->acadlix_table_prefix($this->_table_name),
                acadlix()->helper()->acadlix_old_index_prefix($this->_table_name, 'meta_key'),
                'meta_key',
                acadlix()->helper()->acadlix_index_prefix($this->_table_name, 'meta_key'),
            );
        }
    }
}