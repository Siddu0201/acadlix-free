<?php

namespace Yuvayana\Acadlix\Admin;

use Yuvayana\Acadlix\Models\CourseCart;

use WP_User;

defined('ABSPATH') || exit();

class Core
{
    private static $_instance = null;
    public function __construct()
    {
        add_action('wp_login', [$this, 'acadlix_sync_cart_on_login'], 10, 2);
        add_filter( 'use_block_editor_for_post_type', array($this, 'acadlix_gutenberg_disable_cpt'), 10, 2 );
    }

    public function acadlix_sync_cart_on_login($user_login, WP_User $user)
    {
        $cookie_name = 'acadlix_cart_token'; // Replace with your actual cookie name
    
        // Check if the cookie exists
        if (isset($_COOKIE[$cookie_name])) {
            $cookie = sanitize_text_field( wp_unslash( $_COOKIE[$cookie_name] ) );
            $carts = CourseCart::where('cart_token', $cookie)->get();
            if($carts->count() > 0){
                foreach($carts as $cart){
                    if(CourseCart::where("course_id", $cart->course_id)->where('user_id', $user->ID)->first()){
                        $cart->delete();
                    }else{
                        $cart->update([
                            'cart_token' => null,
                            'token_expiry' => 0,
                            'user_id' => $user->ID
                        ]);
                    }
                }
            }
            // Unset the cookie by setting its expiration time to a past time
            setcookie($cookie_name, '', time() - 3600, "/");
            
            // Optionally, unset it from the $_COOKIE superglobal to ensure it's gone during this request
            if ( array_key_exists( $cookie_name, $_COOKIE ) ) {
                unset( $cookie );
            }
        }
    }

    public function acadlix_gutenberg_disable_cpt($use_block_editor, $post_type)
    {
        if($post_type === ACADLIX_COURSE_CPT){
            $use_block_editor = false;
        }
        return $use_block_editor;
    }

    public static function instance()
    {
        if (is_null(self::$_instance)) {
            self::$_instance = new self();
        }

        return self::$_instance;
    }
}