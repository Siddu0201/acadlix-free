<?php

namespace Yuvayana\Acadlix\Common\Migrations;

use Illuminate\Database\Capsule\Manager;

defined('ABSPATH') || exit();

if (!class_exists('CourseCartMigration')) {
  class CourseCartMigration
  {
    protected $_table_name = 'course_cart';

    public function up()
    {
      if (!Manager::schema()->hasTable(acadlix()->helper()->acadlix_table_prefix($this->_table_name))) {
        Manager::schema()->create(acadlix()->helper()->acadlix_table_prefix($this->_table_name), function ($table) {
          $table->bigIncrements('id');
          $table->string('cart_token')->nullable();
          $table->bigInteger('item_id')->nullable(); // Index for filtering courses
          $table->unsignedBigInteger('user_id')->nullable(); // Index for user lookup
          $table->unsignedBigInteger('subscription_plan_id')->nullable(); // Pro-only usage
          $table->string('type')->default('course'); // 'course' or 'bundle'
          $table->integer('quantity')->default(1);
          $table->bigInteger('token_expiry')->nullable()->default(0); // Index for expiring carts
          $table->timestamps();
          $table->index('cart_token', acadlix()->helper()->acadlix_index_prefix($this->_table_name, 'cart_token'));
          $table->index('item_id', acadlix()->helper()->acadlix_index_prefix($this->_table_name, 'item_id'));
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
      if (
        !Manager::schema()->hasColumn(acadlix()->helper()->acadlix_table_prefix($this->_table_name), 'type')
      ) {
        Manager::schema()->table(acadlix()->helper()->acadlix_table_prefix($this->_table_name), function ($table) {
          $table->string('type')->default('course')->after('subscription_plan_id');
        });
      }
      if (
        Manager::schema()->hasColumn(acadlix()->helper()->acadlix_table_prefix($this->_table_name), 'course_id') &&
        !Manager::schema()->hasColumn(acadlix()->helper()->acadlix_table_prefix($this->_table_name), 'item_id')
      ) {
        Manager::schema()->table(acadlix()->helper()->acadlix_table_prefix($this->_table_name), function ($table) {
          $table->renameColumn('course_id', 'item_id');
          $table->renameIndex(
            acadlix()->helper()->acadlix_index_prefix($this->_table_name, 'course_id'),
            acadlix()->helper()->acadlix_index_prefix($this->_table_name, 'item_id')
          );
        });
      }

      acadlix()->helper()->acadlix_update_index(
        acadlix()->helper()->acadlix_table_prefix($this->_table_name),
        acadlix()->helper()->acadlix_old_index_prefix($this->_table_name, 'cart_token'),
        'cart_token',
        acadlix()->helper()->acadlix_index_prefix($this->_table_name, 'cart_token'),
      );
      // acadlix()->helper()->acadlix_update_index(
      //     acadlix()->helper()->acadlix_table_prefix($this->_table_name),
      //     acadlix()->helper()->acadlix_old_index_prefix($this->_table_name, 'course_id'),
      //     'course_id',
      //     acadlix()->helper()->acadlix_index_prefix($this->_table_name, 'course_id'),
      // );
      acadlix()->helper()->acadlix_update_index(
        acadlix()->helper()->acadlix_table_prefix($this->_table_name),
        acadlix()->helper()->acadlix_old_index_prefix($this->_table_name, 'user_id'),
        'user_id',
        acadlix()->helper()->acadlix_index_prefix($this->_table_name, 'user_id'),
      );

      if (!Manager::schema()->hasColumn(acadlix()->helper()->acadlix_table_prefix($this->_table_name), 'subscription_plan_id')) {
        Manager::schema()->table(acadlix()->helper()->acadlix_table_prefix($this->_table_name), function ($table) {
          $table->unsignedBigInteger('subscription_plan_id')->nullable()->after('user_id');
        });
      }
    }
  }
}