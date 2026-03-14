<?php

namespace Yuvayana\Acadlix\Common\Migrations;

use Illuminate\Database\Capsule\Manager;

defined('ABSPATH') || exit();

if (!class_exists('OrderMigration')) {
  class OrderMigration
  {
    protected $_table_name = 'orders';
    public function up()
    {
      if (!Manager::schema()->hasTable(acadlix()->helper()->acadlix_table_prefix($this->_table_name))) {
        Manager::schema()->create(acadlix()->helper()->acadlix_table_prefix($this->_table_name), function ($table) {
          $table->bigIncrements('id');
          $table->unsignedBigInteger('user_id');
          $table->unsignedBigInteger('subscription_id')->nullable(); // Pro-only usage
          $table->unsignedBigInteger('parent_id')->nullable();       // Pro-only usage
          $table->string('status')->nullable()->default('pending');
          $table->unsignedBigInteger('coupon_id')->nullable();
          $table->string('coupon_code')->nullable();
          $table->float('coupon_amount')->nullable()->default(0);
          $table->string('discount_type')->nullable();
          $table->float('extra_charges')->nullable()->default(0);
          $table->float('total_amount')->nullable()->default(0);
          $table->timestamps();
          $table->index('user_id', acadlix()->helper()->acadlix_index_prefix($this->_table_name, 'user_id'));
          $table->index('status', acadlix()->helper()->acadlix_index_prefix($this->_table_name, 'status'));
        });
      }
    }

    public function down()
    {
      Manager::schema()->dropIfExists(acadlix()->helper()->acadlix_table_prefix($this->_table_name));
    }

    public function update()
    {
      acadlix()->helper()->acadlix_update_index(
        acadlix()->helper()->acadlix_table_prefix($this->_table_name),
        acadlix()->helper()->acadlix_old_index_prefix($this->_table_name, 'user_id'),
        'user_id',
        acadlix()->helper()->acadlix_index_prefix($this->_table_name, 'user_id'),
      );
      acadlix()->helper()->acadlix_update_index(
        acadlix()->helper()->acadlix_table_prefix($this->_table_name),
        acadlix()->helper()->acadlix_old_index_prefix($this->_table_name, 'status'),
        'status',
        acadlix()->helper()->acadlix_index_prefix($this->_table_name, 'status'),
      );

      if (!Manager::schema()->hasColumn(acadlix()->helper()->acadlix_table_prefix($this->_table_name), 'subscription_id')) {
        Manager::schema()->table(acadlix()->helper()->acadlix_table_prefix($this->_table_name), function ($table) {
          $table->unsignedBigInteger('subscription_id')->nullable()->after('user_id');
        });
      }

      if (!Manager::schema()->hasColumn(acadlix()->helper()->acadlix_table_prefix($this->_table_name), 'parent_id')) {
        Manager::schema()->table(acadlix()->helper()->acadlix_table_prefix($this->_table_name), function ($table) {
          $table->unsignedBigInteger('parent_id')->nullable()->after('subscription_id');
        });
      }

      if (!Manager::schema()->hasColumn(acadlix()->helper()->acadlix_table_prefix($this->_table_name), 'coupon_id')) {
        Manager::schema()->table(acadlix()->helper()->acadlix_table_prefix($this->_table_name), function ($table) {
          $table->unsignedBigInteger('coupon_id')->nullable()->after('status');
        });
      }

      if (!Manager::schema()->hasColumn(acadlix()->helper()->acadlix_table_prefix($this->_table_name), 'coupon_code')) {
        Manager::schema()->table(acadlix()->helper()->acadlix_table_prefix($this->_table_name), function ($table) {
          $table->string('coupon_code')->nullable()->after('coupon_id');
        });
      }

      if (!Manager::schema()->hasColumn(acadlix()->helper()->acadlix_table_prefix($this->_table_name), 'coupon_amount')) {
        Manager::schema()->table(acadlix()->helper()->acadlix_table_prefix($this->_table_name), function ($table) {
          $table->float('coupon_amount')->nullable()->default(0)->after('coupon_code');
        });
      }

      if (!Manager::schema()->hasColumn(acadlix()->helper()->acadlix_table_prefix($this->_table_name), 'discount_type')) {
        Manager::schema()->table(acadlix()->helper()->acadlix_table_prefix($this->_table_name), function ($table) {
          $table->string('discount_type')->nullable()->after('coupon_amount');
        });
      }
    }
  }
}