<?php

namespace Yuvayana\Acadlix\Common\Migrations;

use Illuminate\Database\Capsule\Manager;

defined('ABSPATH') || exit();

if (!class_exists('OrderItemMigration')) {
  class OrderItemMigration
  {
    protected $_table_name = 'order_items';
    public function up()
    {
      if (!Manager::schema()->hasTable(acadlix()->helper()->acadlix_table_prefix($this->_table_name))) {
        Manager::schema()->create(acadlix()->helper()->acadlix_table_prefix($this->_table_name), function ($table) {
          $table->bigIncrements('id');
          $table->bigInteger('item_id')->nullable()->index();
          $table->foreignId('order_id')->nullable();
          $table->foreign('order_id', acadlix()->helper()->acadlix_fk_prefix($this->_table_name, 'order_id'))
            ->references('id')
            ->on(acadlix()->helper()->acadlix_table_prefix('orders'))
            ->onDelete('cascade');
          $table->unsignedBigInteger('subscription_id')->nullable();
          $table->string('type')->default('course'); // 'course' or 'bundle'
          $table->string('item_title')->nullable();
          $table->integer('quantity')->nullable()->default(1);
          $table->float('price')->nullable()->default(0);
          $table->float('discount')->nullable()->default(0);
          $table->float('price_after_discount')->nullable()->default(0);
          $table->float('additional_fee')->nullable()->default(0);
          $table->float('tax')->nullable()->default(0);
          $table->float('price_after_tax')->nullable()->default(0);
          $table->timestamps();
        });
      }
    }

    public function down()
    {
      Manager::schema()->dropIfExists(acadlix()->helper()->acadlix_table_prefix($this->_table_name));
    }

    public function update()
    {
      if (
        !Manager::schema()->hasColumn(acadlix()->helper()->acadlix_table_prefix($this->_table_name), 'type')
      ) {
        Manager::schema()->table(acadlix()->helper()->acadlix_table_prefix($this->_table_name), function ($table) {
          $table->string('type')->default('course')->after('subscription_id');
        });
      }
      if (
        Manager::schema()->hasColumn(acadlix()->helper()->acadlix_table_prefix($this->_table_name), 'course_id') &&
        !Manager::schema()->hasColumn(acadlix()->helper()->acadlix_table_prefix($this->_table_name), 'item_id')
      ) {
        Manager::schema()->table(acadlix()->helper()->acadlix_table_prefix($this->_table_name), function ($table) {
          $table->renameColumn('course_id', 'item_id');
        });
      }
      if (
        Manager::schema()->hasColumn(acadlix()->helper()->acadlix_table_prefix($this->_table_name), 'course_title') &&
        !Manager::schema()->hasColumn(acadlix()->helper()->acadlix_table_prefix($this->_table_name), 'item_title')
      ) {
        Manager::schema()->table(acadlix()->helper()->acadlix_table_prefix($this->_table_name), function ($table) {
          $table->renameColumn('course_title', 'item_title');
        });
      }

      acadlix()->helper()->acadlix_update_fk(
        acadlix()->helper()->acadlix_table_prefix($this->_table_name),
        acadlix()->helper()->acadlix_old_fk_prefix($this->_table_name, 'order_id'),
        'order_id',
        acadlix()->helper()->acadlix_table_prefix('orders'),
        acadlix()->helper()->acadlix_fk_prefix($this->_table_name, 'order_id'),
      );

      if (!Manager::schema()->hasColumn(acadlix()->helper()->acadlix_table_prefix($this->_table_name), 'subscription_id')) {
        Manager::schema()->table(acadlix()->helper()->acadlix_table_prefix($this->_table_name), function ($table) {
          $table->unsignedBigInteger('subscription_id')->nullable()->after('order_id');
        });
      }

      if (!Manager::schema()->hasColumn(acadlix()->helper()->acadlix_table_prefix($this->_table_name), 'additional_fee')) {
        Manager::schema()->table(acadlix()->helper()->acadlix_table_prefix($this->_table_name), function ($table) {
          $table->float('additional_fee')->nullable()->default(0)->after('price_after_discount');
        });
      }
    }
  }
}