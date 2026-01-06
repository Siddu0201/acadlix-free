import { getCookie, setCookie } from '@acadlix/helpers/cookie';
import { PostAddWishlist, PostBuyNow, PostRemoveWishlist, PostStartNow } from '@acadlix/requests/front/FrontCourseRequest';
import axios from 'axios';
import React, { useEffect } from 'react'

const FrontButtonListener = () => {
    const course = {
        userId: acadlixListeners?.user_id ? Number(acadlixListeners?.user_id) : 0,
        ajaxUrl: acadlixListeners?.ajax_url,
        cookieName: "acadlix_cart_token",
        cookieExpiryName: "acadlix_cart_token_expiry",
        expiryDays: 7,
    };

    const buyNowMutation = PostBuyNow();
    const startNowMutation = PostStartNow();
    const addWishlistMutation = PostAddWishlist();
    const removeWishlistMutation = PostRemoveWishlist();

    let methods = {
        isUserLoggedIn(
            onSuccess = () => { },
            onError = () => { }
        ) {
            if (course.ajaxUrl) {
                const formData = new FormData();
                formData.append("action", "acadlix_check_user_login_status");
                formData.append("nonce", acadlixOptions?.nonces?.auth || '');
                axios.post(course.ajaxUrl, formData)
                    .then((response) => {
                        if (response) {
                            onSuccess(response);
                        }
                    })
                    .catch((error) => {
                        if (error) {
                            onError(error);
                        }
                    });
            } else {
                console.error("No AJAX URL provided.");
            }
        },
        getTokenWithExpiry: (res = {}) => {
            const tokenExpiry =
                new Date().getTime() + course?.expiryDays * 24 * 60 * 60 * 1000;
            const cartToken = res?.data?.user_id
                ? ""
                : getCookie(course?.cookieName) ||
                `${course?.cookieName}_${tokenExpiry}`;
            if (res?.data?.user_id == 0 && !getCookie(course?.cookieName)) {
                setCookie(course?.cookieName, cartToken, tokenExpiry);
            }
            return { cartToken, tokenExpiry };
        },
        buyNow: (btn) => {
            // console.log(btn);
            const courseId = btn.getAttribute("data-id");
            const text = btn.querySelector(".acadlix-action-button-text");
            const loader = btn.querySelector(".acadlix-btn-loader");

            if (text && loader) {
                text.style.display = "none";       // hide icon
                loader.style.display = "block";    // show loader
            }

            const callback = () => {
                if (text && loader) {
                    text.style.display = "block";       // show icon
                    loader.style.display = "none";    // hide loader
                }
            }

            const onSuccess = (data) => {
                if (data?.data?.status === "success" && data?.data?.redirect) {
                    if (typeof window !== "undefined" && window.location) {
                        window.location.href = data?.data?.redirect;
                    }
                }
                callback();
            }
            const onError = (error) => {
                console.error(error);
                callback();
            }
            if (course?.userId === 0) {
                methods?.isUserLoggedIn(
                    (response) => {
                        if (response && response.data && response.data.success) {
                            const { cartToken, tokenExpiry } = methods.getTokenWithExpiry(response?.data);
                            console.log(cartToken, tokenExpiry);
                            if (cartToken === undefined || tokenExpiry === undefined) {
                                console.error("Failed to get cart token and expiry.");
                                return;
                            }

                            buyNowMutation.mutate({
                                course_id: courseId,
                                user_id: response?.data?.data?.user_id,
                                cart_token: cartToken,
                                token_expiry: tokenExpiry
                            }, {
                                onSuccess: (data) => {
                                    onSuccess(data);
                                },
                                onError: (error) => {
                                    onError(error);
                                }
                            })
                        }
                    },
                    onError
                );
            } else {
                buyNowMutation.mutate({
                    course_id: courseId,
                    user_id: course?.userId,
                    cart_token: "",
                    token_expiry: 0
                }, {
                    onSuccess: (data) => {
                        onSuccess(data);
                    },
                    onError: (error) => {
                        onError(error);
                    }
                })
            }
        },
        startNow: (btn) => {
            const courseId = btn.getAttribute("data-id");
            const text = btn.querySelector(".acadlix-action-button-text");
            const loader = btn.querySelector(".acadlix-btn-loader");

            if (text && loader) {
                text.style.display = "none";       // hide icon
                loader.style.display = "block";    // show loader
            }

            const callback = () => {
                if (text && loader) {
                    text.style.display = "block";       // show icon
                    loader.style.display = "none";    // hide loader
                }
            }
            const onSuccess = (data) => {
                // console.log(data);
                if (data?.data?.status === "success" && data?.data?.redirect) {
                    if (typeof window !== "undefined" && window.location) {
                        window.location.href = data?.data?.redirect;
                    }
                }
                callback();
            }
            const onError = (error) => {
                console.error(error);
                callback();
            }
            if (course?.userId === 0) {
                methods?.isUserLoggedIn(
                    (response) => {
                        if (response && response.data && response.data.success) {
                            const { cartToken, tokenExpiry } = methods.getTokenWithExpiry(response?.data);
                            console.log(cartToken, tokenExpiry);
                            if (cartToken === undefined || tokenExpiry === undefined) {
                                console.error("Failed to get cart token and expiry.");
                                return;
                            }

                            startNowMutation.mutate({
                                course_id: courseId,
                                user_id: response?.data?.data?.user_id,
                                cart_token: cartToken,
                                token_expiry: tokenExpiry
                            }, {
                                onSuccess: (data) => {
                                    onSuccess(data);
                                },
                                onError: (error) => {
                                    onError(error);
                                }
                            })
                        }
                    },
                    onError
                );
            } else {
                startNowMutation.mutate({
                    course_id: courseId,
                    user_id: course?.userId,
                    cart_token: "",
                    token_expiry: 0
                }, {
                    onSuccess: (data) => {
                        onSuccess(data);
                    },
                    onError: (error) => {
                        onError(error);
                    }
                })
            }
        },
        addToWishlist: (btn) => {
            const courseId = btn.getAttribute("data-id");
            const userId = course?.userId;
            if (courseId === undefined) {
                console.error("Element does not have a 'data-id' attribute.");
                return;
            }
            if (userId === undefined) {
                console.error("User ID is undefined.");
                return;
            }
            if (!btn) {
                console.error("Element is null or undefined.");
                return;
            }
            const icon = btn.querySelector("i");
            const loader = btn.querySelector(".acadlix-btn-loader");

            if (!icon || !loader) {
                console.error("Element does not contain a wishlist icon or loader.");
                return;
            }

            if (icon && loader) {
                icon.style.display = "none";
                loader.style.display = "block";
            }
            addWishlistMutation.mutate({
                course_id: courseId,
                user_id: userId,
            }, {
                onSuccess: (data) => {
                    icon.style.display = "block";
                    loader.style.display = "none";
                    btn.parentElement.querySelector(`#remove-from-wishlist-${courseId}`).style.display = "flex";
                    btn.style.display = "none";
                },
                onError: (error) => {
                    icon.style.display = "block";
                    loader.style.display = "none";
                    console.error(error);
                }
            });
        },
        removeFromWishlist: (btn) => {
            const courseId = btn.getAttribute("data-id");
            const userId = course?.userId;
            if (courseId === undefined) {
                console.error("Element does not have a 'data-id' attribute.");
                return;
            }
            if (userId === undefined) {
                console.error("User ID is undefined.");
                return;
            }
            if (!btn) {
                console.error("Element is null or undefined.");
                return;
            }
            const icon = btn.querySelector("i");
            const loader = btn.querySelector(".acadlix-btn-loader");

            if (!icon || !loader) {
                console.error("Element does not contain a wishlist icon or loader.");
                return;
            }

            if (icon && loader) {
                icon.style.display = "none";
                loader.style.display = "block";
            }
            removeWishlistMutation.mutate({
                course_id: courseId,
                user_id: course?.userId,
            }, {
                onSuccess: (data) => {
                    icon.style.display = "block";
                    loader.style.display = "none";
                    btn.parentElement.querySelector(`#add-to-wishlist-${courseId}`).style.display = "flex";
                    btn.style.display = "none";
                },
                onError: (error) => {
                    icon.style.display = "block";
                    loader.style.display = "none";
                    console.error(error);
                }
            });
        },
    };

    methods = window?.acadlixHooks?.applyFilters?.(
        "acadlix.front_button_listener.methods",
        methods,
        course
    ) ?? methods;

    let buttonListeners = [
        {
            selector: ".acadlix-buy-now",
            handler: (btn) => methods?.buyNow(btn),
        },
        {
            selector: ".acadlix-start-now",
            handler: (btn) => methods?.startNow(btn),
        },
        {
            selector: ".acadlix-add-to-wishlist",
            handler: (btn) => methods?.addToWishlist(btn),
        },
        {
            selector: ".acadlix-remove-from-wishlist",
            handler: (btn) => methods?.removeFromWishlist(btn),
        },
    ];

    buttonListeners = window?.acadlixHooks?.applyFilters?.(
        "acadlix.front_button_listener.button_listeners",
        buttonListeners,
        methods,
        course
      ) ?? buttonListeners;
      
    useEffect(() => {
        buttonListeners.forEach(({ selector, handler }) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach((btn) => {
              btn.addEventListener("click", () => handler(btn));
            });
          });
    }, []);
    return null;
}

export default FrontButtonListener