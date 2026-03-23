<?php

namespace Yuvayana\Acadlix\Common\Controller;

defined('ABSPATH') || exit();

if (!class_exists("CertificateController")) {
  class CertificateController
  {
    protected static $_instance = null;

    public function __construct()
    {
      if (is_admin())
        return;
      add_filter("template_include", [$this, 'template_loader'], 10);
      add_filter('show_admin_bar', [$this, 'disable_admin_bar_on_dashboard']);
    }

    protected function is_certificate_page()
    {
      $certificate_page_id = acadlix()->helper()->acadlix_get_option('acadlix_certificate_page_id');
      return $certificate_page_id && is_page($certificate_page_id);
    }

    public function template_loader($template)
    {
      if ($this->is_certificate_page()) {
        // !defined('DONOTCACHEPAGE') && define('DONOTCACHEPAGE', true); // phpcs:ignore
        $certificate_template = ACADLIX_INCLUDES_PATH . 'Common/View/CertificateView.php';
        if ($certificate_template) {
          return $certificate_template;
        }
      }
      return $template;
    }

    public static function instance()
    {
      if (is_null(self::$_instance)) {
        self::$_instance = new self();
      }

      return self::$_instance;
    }
  }
}