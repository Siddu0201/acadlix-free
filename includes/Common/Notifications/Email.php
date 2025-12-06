<?php

namespace Yuvayana\Acadlix\Common\Notifications;

class Email
{
    protected $notify_course_purchase_to_student = false;
    protected $notify_course_purchase_to_admin = false;
    protected $notify_failed_transation_to_student = false;
    protected $notify_failed_transation_to_admin = false;
    protected $notify_course_completion_to_student = false;
    protected $notify_course_completion_to_admin = false;
    protected $notify_offline_purchase_to_student = false;
    protected $notify_offline_purchase_to_admin = false;
    protected $admin_emails = [];

    public function __construct()
    {
        $this->notify_course_purchase_to_student = acadlix()->helper()->acadlix_get_option('acadlix_notify_course_purchase_to_student') == 'yes';
        $this->notify_course_purchase_to_admin = acadlix()->helper()->acadlix_get_option('acadlix_notify_course_purchase_to_admin') == 'yes';
        $this->notify_failed_transation_to_student = acadlix()->helper()->acadlix_get_option('acadlix_notify_failed_transation_to_student') == 'yes';
        $this->notify_failed_transation_to_admin = acadlix()->helper()->acadlix_get_option('acadlix_notify_failed_transation_to_admin') == 'yes';
        $this->notify_course_completion_to_student = acadlix()->helper()->acadlix_get_option('acadlix_notify_course_completion_to_student') == 'yes';
        $this->notify_course_completion_to_admin = acadlix()->helper()->acadlix_get_option('acadlix_notify_course_completion_to_admin') == 'yes';
        $this->notify_offline_purchase_to_student = acadlix()->helper()->acadlix_get_option('acadlix_notify_offline_purchase_to_student') == 'yes';
        $this->notify_offline_purchase_to_admin = acadlix()->helper()->acadlix_get_option('acadlix_notify_offline_purchase_to_admin') == 'yes';
        $this->admin_emails = wp_list_pluck(get_users(['role' => 'administrator']), 'user_email');
    }

    public function handleCoursePurchaseEmail($order_id = 0)
    {
        if ($order_id == 0) {
            return;
        }

        $order = acadlix()->model()->order()->find($order_id);
        if (!$order || $order->status !== 'success') {
            return;
        }
        $r = [
            'order_id' => $order_id,
            'username' => $order->user->display_name ?? '',
            'course_names' => $order->getCourseNames(),
            'order_amount' => acadlix()->helper()->acadlix_get_price_with_currency($order->total_amount, $order->getMetaValue('currency') ?? 'USD'),
            'payment_method' => $order->getMetaValue('payment_method') ?? __('Free', 'acadlix'),
            'order_date' => acadlix()->helper()->formatDate($order->updated_at),
            'year' => date('Y'),
            'sitename' => get_bloginfo('name'),
            'admin_order_url' => admin_url('admin.php?page=acadlix_order#/edit/' . $order_id)
        ];
        $student_email = $order->user->user_email;
        if ($this->notify_course_purchase_to_student && !empty($student_email)) {
            $student_email_template = acadlix()->helper()->acadlix_get_email_template(
                'CoursePurchase.php',
                'student',
                $r
            );
            // $student_msg = str_replace(array_keys($r), $r, $student_email_template);
            /* translators: %d is the order ID */
            $student_subject = sprintf(__('Your order #%d confirmed!', 'acadlix'), $order_id);
            acadlix()->helper()->email()->sendEmail(
                $student_email,
                $student_subject,
                $student_email_template
            );
        }

        if ($this->notify_course_purchase_to_admin && !empty($this->admin_emails)) {
            $admin_email_template = acadlix()->helper()->acadlix_get_email_template(
                'CoursePurchase.php',
                'admin',
                $r
            );
            /* translators: %d is the order ID */
            $admin_subject = sprintf(__('New order received #%d', 'acadlix'), $order_id);
            acadlix()->helper()->email()->sendEmail(
                $this->admin_emails,
                $admin_subject,
                $admin_email_template
            );
        }
    }

