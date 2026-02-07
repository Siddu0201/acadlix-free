<?php

namespace Yuvayana\Acadlix\Common\Controller;

defined('ABSPATH') || exit();

if (!class_exists("ThankyouController")) {
    class ThankyouController
    {
        protected static $_instance = null;

        public function __construct()
        {
            if (is_admin())
                return;
            add_filter("template_include", [$this, 'template_loader'], 10);
            add_action("wp_enqueue_scripts", [$this, 'enqueue_front_thankyou']);
        }

        public function template_loader($template)
        {
            $thankyou_page_id = acadlix()->helper()->acadlix_get_option('acadlix_thankyou_page_id');
            if ($thankyou_page_id && is_page($thankyou_page_id)) {
                // !defined('DONOTCACHEPAGE') && define('DONOTCACHEPAGE', true); // phpcs:ignore

                // $thankyou_template = $this->processData();
                // if ($thankyou_template) {
                //     return $thankyou_template;
                // }
                return acadlix()->view()->thankyou()->render();
            }

            return $template;
        }


        // public function processData()
        // {
        //     $status = 'pending';
        //     $courses_url = get_post_type_archive_link(ACADLIX_COURSE_CPT);
        //     $dashboard_url = get_permalink(acadlix()->helper()->acadlix_get_option('acadlix_dashboard_page_id'));

        //     if (isset($_GET['token'])) { // phpcs:ignore
        //         $token = sanitize_text_field(wp_unslash($_GET['token'])); // phpcs:ignore
        //         $order_meta = acadlix()->model()->orderMeta()->where("meta_value", $token)->first();
        //         if ($order_meta) {
        //             $order = acadlix()->model()->order()->find($order_meta->order_id);
        //             $payment_method = $order->getMetaValue("payment_method");

        //             if ($order) {
        //                 try {
        //                     if (isset($_GET["cancelled"]) && !empty($_GET["cancelled"]) && $order->status != "failed") { // phpcs:ignore
        //                         acadlix()->payments()
        //                             ->{$payment_method}()
        //                                 ->failedOrder($order, "Payment Cancelled");
        //                         $status = $order->status;
        //                     } else {
        //                         switch ($payment_method) {
        //                             case "razorpay":
        //                             case "paypal":
        //                             case "stripe":
        //                             case "payu":
        //                                 if ($order->status == "pending") {
        //                                     acadlix()->payments()
        //                                         ->{$payment_method}()
        //                                             ->verifyOrder($token);

        //                                     $order = acadlix()->payments()
        //                                         ->{$payment_method}()
        //                                             ->getOrder($token);
        //                                     $status = $order->status;
        //                                 } else {
        //                                     $status = $order->status;
        //                                 }
        //                                 break;
        //                             default:
        //                                 $status = $order->status;
        //                         }
        //                     }
        //                 } catch (Exception $e) {
        //                     // error_log($e->getMessage());
        //                 }
        //             }
        //         }
        //     }
        //     $GLOBALS['acadlix_thankyou_data'] = compact('status', 'courses_url', 'dashboard_url');
        //     return ACADLIX_INCLUDES_PATH . 'Common/View/ThankyouView.php';
        // }


        public function enqueue_front_thankyou()
        {
            wp_enqueue_style('acadlix-front-thankyou-css');
        }

        public static function instance()
        {
            if (is_null(self::$_instance)) {
                self::$_instance = new self();
            }

            return self::$_instance;
        }
    }
}