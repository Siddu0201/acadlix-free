<?php

/**
 * Custom Stripe gateway for Acadlix.
 *
 * IMPORTANT:
 * This is NOT the Stripe PHP SDK.
 * No third-party Stripe library is bundled or loaded.
 *
 * @package Acadlix
 */

namespace Yuvayana\Acadlix\Common\Payments\Gateways;

use Yuvayana\Acadlix\Common\Payments\PaymentGatewayInterface;
use WP_REST_Response;
use WP_Error;
use Exception;

defined('ABSPATH') || exit();

class Stripe implements PaymentGatewayInterface
{
    const CONNECTION_TIMEOUT = 30;
    const API_URL = 'https://api.stripe.com';
    protected bool $is_stripe_active;
    protected string $stripe_url;
    protected bool $sandbox;
    protected string $public_key;
    protected string $secret_key;
    protected string $webhook_signature_key;
    protected float $amount;
    protected string $currency;
    protected array $billing_info;

    public function __construct()
    {
        // Get values from your WP options
        $this->sandbox = acadlix()->helper()->acadlix_get_option('acadlix_stripe_sandbox') === 'yes';
        $this->stripe_url = self::API_URL;
        $this->public_key = acadlix()->helper()->acadlix_get_option('acadlix_stripe_public_key');
        $this->secret_key = acadlix()->helper()->acadlix_get_option('acadlix_stripe_secret_key');
        $this->webhook_signature_key = acadlix()->helper()->acadlix_get_option('acadlix_stripe_webhook_signature_key');
        $this->is_stripe_active = acadlix()->helper()->acadlix_get_option('acadlix_stripe_active') === 'yes';
    }

    public function is_stripe_active()
    {
        if ($this->is_stripe_active && $this->public_key && $this->secret_key && $this->webhook_signature_key) {
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
            'Authorization' => 'Bearer ' . $this->secret_key,
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
            $args['headers']['Content-Type'] = 'application/x-www-form-urlencoded';
            $args['body'] = http_build_query($data);
        }

        $response = wp_remote_request($url, $args);

        if (is_wp_error($response)) {
            throw new Exception(esc_html($response->get_error_message()));
        }

        $result = wp_remote_retrieve_body($response);
        $result = json_decode($result);
        $status_code = wp_remote_retrieve_response_code($response);

        // error_log(print_r($result, true));

        if ($status_code < 200 || $status_code > 299) {
            throw new Exception(esc_html($result->error->message));
        }

        return $result;
    }

    protected function returnUrl()
    {
        $args = [
            'token' => '{CHECKOUT_SESSION_ID}',
        ];
        $url = add_query_arg($args, get_permalink(acadlix()->helper()->acadlix_get_option('acadlix_thankyou_page_id')));
        return str_replace('%7B', '{', str_replace('%7D', '}', $url));
    }

    protected function cancelUrl()
    {
        $args = [
            'cancelled' => true,
        ];
        $url = add_query_arg($args, $this->returnUrl());
        return str_replace('%7B', '{', str_replace('%7D', '}', $url));
    }

    protected function getOrderBody(): array
    {
        $body = [
            'mode' => 'payment',
            'success_url' => $this->returnUrl(),
            'cancel_url' => $this->cancelUrl(),
            'payment_method_types[0]' => 'card',

            // Flattened line_items
            'line_items[0][price_data][currency]' => $this->currency,
            'line_items[0][price_data][product_data][name]' => 'Course Purchase',
            'line_items[0][price_data][unit_amount]' => acadlix()->helper()->acadlix_convert_to_unit_price($this->amount),
            'line_items[0][quantity]' => 1,
        ];

        if (isset($this->billing_info['email']) && !empty($this->billing_info['email'])) {
            $body['customer_email'] = $this->billing_info['email'];
        }

        return $body;
    }

    protected function createCheckoutSession(): array|object|null
    {
        $url = $this->stripe_url . '/v1/checkout/sessions';
        $session_data = $this->getOrderBody();
        return $this->createConnection($url, 'POST', $session_data);
    }

    protected function retriveCheckoutSession($session_id): array|object|null
    {
        $url = $this->stripe_url . '/v1/checkout/sessions/' . $session_id;
        return $this->createConnection($url, 'GET');
    }