    public function handleFailedTransationEmail($order_id = 0)
    {
        if ($order_id == 0) {
            return;
        }
        $order = acadlix()->model()->order()->find($order_id);
        if (!$order || $order->status !== 'failed') {
            return;
        }
        $r = [
            'order_id' => $order_id,
            'username' => $order->user->display_name ?? '',
            'course_names' => $order->getCourseNames(),
            'order_amount' => acadlix()->helper()->acadlix_get_price_with_currency($order->total_amount, $order->getMetaValue('currency') ?? 'USD'),
            'payment_method' => $order->getMetaValue('payment_method') ?? __('Free', 'acadlix'),
            'order_date' => acadlix()->helper()->formatDate($order->updated_at),
            'year' => date('Y'),
            'sitename' => get_bloginfo('name'),
            'admin_order_url' => admin_url('admin.php?page=acadlix_order#/edit/' . $order_id)
        ];
        $student_email = $order->user->user_email;
        if ($this->notify_failed_transation_to_student && !empty($student_email)) {
            $student_email_template = acadlix()->helper()->acadlix_get_email_template(
                'FailedTransation.php',
                'student',
                $r
            );
            /* translators: %d is the order ID */
            $student_subject = sprintf(__('Payement failed for order #%d', 'acadlix'), $order_id);
            acadlix()->helper()->email()->sendEmail(
                $student_email,
                $student_subject,
                $student_email_template
            );
        }

        if ($this->notify_failed_transation_to_admin && !empty($this->admin_emails)) {
            $admin_email_template = acadlix()->helper()->acadlix_get_email_template(
                'FailedTransation.php',
                'admin',
                $r
            );
            /* translators: %d is the order ID */
            $admin_subject = sprintf(__('Payment failed for order #%d', 'acadlix'), $order_id);
            acadlix()->helper()->email()->sendEmail(
                $this->admin_emails,
                $admin_subject,
                $admin_email_template
            );
        }
    }

    public function handleCourseCompletionEmail($course_id = 0, $user_id = 0)
    {
        if ($course_id == 0) {
            return;
        }
        $course = acadlix()->model()->course()->find($course_id);
        $user = acadlix()->model()->wpUsers()->find($user_id);

        if (!$course || !$user) {
            return '';
        }

        $course_completion_percentage = $course->getCourseCompletionPercentage($user_id) ?? 0;
        if ($course_completion_percentage != 100) {
            return '';
        }
        $r = [
            'username' => $user->display_name ?? '',
            'coursename' => $course->post_title ?? '',
            'date' => acadlix()->helper()->formatDate(current_time('mysql')),
            'year' => date('Y'),
            'sitename' => get_bloginfo('name'),
        ];

        $student_email = $user->user_email;
        if ($this->notify_course_completion_to_student && !empty($student_email)) {
            $student_email_template = acadlix()
                ->helper()
                ->acadlix_get_email_template(
                    'CourseCompletion.php',
                    'student',
                    $r
                );
            /* translators: %s is the course name */
            $student_subject = sprintf(__('You have completed %s!', 'acadlix'), $r['coursename']);
            acadlix()
                ->helper()
                ->email()
                ->sendEmail(
                    $student_email,
                    $student_subject,
                    $student_email_template
                );
        }

        if ($this->notify_course_completion_to_admin && !empty($this->admin_emails)) {
            $admin_email_template = acadlix()
                ->helper()
                ->acadlix_get_email_template(
                    'CourseCompletion.php',
                    'admin',
                    $r
                );
            /* translators: 1: %s is the username, 2: %s is the coursename */
            $admin_subject = sprintf(__(' %1$s has completed %2$s', 'acadlix'), $r['username'], $r['coursename']);
            acadlix()
                ->helper()
                ->email()
                ->sendEmail(
                    $this->admin_emails,
                    $admin_subject,
                    $admin_email_template
                );
        }
    }

    public function handleOfflinePurchaseEmail($order_id = 0)
    {
        if ($order_id == 0) {
            return;
        }
        $order = acadlix()->model()->order()->find($order_id);
        if (!$order || $order->status !== 'pending') {
            return;
        }
        $r = [
            'order_id' => $order_id,
            'username' => $order->user->display_name ?? '',
            'course_names' => $order->getCourseNames(),
            'order_amount' => acadlix()->helper()->acadlix_get_price_with_currency($order->total_amount, $order->getMetaValue('currency') ?? 'USD'),
            'payment_method' => $order->getMetaValue('payment_method') ?? __('Free', 'acadlix'),
            'order_date' => acadlix()->helper()->formatDate($order->updated_at),
            'year' => date('Y'),
            'sitename' => get_bloginfo('name'),
            'admin_order_url' => admin_url('admin.php?page=acadlix_order#/edit/' . $order_id)
        ];
        $student_email = $order->user->user_email;
        if ($this->notify_offline_purchase_to_student && !empty($student_email)) {
            error_log('Sending offline purchase email to student: ' . $student_email);
            $student_email_template = acadlix()->helper()->acadlix_get_email_template(
                'OfflinePurchase.php',
                'student',
                $r
            );
            /* translators: %d is the order ID */
            $student_subject = sprintf(__('Offline Purchase for order #%d', 'acadlix'), $order_id);
            acadlix()->helper()->email()->sendEmail(
                $student_email,
                $student_subject,
                $student_email_template
            );
        }

        if ($this->notify_offline_purchase_to_admin && !empty($this->admin_emails)) {
            $admin_email_template = acadlix()->helper()->acadlix_get_email_template(
                'OfflinePurchase.php',
                'admin',
                $r
            );
            /* translators: %d is the order ID */
            $admin_subject = sprintf(__('New Offline Purchase for order #%d', 'acadlix'), $order_id);
            acadlix()->helper()->email()->sendEmail(
                $this->admin_emails,
                $admin_subject,
                $admin_email_template
            );
        }
    }
}
