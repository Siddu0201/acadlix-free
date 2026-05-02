<?php

namespace Yuvayana\Acadlix\Common\Integrations\KnitPay;

defined('ABSPATH') || exit();

class KnitPay
{
  public function __construct()
  {
  }

  public function is_active(): bool
  {
    return defined( 'KNITPAY_VERSION' );
  }

  public function get_gateways(): array
  {
    if ( ! $this->is_active() ) {
      return [];
    }

    return \Pronamic\WordPress\Pay\Plugin::get_config_select_options();
  }

}