<?php

namespace Yuvayana\Acadlix\Common\Payments\Gateways;

defined('ABSPATH') || exit();


use Yuvayana\Acadlix\Common\Payments\PaymentGatewayInterface;
use Exception;
use WP_Error;
use Pronamic\WordPress\Money\Currency;
use Pronamic\WordPress\Money\Money;
use Pronamic\WordPress\Pay\Plugin;
use Pronamic\WordPress\Pay\Payments\Payment;
use Pronamic\WordPress\Pay\AddressHelper;
use Pronamic\WordPress\Pay\CustomerHelper;
use Pronamic\WordPress\Pay\ContactNameHelper;
use Pronamic\WordPress\Pay\Payments\PaymentStatus as Core_Statuses;

class Knitpay implements PaymentGatewayInterface
{
  protected bool $is_knitpay_active = false;
  protected string $knitpay_title = '';
  protected string $knitpay_description = '';
  protected string $knitpay_configuration = '';
  protected float $amount;
  protected string $currency;
  protected array $billing_info;
  protected array $order_items;
  protected string|int $order_id;

  public function __construct()
  {
    $this->is_knitpay_active = acadlix()->helper()->acadlix_get_option('acadlix_knit_pay_active') === 'yes';
    $this->knitpay_title = acadlix()->helper()->acadlix_get_option('acadlix_knit_pay_title', 'Knit Pay');
    $this->knitpay_description = acadlix()->helper()->acadlix_get_option('acadlix_knit_pay_description', '');
    $this->knitpay_configuration = acadlix()->helper()->acadlix_get_option('acadlix_knit_pay_configuration', '');
  }