    protected function retrivePaymentIntent($payment_intent_id)
    {
        $url = $this->stripe_url . '/v1/payment_intents/' . $payment_intent_id;
        return $this->createConnection($url, 'GET');
    }

    public function getOrder($stripe_order_id)
    {
        $order_meta = acadlix()->model()->orderMeta()
            ->where("meta_key", "stripe_order_id")
            ->where("meta_value", $stripe_order_id)
            ->first();
        return $order_meta
            ? acadlix()->model()->order()->find($order_meta->order_id)
            : null;
    }

    protected function successOrder($order, $payment_intent_id)
    {
        if (!$order) {
            throw new Exception('Order not found');
        }
        $message = "Stripe PaymentIntentId: {$payment_intent_id}";
        $order->createActivityLog($message);
        $order->updateOrCreateMeta('stripe_payment_intent_id', $payment_intent_id);

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
        acadlix()->notifications()->email()->handleCoursePurchaseEmail($order->id);
        return ['success' => true, 'message' => 'Order captured successfully'];
    }

    public function failedOrder($order, $message = '')
    {
        if (!$order) {
            throw new Exception('Order not found');
        }
        $order->updateStatus('failed');
        $message = "Order status updated to failed";
        $order->createActivityLog($message);

        $order->updateOrCreateMeta('failure_reason', $message);
        acadlix()->notifications()->email()->handleFailedTransationEmail($order->id);
        return ['success' => true, 'message' => $message];
    }

    public function processOrder(): array|object|null
    {
        if (!$this->is_stripe_active()) {
            throw new Exception('Stripe not active');
        }

        $result = $this->createCheckoutSession();
        return $result;
    }

    public function verifyWebhook(array $data): WP_REST_Response|WP_Error
    {
        try {
            if (!$this->is_stripe_active()) {
                throw new Exception('Stripe not active');
            }

            $payload = $data['stream'] ?? '';
            $signature = $data['server']['HTTP_STRIPE_SIGNATURE'] ?? '';

            if (empty($this->webhook_signature_key)) {
                throw new Exception('Stripe webhook signature key missing');
            }

            if (!$payload || !$signature) {
                throw new Exception('Stripe webhook missing payload or signature');
            }

            $parts = [];
            foreach (explode(',', $signature) as $part) {
                [$key, $value] = explode('=', $part, 2);
                $parts[trim($key)] = $value;
            }
            if (!isset($parts['t'], $parts['v1'])) {
                throw new Exception('Stripe webhook signature verification failed: Missing timestamp or signature.');
            }

            $signed_payload = $parts['t'] . '.' . $payload;
            $expected_signature = hash_hmac('sha256', $signed_payload, $this->webhook_signature_key);

            if (hash_equals($expected_signature, $parts['v1'])) {
                $event = json_decode($payload);
                $event_type = explode('.', $event->type)[0];
                switch ($event_type) {
                    case 'checkout':
                        $stripe_order_id = $event->data->object->id;
                        $response = $this->orderCapture($stripe_order_id);
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
            exit;
        }
    }


    protected function orderCapture($stripe_order_id)
    {
        try {
            if (empty($stripe_order_id)) {
                throw new Exception('Stripe order id not found');
            }
            $order = $this->getOrder($stripe_order_id);
            if (!$order) {
                throw new Exception('Order not found');
            }

            if ($order->status == 'success') {
                return ['success' => true, 'message' => 'Order already processed'];
            }

            $checkout_session = $this->retriveCheckoutSession($stripe_order_id);

            if (!isset($checkout_session->payment_intent)) {
                return;
            }
            $payment_intent = $this->retrivePaymentIntent($checkout_session->payment_intent);

            unset($payment_intent->next_action);
            unset($payment_intent->client_secret);

            if (isset($payment_intent->last_payment_error)) {
                return $this->failedOrder($order, $payment_intent->last_payment_error->message);
            }

            return $this->successOrder($order, $payment_intent->id);

        } catch (Exception $e) {
            throw new Exception(esc_html($e->getMessage()));
        }
    }

    public function verifyOrder($stripe_order_id): void
    {
        try {
            if (!$this->is_stripe_active()) {
                throw new Exception('Stripe not active');
            }
            if (!$stripe_order_id) {
                throw new Exception('Stripe order id not found');
            }
            $this->orderCapture($stripe_order_id);
        } catch (Exception $e) {
            return;
        }

    }
}