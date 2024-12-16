(function ($) {
  const $e = $(document).find(".acadlix-course-action-buttons");
  const courseBase = `${acadlixOptions?.api_url}/front-course`;

  const course = {
    userId: acadlixOptions?.user_id ? Number(acadlixOptions?.user_id) : 0,
    courseBase: courseBase,
    ajaxUrl: `${acadlixOptions?.ajax_url}`,
    checkoutUrl: acadlixOptions?.checkout_url,
    addToCartUrl: `${courseBase}/add-to-cart`,
    buyNowUrl: `${courseBase}/buy-now`,
    startNowUrl: `${courseBase}/start-now`,
    addWishlistUrl: `${courseBase}/add-wishlist`,
    removeWishlistUrl: `${courseBase}/remove-wishlist`,
    cookieName: "acadlix_cart_token",
    cookieExpiryName: "acadlix_cart_token_expiry",
    expiryDays: 7,
  };

  const methods = {
    /**
     * Sets a cookie with the given name, value, and expiration date.
     * 
     * @param {string} name - The name of the cookie to set.
     * @param {*} value - The value of the cookie to set.
     * @param {number} expiry - The number of days until the cookie expires.
     */
    setCookie: (name, value, expiry) => {
      const expires = "expires=" + new Date(expiry).toUTCString();
      document.cookie = name + "=" + value + ";" + expires + ";path=/";
    },

    /**
     * Retrieves the value of a specified cookie from the browser.
     * 
     * @param {string} cname - The name of the cookie to retrieve.
     * @returns {string} - The value of the cookie if found; otherwise, an empty string.
     */
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

    /**
     * Deletes a cookie with the given name by setting its value to an empty string
     * and the expiration date to a date in the past.
     * @param {string} name - The name of the cookie to delete.
     */
    deleteCookie: (name) => document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`,

    /**
     * Gets the cart token with its expiry time in milliseconds.
     * If the user is not logged in, it first checks if the cart token exists in the cookie.
     * If it doesn't exist, it generates a new token and sets it as a cookie.
     * If the user is logged in, the cart token is reset.
     * @param {object} [res={}] - The response from the AJAX request.
     * @returns {object} - An object containing the cart token and its expiry time in milliseconds.
     */
    getTokenWithExpiry: (res = {}) => {
      const tokenExpiry =
        new Date().getTime() + course?.expiryDays * 24 * 60 * 60 * 1000;
      const cartToken = res?.data?.user_id
        ? ""
        : methods?.getCookie(course?.cookieName) ||
        `${course?.cookieName}_${tokenExpiry}`;
      if (res?.data?.user_id == 0 && !methods?.getCookie(course?.cookieName)) {
        methods?.setCookie(course?.cookieName, cartToken, tokenExpiry);
      }
      return { cartToken, tokenExpiry };
    },


    /**
     * Checks if the user is logged in using an AJAX request.
     *
     * @param {function} [onSuccess] - A callback function that will be called if the request is successful.
     * @param {function} [onError] - A callback function that will be called if the request fails.
     */
    isUserLoggedIn(
      onSuccess = (response) => { },
      onError = (error) => { }
    ) {
      if (course.ajaxUrl) {
        $.post(course.ajaxUrl, {
          action: "check_user_login_status",
        })
          .done((response) => {
            if (response) {
              onSuccess(response);
            }
          })
          .fail((error) => {
            if (error) {
              onError(error);
            }
          });
      } else {
        console.error("No AJAX URL provided.");
      }
    },


    /**
     * Adds a course to the cart using an AJAX request.
     *
     * @param {number} [courseId=0] - The ID of the course to add to the cart.
     * @param {number} [userId=0] - The ID of the user adding the course to the cart.
     * @param {function} [callback=() => {}] - A callback function that will be called when the request is complete.
     * @returns {void}
     */
    ajaxAddToCart: (courseId = 0, userId = 0, callback = () => { }) => {
      if (courseId == null || userId == null || !course?.addToCartUrl) {
        console.error("Missing required parameters.");
        return;
      }

      try {
        $.ajax({
          url: course.addToCartUrl,
          method: "POST",
          data: JSON.stringify({ courseId, userId }),
          contentType: "application/json",
          success: (response) => {
            if (response && response.status === "success") {
              callback(response);
            } else if (response) {
              console.error("Unexpected response:", response);
            } else {
              console.error("No response received.");
            }
          },
          error: (error) => {
            console.error("Error occurred:", error.responseJSON || error);
          },
          complete: () => {
            callback();
          },
        });
      } catch (error) {
        console.error("An unexpected error occurred:", error);
      }
    },

    /**
     * Adds a course to the cart and redirects to the checkout page if the operation is successful.
     *
     * @param {number} [courseId=0] - The ID of the course to add to the cart.
     * @param {number} [userId=0] - The ID of the user adding the course to the cart.
     * @param {string} [cartToken=""] - The cart token to add the course to.
     * @param {number} [tokenExpiry=0] - The expiry time of the cart token in milliseconds.
     * @param {function} [callback=() => {}] - A callback function that will be called after the AJAX request is complete.
     */
    ajaxBuyNow: (courseId = 0, userId = 0, cartToken = "", tokenExpiry = 0, callback = () => { }) => {
      const data = {
        course_id: courseId,
        user_id: userId,
        cart_token: cartToken,
        token_expiry: tokenExpiry
      };

      try {
        $.ajax({
          url: course?.buyNowUrl,
          method: "POST",
          data: JSON.stringify(data),
          contentType: "application/json",
          success: (response) => {
            if (response?.status === "success" && response?.redirect) {
              if (typeof window !== "undefined" && window.location) {
                window.location.href = response?.redirect;
              }
            }

            callback();
          },
          error: (error) => {
            if (error?.responseJSON) {
              console.error("Error occurred:", error.responseJSON);
            } else {
              console.error("Error occurred:", error);
            }
            callback();
          },
        });
      } catch (error) {
        console.error("An unexpected error occurred:", error);
      }
    },

    /**
     * Makes an AJAX request to start a course.
     *
     * @param {number} [courseId=0] - The ID of the course to start.
     * @param {number} [userId=0] - The ID of the user starting the course.
     * @param {string} [cartToken=""] - The cart token to associate with the course.
     * @param {number} [tokenExpiry=0] - The expiry time of the cart token in milliseconds.
     * @param {function} [callback=() => {}] - A callback function that will be called after the AJAX request is complete.
     * @returns {void}
     */
    ajaxStartNow: (
      courseId = 0,
      userId = 0,
      cartToken = "",
      tokenExpiry = 0,
      callback = () => { }
    ) => {

      const data = {
        course_id: courseId,
        user_id: userId,
        cart_token: cartToken,
        token_expiry: tokenExpiry
      }
      $.ajax({
        url: course?.startNowUrl,
        method: "POST",
        data: JSON.stringify(data),
        contentType: "application/json",
        success: (response) => {
          if (response && response?.status === "success" && response?.redirect) {
            window.location.href = response?.redirect;
          }
          callback();
        },
        error: (error) => {
          console.error("Error occurred:", error.responseJSON);
        },
        complete: () => {
          callback();
        },
      });
    },


    addToCart: (elm) => {
      const id = $(elm).data("id");
      $(elm).find(".acadlix-action-button-text").hide();
      $(elm).find(".acadlix-btn-loader").show();
      if (course?.user_id == 0) {
        methods?.isUserLoggedIn(
          (res) => {
            if (res?.success) {
              methods?.ajaxAddToCart(id, res?.data?.user_id, () => {
                $(elm).find(".acadlix-action-button-text").show();
                $(elm).find(".acadlix-btn-loader").hide();
              });
            }
          },
          (err) => {
            console.error(err?.responseJSON);
          }
        );
      } else {
        methods?.ajaxAddToCart(id, course?.user_id);
      }
    },


    /**
     * Handles the click event of a "Buy Now" button.
     * Checks if the user is logged in using an AJAX request.
     * If the user is logged in, makes an AJAX request to add the course to cart.
     * If the user is not logged in, makes an AJAX request to check the user's login status.
     * If the user's login status is successful, makes an AJAX request to add the course to cart.
     * @param {Object} element - The element that was clicked.
     */
    buyNow: (element) => {
      const courseId = $(element)?.data("id");
      if (courseId === undefined) {
        console.error("Element does not have a 'data-id' attribute.");
        return;
      }

      const $element = $(element);
      if (!$element) {
        console.error("Element is null or undefined.");
        return;
      }

      const $btnText = $element.find(".acadlix-action-button-text");
      const $btnLoader = $element.find(".acadlix-btn-loader");
      $btnText.hide();
      $btnLoader.show();

      const callback = () => {
        $btnText.show();
        $btnLoader.hide();
      };

      if (course.userId === 0) {
        methods?.isUserLoggedIn(
          (response) => {
            if (response && response.success) {
              const { cartToken, tokenExpiry } = methods.getTokenWithExpiry(response);
              if (cartToken === undefined || tokenExpiry === undefined) {
                console.error("Failed to get cart token and expiry.");
                return;
              }

              methods?.ajaxBuyNow(courseId, response.data.userId, cartToken, tokenExpiry, callback);
            }
          },
          (error) => {
            console.error(error?.responseJSON);
          }
        );
      } else {
        methods?.ajaxBuyNow(courseId, course.userId, "", 0, callback);
      }
    },


    /**
     * Handles the click event of a "Start Now" button.
     * Checks if the user is logged in using an AJAX request.
     * If the user is logged in, makes an AJAX request to start the course.
     * If the user is not logged in, makes an AJAX request to check the user's login status.
     * If the user's login status is successful, makes an AJAX request to start the course.
     * @param {Object} element - The element that was clicked.
     */
    startNow: (element) => {
      const courseId = $(element)?.data("id");
      if (courseId === undefined) {
        console.error("Element does not have a 'data-id' attribute.");
        return;
      }

      const $element = $(element);
      if (!$element) {
        console.error("Element is null or undefined.");
        return;
      }

      const $btnText = $element.find(".acadlix-action-button-text");
      const $btnLoader = $element.find(".acadlix-btn-loader");
      $btnText.hide();
      $btnLoader.show();

      const callback = () => {
        $btnText.show();
        $btnLoader.hide();
      };

      if (course.userId === 0) {
        methods?.isUserLoggedIn(
          (response) => {
            if (response && response.success) {
              const { cartToken, tokenExpiry } = methods?.getTokenWithExpiry(response);
              if (cartToken === undefined || tokenExpiry === undefined) {
                console.error("Failed to get cart token and expiry.");
                return;
              }

              methods?.ajaxStartNow(courseId, response.data.userId, cartToken, tokenExpiry, callback);
            }
          },
          (error) => {
            console.error(error?.responseJSON);
          }
        );
      } else {
        methods?.ajaxStartNow(courseId, course.userId, "", 0, callback);
      }
    },


    /**
     * Handles the click event of an "Add to Wishlist" button.
     * Hides the wishlist icon and shows a loading spinner.
     * Sends an AJAX POST request to add the course to the user's wishlist.
     * On success, shows the wishlist icon, hides the loading spinner,
     * and updates the display to show the remove from wishlist button.
     * Logs any errors to the console.
     * @param {Object} element - The element that was clicked.
     */
    addToWishlist: (element) => {
      const courseId = $(element)?.data("id");
      if (courseId === undefined) {
        console.error("Element does not have a 'data-id' attribute.");
        return;
      }

      const $element = $(element);
      if (!$element) {
        console.error("Element is null or undefined.");
        return;
      }

      const $wishlistIcon = $element.find("i");
      const $loader = $element.find(".acadlix-btn-loader");

      if (!$wishlistIcon || !$loader) {
        console.error("Element does not contain a wishlist icon or loader.");
        return;
      }

      $wishlistIcon.hide();
      $loader.show();

      $.ajax({
        url: course?.addWishlistUrl,
        method: "POST",
        data: JSON.stringify({
          course_id: courseId,
          user_id: course?.userId,
        }),
        contentType: "application/json",
        success: () => {
          $wishlistIcon.show();
          $loader.hide();
          $element.siblings(`#remove-from-wishlist-${courseId}`).css("display", "flex");
          $element.css("display", "none");
        },
        error: (error) => {
          $wishlistIcon.show();
          $loader.hide();
          console.error(error?.responseJSON);
        },
      });
    },


    /**
     * Handles the click event of a "Remove from Wishlist" button.
     * Hides the wishlist icon and shows a loading spinner.
     * Sends an AJAX DELETE request to remove the course from the user's wishlist.
     * On success, shows the wishlist icon, hides the loading spinner,
     * and updates the display to show the add to wishlist button.
     * @param {Object} element - The element that was clicked.
     */
    removeFromWishlist(element) {
      const courseId = $(element)?.data("id");
      if (courseId === undefined) {
        throw new Error("Element does not contain a valid course ID.");
      }

      const $element = $(element);
      if (!$element) {
        console.error("Element is null or undefined.");
        return;
      }
      const $icon = $element.find("i");
      const $loader = $element.find(".acadlix-btn-loader");

      $icon.hide();
      $loader.show();

      $.ajax({
        url: course?.removeWishlistUrl,
        method: "DELETE",
        data: JSON.stringify({
          course_id: courseId,
          user_id: course.userId,
        }),
        contentType: "application/json",
        success: () => {
          $icon.show();
          $loader.hide();
          $element.siblings(`#add-to-wishlist-${courseId}`).css("display", "flex");
          $element.css("display", "none");
        },
        error: (error) => {
          $icon.show();
          $loader.hide();
          throw error;
        },
      });
    },
  };

  $e.find(".acadlix-add-to-cart").click(function () {
    methods?.addToCart(this);
  });

  $e.find(".acadlix-buy-now").click(function () {
    methods?.buyNow(this);
  });

  $e.find(".acadlix-start-now").click(function () {
    methods?.startNow(this);
  });

  $e.find(".acadlix-add-to-wishlist").click(function () {
    methods?.addToWishlist(this);
  });

  $e.find(".acadlix-remove-from-wishlist").click(function () {
    methods?.removeFromWishlist(this);
  });
})(jQuery);


