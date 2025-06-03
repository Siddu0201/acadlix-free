<?php 

namespace Yuvayana\Acadlix\Migrations;

use Illuminate\Database\Capsule\Manager;

defined('ABSPATH') || exit();

if (!class_exists('AssignmentUserStatsMigration')) {
    class AssignmentUserStatsMigration
    {
        public function up()
        {
            if (!Manager::schema()->hasTable('acadlix_assignment_user_stats')) {
                Manager::schema()->create('acadlix_assignment_user_stats', function ($table) {
                    $table->bigIncrements('id');
                    $table->integer('assignment_id')->unsigned()->nullable()->default(0)->index();
                    $table->foreignId('course_statistic_id')->nullable()->constrained('acadlix_course_statistics')->cascadeOnDelete();
                    $table->string('user_status')->nullable();
                    $table->string('admin_status')->nullable();
                    $table->integer('attempt_counts')->unsigned()->nullable()->default(0);
                    $table->float('final_marks')->nullable();
                    $table->boolean('is_passed')->nullable();
                    $table->boolean('has_late_submission')->nullable();
                    $table->boolean('resubmission_allowed')->nullable();
                    $table->dateTime('first_started_at')->nullable();
                    $table->timestamps();
                });
            }
        }

        public function down()
        {
            Manager::schema()->dropIfExists('acadlix_assignment_user_stats');
        }
    }
}
