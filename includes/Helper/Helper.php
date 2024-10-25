<?php

namespace Yuvayana\Acadlix\Helper;

if (!class_exists('Helper')) {
    class Helper
    {
        protected static $_instance = null;

        public function renderShortCode($data)
        {
            return do_shortcode(apply_filters('comment_text', $data));
        }

        public function upload_base64_image_to_wordpress($content)
        {
            $pattern = '/<img[^>]+src="data:image\/([^;]+);base64,([^"]+)"[^>]*>/i';

            // Callback function to handle each match
            $callback = function ($matches) {
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
                file_put_contents($file_path, $image_data);

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
                return "<img src='". $upload_dir['url'] . '/' . $filename. "' alt='". $filename."' />";
            };

            // Perform the replacement
            $new_content = preg_replace_callback($pattern, $callback, $content);

            return $new_content;
        }

        public function acadlix_currencies()
        {
            $currencies = array(
                'AFN' => __( 'Afghan afghani', ACADLIX_TEXT_DOMAIN ),
                'ALL' => __( 'Albanian lek', ACADLIX_TEXT_DOMAIN ),
                'AED' => __( 'United Arab Emirates dirham', ACADLIX_TEXT_DOMAIN ),
                'AOA' => __( 'Angolan kwanza', ACADLIX_TEXT_DOMAIN ),
                'ARS' => __( 'Argentine peso', ACADLIX_TEXT_DOMAIN ),
                'AMD' => __( 'Armenian dram', ACADLIX_TEXT_DOMAIN ),
                'ANG' => __( 'Netherlands Antilles guilder', ACADLIX_TEXT_DOMAIN ),
                'AWG' => __( 'Aruban florin', ACADLIX_TEXT_DOMAIN ),
                'AUD' => __( 'Australian dollar', ACADLIX_TEXT_DOMAIN ),
                'AZN' => __( 'Azerbaijani manat', ACADLIX_TEXT_DOMAIN ),
                'BSD' => __( 'Bahamian dollar', ACADLIX_TEXT_DOMAIN ),
                'BHD' => __( 'Bahraini dinar', ACADLIX_TEXT_DOMAIN ),
                'BDT' => __( 'Bangladeshi taka', ACADLIX_TEXT_DOMAIN ),
                'BBD' => __( 'Barbadian dollar', ACADLIX_TEXT_DOMAIN ),
                'BYR' => __( 'Belarusian ruble', ACADLIX_TEXT_DOMAIN ),
                'BZD' => __( 'Belizean dollar', ACADLIX_TEXT_DOMAIN ),
                'BMD' => __( 'Bermudian dollar', ACADLIX_TEXT_DOMAIN ),
                'BTN' => __( 'Bhutanese ngultrum', ACADLIX_TEXT_DOMAIN ),
                'BOB' => __( 'Bolivian boliviano', ACADLIX_TEXT_DOMAIN ),
                'BAM' => __( 'Bosnia and Herzegovina convertible mark', ACADLIX_TEXT_DOMAIN ),
                'BWP' => __( 'Botswana pula', ACADLIX_TEXT_DOMAIN ),
                'BRL' => __( 'Brazilian real', ACADLIX_TEXT_DOMAIN ),
                'BND' => __( 'Brunei dollar', ACADLIX_TEXT_DOMAIN ),
                'BGN' => __( 'Bulgarian lev', ACADLIX_TEXT_DOMAIN ),
                'BIF' => __( 'Burundian franc', ACADLIX_TEXT_DOMAIN ),
                'CAD' => __( 'Canadian dollar', ACADLIX_TEXT_DOMAIN ),
                'CVE' => __( 'Cape Verdean escudo', ACADLIX_TEXT_DOMAIN ),
                'CLP' => __( 'Chilean peso', ACADLIX_TEXT_DOMAIN ),
                'CNY' => __( 'Chinese renminbi', ACADLIX_TEXT_DOMAIN ),
                'COP' => __( 'Colombian peso', ACADLIX_TEXT_DOMAIN ),
                'CDF' => __( 'Congolese franc', ACADLIX_TEXT_DOMAIN ),
                'CHF' => __( 'Swiss franc', ACADLIX_TEXT_DOMAIN ),
                'CRC' => __( 'Costa Rican colón', ACADLIX_TEXT_DOMAIN ),
                'CUC' => __( 'Cuban peso', ACADLIX_TEXT_DOMAIN ),
                'CZK' => __( 'Czech koruna', ACADLIX_TEXT_DOMAIN ),
                'DKK' => __( 'Danish krone', ACADLIX_TEXT_DOMAIN ),
                'DJF' => __( 'Djiboutian franc', ACADLIX_TEXT_DOMAIN ),
                'DOP' => __( 'Dominican peso', ACADLIX_TEXT_DOMAIN ),
                'DZD' => __( 'Algerian dinar', ACADLIX_TEXT_DOMAIN ),
                'EGP' => __( 'Egyptian pound', ACADLIX_TEXT_DOMAIN ),
                'ERN' => __( 'Eritrean nakfa', ACADLIX_TEXT_DOMAIN ),
                'EUR' => __( 'Euro', ACADLIX_TEXT_DOMAIN ),
                'ETB' => __( 'Ethiopian birr', ACADLIX_TEXT_DOMAIN ),
                'FKP' => __( 'Falkland Islands pound', ACADLIX_TEXT_DOMAIN ),
                'FJD' => __( 'Fijian dollar', ACADLIX_TEXT_DOMAIN ),
                'GMD' => __( 'Gambian dalasi', ACADLIX_TEXT_DOMAIN ),
                'GEL' => __( 'Georgian lari', ACADLIX_TEXT_DOMAIN ),
                'GHS' => __( 'Ghanian cedi', ACADLIX_TEXT_DOMAIN ),
                'GIP' => __( 'Gibraltar pound', ACADLIX_TEXT_DOMAIN ),
                'GTQ' => __( 'Guatemalan quetzal', ACADLIX_TEXT_DOMAIN ),
                'GBP' => __( 'British pound', ACADLIX_TEXT_DOMAIN ),
                'GNF' => __( 'Guinean franc', ACADLIX_TEXT_DOMAIN ),
                'GYD' => __( 'Guyanese dollar', ACADLIX_TEXT_DOMAIN ),
                'HTG' => __( 'Haitian gourde', ACADLIX_TEXT_DOMAIN ),
                'HNL' => __( 'Honduran lempira', ACADLIX_TEXT_DOMAIN ),
                'HKD' => __( 'Hong Kong dollar', ACADLIX_TEXT_DOMAIN ),
                'HRK' => __( 'Croatian kuna', ACADLIX_TEXT_DOMAIN ),
                'HUF' => __( 'Hungarian forint', ACADLIX_TEXT_DOMAIN ),
                'ISK' => __( 'Icelandic króna', ACADLIX_TEXT_DOMAIN ),
                'INR' => __( 'Indian rupee', ACADLIX_TEXT_DOMAIN ),
                'IDR' => __( 'Indonesian rupiah', ACADLIX_TEXT_DOMAIN ),
                'IRR' => __( 'Iranian rial', ACADLIX_TEXT_DOMAIN ),
                'IQD' => __( 'Iraqi dinar', ACADLIX_TEXT_DOMAIN ),
                'ILS' => __( 'Israeli new sheqel', ACADLIX_TEXT_DOMAIN ),
                'JMD' => __( 'Jamaican dollar', ACADLIX_TEXT_DOMAIN ),
                'JPY' => __( 'Japanese yen ', ACADLIX_TEXT_DOMAIN ),
                'JEP' => __( 'Jersey pound', ACADLIX_TEXT_DOMAIN ),
                'JOD' => __( 'Jordanian dinar', ACADLIX_TEXT_DOMAIN ),
                'KZT' => __( 'Kazakhstani tenge', ACADLIX_TEXT_DOMAIN ),
                'KES' => __( 'Kenyan shilling', ACADLIX_TEXT_DOMAIN ),
                'KPW' => __( 'North Korean won', ACADLIX_TEXT_DOMAIN ),
                'KHR' => __( 'Cambodian riel', ACADLIX_TEXT_DOMAIN ),
                'KWD' => __( 'Kuwaiti dinar', ACADLIX_TEXT_DOMAIN ),
                'KGS' => __( 'Kyrgyzstani som', ACADLIX_TEXT_DOMAIN ),
                'KYD' => __( 'Cayman Islands dollar', ACADLIX_TEXT_DOMAIN ),
                'KMF' => __( 'Comorian franc', ACADLIX_TEXT_DOMAIN ),
                'KRW' => __( 'South Korean won', ACADLIX_TEXT_DOMAIN ),
                'LAK' => __( 'Lao kip', ACADLIX_TEXT_DOMAIN ),
                'LVL' => __( 'Latvian lats', ACADLIX_TEXT_DOMAIN ),
                'LBP' => __( 'Lebanese pound', ACADLIX_TEXT_DOMAIN ),
                'LSL' => __( 'Lesotho loti', ACADLIX_TEXT_DOMAIN ),
                'LRD' => __( 'Liberian dollar', ACADLIX_TEXT_DOMAIN ),
                'LD'  => __( 'Libyan dinar', ACADLIX_TEXT_DOMAIN ),
                'LYD' => __( 'Libyan dinar', ACADLIX_TEXT_DOMAIN ),
                'LKR' => __( 'Sri Lankan rupee', ACADLIX_TEXT_DOMAIN ),
                'LTL' => __( 'Lithuanian litas', ACADLIX_TEXT_DOMAIN ),
                'MOP' => __( 'Macanese pataca', ACADLIX_TEXT_DOMAIN ),
                'MKD' => __( 'Macedonian denar', ACADLIX_TEXT_DOMAIN ),
                'MGA' => __( 'Malagasy ariary', ACADLIX_TEXT_DOMAIN ),
                'MWK' => __( 'Malawian kwacha', ACADLIX_TEXT_DOMAIN ),
                'MYR' => __( 'Malaysian ringgit', ACADLIX_TEXT_DOMAIN ),
                'MVR' => __( 'Maldivian rufiyaa', ACADLIX_TEXT_DOMAIN ),
                'MRO' => __( 'Mauritanian ouguiya', ACADLIX_TEXT_DOMAIN ),
                'MUR' => __( 'Mauritian rupee', ACADLIX_TEXT_DOMAIN ),
                'MXN' => __( 'Mexican peso', ACADLIX_TEXT_DOMAIN ),
                'MDL' => __( 'Moldovan leu', ACADLIX_TEXT_DOMAIN ),
                'MNT' => __( 'Mongolian tugrik', ACADLIX_TEXT_DOMAIN ),
                'MAD' => __( 'Moroccan dirham', ACADLIX_TEXT_DOMAIN ),
                'MZN' => __( 'Mozambican metical', ACADLIX_TEXT_DOMAIN ),
                'MMK' => __( 'Burmese kyat', ACADLIX_TEXT_DOMAIN ),
                'NAD' => __( 'Namibian dollar', ACADLIX_TEXT_DOMAIN ),
                'NPR' => __( 'Nepalese rupee', ACADLIX_TEXT_DOMAIN ),
                'NIO' => __( 'Nicaraguan córdoba', ACADLIX_TEXT_DOMAIN ),
                'NGN' => __( 'Nigerian naira', ACADLIX_TEXT_DOMAIN ),
                'NOK' => __( 'Norwegian krone', ACADLIX_TEXT_DOMAIN ),
                'NZD' => __( 'New Zealand dollar', ACADLIX_TEXT_DOMAIN ),
                'OMR' => __( 'Omani rial', ACADLIX_TEXT_DOMAIN ),
                'PKR' => __( 'Pakistani rupee', ACADLIX_TEXT_DOMAIN ),
                'PAB' => __( 'Panamanian balboa', ACADLIX_TEXT_DOMAIN ),
                'PGK' => __( 'Papua New Guinea kina', ACADLIX_TEXT_DOMAIN ),
                'PYG' => __( 'Paraguayan guarani', ACADLIX_TEXT_DOMAIN ),
                'PEN' => __( 'Peruvian nuevo sol', ACADLIX_TEXT_DOMAIN ),
                'PHP' => __( 'Philippine peso', ACADLIX_TEXT_DOMAIN ),
                'PLN' => __( 'Polish zloty', ACADLIX_TEXT_DOMAIN ),
                'QAR' => __( 'Qatari riyal', ACADLIX_TEXT_DOMAIN ),
                'RON' => __( 'Romanian leu', ACADLIX_TEXT_DOMAIN ),
                'RUB' => __( 'Russian ruble', ACADLIX_TEXT_DOMAIN ),
                'RSD' => __( 'Serbian dinar', ACADLIX_TEXT_DOMAIN ),
                'RWF' => __( 'Rwandan franc', ACADLIX_TEXT_DOMAIN ),
                'SVC' => __( 'Salvadoran colón', ACADLIX_TEXT_DOMAIN ),
                'STD' => __( 'São Tomé and Príncipe dobra', ACADLIX_TEXT_DOMAIN ),
                'SAR' => __( 'Saudi riyal', ACADLIX_TEXT_DOMAIN ),
                'SCR' => __( 'Seychellois rupee', ACADLIX_TEXT_DOMAIN ),
                'SLL' => __( 'Sierra Leonean leone', ACADLIX_TEXT_DOMAIN ),
                'SGD' => __( 'Singapore dollar', ACADLIX_TEXT_DOMAIN ),
                'SBD' => __( 'Solomon Islands dollar', ACADLIX_TEXT_DOMAIN ),
                'SOS' => __( 'Somali shilling', ACADLIX_TEXT_DOMAIN ),
                'SHP' => __( 'St. Helena pound', ACADLIX_TEXT_DOMAIN ),
                'SDG' => __( 'Sudanese pound', ACADLIX_TEXT_DOMAIN ),
                'SRD' => __( 'Surinamese dollar', ACADLIX_TEXT_DOMAIN ),
                'SZL' => __( 'Swazi lilangeni', ACADLIX_TEXT_DOMAIN ),
                'SEK' => __( 'Swedish krona', ACADLIX_TEXT_DOMAIN ),
                'SYP' => __( 'Syrian pound', ACADLIX_TEXT_DOMAIN ),
                'TWD' => __( 'New Taiwan dollar', ACADLIX_TEXT_DOMAIN ),
                'TJS' => __( 'Tajikistani somoni', ACADLIX_TEXT_DOMAIN ),
                'TZS' => __( 'Tanzanian shilling', ACADLIX_TEXT_DOMAIN ),
                'THB' => __( 'Thai baht ', ACADLIX_TEXT_DOMAIN ),
                'TOP' => __( 'Tongan pa’anga', ACADLIX_TEXT_DOMAIN ),
                'TTD' => __( 'Trinidad and Tobago dollar', ACADLIX_TEXT_DOMAIN ),
                'TND' => __( 'Tunisian dinar', ACADLIX_TEXT_DOMAIN ),
                'TRY' => __( 'Turkish lira', ACADLIX_TEXT_DOMAIN ),
                'TMT' => __( 'Turkmenistani manat', ACADLIX_TEXT_DOMAIN ),
                'UGX' => __( 'Ugandan shilling', ACADLIX_TEXT_DOMAIN ),
                'UAH' => __( 'Ukrainian hryvnia', ACADLIX_TEXT_DOMAIN ),
                'USD' => __( 'US dollar', ACADLIX_TEXT_DOMAIN ),
                'UYU' => __( 'Uruguayan peso', ACADLIX_TEXT_DOMAIN ),
                'UZS' => __( 'Uzbekistani som', ACADLIX_TEXT_DOMAIN ),
                'VUV' => __( 'Vanuatu vatu', ACADLIX_TEXT_DOMAIN ),
                'VEF' => __( 'Venezuelan bolivar', ACADLIX_TEXT_DOMAIN ),
                'VND' => __( 'Vietnamese dong', ACADLIX_TEXT_DOMAIN ),
                'WST' => __( 'Samoan tālā', ACADLIX_TEXT_DOMAIN ),
                'XCD' => __( 'East Caribbean dollar', ACADLIX_TEXT_DOMAIN ),
                'XOF' => __( 'West African CFA franc', ACADLIX_TEXT_DOMAIN ),
                'XAF' => __( 'Central African CFA franc', ACADLIX_TEXT_DOMAIN ),
                'XPF' => __( 'CFP franc', ACADLIX_TEXT_DOMAIN ),
                'YER' => __( 'Yemeni rial', ACADLIX_TEXT_DOMAIN ),
                'ZAR' => __( 'South African rand', ACADLIX_TEXT_DOMAIN ),
                'ZMK' => __( 'Zambian kwacha', ACADLIX_TEXT_DOMAIN ),
                'ZWL' => __( 'Zimbabwean dollar', ACADLIX_TEXT_DOMAIN ),
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
            foreach($currencies as $key => $currency)
            {
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
                'acadlix_all_courses_page_id' => null,
                'acadlix_dashboard_page_id' => null,
                'acadlix_advance_quiz_page_id' => null,
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
                'acadlix_upload_logo_url' => "",
                'acadlix_upload_mini_logo_url' => "",
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
                'acadlix_license_email_id' => "",
                'acadlix_license_key' => "",
            ];
            return $options;
        }

        public function acadlix_get_all_options()
        {
            $options = $this->acadlix_options();
            $new_options = [];
            if(count($options) > 0){
                foreach($options as $key => $option){
                    $new_options[$key] = get_option( $key, $option );
                }
            }
            return $new_options;
        }

        public function acadlix_get_option($key = '', $default = false)
        {
            $options = $this->acadlix_options();
            if(!empty($key) && is_array($options)){
                return get_option( $key, $options[$key] ?? $default );
            }
            return $default;
        }

        public function acadlix_update_option($key = '', $value = '')
        {
            if(!empty($key)){
                update_option( $key, $value );
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