<?php

namespace Yuvayana\Acadlix\Common\Payments\Gateways;

defined('ABSPATH') || exit();

use Yuvayana\Acadlix\Common\Payments\PaymentGatewayInterface;
use Exception;
use WP_Error;
use WP_REST_Response;

class Offline implements PaymentGatewayInterface
{
  protected bool $is_offline_active = false;
  protected float $amount;
  protected string $currency;
  protected string $instructions;
  protected bool $is_enable_file_upload = false;
  protected int|string $max_upload_file_size = 2;
  protected array $allowed_mime_types = [];

  public function __construct()
  {
    // Initialization code if needed
    $this->is_offline_active = acadlix()->helper()->acadlix_get_option('acadlix_offline_active') === 'yes';
    $this->instructions = acadlix()->helper()->acadlix_get_option('acadlix_offline_instructions', '');
    $this->is_enable_file_upload = acadlix()->helper()->acadlix_get_option('acadlix_offline_enable_file_upload') === 'yes';
    $this->max_upload_file_size = acadlix()->helper()->acadlix_get_option('acadlix_offline_max_upload_file_size', 2);
    $allowed_types = acadlix()->helper()->acadlix_get_option('acadlix_offline_allowed_mime_types', []);
    $this->allowed_mime_types = is_array($allowed_types) ? $allowed_types : [];

  }

  public function is_offline_active(): bool
  {
    return $this->is_offline_active;
  }

  public function getInstructions(): string
  {
    return $this->instructions;
  }

  public function isEnableFileUpload(): bool
  {
    return $this->is_enable_file_upload;
  }

  public function getMaxUploadFileSize(): int|string
  {
    return $this->max_upload_file_size;
  }

  public function getAllowedMimeTypes(): array
  {
    return $this->allowed_mime_types;
  }

  public function getData()
  {
    return [
      'acadlix_offline_instructions' => $this->instructions,
      'acadlix_offline_enable_file_upload' => $this->is_enable_file_upload,
      'acadlix_offline_max_upload_file_size' => $this->max_upload_file_size,
      'acadlix_offline_allowed_mime_types' => $this->allowed_mime_types,
    ];
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

  public function processOrder(): array|object|null
  {
    // Implement logic for offline order creation (e.g., mark as pending, show instructions)
    return [
      'success' => true,
      'message' => 'Offline payment initiated. Please follow the instructions to complete your payment.',
      // Add more fields as needed
    ];
  }

  public function verifyWebhook(array $data): WP_REST_Response|WP_Error
  {
    // Offline payments typically do not use webhooks
    return new WP_Error('offline_no_webhook', 'Offline payment does not support webhooks.', []);
  }

  public function verifyOrder($order_id): void
  {
    // Implement logic to verify or update offline order status (e.g., after manual confirmation)
    // Example: mark order as paid after admin verification
  }
}