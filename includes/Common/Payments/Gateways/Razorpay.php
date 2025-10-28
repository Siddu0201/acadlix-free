<?php

namespace Yuvayana\Acadlix\Common\Payments\Gateways;

defined('ABSPATH') || exit();

use Yuvayana\Acadlix\Common\Payments\PaymentGatewayInterface;
use WP_REST_Response;
use WP_Error;
use Exception;

class Razorpay implements PaymentGatewayInterface
{
    const API_URL = 'https://api.razorpay.com';
    const CONNECTION_TIMEOUT = 30;
    protected bool $is_razorpay_active;
    protected string $razorpay_url;
    protected string $client_id;
    protected string $secret_key;
    protected string $webhook_secret;
    protected float $amount;
    protected string $currency;
    protected array $billing_info;

    public function __construct()
    {
        // Get values from your WP options
        $this->razorpay_url = self::API_URL;
        $this->client_id = acadlix()->helper()->acadlix_get_option('acadlix_razorpay_client_id');
        $this->secret_key = acadlix()->helper()->acadlix_get_option('acadlix_razorpay_secret_key');
        $this->webhook_secret = acadlix()->helper()->acadlix_get_option('acadlix_razorpay_webhook_secret');
        $this->is_razorpay_active = acadlix()->helper()->acadlix_get_option('acadlix_razorpay_active') === 'yes';
    }

    public function is_razorpay_active()
    {
        if ($this->is_razorpay_active && $this->client_id && $this->secret_key && $this->webhook_secret) {
            return true;
        }
        return false;
    }

    public function setAmount(float $amount): self
    {
        $this->amount = $amount;
        return $this;
    }

    public function setCurrency(string $currency): self
    {
        $this->currency = $currency;
        return $this;
    }

    public function setBillingInfo(array $billing_info): self
    {
        $this->billing_info = $billing_info;
        return $this;
    }

    protected function get_request_headers(): array
    {
        return [
            'Authorization' => 'Basic ' . base64_encode($this->client_id . ':' . $this->secret_key),
            'Content-Type' => 'application/json',
        ];
    }

    protected function createConnection($url, $method, $data = [], $retry = 1)
    {
        $args = [
            'method' => $method,
            'headers' => $this->get_request_headers(),
            'timeout' => self::CONNECTION_TIMEOUT,
        ];

        if ($method !== 'GET' && !empty($data)) {
            $args['body'] = wp_json_encode($data);
        }

        $response = wp_remote_request($url, $args);

        if (is_wp_error($response)) {
            throw new Exception($response->get_error_message());
        }

        $result = wp_remote_retrieve_body($response);
        $result = json_decode($result);

        $status_code = wp_remote_retrieve_response_code($response);
        
        if ($status_code < 200 || $status_code > 299) {
            throw new Exception($result?->error?->description ?? 'Something went wrong. Please try again later.');
        }

        return $result;
    }

    protected function createRazorpayOrder()
    {
        $body = [
            'receipt' => uniqid('order_'),
            'amount' => acadlix()->helper()->acadlix_convert_to_unit_price($this->amount),
            'currency' => $this->currency,
        ];

        $result = $this->createConnection(
            $this->razorpay_url . '/v1/orders',
            'POST',
            $body
        );

        if (isset($result->id)) {
            return $result;
        }
        throw new Exception('Something went wrong. Please try again later.');
    }

    protected function fetchRazorpayPaymentOrder($razorpay_order_id)
    {
        $result = $this->createConnection(
            $this->razorpay_url . '/v1/orders/' . $razorpay_order_id . '/payments',
            'GET'
        );
        return $result;
    }

    protected function captureRazorpayPayment($razorpay_payment_id, $body)
    {
        $result = $this->createConnection(
            $this->razorpay_url . '/v1/payments/' . $razorpay_payment_id . '/capture',
            'POST',
            $body
        );
        return $result;
    }

