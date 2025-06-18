<?php

namespace Yuvayana\Acadlix\Common\Helper;

if (!class_exists('Helper')) {
    class Helper
    {
        protected static $_instance = null;

        protected $course = null;
        protected $cpt = null;
        protected $email = null;
        protected $queryLogger = null;

        public function course(): CourseHelper|null{
            if($this->course === null){
                $this->course = new CourseHelper();
            }
            return $this->course;
        }

        public function cpt(): CptHelper|null{
            if($this->cpt === null){
                $this->cpt = new CptHelper();
            }
            return $this->cpt;
        }

        public function email(): EmailHelper|null{
            if($this->email === null){
                $this->email = new EmailHelper();
            }
            return $this->email;
        }

        public function queryLogger(): QueryLogger|null{
            if($this->queryLogger === null){
                $this->queryLogger = new QueryLogger();
            }
            return $this->queryLogger;
        }


        public function acadlix_modify_video_shortcode($content)
        {
            if (empty($content)) {
                return $content; // If content is empty, return it as-is
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
                    return $matches[0]; // Return original shortcode if not [video]
                }, $content);
            }
            return $content;

        }

        public function renderShortCode($content)
        {
            $content = $this->acadlix_modify_video_shortcode($content);
            $content = apply_filters('the_content', $content);
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
                    WP_Filesystem(); // This initializes the $wp_filesystem global
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

        public function acadlix_get_system_languages()
        {
            require_once ABSPATH . 'wp-admin/includes/translation-install.php';
            $translations = wp_get_available_translations();

            $language_map = [];

            // Populate the language map with locale => native name
            foreach ($translations as $locale => $details) {
                $language_map[$locale] = $details['native_name'];
            }

            // Add the default locale (en_US) if not already in the list
            if (!isset($language_map['en_US'])) {
                $language_map['en_US'] = 'English';
            }

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
                'acadlix_dashboard_page_id' => null,
                // 'acadlix_advance_quiz_page_id' => null,
                'acadlix_cart_page_id' => null,
                'acadlix_checkout_page_id' => null,
                'acadlix_thankyou_page_id' => null,
                'acadlix_no_of_courses_per_page' => 10,
                'acadlix_one_click_checkout' => "no",
                'acadlix_admin_auto_registration_to_courses' => "no",
                'acadlix_admin_can_assign_courses_to_student' => "no",
                'acadlix_admin_can_remove_student_from_course' => "no",
                'acadlix_currency' => "USD",
                'acadlix_currency_position' => "Left ( $99.99 )",
                'acadlix_thousand_separator' => ",",
                'acadlix_decimal_seprator' => ".",
                'acadlix_number_of_decimals' => 2,
                'acadlix_delete_data_on_plugin_uninstall' => "no",  
                // Payment option
                'acadlix_razorpay_active' => "no",
                'acadlix_razorpay_client_id' => "",
                'acadlix_razorpay_secret_key' => "",
                'acadlix_paypal_active' => "no",
                'acadlix_paypal_client_id' => "",
                'acadlix_paypal_secret_key' => "",
                'acadlix_paypal_sandbox' => "no",
                'acadlix_payu_active' => "no",
                'acadlix_payu_merchant_key' => "",
                'acadlix_payu_salt' => "",
                'acadlix_payu_sandbox' => "no",
                'acadlix_offline_payment' => "no",
                // Notification option
                'acadlix_notify_course_purchase_to_student' => "no",
                'acadlix_notify_course_purchase_to_admin' => "no",
                'acadlix_notify_course_completion_to_student' => "no",
                'acadlix_notify_course_completion_to_admin' => "no",
                'acadlix_notify_failed_transation_to_student' => "no",
                'acadlix_notify_failed_transation_to_admin' => "no",
                // Permalink option
                'acadlix_course_base' => "courses",
                'acadlix_course_category_base' => "course-category",
                'acadlix_course_tag_base' => "course-tag",
                // License option
                // 'acadlix_license_email_id' => "",
                // 'acadlix_license_key' => "",
            ];

            // Filter options
            $options = apply_filters('acadlix_options', $options);

            return $options;
        }

        public function acadlix_get_all_options()
        {
            $options = $this->acadlix_options();
            $new_options = [];
            if (count($options) > 0) {
                foreach ($options as $key => $option) {
                    $new_options[$key] = get_option($key, $option);
                }
            }
            return $new_options;
        }

        public function acadlix_get_option($key = '', $default = false)
        {
            $options = $this->acadlix_options();
            if (!empty($key) && is_array($options)) {
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

        /**
         * Formats a date string according to the WordPress date format setting.
         *
         * @param string $dateStr The date string to format.
         *
         * @return string The formatted date string.
         */
        public function formatDate(string $dateStr): string
        {
            $dateFormat = get_option('date_format');
            $dateObj = strtotime($dateStr);
            $formattedDate = date($dateFormat, $dateObj);
            return $formattedDate;
        }

        public function acadlix_get_time_zone_string()
        {
            $timezone = get_option('timezone_string');
            if ($timezone) {
                return $timezone;
            }

            // get UTC offset, if it isn't set then return UTC
            $utcOffset = get_option('gmt_offset', 0);
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
            return get_option('date_format') . ' ' . get_option('time_format');
        }

        public function acadlix_ddd($data)
        {
            foreach (func_get_args() as $arg) {
                echo "<pre>";
                print_r($arg);
                echo "</pre>";
            }
        }

        public function acadlix_dd($data)
        {
            foreach (func_get_args() as $arg) {
                echo "<pre>";
                print_r($arg); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
                echo "</pre>";
            }
            die;
        }

        public function acadlix_max_execution_time()
        {
            return ini_get('max_execution_time') * 1000;
        }

        public function acadlix_get_email_template($template_name, $type = "student")
        {
            $file_path = ACADLIX_TEMPLATE_PATH . 'email/' . $type . '/' . $template_name;
            if (file_exists($file_path)) {
                return file_get_contents($file_path);
            }

            return '';
        }

        public function acadlix_preload_scripts($script = '')
        {
            $manifest_path = ACADLIX_BUILD_PATH . '/manifest.php';

            if (file_exists($manifest_path)) {
                $manifest = include $manifest_path;

                // Preload dependencies
                if(!empty($script) && is_array($manifest[$script]['imports'])){ 
                    foreach ($manifest[$script]['imports'] as $name => $file) {
                        if (strpos($name, 'vendor-') === 0) {
                            echo '<link rel="preload" as="script" href="' . ACADLIX_BUILD_URL . esc_attr($file) . '">' . "\n";
                        }
                    }
                }
            }
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