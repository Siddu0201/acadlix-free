<?php

namespace Yuvayana\Acadlix\Common\Payments;

use Yuvayana\Acadlix\Common\Payments\Gateways\Offline;
use Yuvayana\Acadlix\Common\Payments\Gateways\Paypal;
use Yuvayana\Acadlix\Common\Payments\Gateways\PayU;
use Yuvayana\Acadlix\Common\Payments\Gateways\Razorpay;
use Yuvayana\Acadlix\Common\Payments\Gateways\Stripe;

defined('ABSPATH') || exit();

class Payments
{
    protected $_razorpay = null;
    protected $_paypal = null;
    protected $_payu = null;
    protected $_stripe = null;
    protected $_offline = null;

    public function razorpay(): Razorpay
    {
        if (is_null($this->_razorpay)) {
            $this->_razorpay = new Razorpay();
        }
        return $this->_razorpay;
    }

    public function paypal(): Paypal
    {
        if (is_null($this->_paypal)) {
            $this->_paypal = new Paypal();
        }
        return $this->_paypal;
    }

    public function payu(): PayU
    {
        if (is_null($this->_payu)) {
            $this->_payu = new PayU();
        }
        return $this->_payu;
    }

    public function stripe(): Stripe
    {
        if (is_null($this->_stripe)) {
            $this->_stripe = new Stripe();
        }
        return $this->_stripe;
    }

    public function offline(): Offline
    {
        if (is_null($this->_offline)) {
            $this->_offline = new Offline();
        }
        return $this->_offline;
    }
}