    protected function fetchRazorpayPayment($razorpay_payment_id)
    {
        $result = $this->createConnection(
            $this->razorpay_url . '/v1/payments/' . $razorpay_payment_id,
            'GET'
        );
        return $result;
    }

    protected function returnUrl($razorpay_order_id)
    {
        $args = [
            'token' => $razorpay_order_id,
        ];
        return add_query_arg($args, esc_url(get_permalink(acadlix()->helper()->acadlix_get_option('acadlix_thankyou_page_id'))));
    }

    protected function cancelUrl($razorpay_order_id)
    {
        $args = [
            'cancelled' => true,
        ];
        return add_query_arg($args, $this->returnUrl($razorpay_order_id));
    }

    protected function getOutputField($razorpay_order_id)
    {
        $box_title = '';
        if (empty($box_title)) {
            $box_title = get_bloginfo('name');
            ;
        }

        if (empty($box_title)) {
            $box_title = 'Pay via Razorpay';
        }
        $return_url = $this->returnUrl($razorpay_order_id);
        $cancel_url = $this->cancelUrl($razorpay_order_id);
        $theme_settings = acadlix()->helper()->acadlix_get_option('acadlix_theme_settings');
        $data = [
            'key' => $this->client_id,
            'order_id' => $razorpay_order_id,
            'amount' => acadlix()->helper()->acadlix_convert_to_unit_price($this->amount),
            'currency' => $this->currency,
            'name' => $box_title,
            'description' => 'Buy now',
            'theme' => [
                'backdrop_color' => 'rgba(0, 0, 0, 0.8)',
            ],
            'callback_url' => $return_url,
            'cancel_url' => $cancel_url,
            'timeout' => 900,
            'config' => [
                'display' => [
                    'language' => get_locale(),
                ],
            ],
        ];

        if (isset($theme_settings['palette']['primary']['main']) && !empty($theme_settings['palette']['primary']['main'])) {
            $data['theme']['color'] = $theme_settings['palette']['primary']['main'];
        }

        if (isset($this->billing_info)) {
            $data['prefill']['name'] = $this->billing_info['first_name'] . ' ' . $this->billing_info['last_name'];
            if (!empty($this->billing_info['email'])) {
                $data['prefill']['email'] = $this->billing_info['email'];
            }
            if (!empty($this->billing_info['phone_number']) && !empty($this->billing_info['phonecode'])) {
                $data['prefill']['contact'] = $this->billing_info['phonecode'] . $this->billing_info['phone_number'];
            }
        }

        return $data;
    }


    public function getOrder($razorpay_order_id)
    {
        $order_meta = acadlix()->model()->orderMeta()
            ->where("meta_key", "razorpay_order_id")
            ->where("meta_value", $razorpay_order_id)
            ->first();
        return $order_meta
            ? acadlix()->model()->order()->find($order_meta->order_id)
            : null;
    }

    protected function successOrder($order, $payment_id = '')
    {
        if (!$order) {
            throw new Exception('Order not found');
        }
        $order->updateOrCreateMeta('razorpay_payment_id', $payment_id);
        $message = "Razorpay PaymentId: {$payment_id}";
        $order->createActivityLog($message);

        $order->updateStatus('success');
        $message = "Order status updated to success";
        $order->createActivityLog($message);

        if ($order->order_items()->count() > 0) {
            foreach ($order->order_items as $item) {
                $cart = acadlix()->model()->courseCart()
                    ->where("user_id", $order->user_id)
                    ->where("course_id", $item->course_id)
                    ->first();
                if ($cart) {
                    $cart->delete();
                }
            }
        }
        // send mail on success
        acadlix()->helper()->course()->handleCoursePurchaseEmail($order->id);
        return ['success' => true, 'message' => 'Order captured successfully'];
    }

