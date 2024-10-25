(function ($) {
  const $e = $(document).find("#acadlix_all_course_page");
  const course_base = `${acadlixOptions?.api_url}/front-course`;

  const course = {
    user_id: acadlixOptions?.user_id ? Number(acadlixOptions?.user_id) : 0,
    course_base: course_base,
    ajax_url: `${acadlixOptions?.ajax_url}`,
    checkout_url: acadlixOptions?.checkout_url,
    add_to_cart_url: `${course_base}/add-to-cart`,
    buy_now_url: `${course_base}/buy-now`,
    start_now_url: `${course_base}/start-now`,
    add_wishlist_url: `${course_base}/add-wishlist`,
    remove_wishlist_url: `${course_base}/remove-wishlist`,
    cookie_name: "acadlix_cart_token",
    cookie_expiry_name: "acadlix_cart_token_expiry",
    expiry_days: 7,
  };

  const methods = {
    setCookie: (name, value, expiry) => {
      const expires = "expires=" + new Date(expiry).toUTCString();
      document.cookie = name + "=" + value + ";" + expires + ";path=/";
    },

    getCookie: (cname) => {
      let name = cname + "=";
      let decodedCookie = decodeURIComponent(document.cookie);
      let ca = decodedCookie.split(";");
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == " ") {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return "";
    },

    deleteCookie: (name) => {
      document.cookie =
        name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    },

    getTokenWithExpiry: (res = {}) => {
      let cartToken = "",
        tokenExpiry =
          new Date().getTime() + course?.expiry_days * 24 * 60 * 60 * 1000;
      if (res?.data?.user_id == 0) {
        cartToken = methods?.getCookie(course?.cookie_name);
        if (cartToken == "") {
          cartToken = `${course?.cookie_name}_${tokenExpiry}`;
          methods?.setCookie(course?.cookie_name, cartToken, tokenExpiry);
        } else {
          methods?.setCookie(course?.cookie_name, cartToken, tokenExpiry);
        }
      }
      return { cartToken, tokenExpiry };
    },

    is_user_logged_in: (
      onSuccess = (response) => {},
      onError = (error) => {}
    ) => {
      $.ajax({
        url: course?.ajax_url, // Use WordPress AJAX endpoint
        method: "POST",
        data: {
          action: "check_user_login_status",
        },
        success: (response) => {
          onSuccess(response);
        },
        error: (error) => {
          onError(error);
        },
      });
    },

    ajax_add_to_cart: (course_id = 0, user_id = 0, callback = () => {}) => {
      $.ajax({
        url: course?.add_to_cart_url,
        method: "POST",
        data: JSON.stringify({
          course_id: course_id,
          user_id: user_id,
        }),
        contentType: "application/json",
        success: (res) => {
          if ("success" === res?.status) {
            console.log(res);
          }
        },
        error: (err) => {
          console.error(err?.responseJSON);
        },
        complete: () => {
          callback();
        },
      });
    },

    ajax_buy_now: (
      course_id = 0,
      user_id = 0,
      cart_token = "",
      token_expiry = 0,
      callback = () => {}
    ) => {
      $.ajax({
        url: course?.buy_now_url,
        method: "POST",
        data: JSON.stringify({
          course_id: course_id,
          user_id: user_id,
          cart_token: cart_token,
          token_expiry: token_expiry,
        }),
        contentType: "application/json",
        success: (res) => {
          if ("success" === res?.status) {
            if (res?.redirect) {
              window.location.href = res?.redirect;
            }
          }
        },
        error: (err) => {
          console.error(err?.responseJSON);
        },
        complete: () => {
          callback();
        },
      });
    },

    ajax_start_now: (
      course_id = 0,
      user_id = 0,
      cart_token = "",
      token_expiry = 0,
      callback = () => {}
    ) => {
      $.ajax({
        url: course?.start_now_url,
        method: "POST",
        data: JSON.stringify({
          course_id: course_id,
          user_id: user_id,
          cart_token: cart_token,
          token_expiry: token_expiry,
        }),
        contentType: "application/json",
        success: (res) => {
          if ("success" === res?.status) {
            if (res?.redirect) {
              window.location.href = res?.redirect;
            }
          }
        },
        error: (err) => {
          console.error(err?.responseJSON);
        },
        complete: () => {
          callback();
        },
      });
    },

    add_to_cart: (elm) => {
      const id = $(elm).data("id");
      $(elm).find(".acadlix_action_button_text").hide();
      $(elm).find(".acadlix_btn_loader").show();
      if (course?.user_id == 0) {
        methods?.is_user_logged_in(
          (res) => {
            if (res?.success) {
              methods?.ajax_add_to_cart(id, res?.data?.user_id, () => {
                $(elm).find(".acadlix_action_button_text").show();
                $(elm).find(".acadlix_btn_loader").hide();
              });
            }
          },
          (err) => {
            console.error(err?.responseJSON);
          }
        );
      } else {
        methods?.ajax_add_to_cart(id, course?.user_id);
      }
    },

    buy_now: (elm) => {
      const id = $(elm).data("id");
      $(elm).find(".acadlix_action_button_text").hide();
      $(elm).find(".acadlix_btn_loader").show();
      const callback = () => {
        $(elm).find(".acadlix_action_button_text").show();
        $(elm).find(".acadlix_btn_loader").hide();
      };
      if (course?.user_id == 0) {
        methods?.is_user_logged_in(
          (res) => {
            if (res?.success) {
              let {cartToken, tokenExpiry} = methods?.getTokenWithExpiry(res);
              methods?.ajax_buy_now(
                id,
                res?.data?.user_id,
                cartToken,
                tokenExpiry,
                callback
              );
            }
          },
          (err) => {
            console.error(err?.responseJSON);
          }
        );
      } else {
        methods?.ajax_buy_now(id, course?.user_id, "", 0, callback);
      }
    },

    start_now: (elm) => {
      const id = $(elm).data("id");
      $(elm).find(".acadlix_action_button_text").hide();
      $(elm).find(".acadlix_btn_loader").show();
      const callback = () => {
        $(elm).find(".acadlix_action_button_text").show();
        $(elm).find(".acadlix_btn_loader").hide();
      };
      if (course?.user_id == 0) {
        methods?.is_user_logged_in(
          (res) => {
            if (res?.success) {
              let {cartToken, tokenExpiry} = methods?.getTokenWithExpiry(res);
              methods?.ajax_start_now(
                id,
                res?.data?.user_id,
                cartToken,
                tokenExpiry,
                callback
              );
            }
          },
          (err) => {
            console.error(err?.responseJSON);
          }
        );
      } else {
        methods?.ajax_start_now(id, course?.user_id, "", 0, callback);
      }
    },

    add_to_wishlist: (elm) => {
      const id = $(elm).data("id");
      $(elm).find("i").hide();
      $(elm).find(".acadlix_btn_loader").show();
      $.ajax({
        url: course?.add_wishlist_url,
        method: "POST",
        data: JSON.stringify({
          course_id: id,
          user_id: course?.user_id,
        }),
        contentType: "application/json",
        success: () => {
          $(elm).find("i").show();
          $(elm).find(".acadlix_btn_loader").hide();
          $(elm).css("display", "none");
          $(`#remove_from_wishlist_${id}`).css("display", "flex");
        },
        error: (err) => {
          $(elm).find("i").show();
          $(elm).find(".acadlix_btn_loader").hide();
          console.error(err?.responseJSON);
        },
      });
    },

    remove_from_wishlist: (elm) => {
      const id = $(elm).data("id");
      $(elm).find("i").hide();
      $(elm).find(".acadlix_btn_loader").show();
      $.ajax({
        url: course?.remove_wishlist_url,
        method: "DELETE",
        data: JSON.stringify({
          course_id: id,
          user_id: course?.user_id,
        }),
        contentType: "application/json",
        success: () => {
          $(elm).find("i").show();
          $(elm).find(".acadlix_btn_loader").hide();
          $(elm).css("display", "none");
          $(`#add_to_wishlist_${id}`).css("display", "flex");
        },
        error: (err) => {
          $(elm).find("i").show();
          $(elm).find(".acadlix_btn_loader").hide();
          console.error(err?.responseJSON);
        },
      });
    },
  };

  $e.find(".acadlix_add_to_cart").click(function () {
    methods?.add_to_cart(this);
  });

  $e.find(".acadlix_buy_now").click(function () {
    methods?.buy_now(this);
  });

  $e.find(".acadlix_start_now").click(function () {
    methods?.start_now(this);
  });

  $e.find(".acadlix_add_to_wishlist").click(function () {
    methods?.add_to_wishlist(this);
  });

  $e.find(".acadlix_remove_from_wishlist").click(function () {
    methods?.remove_from_wishlist(this);
  });
})(jQuery);
