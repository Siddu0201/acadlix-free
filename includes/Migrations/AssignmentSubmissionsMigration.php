<?php

namespace Yuvayana\Acadlix\Migrations;

use Illuminate\Database\Capsule\Manager;

defined('ABSPATH') || exit();

if (!class_exists('AssignmentSubmissionsMigration')) {
    class AssignmentSubmissionsMigration
    {
        public function up()
        {
            if (!Manager::schema()->hasTable('acadlix_assignment_submissions')) {
                Manager::schema()->create('acadlix_assignment_submissions', function ($table) {
                    $table->bigIncrements('id');
                    $table->foreignId('assignment_user_stats_id')->constrained('acadlix_assignment_user_stats')->cascadeOnDelete();
                    $table->boolean('is_active')->nullable();
                    $table->boolean('is_late')->nullable();
                    $table->float('marks')->nullable();
                    $table->longText('answer_text')->nullable();
                    $table->longText('answer_attachments')->nullable();
                    $table->longText('feedback')->nullable();
                    $table->longText('feedback_attachments')->nullable();
                    $table->dateTime('submitted_at')->nullable();
                    $table->dateTime('evaluated_at')->nullable();
                    $table->timestamps();
                });
            }
        }

        public function down()
        {
            Manager::schema()->dropIfExists('acadlix_assignment_submissions');
        }

    }
}