    public function failedOrder($order, $message = ''): array
    {
        if (!$order) {
            throw new Exception('Order not found');
        }
        $order->updateStatus('failed');
        $message = "Order status updated to failed";
        $order->createActivityLog($message);

        $order->updateOrCreateMeta('failure_reason', $message);
        acadlix()->helper()->course()->handleFailedTransationEmail($order->id);
        return ['success' => true, 'message' => $message];
    }

    public function processOrder(): array|object|null
    {
        if (!$this->is_razorpay_active()) {
            throw new Exception('Razorpay not active');
        }
        $result = $this->createRazorpayOrder();
        if ($result) {
            return $this->getOutputField($result->id);
        }
        throw new Exception('Something went wrong. Please try again later.');
    }

    public function verifyWebhook(array $data): WP_REST_Response|WP_Error
    {
        try {
            if (!$this->is_razorpay_active()) {
                throw new Exception('Razorpay not active');
            }
            $payload = $data['stream'] ?? '';
            $signature = $data['server']['HTTP_X_RAZORPAY_SIGNATURE'] ?? '';

            if (empty($this->webhook_secret)) {
                throw new Exception('Razorpay webhook secret missing');
            }

            if (!$payload || !$signature) {
                throw new Exception('Razorpay webhook verification failed: Missing payload or signature.');
            }

            $expected_signature = hash_hmac('sha256', $payload, $this->webhook_secret);

            if (hash_equals($expected_signature, $signature)) {
                $event = json_decode($payload);
                switch ($event->event) {
                    case 'payment.authorized':
                    case 'payment.failed':
                        $razorpay_order_id = $event->payload->payment->entity->order_id;
                        $response = $this->orderCapture($razorpay_order_id);
                        $response = new WP_REST_Response($response, 200);
                        break;
                    default:
                        $response = new WP_REST_Response(['message' => 'Event ignored'], 200);
                        break;
                }
                return $response;
            }

            exit;
        } catch (Exception $e) {
            error_log($e->getMessage());
            exit;
        }
    }

    protected function orderCapture($razorpay_order_id)
    {
        try {
            if (empty($razorpay_order_id)) {
                throw new Exception('Razorpay order id not found');
            }

            $order = $this->getOrder($razorpay_order_id);
            if (!$order) {
                throw new Exception('Order not found');
            }

            if ($order->status == 'success') {
                return ['success' => true, 'message' => 'Order already processed'];
            }

            $razorpay_payments = $this->fetchRazorpayPaymentOrder($razorpay_order_id);
            if (empty($razorpay_payments->count)) {
                return $this->failedOrder($order, 'Order not captured');
            }
            $razorpay_payment = $razorpay_payments->items[0];

            // If order is paid, get the payment which is authorized/captured/refunded.
            foreach ($razorpay_payments->items as $razorpay_payment_item) {
                if ('created' !== $razorpay_payment_item->status && 'failed' !== $razorpay_payment_item->status) {
                    $razorpay_payment = $razorpay_payment_item;
                }
            }

            if (!empty($razorpay_payment->error_description)) {
                return $this->failedOrder($order, $razorpay_payment->error_description);
            }

            if($razorpay_payment->status == 'authorized'){
                $this->captureRazorpayPayment(
                    $razorpay_payment->id,
                    [
                        'amount' => $razorpay_payment->amount,
                        'currency' => $razorpay_payment->currency,
                    ]
                );
            }

            $razorpay_payment = $this->fetchRazorpayPayment($razorpay_payment->id);

            if($razorpay_payment->status == 'captured'){
                return $this->successOrder($order, $razorpay_payment->id);
            }

            return ['success' => false, 'message' => 'Order not captured'];
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }
    }

    public function verifyOrder($razorpay_order_id): void
    {
        try {
            if (!$this->is_razorpay_active()) {
                throw new Exception('Razorpay not active');
            }

            if (!$razorpay_order_id) {
                throw new Exception('Razorpay order id not found');
            }

            $this->orderCapture($razorpay_order_id);
        } catch (Exception $e) {
            error_log($e->getMessage());
            return;
        }
    }

}
