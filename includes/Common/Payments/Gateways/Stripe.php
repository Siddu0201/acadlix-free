<?php

namespace Yuvayana\Acadlix\Common\Payments\Gateways;

use Yuvayana\Acadlix\Common\Payments\PaymentGatewayInterface;
use WP_REST_Response;
use WP_Error;
use Exception;

class Stripe implements PaymentGatewayInterface
{
    const CONNECTION_TIMEOUT = 30;
    const API_URL = 'https://api.stripe.com';
    private bool $is_stripe_active;
    private string $stripe_url;
    private bool $sandbox;
    private string $public_key;
    private string $secret_key;
    private string $webhook_signature_key;
    private float $amount;
    private string $currency;
    private array $billing_info;

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

    private function get_request_headers(): array
    {
        return [
            'Authorization' => 'Bearer ' . $this->secret_key,
        ];
    }

    private function createConnection($url, $method, $data = [], $retry = 1)
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
            throw new Exception($response->get_error_message());
        }

        $result = wp_remote_retrieve_body($response);
        $result = json_decode($result);
        $status_code = wp_remote_retrieve_response_code($response);

        error_log(print_r($result, true));

        if ($status_code < 200 || $status_code > 299) {
            throw new Exception($result->error->message);
        }

        return $result;
    }

    private function createCheckoutSession(): array|object|null
    {
        $url = $this->stripe_url . '/v1/checkout/sessions';
        $return_url = esc_url(get_permalink(acadlix()->helper()->acadlix_get_option('acadlix_thankyou_page_id'))) . '?token={CHECKOUT_SESSION_ID}';
        // $cancel_url = add_query_arg( 'cancelled', true, $return_url );
        $session_data = [
            'mode' => 'payment',
            'success_url' => $return_url,
            'cancel_url'  => $return_url,
            'payment_method_types[0]' => 'card',
        
            // Flattened line_items
            'line_items[0][price_data][currency]' => $this->currency,
            'line_items[0][price_data][product_data][name]' => 'Course Purchase',
            'line_items[0][price_data][unit_amount]' => $this->amount,
            'line_items[0][quantity]' => 1,
        ];
        if (isset($this->billing_info['email']) && !empty($this->billing_info['email'])) {
            $session_data['customer_email'] = $this->billing_info['email'];
        }
        return $this->createConnection($url, 'POST', $session_data);
    }

    private function retriveCheckoutSession($session_id): array|object|null
    {
        $url = $this->stripe_url . '/v1/checkout/sessions/' . $session_id;
        return $this->createConnection($url, 'GET');
    }

    private function retrivePaymentIntent($payment_intent_id)
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

    private function successOrder($order, $payment_intent_id)
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
        acadlix()->helper()->course()->handleCoursePurchaseEmail($order->id);
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
        acadlix()->helper()->course()->handleFailedTransationEmail($order->id);
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
                $event_type = explode( '.', $event->type )[0];
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
            error_log($e->getMessage());
            exit;
        }
    }


    private function orderCapture($stripe_order_id)
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
            throw new Exception($e->getMessage());
        }
    }

    public function verifyOrder($stripe_order_id): void
    {
        try{
            if (!$this->is_stripe_active()) {
                throw new Exception('Stripe not active');
            }
            if (!$stripe_order_id) {
                throw new Exception('Stripe order id not found');
            }
            $this->orderCapture($stripe_order_id);
        } catch (Exception $e) {
            error_log($e->getMessage());
            return;
        }
        
    }
}