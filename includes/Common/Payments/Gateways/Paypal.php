<?php

namespace Yuvayana\Acadlix\Common\Payments\Gateways;

defined('ABSPATH') || exit();

use Yuvayana\Acadlix\Common\Payments\PaymentGatewayInterface;
use Exception;
use WP_Error;
use WP_REST_Response;

class Paypal implements PaymentGatewayInterface
{
    const API_URL_TEST = 'https://api-m.sandbox.paypal.com';
    const API_URL_LIVE = 'https://api-m.paypal.com';
    const CONNECTION_TIMEOUT = 30;

    protected bool $is_paypal_active;
    protected string $paypal_url;
    protected bool $sandbox;
    protected string $client_id;
    protected string $secret_key;
    protected string $webhook_id;
    protected float $amount;
    protected string $currency;
    protected array $billing_info;
    protected array $order_items;

    public function __construct()
    {
        $this->sandbox = acadlix()->helper()->acadlix_get_option('acadlix_paypal_sandbox') === 'yes';
        $this->paypal_url = $this->sandbox ? self::API_URL_TEST : self::API_URL_LIVE;
        $this->client_id = acadlix()->helper()->acadlix_get_option('acadlix_paypal_client_id');
        $this->secret_key = acadlix()->helper()->acadlix_get_option('acadlix_paypal_secret_key');
        $this->webhook_id = acadlix()->helper()->acadlix_get_option('acadlix_paypal_webhook_id');
        $this->is_paypal_active = acadlix()->helper()->acadlix_get_option('acadlix_paypal_active') === 'yes';
    }

