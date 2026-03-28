<?php

namespace Yuvayana\Acadlix\Common\Migrations;

use Illuminate\Database\Capsule\Manager;

defined('ABSPATH') || exit();

if (!class_exists('QuestionMigration')) {
  class QuestionMigration
  {
    protected $_table_name = 'question';
    public function up()
    {
      if (!Manager::schema()->hasTable(acadlix()->helper()->acadlix_table_prefix($this->_table_name))) {
        Manager::schema()->create(acadlix()->helper()->acadlix_table_prefix($this->_table_name), function ($table) {
          $table->bigIncrements('id');
          $table->bigInteger('quiz_id')->nullable();
          $table->foreignId('subject_id')->nullable();
          $table->foreign('subject_id', acadlix()->helper()->acadlix_fk_prefix($this->_table_name, 'subject_id'))
            ->references('id')
            ->on(acadlix()->helper()->acadlix_table_prefix('subject'))
            ->nullOnDelete();
          $table->string('difficulty_level')->nullable();
          $table->boolean('online')->default(1)->comment('0 => offline, 1 => online');
          $table->integer('sort')->unsigned()->default(1);
          $table->string('title')->nullable();
          $table->float('points')->default(1);
          $table->float('negative_points')->default(0);
          $table->boolean('different_points_for_each_answer')->default(0);
          $table->boolean('different_incorrect_msg')->default(0);
          $table->boolean('hint_enabled')->default(0);
          $table->boolean('paragraph_enabled')->default(0);
          $table->bigInteger('paragraph_id')->nullable();
          $table->string('answer_type')->nullable();
          $table->text('meta')->nullable();
          $table->timestamps();
          $table->index('paragraph_id', acadlix()->helper()->acadlix_index_prefix($this->_table_name, 'paragraph_id'));
          $table->index(['quiz_id', "online"], acadlix()->helper()->acadlix_index_prefix($this->_table_name, 'quiz_id_online'));
        });
      }
    }

    public function down()
    {
      Manager::schema()->dropIfExists(acadlix()->helper()->acadlix_table_prefix($this->_table_name));
    }

    public function update()
    {
      if (!Manager::schema()->hasColumn(acadlix()->helper()->acadlix_table_prefix($this->_table_name), 'difficulty_level')) {
        Manager::schema()->table(acadlix()->helper()->acadlix_table_prefix($this->_table_name), function ($table) {
          $table->string('difficulty_level')->nullable()->after('subject_id');
        });
      }

      acadlix()->helper()->acadlix_update_fk(
        acadlix()->helper()->acadlix_table_prefix($this->_table_name),
        acadlix()->helper()->acadlix_old_fk_prefix($this->_table_name, 'subject_id'),
        'subject_id',
        acadlix()->helper()->acadlix_table_prefix('subject'),
        acadlix()->helper()->acadlix_fk_prefix($this->_table_name, 'subject_id'),
      );
      acadlix()->helper()->acadlix_update_index(
        acadlix()->helper()->acadlix_table_prefix($this->_table_name),
        acadlix()->helper()->acadlix_old_index_prefix($this->_table_name, 'paragraph_id'),
        'paragraph_id',
        acadlix()->helper()->acadlix_index_prefix($this->_table_name, 'paragraph_id'),
      );
      acadlix()->helper()->acadlix_update_index(
        acadlix()->helper()->acadlix_table_prefix($this->_table_name),
        acadlix()->helper()->acadlix_old_index_prefix($this->_table_name, 'quiz_id_online'),
        ['quiz_id', "online"],
        acadlix()->helper()->acadlix_index_prefix($this->_table_name, 'quiz_id_online'),
      );
    }

  }
}