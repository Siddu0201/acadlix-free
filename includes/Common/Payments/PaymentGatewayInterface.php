<?php

namespace Yuvayana\Acadlix\Common\Payments;

defined('ABSPATH') || exit();

use WP_REST_Response;
use WP_Error;

interface PaymentGatewayInterface
{
    public function setAmount(float $amount): self;
    public function setCurrency(string $currency): self;
    public function processOrder(): array|object|null;
    public function verifyWebhook(array $data): WP_REST_Response|WP_Error;
    public function verifyOrder($order_id): void;
}