  public function is_knitpay_active(): bool
  {
    if (
      acadlix()->integrations()->knit_pay()->is_active() &&
      $this->is_knitpay_active &&
      $this->knitpay_configuration !== ''
    ) {
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

  public function setOrderId(string|int $order_id): self
  {
    $this->order_id = $order_id;
    return $this;
  }

  protected function returnUrl()
  {
    $thankyou_page_id = acadlix()->helper()->acadlix_get_option('acadlix_thankyou_page_id');
    $nonce = wp_create_nonce('acadlix_payment_nonce');
    $url = add_query_arg("nonce", $nonce, get_permalink($thankyou_page_id));
    return esc_url($url);
  }

  protected function notifyUrl()
  {
    return acadlix()->helper()->acadlix_get_webhook_url('knitpay');
  }

  protected function successOrder($order)
  {
    if (!$order) {
      throw new Exception('Order not found');
    }

    $order->updateStatus('success');
    if ($order->status != 'success') {
      $message = 'Order status updated to success';
      $order->createActivityLog($message);
    }
    if ($order->order_items()->count() > 0) {
      foreach ($order->order_items as $item) {
        $cart = acadlix()
          ->model()
          ->courseCart()
          ->where('user_id', $order->user_id)
          ->where('item_id', $item->item_id)
          ->where('type', $item->type)
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
    if ($order->status != 'failed') {
      $message = 'Order status updated to failed';
      $order->createActivityLog($message);
    }
    $order->updateOrCreateMeta('failure_reason', $message);
    acadlix()->notifications()->email()->handleFailedTransationEmail($order->id);
    return ['success' => true, 'message' => $message];
  }

  public function processOrder(): array|object|null
  {
    if (!$this->is_knitpay_active()) {
      return new WP_Error('knitpay_inactive', __('Knitpay payment gateway is not active.', 'acadlix'), array('status' => 500));
    }
    $config_id = $this->knitpay_configuration; // TODO: configuration id should be passed here which was saved by user on configuration page.
    $payment_method = 'knit_pay';

    // Use default gateway if no configuration has been set.
    if (empty($config_id)) {
      $config_id = get_option('pronamic_pay_config_id');
    }

    $gateway = Plugin::get_gateway($config_id);

    if (!$gateway) {
      return new WP_Error('invalid_gateway', __('Invalid payment gateway configuration.', 'acadlix'), array('status' => 500));
    }

    $order_id = $this->order_id; // TODO: your order id here
    $return_url = $this->returnUrl(); // TODO: your redirect url here
    $notify_url = $this->notifyUrl(); // TODO: your notify url

    /**
     * Build payment.
     */
    $payment = new Payment();

    $payment->source = 'acadlix'; //TODO: Change this with your plugin slug
    $payment->source_id = $order_id;
    $payment->order_id = $order_id;

    $payment->set_description($this->knitpay_description); // TODO Payment Description

    $payment->title = "Order " . $order_id;
    $billing_info = $this->billing_info;
    // Customer.
    $customer_name = ContactNameHelper::from_array(
      [
        'first_name' => $billing_info['first_name'] ?? 'First', // TODO: customer first name here
        'last_name' => $billing_info['last_name'] ?? 'Last', // TODO: customer last name here
      ]
    );
    $payment->set_customer(CustomerHelper::from_array(
      [
        'name' => $customer_name,
        'email' => $billing_info['email'] ?? 'email@example.com', // TODO: customer email here
        'phone' => $billing_info['phone_number'] ?? "1234567890", // TODO: customer phone here
      ]
    ));

    // Address.
    $payment->set_billing_address(AddressHelper::from_array(
      // address array, pass only those fields which are available
      [
        'name' => $customer_name,
        'email' => $billing_info['email'] ?? 'email@example.com', // TODO: customer email here
        'phone' => $billing_info['phone_number'] ?? "1234567890", // TODO: customer phone here
        'line_1' => $billing_info['address'] ?? '', // TODO: customer address line 1 here
        'line_2' => '', // TODO: customer address line 2 here
        'postal_code' => $billing_info['zip_code'] ?? '123456', // TODO: customer postal code here
        'city' => $billing_info['city'] ?? 'city', // TODO: customer city here
        'region' => $billing_info['state'] ?? 'state', // TODO: customer state here
        'country_code' => $billing_info['country_code'] ?? 'IN', // TODO: customer country code here
      ]
    ));

    // Currency.
    $currency = Currency::get_instance($this->currency); // TODO: your currency here

    // Amount.
    $payment->set_total_amount(new Money($this->amount, $currency)); // TODO: your amount here. change 100.00 to your amount

    // Method.
    $payment->set_payment_method($payment_method);

    // Configuration.
    $payment->config_id = $config_id;

    try {
      $payment = Plugin::start_payment($payment);

      $return_url = add_query_arg('kp_payment_id', $payment->get_id(), $return_url);
      $payment->set_meta('rest_redirect_url', $return_url);
      $payment->set_meta('rest_notify_url', $notify_url);
      $payment->save();

      // TODO: redirect customer to this url
      $redirect_url = $payment->get_pay_redirect_url();
      return (object) [
        'id' => $payment->get_id(),
        'redirect_url' => $redirect_url,
      ];
    } catch (\Exception $e) {
      return new WP_Error('payment_error', $e->getMessage(), array('status' => 500));
    }

  }

  public function verifyWebhook(array $data): WP_Error|\WP_REST_Response
  {
    try {
      if (!$this->is_knitpay_active()) {
        throw new Exception(__('Knitpay payment gateway is not active.', 'acadlix'));
      }

      $payload = $data['stream'] ?? '';

      if (empty($payload)) {
        return new WP_Error('invalid_webhook', __('Webhook payload is missing.', 'acadlix'), array('status' => 400));
      }

      $stream_data = is_array($payload) ? $payload : json_decode((string) $payload, true);

      if (!is_array($stream_data)) {
        return new WP_Error('invalid_webhook', __('Invalid webhook payload format.', 'acadlix'), array('status' => 400));
      }

      $kp_payment_id = isset($stream_data['id']) ? absint($stream_data['id']) : 0;

      if (!$kp_payment_id) {
        return new WP_Error('invalid_webhook', __('Missing payment ID in webhook payload.', 'acadlix'), array('status' => 400));
      }

      // error_log('Received Knitpay webhook payment id: ' . $kp_payment_id);

      $this->verifyOrder($kp_payment_id);

      return new \WP_REST_Response([
        'success' => true,
        'kp_payment_id' => $kp_payment_id,
      ], 200);
    } catch (Exception $e) {
      return new WP_Error(
        'webhook_error',
        __('PayPal webhook error: ', 'acadlix') . esc_html($e->getMessage()),
        ['status' => 500]
      );
    }
  }

  protected function getKpPayment($kp_payment_id)
  {
    if (function_exists('get_pronamic_payment')) {
      return get_pronamic_payment($kp_payment_id);
    }
    return new WP_Error('function_not_exists', __('Required function get_pronamic_payment does not exist.', 'acadlix'), array('status' => 500));
  }

  public function getOrder($kp_order_id)
  {
    $payment = $this->getKpPayment($kp_order_id);
    if (is_wp_error($payment)) {
      return $payment;
    }

    if ($payment) {
      $order = acadlix()->model()->order()->find($payment->get_order_id());
      if (!$order) {
        return new WP_Error('order_not_found', __('Order not found for the given payment ID.', 'acadlix'), array('status' => 500));
      }
      return $order;
    }
    return new WP_Error('order_not_found', __('Order not found for the given payment ID.', 'acadlix'), array('status' => 500));
  }

  public function getPaymentStatus($kp_order_id)
  {
    $payment = $this->getKpPayment($kp_order_id);
    if (is_wp_error($payment)) {
      return $payment;
    }
    if ($payment) {
      switch ($payment->get_status()) {
        case Core_Statuses::CANCELLED:
        case Core_Statuses::EXPIRED:
        case Core_Statuses::FAILURE:
          return 'failed';
        case Core_Statuses::SUCCESS:
          return 'success';
        case Core_Statuses::OPEN:
          return 'pending';
        default:
          return 'pending';
      }
    }
    return 'pending';
  }

  public function verifyOrder($kp_order_id): void
  {
    try {
      if (!$this->is_knitpay_active()) {
        throw new Exception(__('Knitpay payment gateway is not active.', 'acadlix'));
      }
      if (!$kp_order_id) {
        throw new Exception(__('Order ID is missing.', 'acadlix'));
      }

      $payment_status = $this->getPaymentStatus($kp_order_id);
      if (is_wp_error($payment_status)) {
        throw new Exception($payment_status->get_error_message());
      }

      $order = $this->getOrder($kp_order_id);
      if (is_wp_error($order)) {
        throw new Exception($order->get_error_message());
      }
      if ($payment_status == 'success') {
        $this->successOrder($order);
      } else if ($payment_status == 'failed') {
        $this->failedOrder($order, 'Payment failed via Knitpay');
      } else {
        $order->updateStatus($payment_status);
        $message = "Order status updated to {$payment_status}";
        $order->createActivityLog($message);
      }
    } catch (Exception $e) {
      // Handle the error as needed, e.g., log it, notify admin, etc.
      return;
    }
  }

}