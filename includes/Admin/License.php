<?php 

namespace Yuvayana\Acadlix\Admin;

use IdeoLogix\DigitalLicenseManagerUpdaterWP\Main;

defined('ABSPATH') || exit();

class License
{
    protected $consumerKey = 'ck_58afad60f7d76d2c3f44570baf19324d823b2e16';
    protected $consumerSecret = 'cs_548171f1bc59c6f2e3b6378491bb366a4cd7d825';
    public $updater;
    public $isDeactivated;
    public $deactivatedAt;
    public $isExpired;
    public $expiresAt;
    public $isActive;
    public function __construct()
    {
        $this->setup_updater();
        $this->validateLicense();
    }

    protected function setup_updater()
    {
        try {
            $this->updater = new Main([
                'id' => 1,
                'name' => ACADLIX_PLUGIN_BASENAME,
                'file' => ACADLIX_PLUGIN_FILE,
                'basename' => ACADLIX_PLUGIN_BASENAME,
                'version' => ACADLIX_VERSION,
                'url_settings' => admin_url("admin.php?page=acadlix_license"),
                'url_purchase' => ACADLIX_DLM_URL."pricing",
                'consumer_key' => $this->consumerKey,
                'consumer_secret' => $this->consumerSecret,
                'api_url' => ACADLIX_DLM_REST_URL,
                'prefix' => 'dlm',
                // 'mask_key_input'  => true, // Show ***** in license key input?
            ]);
        } catch (\Exception $e) {
            error_log('Error: ' . $e->getMessage());
        }
    }

    protected function validateLicense()
    {
        $token          = $this->updater->getConfiguration()->getEntity()->getActivationToken();
		$license        = $token ? $this->updater->getConfiguration()->getClient()->prepareValidateLicense( $token, true, false ) : array();
        $deactivated_at = $license['deactivated_at'] ?? false;
		$is_expired     = $license['license']['is_expired'] ?? true;
		$is_deactivated = ! empty( $deactivated_at );
		$expires_at     = $license['license']['expires_at'] ?? '';
        $this->isDeactivated = $is_deactivated;
        $this->deactivatedAt = $deactivated_at;
        $this->isExpired = $is_expired;
        $this->expiresAt = $expires_at;
        $this->isActive = !$is_deactivated && !$is_expired;
    }
}
