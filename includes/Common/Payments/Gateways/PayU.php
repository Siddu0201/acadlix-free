<?php

namespace Yuvayana\Acadlix\Common\Payments\Gateways;

defined('ABSPATH') || exit();

use Yuvayana\Acadlix\Common\Payments\PaymentGatewayInterface;
use WP_REST_Response;
use WP_Error;
use Exception;

class PayU implements PaymentGatewayInterface
{
    const CONNECTION_TIMEOUT = 30;
    const REDIRECT_URL_SANDBOX = 'https://test.payu.in';
    const REDIRECT_URL_LIVE = 'https://secure.payu.in';
    const API_URL_SANDBOX = 'https://test.payu.in';
    const API_URL_LIVE = 'https://info.payu.in';
    protected bool $is_payu_active;
    protected string $payu_url;
    protected string $redirect_url;
    protected bool $sandbox;
    protected string $merchant_key;
    protected string $salt;
    protected float $amount;
    protected string $currency;
    protected array $billing_info;

    public function __construct()
    {
        $this->sandbox = acadlix()->helper()->acadlix_get_option('acadlix_payu_sandbox') === 'yes';
        $this->payu_url = $this->sandbox ? self::API_URL_SANDBOX : self::API_URL_LIVE;
        $this->redirect_url = $this->sandbox ? self::REDIRECT_URL_SANDBOX : self::REDIRECT_URL_LIVE;
        $this->merchant_key = acadlix()->helper()->acadlix_get_option('acadlix_payu_merchant_key');
        $this->salt = acadlix()->helper()->acadlix_get_option('acadlix_payu_salt');
        $this->is_payu_active = acadlix()->helper()->acadlix_get_option('acadlix_payu_active') === 'yes';
    }

    public function is_payu_active()
    {
        if ($this->is_payu_active && $this->merchant_key && $this->salt) {
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

    protected function verifyPayment($payu_order_id)
    {
        $command = 'verify_payment';

        $hash_str = "{$this->merchant_key}|{$command}|{$payu_order_id}|{$this->salt}";
        $hash = strtolower(hash('sha512', $hash_str)); // generate hash for verify payment request

        $data = [
            'key' => $this->merchant_key,
            'command' => $command,
            'var1' => $payu_order_id,
            'hash' => $hash,
        ];
        $response = wp_remote_post(
            $this->payu_url . '/merchant/postservice?form=2',
            [
                'body' => $data,
                'timeout' => self::CONNECTION_TIMEOUT,
            ]
        );

        if (is_wp_error($response)) {
            throw new Exception($response->get_error_message());
        }

        $result = wp_remote_retrieve_body($response);
        $result = json_decode($result);

        $status_code = wp_remote_retrieve_response_code($response);

        if ($status_code < 200 || $status_code > 299) {
            throw new Exception($result->error_description);
        }

        if (isset($result->status) && 1 === $result->status) {
            return $result->transaction_details->$payu_order_id;
        }

        if (isset($result->msg)) {
            $error = trim($result->msg);
            throw new Exception($error);
        }
        throw new Exception('Something went wrong. Please try again later.');
    }

    protected function getOutputField()
    {
        $first_name = $this->billing_info['first_name'] ?? '';
        $last_name = $this->billing_info['last_name'] ?? '';
        $email = $this->billing_info['email'] ?? '';
        $phone = $this->billing_info['phone'] ?? '';
        $address = $this->billing_info['address'] ?? '';
        $city = $this->billing_info['city'] ?? '';
        $country = $this->billing_info['country'] ?? '';
        $zipcode = $this->billing_info['zipcode'] ?? '';

        $udf1 = PHP_VERSION;
        $udf2 = acadlix()->isDev ? '1.0.0' : ACADLIX_VERSION;
        $udf3 = 'ACADLIX LMS COURSE';
        $udf4 = home_url('/');
        $udf5 = 'ACADLIX Pay';

        $txnid = substr(hash('sha256', wp_rand() . microtime()), 0, 20);
        $str = "{$this->merchant_key}|{$txnid}|{$this->amount}|Product Info|{$first_name}|{$email}|{$udf1}|{$udf2}|{$udf3}|{$udf4}|{$udf5}||||||{$this->salt}";
        $hash = strtolower(hash('sha512', $str));

        $return_url = esc_url(get_permalink(acadlix()->helper()->acadlix_get_option('acadlix_thankyou_page_id'))) . '?token=' . $txnid; // Change to your success page URL
        return [
            'key' => $this->merchant_key,
            'txnid' => $txnid,
            'amount' => $this->amount,
            'productinfo' => 'Product Info',
            'firstname' => $first_name,
            'lastname' => $last_name,
            'address1' => $address,
            'city' => $city,
            'country' => $country,
            'zipcode' => $zipcode,
            'email' => $email,
            'phone' => $phone,
            'surl' => $return_url,
            'furl' => $return_url,
            'hash' => $hash,
            'udf1' => $udf1,
            'udf2' => $udf2,
            'udf3' => $udf3,
            'udf4' => $udf4,
            'udf5' => $udf5,
        ];
    }

    public function getOrder($payu_txn_id)
    {
        $order_meta = acadlix()->model()->orderMeta()
            ->where("meta_key", "payu_txn_id")
            ->where("meta_value", $payu_txn_id)
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
        if (!$this->is_payu_active()) {
            throw new Exception("PayU is not active");
        }

        if ($this->currency !== "INR") {
            throw new Exception("PayU only supports INR");
        }

        $body['payu_url'] = "{$this->redirect_url}/_payment";
        $body['payu_data'] = $this->getOutputField();
        return $body;
    }

    public function verifyWebhook(array $data): WP_REST_Response|WP_Error
    {
        try {
            if (!$this->is_payu_active()) {
                throw new Exception("PayU is not active");
            }
            $payload = $data['stream'] ?? '';

            if (!$payload) {
                throw new Exception("PayU payload not found");
            }
            parse_str($payload, $post_array);
            $txn_id = $post_array["txnid"];
            $order = $this->getOrder($txn_id);
            if (null === $order) {
                exit;
            }
            $response = $this->orderCapture($txn_id);
            return new WP_REST_Response($response, 200);

        } catch (Exception $e) {
            error_log($e->getMessage());
            exit;
        }
    }

    protected function orderCapture($payu_txn_id)
    {
        try {
            if (!$payu_txn_id) {
                throw new Exception('PayU txn id not found');
            }

            $order = $this->getOrder($payu_txn_id);
            if (!$order) {
                throw new Exception('Order not found');
            }

            if ($order->status == 'success') {
                return ['success' => true, 'message' => 'Order already processed'];
            }

            $payu_payment = $this->verifyPayment($payu_txn_id);
            if ($payu_payment->txnid !== $payu_txn_id) {
                return;
            }

            if (isset($payu_payment->status)) {
                $transaction_status = $payu_payment->status;
                if ('success' === $transaction_status) {
                    return $this->successOrder($order);
                } elseif (isset($payu_payment->error_Message)) {
                    return $this->failedOrder($order, $payu_payment->error_Message);
                }
            }
            return;
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }

    }

    public function verifyOrder($payu_txn_id): void
    {
        try {
            if (!$this->is_payu_active()) {
                throw new Exception("PayU is not active");
            }
            if (!$payu_txn_id) {
                throw new Exception('PayU txn id not found');
            }
            $this->orderCapture($payu_txn_id);
        } catch (Exception $e) {
            error_log($e->getMessage());
            return;
        }
    }

}
