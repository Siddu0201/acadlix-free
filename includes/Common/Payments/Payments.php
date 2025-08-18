<?php

namespace Yuvayana\Acadlix\Common\Payments;

use Yuvayana\Acadlix\Common\Payments\Gateways\Paypal;
use Yuvayana\Acadlix\Common\Payments\Gateways\PayU;
use Yuvayana\Acadlix\Common\Payments\Gateways\Razorpay;
use Yuvayana\Acadlix\Common\Payments\Gateways\Stripe;

defined('ABSPATH') || exit();


class Payments
{
    private $_razorpay;
    private $_paypal;
    private $_payu;
    private $_stripe;

    public function razorpay(): Razorpay
    {
        if (!$this->_razorpay) {
            $this->_razorpay = new Razorpay();
        }
        return $this->_razorpay;
    }

    public function paypal(): Paypal
    {
        if (!$this->_paypal) {
            $this->_paypal = new Paypal();
        }
        return $this->_paypal;
    }

    public function payu(): PayU
    {
        if (!$this->_payu) {
            $this->_payu = new PayU();
        }
        return $this->_payu;
    }

    public function stripe(): Stripe
    {
        if (!$this->_stripe) {
            $this->_stripe = new Stripe();
        }
        return $this->_stripe;
    }
}
