<?php

namespace Yuvayana\Acadlix\Common\Helper;

use Illuminate\Database\Capsule\Manager;

defined('ABSPATH') || exit();

if (!class_exists('Helper')) {
  class Helper
  {
    protected static $_instance = null;

    protected $course = null;
    protected $cpt = null;
    protected $email = null;
    protected $queryLogger = null;

    public function __construct()
    {
      // Constructor code if needed
      add_action('admin_init', function () {
        if (!function_exists('wp_get_available_translations')) {
          require_once ABSPATH . 'wp-admin/includes/translation-install.php';
        }
      });
    }

    public function course(): CourseHelper|null
    {
      if ($this->course === null) {
        $this->course = new CourseHelper();
      }
      return $this->course;
    }

    public function cpt(): CptHelper|null
    {
      if ($this->cpt === null) {
        $this->cpt = new CptHelper();
      }
      return $this->cpt;
    }

    public function email(): EmailHelper|null
    {
      if ($this->email === null) {
        $this->email = new EmailHelper();
      }
      return $this->email;
    }

    public function queryLogger(): QueryLogger|null
    {
      if ($this->queryLogger === null) {
        $this->queryLogger = new QueryLogger();
      }
      return $this->queryLogger;
    }

    public function acadlix_modify_video_shortcode($content)
    {
      if (empty($content)) {
        return $content;  // If content is empty, return it as-is
      }
      if (has_shortcode($content, 'video')) {
        // Use regex to find all [video] shortcodes in the content
        $pattern = get_shortcode_regex(['video']);
        $content = preg_replace_callback("/$pattern/", function ($matches) {
          // Check if the matched shortcode is [video]
          if ($matches[2] === 'video') {
            // Parse shortcode attributes
            $attrs = shortcode_parse_atts($matches[3]);

            // Remove width and height if they exist
            unset($attrs['width'], $attrs['height']);

            // Rebuild the shortcode with the modified attributes
            $attr_string = '';
            if ($attrs) {
              foreach ($attrs as $key => $value) {
                $attr_string .= sprintf(' %s="%s"', $key, esc_attr($value));
              }
            }

            // Return the modified shortcode
            return sprintf('[%s%s]%s[/%s]', $matches[2], $attr_string, $matches[5], $matches[2]);
          }
          return $matches[0];  // Return original shortcode if not [video]
        }, $content);
      }
      return $content;
    }

    public function renderShortCode($content)
    {
      // Prevent null warnings — always ensure it's a string
      $content = (string) ($content ?? '');

      $content = $this->acadlix_modify_video_shortcode($content);
      $content = apply_filters('the_content', $content); // phpcs:ignore
      return $content;
    }

    public function upload_base64_image_to_wordpress($content)
    {
      $pattern = '/<img[^>]+src="data:image\/([^;]+);base64,([^"]+)"[^>]*>/i';

      // Callback function to handle each match
      $callback = function ($matches) {
        require_once(ABSPATH . 'wp-admin/includes/file.php');

        // Initialize the filesystem
        global $wp_filesystem;
        if (empty($wp_filesystem)) {
          WP_Filesystem();  // This initializes the $wp_filesystem global
        }
        // Extract mime type and base64 data from matches
        $mime_type = $matches[1];
        $base64_data = $matches[2];

        // Decode base64 data
        $image_data = base64_decode($base64_data);

        // Create a unique filename
        $filename = uniqid() . '.' . $mime_type;

        // Path to the uploads directory
        $upload_dir = wp_upload_dir();
        $file_path = $upload_dir['path'] . '/' . $filename;

        // Save the image data to a file
        if (!$wp_filesystem->put_contents($file_path, $image_data, FS_CHMOD_FILE)) {
          /* translators: %s is the filepath */
          return new WP_Error('failed', sprintf(__('Failed to write to file: %s', 'acadlix'), esc_html($file_path)), array('status' => 400));
        } else {
          // Prepare file data for WP attachment
          $wp_file_type = wp_check_filetype($filename, null);
          $attachment = array(
            'guid' => $upload_dir['url'] . '/' . $filename,
            'post_mime_type' => $wp_file_type['type'],
            'post_title' => sanitize_file_name($filename),
            'post_content' => '',
            'post_status' => 'inherit'
          );

          // // Insert the attachment into the media library
          $attach_id = wp_insert_attachment($attachment, $file_path);

          // // Generate attachment metadata
          require_once(ABSPATH . 'wp-admin/includes/image.php');
          $attach_data = wp_generate_attachment_metadata($attach_id, $file_path);
          wp_update_attachment_metadata($attach_id, $attach_data);

          // Return the URL of the uploaded image
          return "<img src='" . $upload_dir['url'] . '/' . $filename . "' alt='" . $filename . "' />";
        }
      };

      // Perform the replacement
      $new_content = preg_replace_callback($pattern, $callback, $content);

      return $new_content;
    }

    public function acadlix_upload_file_to_wordpress($file, $subdir = '/', $allowed_extensions = [], $max_size_mb = null)
    {
      require_once(ABSPATH . 'wp-admin/includes/file.php');

      // Validate file array
      if (!is_array($file) || empty($file['tmp_name']) || empty($file['name'])) {
        return new WP_Error('invalid_file', __('Invalid file upload.', 'acadlix'));
      }

      // Validate extension
      $original_filename = sanitize_file_name($file['name']);
      $extension = strtolower(pathinfo($original_filename, PATHINFO_EXTENSION));
      if (!empty($allowed_extensions) && !in_array($extension, array_map('strtolower', $allowed_extensions))) {
        return new WP_Error('invalid_extension', __('File extension not allowed.', 'acadlix'));
      }

      // Validate file size (max size in MB from argument, option, or default 2MB)
      if ($max_size_mb !== null) {
        $max_size_bytes = $max_size_mb * 1024 * 1024;
        if (!empty($file['size']) && $file['size'] > $max_size_bytes) {
          return new WP_Error(
            'file_too_large',
            sprintf(
              /* translators: %s is the maximum size in MB */
              __('File size exceeds the maximum allowed size of %s MB.', 'acadlix'),
              $max_size_mb
            )
          );
        }
      }

      // Get the base uploads directory
      $upload_dir = wp_upload_dir();
      $custom_dir_path = $upload_dir['basedir'] . $subdir;

      // Create the folder if it doesn't exist
      if (!file_exists($custom_dir_path)) {
        if (!wp_mkdir_p($custom_dir_path)) {
          return new WP_Error('mkdir_failed', __('Failed to create upload folder.', 'acadlix'), ['status' => 500]);
        }
      }

      // Prepare file for upload
      $timestamp = time();
      $filename_wo_ext = pathinfo($original_filename, PATHINFO_FILENAME);
      $file['name'] = "{$filename_wo_ext}_{$timestamp}.{$extension}";

      // Set upload_dir filter for each file
      add_filter('upload_dir', function ($dirs) use ($subdir) {
        $dirs['subdir'] = $subdir;
        $dirs['path'] = $dirs['basedir'] . $subdir;
        $dirs['url'] = $dirs['baseurl'] . $subdir;
        return $dirs;
      });

      // Handle the file upload using WordPress functions
      $upload = wp_handle_upload($file, array('test_form' => false));

      // Remove the filter (important when looping)
      remove_filter('upload_dir', '__return_false');

      if (isset($upload['error'])) {
        return new WP_Error('upload_error', $upload['error']);
      }

      $new_file = [
        'file_name' => $file['name'],
        'file_size' => $file['size'],
        'file_extension' => $extension,
        'file_url' => $upload['url'],
        'file_path' => $upload['file'],
        'file_type' => $upload['type'],
      ];

      return $new_file;
    }

    public function acadlix_get_system_languages()
    {
      if (!function_exists('wp_get_available_translations')) {
        return ['en_US' => 'English'];
      }

      $translations = wp_get_available_translations();
      $language_map = [];

      foreach ($translations as $locale => $details) {
        $language_map[$locale] = $details['native_name'];
      }

      $language_map['en_US'] ??= 'English';

      return $language_map;
    }

    public function acadlix_currencies()
    {
      $currencies = array(
        'AFN' => __('Afghan afghani', 'acadlix'),
        'ALL' => __('Albanian lek', 'acadlix'),
        'AED' => __('United Arab Emirates dirham', 'acadlix'),
        'AOA' => __('Angolan kwanza', 'acadlix'),
        'ARS' => __('Argentine peso', 'acadlix'),
        'AMD' => __('Armenian dram', 'acadlix'),
        'ANG' => __('Netherlands Antilles guilder', 'acadlix'),
        'AWG' => __('Aruban florin', 'acadlix'),
        'AUD' => __('Australian dollar', 'acadlix'),
        'AZN' => __('Azerbaijani manat', 'acadlix'),
        'BSD' => __('Bahamian dollar', 'acadlix'),
        'BHD' => __('Bahraini dinar', 'acadlix'),
        'BDT' => __('Bangladeshi taka', 'acadlix'),
        'BBD' => __('Barbadian dollar', 'acadlix'),
        'BYR' => __('Belarusian ruble', 'acadlix'),
        'BZD' => __('Belizean dollar', 'acadlix'),
        'BMD' => __('Bermudian dollar', 'acadlix'),
        'BTN' => __('Bhutanese ngultrum', 'acadlix'),
        'BOB' => __('Bolivian boliviano', 'acadlix'),
        'BAM' => __('Bosnia and Herzegovina convertible mark', 'acadlix'),
        'BWP' => __('Botswana pula', 'acadlix'),
        'BRL' => __('Brazilian real', 'acadlix'),
        'BND' => __('Brunei dollar', 'acadlix'),
        'BGN' => __('Bulgarian lev', 'acadlix'),
        'BIF' => __('Burundian franc', 'acadlix'),
        'CAD' => __('Canadian dollar', 'acadlix'),
        'CVE' => __('Cape Verdean escudo', 'acadlix'),
        'CLP' => __('Chilean peso', 'acadlix'),
        'CNY' => __('Chinese renminbi', 'acadlix'),
        'COP' => __('Colombian peso', 'acadlix'),
        'CDF' => __('Congolese franc', 'acadlix'),
        'CHF' => __('Swiss franc', 'acadlix'),
        'CRC' => __('Costa Rican colón', 'acadlix'),
        'CUC' => __('Cuban peso', 'acadlix'),
        'CZK' => __('Czech koruna', 'acadlix'),
        'DKK' => __('Danish krone', 'acadlix'),
        'DJF' => __('Djiboutian franc', 'acadlix'),
        'DOP' => __('Dominican peso', 'acadlix'),
        'DZD' => __('Algerian dinar', 'acadlix'),
        'EGP' => __('Egyptian pound', 'acadlix'),
        'ERN' => __('Eritrean nakfa', 'acadlix'),
        'EUR' => __('Euro', 'acadlix'),
        'ETB' => __('Ethiopian birr', 'acadlix'),
        'FKP' => __('Falkland Islands pound', 'acadlix'),
        'FJD' => __('Fijian dollar', 'acadlix'),
        'GMD' => __('Gambian dalasi', 'acadlix'),
        'GEL' => __('Georgian lari', 'acadlix'),
        'GHS' => __('Ghanian cedi', 'acadlix'),
        'GIP' => __('Gibraltar pound', 'acadlix'),
        'GTQ' => __('Guatemalan quetzal', 'acadlix'),
        'GBP' => __('British pound', 'acadlix'),
        'GNF' => __('Guinean franc', 'acadlix'),
        'GYD' => __('Guyanese dollar', 'acadlix'),
        'HTG' => __('Haitian gourde', 'acadlix'),
        'HNL' => __('Honduran lempira', 'acadlix'),
        'HKD' => __('Hong Kong dollar', 'acadlix'),
        'HRK' => __('Croatian kuna', 'acadlix'),
        'HUF' => __('Hungarian forint', 'acadlix'),
        'ISK' => __('Icelandic króna', 'acadlix'),
        'INR' => __('Indian rupee', 'acadlix'),
        'IDR' => __('Indonesian rupiah', 'acadlix'),
        'IRR' => __('Iranian rial', 'acadlix'),
        'IQD' => __('Iraqi dinar', 'acadlix'),
        'ILS' => __('Israeli new sheqel', 'acadlix'),
        'JMD' => __('Jamaican dollar', 'acadlix'),
        'JPY' => __('Japanese yen ', 'acadlix'),
        'JEP' => __('Jersey pound', 'acadlix'),
        'JOD' => __('Jordanian dinar', 'acadlix'),
        'KZT' => __('Kazakhstani tenge', 'acadlix'),
        'KES' => __('Kenyan shilling', 'acadlix'),
        'KPW' => __('North Korean won', 'acadlix'),
        'KHR' => __('Cambodian riel', 'acadlix'),
        'KWD' => __('Kuwaiti dinar', 'acadlix'),
        'KGS' => __('Kyrgyzstani som', 'acadlix'),
        'KYD' => __('Cayman Islands dollar', 'acadlix'),
        'KMF' => __('Comorian franc', 'acadlix'),
        'KRW' => __('South Korean won', 'acadlix'),
        'LAK' => __('Lao kip', 'acadlix'),
        'LVL' => __('Latvian lats', 'acadlix'),
        'LBP' => __('Lebanese pound', 'acadlix'),
        'LSL' => __('Lesotho loti', 'acadlix'),
        'LRD' => __('Liberian dollar', 'acadlix'),
        'LD' => __('Libyan dinar', 'acadlix'),
        'LYD' => __('Libyan dinar', 'acadlix'),
        'LKR' => __('Sri Lankan rupee', 'acadlix'),
        'LTL' => __('Lithuanian litas', 'acadlix'),
        'MOP' => __('Macanese pataca', 'acadlix'),
        'MKD' => __('Macedonian denar', 'acadlix'),
        'MGA' => __('Malagasy ariary', 'acadlix'),
        'MWK' => __('Malawian kwacha', 'acadlix'),
        'MYR' => __('Malaysian ringgit', 'acadlix'),
        'MVR' => __('Maldivian rufiyaa', 'acadlix'),
        'MRO' => __('Mauritanian ouguiya', 'acadlix'),
        'MUR' => __('Mauritian rupee', 'acadlix'),
        'MXN' => __('Mexican peso', 'acadlix'),
        'MDL' => __('Moldovan leu', 'acadlix'),
        'MNT' => __('Mongolian tugrik', 'acadlix'),
        'MAD' => __('Moroccan dirham', 'acadlix'),
        'MZN' => __('Mozambican metical', 'acadlix'),
        'MMK' => __('Burmese kyat', 'acadlix'),
        'NAD' => __('Namibian dollar', 'acadlix'),
        'NPR' => __('Nepalese rupee', 'acadlix'),
        'NIO' => __('Nicaraguan córdoba', 'acadlix'),
        'NGN' => __('Nigerian naira', 'acadlix'),
        'NOK' => __('Norwegian krone', 'acadlix'),
        'NZD' => __('New Zealand dollar', 'acadlix'),
        'OMR' => __('Omani rial', 'acadlix'),
        'PKR' => __('Pakistani rupee', 'acadlix'),
        'PAB' => __('Panamanian balboa', 'acadlix'),
        'PGK' => __('Papua New Guinea kina', 'acadlix'),
        'PYG' => __('Paraguayan guarani', 'acadlix'),
        'PEN' => __('Peruvian nuevo sol', 'acadlix'),
        'PHP' => __('Philippine peso', 'acadlix'),
        'PLN' => __('Polish zloty', 'acadlix'),
        'QAR' => __('Qatari riyal', 'acadlix'),
        'RON' => __('Romanian leu', 'acadlix'),
        'RUB' => __('Russian ruble', 'acadlix'),
        'RSD' => __('Serbian dinar', 'acadlix'),
        'RWF' => __('Rwandan franc', 'acadlix'),
        'SVC' => __('Salvadoran colón', 'acadlix'),
        'STD' => __('São Tomé and Príncipe dobra', 'acadlix'),
        'SAR' => __('Saudi riyal', 'acadlix'),
        'SCR' => __('Seychellois rupee', 'acadlix'),
        'SLL' => __('Sierra Leonean leone', 'acadlix'),
        'SGD' => __('Singapore dollar', 'acadlix'),
        'SBD' => __('Solomon Islands dollar', 'acadlix'),
        'SOS' => __('Somali shilling', 'acadlix'),
        'SHP' => __('St. Helena pound', 'acadlix'),
        'SDG' => __('Sudanese pound', 'acadlix'),
        'SRD' => __('Surinamese dollar', 'acadlix'),
        'SZL' => __('Swazi lilangeni', 'acadlix'),
        'SEK' => __('Swedish krona', 'acadlix'),
        'SYP' => __('Syrian pound', 'acadlix'),
        'TWD' => __('New Taiwan dollar', 'acadlix'),
        'TJS' => __('Tajikistani somoni', 'acadlix'),
        'TZS' => __('Tanzanian shilling', 'acadlix'),
        'THB' => __('Thai baht ', 'acadlix'),
        'TOP' => __('Tongan pa’anga', 'acadlix'),
        'TTD' => __('Trinidad and Tobago dollar', 'acadlix'),
        'TND' => __('Tunisian dinar', 'acadlix'),
        'TRY' => __('Turkish lira', 'acadlix'),
        'TMT' => __('Turkmenistani manat', 'acadlix'),
        'UGX' => __('Ugandan shilling', 'acadlix'),
        'UAH' => __('Ukrainian hryvnia', 'acadlix'),
        'USD' => __('US dollar', 'acadlix'),
        'UYU' => __('Uruguayan peso', 'acadlix'),
        'UZS' => __('Uzbekistani som', 'acadlix'),
        'VUV' => __('Vanuatu vatu', 'acadlix'),
        'VEF' => __('Venezuelan bolivar', 'acadlix'),
        'VND' => __('Vietnamese dong', 'acadlix'),
        'WST' => __('Samoan tālā', 'acadlix'),
        'XCD' => __('East Caribbean dollar', 'acadlix'),
        'XOF' => __('West African CFA franc', 'acadlix'),
        'XAF' => __('Central African CFA franc', 'acadlix'),
        'XPF' => __('CFP franc', 'acadlix'),
        'YER' => __('Yemeni rial', 'acadlix'),
        'ZAR' => __('South African rand', 'acadlix'),
        'ZMK' => __('Zambian kwacha', 'acadlix'),
        'ZWL' => __('Zimbabwean dollar', 'acadlix'),
      );
      asort($currencies);
      return $currencies;
    }

    public function acadlix_currency_symbols()
    {
      $symbols = array(
        'AED' => '&#x62f;.&#x625;',
        'AFN' => '&#x60b;',
        'ALL' => 'L',
        'AMD' => 'AMD',
        'ANG' => '&fnof;',
        'AOA' => 'Kz',
        'ARS' => '&#36;',
        'AUD' => '&#36;',
        'AWG' => 'Afl.',
        'AZN' => 'AZN',
        'BAM' => 'KM',
        'BBD' => '&#36;',
        'BDT' => '&#2547;&nbsp;',
        'BGN' => '&#1083;&#1074;.',
        'BHD' => '.&#x62f;.&#x628;',
        'BIF' => 'Fr',
        'BMD' => '&#36;',
        'BND' => '&#36;',
        'BOB' => 'Bs.',
        'BRL' => '&#82;&#36;',
        'BSD' => '&#36;',
        'BTC' => '&#3647;',
        'BTN' => 'Nu.',
        'BWP' => 'P',
        'BYR' => 'Br',
        'BYN' => 'Br',
        'BZD' => '&#36;',
        'CAD' => '&#36;',
        'CDF' => 'Fr',
        'CHF' => '&#67;&#72;&#70;',
        'CLP' => '&#36;',
        'CNY' => '&yen;',
        'COP' => '&#36;',
        'CRC' => '&#x20a1;',
        'CUC' => '&#36;',
        'CUP' => '&#36;',
        'CVE' => '&#36;',
        'CZK' => '&#75;&#269;',
        'DJF' => 'Fr',
        'DKK' => 'DKK',
        'DOP' => 'RD&#36;',
        'DZD' => '&#x62f;.&#x62c;',
        'EGP' => 'EGP',
        'ERN' => 'Nfk',
        'ETB' => 'Br',
        'EUR' => '&euro;',
        'FJD' => '&#36;',
        'FKP' => '&pound;',
        'GBP' => '&pound;',
        'GEL' => '&#x20be;',
        'GGP' => '&pound;',
        'GHS' => '&#x20b5;',
        'GIP' => '&pound;',
        'GMD' => 'D',
        'GNF' => 'Fr',
        'GTQ' => 'Q',
        'GYD' => '&#36;',
        'HKD' => '&#36;',
        'HNL' => 'L',
        'HRK' => 'kn',
        'HTG' => 'G',
        'HUF' => '&#70;&#116;',
        'IDR' => 'Rp',
        'ILS' => '&#8362;',
        'IMP' => '&pound;',
        'INR' => '&#8377;',
        'IQD' => '&#x639;.&#x62f;',
        'IRR' => '&#xfdfc;',
        'IRT' => '&#x062A;&#x0648;&#x0645;&#x0627;&#x0646;',
        'ISK' => 'kr.',
        'JEP' => '&pound;',
        'JMD' => '&#36;',
        'JOD' => '&#x62f;.&#x627;',
        'JPY' => '&yen;',
        'KES' => 'KSh',
        'KGS' => '&#x441;&#x43e;&#x43c;',
        'KHR' => '&#x17db;',
        'KMF' => 'Fr',
        'KPW' => '&#x20a9;',
        'KRW' => '&#8361;',
        'KWD' => '&#x62f;.&#x643;',
        'KYD' => '&#36;',
        'KZT' => '&#8376;',
        'LAK' => '&#8365;',
        'LBP' => '&#x644;.&#x644;',
        'LKR' => '&#xdbb;&#xdd4;',
        'LRD' => '&#36;',
        'LSL' => 'L',
        'LYD' => '&#x644;.&#x62f;',
        'MAD' => '&#x62f;.&#x645;.',
        'MDL' => 'MDL',
        'MGA' => 'Ar',
        'MKD' => '&#x434;&#x435;&#x43d;',
        'MMK' => 'Ks',
        'MNT' => '&#x20ae;',
        'MOP' => 'P',
        'MRU' => 'UM',
        'MUR' => '&#x20a8;',
        'MVR' => '.&#x783;',
        'MWK' => 'MK',
        'MXN' => '&#36;',
        'MYR' => '&#82;&#77;',
        'MZN' => 'MT',
        'NAD' => 'N&#36;',
        'NGN' => '&#8358;',
        'NIO' => 'C&#36;',
        'NOK' => '&#107;&#114;',
        'NPR' => '&#8360;',
        'NZD' => '&#36;',
        'OMR' => '&#x631;.&#x639;.',
        'PAB' => 'B/.',
        'PEN' => 'S/',
        'PGK' => 'K',
        'PHP' => '&#8369;',
        'PKR' => '&#8360;',
        'PLN' => '&#122;&#322;',
        'PRB' => '&#x440;.',
        'PYG' => '&#8370;',
        'QAR' => '&#x631;.&#x642;',
        'RMB' => '&yen;',
        'RON' => 'lei',
        'RSD' => '&#1088;&#1089;&#1076;',
        'RUB' => '&#8381;',
        'RWF' => 'Fr',
        'SAR' => '&#x631;.&#x633;',
        'SBD' => '&#36;',
        'SCR' => '&#x20a8;',
        'SDG' => '&#x62c;.&#x633;.',
        'SEK' => '&#107;&#114;',
        'SGD' => '&#36;',
        'SHP' => '&pound;',
        'SLL' => 'Le',
        'SOS' => 'Sh',
        'SRD' => '&#36;',
        'SSP' => '&pound;',
        'STN' => 'Db',
        'SYP' => '&#x644;.&#x633;',
        'SZL' => 'L',
        'THB' => '&#3647;',
        'TJS' => '&#x405;&#x41c;',
        'TMT' => 'm',
        'TND' => '&#x62f;.&#x62a;',
        'TOP' => 'T&#36;',
        'TRY' => '&#8378;',
        'TTD' => '&#36;',
        'TWD' => '&#78;&#84;&#36;',
        'TZS' => 'Sh',
        'UAH' => '&#8372;',
        'UGX' => 'UGX',
        'USD' => '&#36;',
        'UYU' => '&#36;',
        'UZS' => 'UZS',
        'VEF' => 'Bs F',
        'VES' => 'Bs.S',
        'VND' => '&#8363;',
        'VUV' => 'Vt',
        'WST' => 'T',
        'XAF' => 'CFA',
        'XCD' => '&#36;',
        'XOF' => 'CFA',
        'XPF' => 'Fr',
        'YER' => '&#xfdfc;',
        'ZAR' => '&#82;',
        'ZMW' => 'ZK',
      );
      return $symbols;
    }

    public function acadlix_get_currency_with_symbols()
    {
      $currency_symbol = [];
      $currencies = $this->acadlix_currencies();
      $symbol = $this->acadlix_currency_symbols();
      $i = 0;
      foreach ($currencies as $key => $currency) {
        $currency_symbol[$i]['short_name'] = $key;
        $currency_symbol[$i]['name'] = $currency;
        $currency_symbol[$i]['symbol'] = $symbol[$key] ?? '';
        $i++;
      }
      return $currency_symbol;
    }

    public function acadlix_options()
    {
      $options = [
        // Page Setup
        'acadlix_dashboard_page_id' => null,
        // 'acadlix_cart_page_id' => null,
        'acadlix_checkout_page_id' => null,
        'acadlix_thankyou_page_id' => null,
        'acadlix_one_click_checkout' => 'no',
        // Course Option
        'acadlix_no_of_courses_per_page' => 10,
        'acadlix_disable_wishlist' => 'no',
        'acadlix_enable_rating_and_reviews' => 'no',
        'acadlix_require_admin_approval_for_reviews' => 'no',
        'acadlix_review_pagination_count' => 10,
        'acadlix_enable_course_filters' => 'no',
        'acadlix_disable_student_enrolled' => 'no',
        // Currency Option
        'acadlix_currency' => 'USD',
        'acadlix_currency_position' => 'Left ( $99.99 )',
        'acadlix_thousand_separator' => ',',
        'acadlix_decimal_separator' => '.',
        'acadlix_number_of_decimals' => 2,
        'acadlix_default_payment_gateway' => '',
        // Admin Option
        'acadlix_default_rows_per_page' => 20,
        'acadlix_admin_auto_registration_to_courses' => 'no',
        'acadlix_admin_can_assign_courses_to_student' => 'no',
        'acadlix_admin_can_remove_student_from_course' => 'no',
        // Front end Option
        'acadlix_disable_admin_toolbar' => 'no',
        'acadlix_enable_content_protection' => 'no',
        // Student Dashboard Option
        'acadlix_logout_redirect_url' => '',
        'acadlix_enable_dashboard_fullwidth' => 'no',
        'acadlix_enable_site_logo_in_header' => 'no',
        'acadlix_enable_course_content_scroll_button' => 'no',
        // Checkout Option
        'acadlix_enable_coupon_code' => 'no',
        // Data management
        'acadlix_delete_data_on_plugin_uninstall' => 'no',
        // Notification option
        'acadlix_notify_course_purchase_to_student' => 'no',
        'acadlix_notify_course_purchase_to_admin' => 'no',
        'acadlix_notify_course_completion_to_student' => 'no',
        'acadlix_notify_course_completion_to_admin' => 'no',
        'acadlix_notify_failed_transation_to_student' => 'no',
        'acadlix_notify_failed_transation_to_admin' => 'no',
        'acadlix_notify_offline_purchase_to_student' => 'no',
        'acadlix_notify_offline_purchase_to_admin' => 'no',
        // Permalink option
        'acadlix_course_base' => 'courses',
        'acadlix_course_category_base' => 'course-category',
        'acadlix_course_tag_base' => 'course-tag',
        // DB option
        'acadlix_db_version' => '',
        // Certificate option
        'acadlix_certificate_authorised_name' => '',
        'acadlix_certificate_authorised_company' => '',
        'acadlix_certificate_show_instructor_name_on_certificate' => 'no',
        'acadlix_certificate_show_course_completion_date_on_certificate' => 'no',
        'acadlix_certificate_page_id' => null,
        'acadlix_certificate_show_certificate_link_in_email' => 'no',
        'acadlix_certificate_signature' => [],
        'acadlix_certificate_template' => 'classic-landscape',
        // Authentication option
        'acadlix_default_auth_screen' => 'login',
        'acadlix_registration_options' => [
          "phone" => [
            'enabled' => false,
            'required' => false,
          ]
        ],
        'acadlix_enable_fraud_protection' => 'no',
        'acadlix_v3_site_key' => '',
      ];

      // Filter options
      $options = apply_filters('acadlix_options', $options);

      return $options;
    }

    public function acadlix_advance_options()
    {
      $options = [
        'acadlix_razorpay_active' => 'no',
        'acadlix_razorpay_client_id' => '',
        'acadlix_razorpay_secret_key' => '',
        'acadlix_razorpay_webhook_secret' => '',
        'acadlix_razorpay_webhook_url' => $this->acadlix_get_webhook_url('razorpay'),
        'acadlix_paypal_active' => 'no',
        'acadlix_paypal_client_id' => '',
        'acadlix_paypal_secret_key' => '',
        'acadlix_paypal_sandbox' => 'no',
        'acadlix_paypal_webhook_id' => '',
        'acadlix_paypal_webhook_url' => $this->acadlix_get_webhook_url('paypal'),
        'acadlix_payu_active' => 'no',
        'acadlix_payu_merchant_key' => '',
        'acadlix_payu_salt' => '',
        'acadlix_payu_sandbox' => 'no',
        'acadlix_payu_webhook_url' => $this->acadlix_get_webhook_url('payu'),
        'acadlix_offline_payment' => 'no',
        'acadlix_stripe_active' => 'no',
        'acadlix_stripe_public_key' => '',
        'acadlix_stripe_secret_key' => '',
        'acadlix_stripe_sandbox' => 'no',
        'acadlix_stripe_webhook_signature_key' => '',
        'acadlix_stripe_webhook_url' => $this->acadlix_get_webhook_url('stripe'),
        'acadlix_v3_secret_key' => '',
        'acadlix_offline_active' => 'no',
        'acadlix_offline_instructions' => '',
        'acadlix_offline_enable_file_upload' => 'no',
        'acadlix_offline_max_upload_file_size' => 2,
        'acadlix_offline_allowed_mime_types' => [],
      ];
      return $options;
    }

    public function acadlix_get_webhook_url($payment_method = 'paypal')
    {
      // Ensure method is safe for URLs
      $payment_method = sanitize_key($payment_method);

      // Base REST route
      $rest_route = sprintf(
        'acadlix/v1/front-checkout/handle-webhook'
      );

      // Build REST URL
      $url = add_query_arg(
        array('payment_method' => $payment_method),
        rest_url($rest_route)
      );

      return esc_url_raw($url);
    }

    public function acadlix_get_all_options($options = [])
    {
      if (empty($options)) {
        $options = $this->acadlix_options();
      }
      $new_options = [];
      if (count($options) > 0) {
        foreach ($options as $key => $option) {
          $new_options[$key] = $this->acadlix_get_option($key, $option);
        }
      }
      return $new_options;
    }

    public function acadlix_delete_all_options()
    {
      $options = $this->acadlix_options();
      if (count($options) > 0) {
        foreach ($options as $key => $option) {
          $this->acadlix_delete_option($key);
        }
      }
    }

    public function acadlix_get_option($key = '', $default = false)
    {
      $options = $this->acadlix_options();
      if (!empty($key)) {
        return get_option($key, $options[$key] ?? $default);
      }
      return $default;
    }

    public function acadlix_update_option($key = '', $value = '')
    {
      if (!empty($key)) {
        update_option($key, $value);
      }
    }

    public function acadlix_delete_option($key = '')
    {
      if (!empty($key)) {
        delete_option($key);
      }
    }

    /**
     * Formats a date string according to the WordPress date format setting.
     *
     * @param string $dateStr The date string to format.
     *
     * @return string The formatted date string.
     */
    public function formatDate(string $dateStr): string
    {
      $dateFormat = $this->acadlix_get_option('date_format');
      $dateObj = strtotime($dateStr);
      $formattedDate = date($dateFormat, $dateObj); // phpcs:ignore
      return $formattedDate;
    }

    public function acadlix_get_time_zone_string()
    {
      $timezone = $this->acadlix_get_option('timezone_string');
      if ($timezone) {
        return $timezone;
      }

      // get UTC offset, if it isn't set then return UTC
      $utcOffset = $this->acadlix_get_option('gmt_offset', 0);
      if ($utcOffset === 0) {
        return 'UTC';
      }

      // Adjust UTC offset from hours to seconds
      $utcOffset *= 3600;

      // Attempt to guess the timezone string from the UTC offset
      $timezone = timezone_name_from_abbr('', $utcOffset, 0);
      if ($timezone) {
        return $timezone;
      }
    }

    public function acadlix_get_date_time_format()
    {
      return $this->acadlix_get_option('date_format') . ' ' . $this->acadlix_get_option('time_format');
    }

    public function acadlix_ddd($data)
    {
      foreach (func_get_args() as $arg) {
        echo '<pre>';
        print_r($arg);  // phpcs:ignore
        echo '</pre>';
      }
    }

    public function acadlix_dd($data)
    {
      foreach (func_get_args() as $arg) {
        echo '<pre>';
        print_r($arg);  // phpcs:ignore
        echo '</pre>';
      }
      die;
    }

    public function acadlix_max_execution_time()
    {
      return ini_get('max_execution_time') * 1000;
    }

    public function acadlix_get_email_template($template_name, $type = 'student', $vars = [])
    {
      $file_path = ACADLIX_TEMPLATE_PATH . 'email/' . $type . '/' . $template_name;
      // if (file_exists($file_path)) {
      //     return file_get_contents($file_path);
      // }

      // return '';

      if (!file_exists($file_path)) {
        return '';
      }
      extract($vars, EXTR_SKIP);
      // Start output buffering
      ob_start();

      // Execute the PHP template file
      include $file_path;

      // Get the final rendered HTML and clear the buffer
      $content = ob_get_clean();

      return $content;
    }

    public function acadlix_preload_scripts($script = '')
    {
      $manifest_path = ACADLIX_BUILD_PATH . acadlix()->versionPath . '/manifest.php';

      if (file_exists($manifest_path)) {
        $manifest = include $manifest_path;

        // Preload dependencies
        if (!empty($script) && is_array($manifest[$script]['imports'])) {
          foreach ($manifest[$script]['imports'] as $name => $file) {
            if (strpos($name, 'vendor-') === 0) {
              echo '<link rel="preload" as="script" href="' . esc_url(ACADLIX_BUILD_URL . acadlix()->versionPath . '/' . $file) . '">' . "\n";
            }
          }
        }
      }
    }

    public function acadlix_table_prefix($table_name)
    {
      global $wpdb;
      return "{$wpdb->prefix}acadlix_{$table_name}";
    }

    public function acadlix_wp_prefix($table_name)
    {
      global $wpdb;
      return "{$wpdb->prefix}{$table_name}";
    }

    public function acadlix_fk_prefix($table_name, $key)
    {
      global $wpdb;
      return "{$wpdb->prefix}{$table_name}_{$key}_fn";
    }

    public function acadlix_index_prefix($table_name, $key)
    {
      global $wpdb;
      return "{$wpdb->prefix}{$table_name}_{$key}_ix";
    }

    public function acadlix_old_fk_prefix($table_name, $key)
    {
      return "acadlix_{$table_name}_{$key}_foreign";
    }

    public function acadlix_old_index_prefix($table_name, $key)
    {
      return "acadlix_{$table_name}_{$key}_index";
    }

    public function acadlix_update_fk($table, $oldConstraint, $column, $referencedTable, $newConstraint)
    {
      global $wpdb;
      $exists = $wpdb->get_var( // phpcs:ignore
        $wpdb->prepare(
          'SELECT CONSTRAINT_NAME 
                     FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
                     WHERE TABLE_SCHEMA = %s 
                     AND TABLE_NAME = %s 
                     AND CONSTRAINT_NAME = %s',
          DB_NAME,
          $table,
          $oldConstraint
        )
      );
      if ($exists) {
        try {
          Manager::schema()->table($table, function ($table) use ($oldConstraint) {
            $table->dropForeign($oldConstraint);
          });
        } catch (\Exception $e) {
          // Fail silently or log if needed
        }
      }

      // Step 2: Check if new constraint already exists
      $newExists = $wpdb->get_var( // phpcs:ignore
        $wpdb->prepare(
          'SELECT CONSTRAINT_NAME 
                    FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
                    WHERE TABLE_SCHEMA = %s 
                    AND TABLE_NAME = %s 
                    AND CONSTRAINT_NAME = %s',
          DB_NAME,
          $table,
          $newConstraint
        )
      );
      if (!$newExists) {
        Manager::schema()->table($table, function ($table) use ($column, $referencedTable, $newConstraint) {
          $table
            ->foreign($column, $newConstraint)
            ->references('id')
            ->on($referencedTable)
            ->onDelete('cascade');
        });
      }
    }

    public function acadlix_update_index($table, $oldIndex, $columns, $newIndex)
    {
      global $wpdb;

      // Step 1: Drop old index if it exists
      $oldExists = $wpdb->get_var( // phpcs:ignore
        $wpdb->prepare(
          'SELECT INDEX_NAME
                 FROM INFORMATION_SCHEMA.STATISTICS
                 WHERE TABLE_SCHEMA = %s
                 AND TABLE_NAME = %s
                 AND INDEX_NAME = %s',
          DB_NAME,
          $table,
          $oldIndex
        )
      );

      if ($oldExists) {
        try {
          Manager::schema()->table($table, function ($table) use ($oldIndex) {
            $table->dropIndex($oldIndex);  // Drop old index
          });
        } catch (\Throwable $e) {
          // Optional: log or silently ignore
        }
      }

      $newExists = $wpdb->get_var( // phpcs:ignore
        $wpdb->prepare(
          'SELECT INDEX_NAME
                     FROM INFORMATION_SCHEMA.STATISTICS
                     WHERE TABLE_SCHEMA = %s
                     AND TABLE_NAME = %s
                     AND INDEX_NAME = %s',
          DB_NAME,
          $table,
          $newIndex
        )
      );

      if (!$newExists) {
        Manager::schema()->table($table, function ($table) use ($columns, $newIndex) {
          $table->index($columns, $newIndex);
        });
      }
    }

    public function acadlix_get_all_addons(): array
    {
      return [
        [
          'name' => __('Acadlix Bulk Question Upload', 'acadlix'),
          'description' => __('Upload hundreds of questions in seconds via MS Word.', 'acadlix'),
          'pro' => true,
          'internal' => true,
          'installed' => true,
          'active' => $this->acadlix_get_option('acadlix_addon_bulk_question_upload_enabled', false) == 'yes',
          'url' => '',
          'option_name' => 'acadlix_addon_bulk_question_upload_enabled',
          'icon' => 'FaCloudUploadAlt',
          'icon_color' => 'red',
        ],
        [
          'name' => __('Acadlix Assignments', 'acadlix'),
          'description' => __('Create, assign, and evaluate student assignments seamlessly.', 'acadlix'),
          'pro' => true,
          'internal' => true,
          'installed' => true,
          'active' => $this->acadlix_get_option('acadlix_addon_assignments_enabled', false) == 'yes',
          'url' => '',
          'option_name' => 'acadlix_addon_assignments_enabled',
          'icon' => 'MdAssignment',
          'icon_color' => '#ffa65a',
        ],
        [
          'name' => __('Acadlix Zoom Integration', 'acadlix'),
          'description' => __('Schedule and manage live classes via Zoom from your dashboard.', 'acadlix'),
          'pro' => true,
          'internal' => true,
          'installed' => true,
          'active' => $this->acadlix_get_option('acadlix_addon_zoom_integration_enabled', false) == 'yes',
          'url' => '',
          'option_name' => 'acadlix_addon_zoom_integration_enabled',
          'icon' => 'BiLogoZoom',
          'icon_color' => '#2d8cff',
        ],
        [
          'name' => __('Acadlix Advanced Report', 'acadlix'),
          'description' => __('Generate detailed reports for your students and courses.', 'acadlix'),
          'pro' => true,
          'internal' => true,
          'installed' => true,
          'active' => $this->acadlix_get_option('acadlix_addon_advanced_report_enabled', false) == 'yes',
          'url' => '',
          'option_name' => 'acadlix_addon_advanced_report_enabled',
          'icon' => 'HiDocumentReport',
          'icon_color' => '#4A90E2',
        ],
        [
          'name' => __('Acadlix Subscriptions', 'acadlix'),
          'description' => __('Manage subscriptions for your students and courses.', 'acadlix'),
          'pro' => true,
          'internal' => true,
          'installed' => true,
          'active' => $this->acadlix_get_option('acadlix_addon_subscriptions_enabled', false) == 'yes',
          'url' => '',
          'option_name' => 'acadlix_addon_subscriptions_enabled',
          'icon' => 'MdSubscriptions',
          'icon_color' => '#22C55E',
        ],
        [
          'name' => __('Acadlix Data Exporter', 'acadlix'),
          'description' => __('Export results, answer sheets in PDF or Excel.', 'acadlix'),
          'pro' => true,
          'internal' => true,
          'installed' => true,
          'active' => $this->acadlix_get_option('acadlix_addon_data_exporter_enabled', false) == 'yes',
          'url' => '',
          'option_name' => 'acadlix_addon_data_exporter_enabled',
          'icon' => 'FaFileExport',
          'icon_color' => '#3B82F6',
        ],
        [
          'name' => __('Question Error Reporting', 'acadlix'),
          'description' => __('This addon lets students flag and report incorrect or unclear questions, helping admins maintain accuracy and improve question quality.', 'acadlix'),
          'pro' => true,
          'internal' => true,
          'installed' => true,
          'active' => $this->acadlix_get_option('acadlix_addon_question_error_reporting_enabled', false) == 'yes',
          'url' => '',
          'option_name' => 'acadlix_addon_question_error_reporting_enabled',
          'icon' => 'TbAlertTriangleFilled',
          'icon_color' => '#FFAB00',
        ],
        [
          'name' => __('Social Login', 'acadlix'),
          'description' => __('Allow users to log in using their social media accounts.', 'acadlix'),
          'pro' => true,
          'internal' => true,
          'installed' => true,
          'active' => $this->acadlix_get_option('acadlix_addon_social_login_enabled', false) == 'yes',
          'url' => '',
          'option_name' => 'acadlix_addon_social_login_enabled',
          'icon' => 'SocialLogin',
          'icon_color' => '#3B82F6',
        ],
        [
          'name' => __('Course Bundle', 'acadlix'),
          'description' => __('Allow users to purchase multiple courses as a bundle.', 'acadlix'),
          'pro' => true,
          'internal' => true,
          'installed' => true,
          'active' => $this->acadlix_get_option('acadlix_addon_course_bundle_enabled', false) == 'yes',
          'url' => '',
          'option_name' => 'acadlix_addon_course_bundle_enabled',
          'icon' => 'FaLayerGroup',
          'icon_color' => '#7C3AED',
        ],
      ];
    }

    public function is_social_login_addon_active()
    {
      $value = get_option('acadlix_addon_social_login_enabled', false);
      if ($value != 'yes') {
        return false;
      }
      if (!acadlix()->pro) {
        return false;
      } else {
        if (!acadlix()->license()->isActive) {
          return false;
        }
      }
      return true;
    }

    public function is_bulk_question_addon_active()
    {
      $value = get_option('acadlix_addon_bulk_question_upload_enabled', false);
      if ($value != 'yes') {
        return false;
      }
      if (!acadlix()->pro) {
        return false;
      } else {
        if (!acadlix()->license()->isActive) {
          return false;
        }
      }
      return true;
    }

    public function is_assignment_addon_active()
    {
      $value = get_option('acadlix_addon_assignments_enabled', false);
      if ($value != 'yes') {
        return false;
      }
      if (!acadlix()->pro) {
        return false;
      } else {
        if (!acadlix()->license()->isActive) {
          return false;
        }
      }
      return true;
    }

    public function is_zoom_integration_addon_active()
    {
      $value = get_option('acadlix_addon_zoom_integration_enabled', false);
      if ($value != 'yes') {
        return false;
      }
      if (!acadlix()->pro) {
        return false;
      } else {
        if (!acadlix()->license()->isActive) {
          return false;
        }
      }
      return true;
    }

    public function is_advanced_report_addon_active()
    {
      $value = get_option('acadlix_addon_advanced_report_enabled', false);
      if ($value != 'yes') {
        return false;
      }
      if (!acadlix()->pro) {
        return false;
      } else {
        if (!acadlix()->license()->isActive) {
          return false;
        }
      }
      return true;
    }

    public function is_subscriptions_addon_active()
    {
      $value = get_option('acadlix_addon_subscriptions_enabled', false);
      if ($value != 'yes') {
        return false;
      }
      if (!acadlix()->pro) {
        return false;
      } else {
        if (!acadlix()->license()->isActive) {
          return false;
        }
      }
      return true;
    }

    public function is_data_exporter_addon_active()
    {
      $value = get_option('acadlix_addon_data_exporter_enabled', false);
      if ($value != 'yes') {
        return false;
      }
      if (!acadlix()->pro) {
        return false;
      } else {
        if (!acadlix()->license()->isActive) {
          return false;
        }
      }
      return true;
    }

    public function is_question_error_reporting_addon_active()
    {
      $value = get_option('acadlix_addon_question_error_reporting_enabled', false);
      if ($value != 'yes') {
        return false;
      }
      if (!acadlix()->pro) {
        return false;
      } else {
        if (!acadlix()->license()->isActive) {
          return false;
        }
      }
      return true;
    }

    public function is_course_bundle_addon_active()
    {
      $value = get_option('acadlix_addon_course_bundle_enabled', false);
      if ($value != 'yes') {
        return false;
      }
      if (!acadlix()->pro) {
        return false;
      } else {
        if (!acadlix()->license()->isActive) {
          return false;
        }
      }
      return true;
    }

    public function acadlix_delete_addon_options()
    {
      $options = $this->acadlix_get_all_addons();
      foreach ($options as $option) {
        $this->acadlix_delete_option($option['option_name']);
      }
    }

    public function acadlix_delete_extra_options()
    {
      $options = [
        'acadlix_theme_settings',
      ];
      foreach ($options as $option) {
        $this->acadlix_delete_option($option);
      }
    }

    private function acadlix_allowed_html()
    {
      return [
        'main' => ['id' => true, 'class' => true, 'role' => true, 'style' => true],
        'section' => ['id' => true, 'class' => true, 'style' => true],
        'header' => ['id' => true, 'class' => true, 'style' => true],
        'footer' => ['id' => true, 'class' => true, 'style' => true],
        'nav' => ['id' => true, 'class' => true, 'role' => true, 'style' => true, 'aria-*' => true],
        'div' => ['id' => true, 'class' => true, 'style' => true, 'role' => true, 'data-*' => true, 'aria-*' => true],
        'span' => ['id' => true, 'class' => true, 'style' => true, 'data-*' => true, 'aria-*' => true],
        'p' => ['id' => true, 'class' => true, 'style' => true],
        'a' => [
          'href' => true,
          'class' => true,
          'target' => true,
          'rel' => true,
          'title' => true,
          'id' => true,
          'style' => true,
          'aria-*' => true,
          'data-*' => true,
        ],
        'ul' => ['id' => true, 'class' => true, 'style' => true, 'data-*' => true],
        'ol' => ['id' => true, 'class' => true, 'style' => true, 'data-*' => true],
        'li' => ['id' => true, 'class' => true, 'style' => true, 'data-*' => true],
        'strong' => [],
        'em' => [],
        'br' => [],
        'small' => ['class' => true, 'style' => true],
        'h1' => ['id' => true, 'class' => true, 'style' => true],
        'h2' => ['id' => true, 'class' => true, 'style' => true],
        'h3' => ['id' => true, 'class' => true, 'style' => true],
        'h4' => ['id' => true, 'class' => true, 'style' => true],
        'h5' => ['id' => true, 'class' => true, 'style' => true],
        'h6' => ['id' => true, 'class' => true, 'style' => true],
        'img' => [
          'src' => true,
          'alt' => true,
          'class' => true,
          'width' => true,
          'height' => true,
          'loading' => true,
          'srcset' => true,
          'sizes' => true,
          'style' => true,
          'data-*' => true,
        ],
        'i' => ['class' => true, 'aria-hidden' => true, 'style' => true],
        'svg' => ['class' => true, 'viewBox' => true, 'xmlns' => true, 'width' => true, 'height' => true, 'aria-hidden' => true, 'focusable' => true, 'role' => true],
        'path' => ['d' => true, 'fill' => true, 'stroke' => true, 'stroke-width' => true],
        'button' => ['type' => true, 'class' => true, 'id' => true, 'data-*' => true, 'aria-*' => true, 'style' => true],
        'input' => ['type' => true, 'name' => true, 'value' => true, 'placeholder' => true, 'class' => true, 'id' => true, 'checked' => true, 'disabled' => true, 'aria-*' => true, 'data-*' => true, 'style' => true],
        'label' => ['for' => true, 'class' => true, 'id' => true, 'style' => true],
        'select' => ['name' => true, 'class' => true, 'id' => true, 'style' => true],
        'option' => ['value' => true, 'selected' => true, 'label' => true],
        'textarea' => ['name' => true, 'class' => true, 'id' => true, 'rows' => true, 'cols' => true, 'placeholder' => true, 'style' => true],
        'form' => ['action' => true, 'method' => true, 'class' => true, 'id' => true, 'style' => true],
        'time' => ['datetime' => true, 'class' => true],
        'figure' => ['class' => true],
        'figcaption' => ['class' => true],
        'style' => true,
      ];
    }

    public function acadlix_render_component($node)
    {
      // Allowed HTML for dynamic rendering
      $allowed_html = $this->acadlix_allowed_html();

      // Allow plain string or callable directly
      if (is_string($node)) {
        echo wp_kses($node, $allowed_html);
        return;
      }

      if (is_callable($node)) {
        $output = call_user_func($node);
        echo wp_kses($output, $allowed_html);
        return;
      }

      if (!is_array($node)) {
        return;
      }

      // Skip if not visible
      if (isset($node['visible']) && $node['visible'] === false) {
        return;
      }

      $tag = !empty($node['component']) ? strtolower($node['component']) : 'div';

      // Special case: "php" pseudo-component
      if ($tag === 'php' && isset($node['value'])) {
        $output = is_callable($node['value'])
          ? call_user_func($node['value'])
          : $node['value'];

        echo wp_kses($output, $allowed_html);
        return;
      }
      /**
       * ----------------------------------------
       * Build attributes safely
       * ----------------------------------------
       */
      $attributes = '';

      if (!empty($node['props']) && is_array($node['props'])) {
        foreach ($node['props'] as $key => $value) {

          if (is_bool($value)) {
            if ($value) {
              $attributes .= ' ' . esc_attr($key);
            }
            continue;
          }

          if ($value !== null) {
            // Special handling for style
            if ($key === 'style') {
              $safe_style = safecss_filter_attr($value);
              if (!empty($safe_style)) {
                $attributes .= sprintf(
                  ' %s="%s"',
                  esc_attr($key),
                  esc_attr($safe_style)
                );
              }
              continue;
            }

            $attributes .= sprintf(
              ' %s="%s"',
              esc_attr($key),
              esc_attr($value)
            );
          }
        }
      }


      // Self-closing tags
      $self_closing = in_array(
        $tag,
        ['input', 'img', 'br', 'hr', 'meta', 'link'],
        true
      );

      if ($self_closing) {
        printf(
          '<%1$s%2$s />',
          esc_html($tag),
          $attributes // phpcs:ignore
        );
        return;
      }

      // Output opening tag
      printf(
        '<%1$s %2$s>',
        esc_html($tag),
        $attributes // phpcs:ignore
      );

      if (array_key_exists('value', $node) && $node['value'] !== null) {
        echo wp_kses($node['value'], $allowed_html);
      }

      /**
       * ----------------------------------------
       * Children
       * ----------------------------------------
       */
      if (!empty($node['children']) && is_array($node['children'])) {
        foreach ($node['children'] as $child) {
          $this->acadlix_render_component($child);
        }
      }

      /**
       * ----------------------------------------
       * Closing tag
       * ----------------------------------------
       */
      printf(
        '</%s>',
        esc_html($tag)
      );
    }

    public function acadlix_render_tree($tree)
    {
      // $tree = apply_filters('acadlix_render_tree', $tree);

      if (is_array($tree)) {
        foreach ($tree as $node) {
          $this->acadlix_render_component($node);
        }
      } elseif (is_string($tree) || is_callable($tree)) {
        $this->acadlix_render_component($tree);
      }
    }

    public function acadlix_add_to_date($date = '', $format = 'Y-m-d H:i:s', $number = 1, $type = 'day')
    {
      // Convert given date to timestamp (WP timezone aware)
      if (empty($date)) {
        $date = current_time('timestamp');
      }
      $timestamp = is_numeric($date) ? (int) $date : strtotime($date);

      if (!$timestamp) {
        return false;
      }

      switch (strtolower($type)) {
        case 'day':
        case 'days':
          $timestamp += $number * DAY_IN_SECONDS;
          break;

        case 'week':
        case 'weeks':
          $timestamp += $number * WEEK_IN_SECONDS;
          break;

        case 'month':
        case 'months':
          $timestamp = strtotime("+{$number} month", $timestamp);
          break;

        case 'year':
        case 'years':
          $timestamp = strtotime("+{$number} year", $timestamp);
          break;

        default:
          return false;
      }

      $tz_string = $this->acadlix_get_option('timezone_string') ?: 'UTC';
      $timezone = new \DateTimeZone($tz_string);

      return wp_date($format, $timestamp, $timezone);
    }

    public function acadlix_convert_to_unit_price($amount = 0)
    {
      // Convert null/empty to string
      if ($amount === null) {
        $amount = '0';
      }

      // Get decimal places (default 2)
      $decimal_places = $this->acadlix_get_option('acadlix_number_of_decimals', 2);
      $multiplier = pow(10, $decimal_places);

      // Get thousand separator (default empty string)
      $thousand_separator = $this->acadlix_get_option('acadlix_thousand_separator', '');

      // Remove thousand separator from string if present
      if ($thousand_separator !== '') {
        $amount = str_replace($thousand_separator, '', strval($amount));
      }

      // Convert to number and multiply
      $amount = floatval($amount);

      return round($amount * $multiplier);
    }

    public function acadlix_format_price_for_storage($price)
    {
      $decimal_places = $this->acadlix_get_option('acadlix_number_of_decimals', 2);
      return round((float) $price, (int) $decimal_places);
    }

    public function acadlix_format_price_for_display($price)
    {
      $decimal_places = $this->acadlix_get_option('acadlix_number_of_decimals', 2);
      $decimal_separator = $this->acadlix_get_option('acadlix_decimal_separator', '.');
      $thousand_separator = $this->acadlix_get_option('acadlix_thousand_separator', '');
      return number_format((float) $price, (int) $decimal_places, $decimal_separator, $thousand_separator);
    }

    public function acadlix_get_price_with_currency(float|string $price, $currency = '')
    {
      $price = (float) preg_replace('/[^\d.-]/', '', (string) $price);
      if (empty($currency)) {
        $currency = $this->acadlix_get_option('acadlix_currency');
      }
      $currency_position_option = $this->acadlix_get_option('acadlix_currency_position');

      $currency_symbols = $this->acadlix_currency_symbols();

      if (!array_key_exists($currency, $currency_symbols)) {
        return new \WP_Error('currency_symbol_not_found', __('Currency symbol not found for the selected currency.', 'acadlix'));
      }

      $currency_symbol = $currency_symbols[$currency];

      $price = $this->acadlix_format_price_for_display($price);

      return match ($currency_position_option) {
        'Left ( $99.99 )' => "$currency_symbol$price",
        'Right ( 99.99$ )' => "$price$currency_symbol",
        'Left with space ( $ 99.99 )' => "$currency_symbol $price",
        'Right with space ( 99.99 $ )' => "$price $currency_symbol",
        default => "$currency_symbol$price",
      };
    }

    public function acadlix_is_json($string)
    {
      if (!is_string($string)) {
        return false;
      }

      json_decode($string);
      return json_last_error() === JSON_ERROR_NONE;
    }

    public function acadlix_format_e164($phone, $country_code)
    {
      if (empty($phone) || empty($country_code)) {
        return '';
      }

      // If already E.164 → trust but verify
      if (strpos($phone, '+') === 0) {
        return preg_replace('/[^\+\d]/', '', $phone);
      }

      $phone = preg_replace('/\D/', '', $phone);
      $country_code = preg_replace('/\D/', '', $country_code);

      // Remove leading zero
      if (substr($phone, 0, 1) === '0') {
        $phone = substr($phone, 1);
      }

      return '+' . $country_code . $phone;
    }

    public function acadlix_css_color($value, $default)
    {
      if (!is_string($value)) {
        return $default;
      }

      $value = trim($value);

      // Hex colors (#fff, #ffffff)
      if (sanitize_hex_color($value)) {
        return $value;
      }

      // hsl(0–360, 0–100%, 0–100%)
      if (
        preg_match(
          '/^hsl\(\s*(?:[0-9]|[1-9][0-9]|[12][0-9]{2}|3[0-5][0-9]|360)\s*,\s*(?:100|[0-9]{1,2})%\s*,\s*(?:100|[0-9]{1,2})%\s*\)$/',
          $value
        )
      ) {
        return $value;
      }

      // rgb(0–255, 0–255, 0–255)
      if (
        preg_match(
          '/^rgb\(\s*(?:25[0-5]|2[0-4]\d|1?\d{1,2})\s*,\s*(?:25[0-5]|2[0-4]\d|1?\d{1,2})\s*,\s*(?:25[0-5]|2[0-4]\d|1?\d{1,2})\s*\)$/',
          $value
        )
      ) {
        return $value;
      }

      // rgba(0–255, 0–255, 0–255, 0–1)
      if (
        preg_match(
          '/^rgba\(\s*(?:25[0-5]|2[0-4]\d|1?\d{1,2})\s*,\s*(?:25[0-5]|2[0-4]\d|1?\d{1,2})\s*,\s*(?:25[0-5]|2[0-4]\d|1?\d{1,2})\s*,\s*(?:0|1|0?\.\d+)\s*\)$/',
          $value
        )
      ) {
        return $value;
      }

      return $default;
    }


    public function acadlix_css_size($value, $default)
    {
      if (preg_match('/^\d+(\.\d+)?(px|rem|em|%)$/', (string) $value)) {
        return $value;
      }
      return $default;
    }

    public function acadlix_css_number($value, $default)
    {
      return is_numeric($value) ? (string) $value : (string) $default;
    }

    public function acadlix_css_line_height($value, $default)
    {
      if (is_numeric($value) || preg_match('/^\d+(\.\d+)?$/', (string) $value)) {
        return (string) $value;
      }
      return $default;
    }

    public function acadlix_generate_certificate_id()
    {
      do {
        $id = 'CRT-' . date('Y') . '-' . strtoupper(substr(bin2hex(random_bytes(4)), 0, 8));
      } while (
        acadlix()->model()->userActivityMeta()->where('reference_id', $id)->exists()
      );

      return $id;
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