    public function is_paypal_active()
    {
        if ($this->is_paypal_active && $this->client_id && $this->secret_key && $this->webhook_id) {
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

    public function setOrderItems(array $order_items): self
    {
        $this->order_items = $order_items;
        return $this;
    }

    protected function formatPayPalAmount($amount)
    {
        // Round safely to 2 decimal places
        $rounded = round((float) $amount, 2);

        // Format with 2 decimals as string
        return number_format($rounded, 2, '.', '');
    }

    protected function getPayPalAccessToken(): ?string
    {
        $header = [
            'Authorization' => 'Basic ' . base64_encode($this->client_id . ':' . $this->secret_key),
            'Content-Type' => 'application/x-www-form-urlencoded',
        ];
        $body = [
            'grant_type' => 'client_credentials'
        ];
        $response = wp_remote_post($this->paypal_url . '/v1/oauth2/token', [
            'headers' => $header,
            'body' => $body,
        ]);

        if (is_wp_error($response)) {
            throw new Exception($response->get_error_message());
        }

        $result = wp_remote_retrieve_body($response);
        $result = json_decode($result);

        $status_code = wp_remote_retrieve_response_code($response);

        if ($status_code < 200 || $status_code > 299) {
            throw new Exception($result->error_description);
        }

        return $result->access_token ?? null;
    }

    protected function get_request_headers(): array
    {
        if (!$this->getPayPalAccessToken()) {
            throw new Exception('PayPal access token failed');
        }
        return [
            'Authorization' => 'Bearer ' . $this->getPayPalAccessToken(),
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

        if ($status_code === 401) {
            throw new Exception($result->error_description);
        }

        return $result;
    }

    protected function returnUrl()
    {
        return esc_url(get_permalink(acadlix()->helper()->acadlix_get_option('acadlix_thankyou_page_id')));
    }

    protected function cancelUrl()
    {
        return add_query_arg('cancelled', true, $this->returnUrl());
    }

    protected function getOrderBody(): array
    {
        $billing_info = $this->billing_info;
        $body = [
            'intent' => 'CAPTURE',
            'purchase_units' => [
                [
                    'amount' => [
                        'currency_code' => $this->currency,
                        'value' => $this->formatPayPalAmount($this->amount),
                    ],
                ]
            ],
            'payment_source' => [
                'paypal' => [
                    'experience_context' => [
                        'shipping_preference' => 'NO_SHIPPING',
                        'user_action' => 'PAY_NOW',
                        'locale' => str_replace('_', '-', get_locale()),
                        'return_url' => $this->returnUrl(),
                        'cancel_url' => $this->cancelUrl(),
                        'payment_method_preference' => 'IMMEDIATE_PAYMENT_REQUIRED',
                    ],
                ],
            ],
        ];
        if (isset($billing_info) && null !== $billing_info['country_code']) {
            $body['purchase_units'][0]['shipping'] = [
                'name' => [
                    'full_name' => $billing_info['first_name'] . ' ' . $billing_info['last_name'],
                ],
                'email_address' => $billing_info['email'] ?? '',
                'address' => [
                    'address_line_1' => $billing_info['address'] ?? '',
                    'admin_area_2' => $billing_info['city'] ?? '',
                    'admin_area_1' => $billing_info['city'] ?? '',
                    'postal_code' => $billing_info['zip_code'] ?? '',
                    'country_code' => $billing_info['country_code'] ?? '',
                ],
            ];

            $body['payment_source']['paypal']['experience_context']['shipping_preference'] = 'SET_PROVIDED_ADDRESS';
        } else {
            $body['payment_source']['paypal']['experience_context']['shipping_preference'] = 'NO_SHIPPING';
        }
        return $body;
    }

    protected function createPaypalOrder()
    {
        $body = $this->getOrderBody();

        $result = $this->createConnection(
            $this->paypal_url . '/v2/checkout/orders',
            'POST',
            $body
        );

        if (isset($result->details)) {
            throw new Exception(trim($result->details[0]->description));
        } elseif (isset($result->message)) {
            throw new Exception(trim($result->message));
        }

        if (isset($result->id)) {
            return $result;
        }
        throw new Exception('Something went wrong. Please try again later.');
    }

    protected function getPaypalOrderDetail($paypal_order_id)
    {
        $result = $this->createConnection(
            $this->paypal_url . '/v2/checkout/orders/' . $paypal_order_id,
            'GET'
        );

        if (!isset($result->status) || $paypal_order_id !== $result->id) {
            throw new Exception('Something went wrong. Please try again later.');
        }

        return $result;
    }

    protected function capturePayment($paypal_order_id)
    {
        $result = $this->createConnection(
            $this->paypal_url . '/v2/checkout/orders/' . $paypal_order_id . '/capture',
            'POST'
        );

        if (isset($result->message) || $paypal_order_id === $result->id) {
            return $result;
        }

        throw new Exception('Something went wrong. Please try again later.');
    }

    protected function get_action_link($payment_order, $action)
    {
        foreach ($payment_order->links as $link) {
            if ($action === $link->rel) {
                return $link->href;
            }
        }
        return null;
    }

    public function getOrder($paypal_order_id)
    {
        $order_meta = acadlix()
            ->model()
            ->orderMeta()
            ->where('meta_key', 'paypal_order_id')
            ->where('meta_value', $paypal_order_id)
            ->first();
        return $order_meta
            ? acadlix()->model()->order()->find($order_meta->order_id)
            : null;
    }

    protected function successOrder($order)
    {
        if (!$order) {
            throw new Exception('Order not found');
        }

        $order->updateStatus('success');
        $message = 'Order status updated to success';
        $order->createActivityLog($message);
        if ($order->order_items()->count() > 0) {
            foreach ($order->order_items as $item) {
                $cart = acadlix()
                    ->model()
                    ->courseCart()
                    ->where('user_id', $order->user_id)
                    ->where('course_id', $item->course_id)
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
        $message = 'Order status updated to failed';
        $order->createActivityLog($message);
        $order->updateOrCreateMeta('failure_reason', $message);
        acadlix()->notifications()->email()->handleFailedTransationEmail($order->id);
        return ['success' => true, 'message' => $message];
    }

    public function processOrder(): array|object|null
    {
        if (!$this->is_paypal_active()) {
            throw new Exception('PayPal not active');
        }
        $result = $this->createPaypalOrder();
        $result->redirect_url = $this->get_action_link($result, 'payer-action');
        return $result;
    }

    protected function getPayPalWebhookHeaders(array $server): array
    {
        $header_keys = [
            'PAYPAL-TRANSMISSION-ID' => 'HTTP_PAYPAL_TRANSMISSION_ID',
            'PAYPAL-TRANSMISSION-TIME' => 'HTTP_PAYPAL_TRANSMISSION_TIME',
            'PAYPAL-TRANSMISSION-SIG' => 'HTTP_PAYPAL_TRANSMISSION_SIG',
            'PAYPAL-AUTH-ALGO' => 'HTTP_PAYPAL_AUTH_ALGO',
            'PAYPAL-CERT-URL' => 'HTTP_PAYPAL_CERT_URL',
        ];

        $headers = [];
        foreach ($header_keys as $key => $server_key) {
            $headers[$key] = $server[$server_key] ?? '';
        }

        return $headers;
    }

    public function verifyWebhook(array $data): WP_REST_Response|WP_Error
    {
        try {
            if (!$this->is_paypal_active()) {
                throw new Exception('PayPal not active');
            }

            $headers = $this->getPayPalWebhookHeaders($data['server']);
            $body = $data['stream'] ?? '';
            $verify_payload = [
                'auth_algo' => $headers['PAYPAL-AUTH-ALGO'],
                'cert_url' => $headers['PAYPAL-CERT-URL'],
                'transmission_id' => $headers['PAYPAL-TRANSMISSION-ID'],
                'transmission_sig' => $headers['PAYPAL-TRANSMISSION-SIG'],
                'transmission_time' => $headers['PAYPAL-TRANSMISSION-TIME'],
                'webhook_id' => $this->webhook_id,
                'webhook_event' => json_decode($body),
            ];

            $url = $this->paypal_url . '/v1/notifications/verify-webhook-signature';
            $result = $this->createConnection($url, 'POST', $verify_payload);

            if (isset($result->verification_status)) {
                $event = json_decode($body);
                switch ($event->event_type) {
                    case 'CHECKOUT.ORDER.APPROVED':
                        $paypal_order_id = $event->resource->id ?? '';
                        $response = $this->orderCapture($paypal_order_id);
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

    protected function orderCapture($paypal_order_id)
    {
        try {
            if (empty($paypal_order_id)) {
                throw new Exception('PayPal order id not found');
            }
            $order = $this->getOrder($paypal_order_id);
            if (!$order) {
                throw new Exception('Order not found');
            }

            if ($order->status == 'success') {
                return ['success' => true, 'message' => 'Order already processed'];
            }

            $order_details = $this->getPaypalOrderDetail($paypal_order_id);

            if ($order_details->status !== 'APPROVED') {
                return $this->failedOrder($order, 'Order not approved');
            }

            // capture order if order status is approved.
            $capture = $this->capturePayment($paypal_order_id);

            if (isset($capture->details)) {
                $this->failedOrder($order, $capture->details[0]->description);
            } elseif (isset($capture->message)) {
                return $this->failedOrder($paypal_order_id, $capture->message);
            }

            if ($capture->status !== 'COMPLETED') {
                return $this->failedOrder($order, $capture->message);
            }

            return $this->successOrder($order);
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }
    }

    public function verifyOrder($paypal_order_id): void
    {
        try {
            if (!$this->is_paypal_active()) {
                throw new Exception('PayPal not active');
            }
            if (!$paypal_order_id) {
                throw new Exception('PayPal order id not found');
            }
            $this->orderCapture($paypal_order_id);
        } catch (Exception $e) {
            error_log(sprintf(
                'PayPal Verify Order Error: %s',
                $e->getMessage()
            ));
            return;
        }
    }
}
