import { getCookie, setCookie } from '@acadlix/helpers/cookie';
import { PostAddWishlist, PostBuyNow, PostLoadMoreReviews, PostRemoveWishlist, PostStartNow, PostSubmitReview } from '@acadlix/requests/front/FrontCourseRequest';
import axios from 'axios';
import React, { useEffect } from 'react'
import toast from 'react-hot-toast';

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
    const submitReviewMutation = PostSubmitReview();
    const loadMoreReviewsMutation = PostLoadMoreReviews();

    let methods = {
        isUserLoggedIn: (
            onSuccess = () => { },
            onError = () => { }
        ) => {
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
        toggleAddEditReviewForm: (btn) => {
            const reviewFormContainer = document.getElementById("acadlix-review-form-container");
            if (reviewFormContainer) {
                if (reviewFormContainer.style.display === "none" || reviewFormContainer.style.display === "") {
                    reviewFormContainer.style.display = "block";
                    reviewFormContainer.style.maxHeight = "0";
                    reviewFormContainer.style.overflow = "hidden";
                    reviewFormContainer.style.transition = "max-height 0.3s ease-in-out";

                    // Trigger reflow to ensure transition works
                    reviewFormContainer.offsetHeight;

                    reviewFormContainer.style.maxHeight = reviewFormContainer.scrollHeight + "px";
                } else {
                    reviewFormContainer.style.maxHeight = reviewFormContainer.scrollHeight + "px";

                    // Trigger reflow
                    reviewFormContainer.offsetHeight;

                    reviewFormContainer.style.maxHeight = "0";

                    // Wait for transition to complete before hiding
                    setTimeout(() => {
                        reviewFormContainer.style.display = "none";
                    }, 300); // Match transition duration
                }
            }
        },
        updateRatingStars: (container, rating) => {
            if (!container) return;

            const stars = container.querySelectorAll('i[data-rating-value]');
            stars.forEach((star) => {
                const value = Number(star.getAttribute('data-rating-value'));
                if (value <= rating) {
                    star.classList.remove('far');
                    star.classList.add('fas');
                } else {
                    star.classList.remove('fas');
                    star.classList.add('far');
                }
            });
        },
        ratingMouseOver: (star) => {
            const ratingValue = Number(star.getAttribute("data-rating-value"));
            const container = star.closest('.acadlix-ratings-selectable');

            methods.updateRatingStars(container, ratingValue);
        },
        ratingClick: (star) => {
            const ratingValue = Number(star.getAttribute("data-rating-value"));
            const container = star.closest('.acadlix-ratings-selectable');
            const input = container?.querySelector('#acadlix_review_rating');

            if (input) {
                input.value = ratingValue;
            }

            methods.updateRatingStars(container, ratingValue);
        },
        ratingMouseOut: (star) => {
            const container = star.closest('.acadlix-ratings-selectable');
            const input = container?.querySelector('#acadlix_review_rating');
            const savedRating = Number(input?.value || 0);

            methods.updateRatingStars(container, savedRating);
        },
        submitReview: (btn) => {
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
            const form = btn.closest('form');
            if (!form) return;
            const review_text = form.querySelector('textarea[name="acadlix_review_text"]')?.value;
            const ratingInput = form.querySelector('input[name="acadlix_review_rating"]')?.value;
            const courseId = form.querySelector('input[name="acadlix_course_id"]')?.value;
            const userId = form.querySelector('input[name="acadlix_user_id"]')?.value;
            const reviewId = form.querySelector('input[name="acadlix_review_id"]')?.value;
            console.log({ review_text, ratingInput, courseId, userId, reviewId });
            if (!review_text || ratingInput === undefined || ratingInput === "0") {
                alert("Rating and review are required.");
                return;
            }

            const onSuccess = (data) => {
                if (data?.data?.status === "success") {
                    toast.success(data?.data?.message || "Review submitted successfully.");
                    window.location.reload();
                }
                callback();
            }

            const onError = (error) => {
                console.error(error);
                callback();
            }

            submitReviewMutation.mutate({
                review_id: reviewId,
                course_id: courseId,
                user_id: userId,
                rating: ratingInput,
                review_text: review_text,
            }, {
                onSuccess: (data) => {
                    onSuccess(data);
                },
                onError: (error) => {
                    onError(error);
                }
            });
        },
        loadMoreReview: (btn) => {
            const courseId = btn.getAttribute("data-course-id");
            const currentPage = parseInt(btn.getAttribute("data-current-page")) || 1;
            const totalPages = parseInt(btn.getAttribute("data-total-pages")) || 1;
            const skipCount = parseInt(btn.getAttribute("data-skip-count")) || 0;
            const takeCount = parseInt(btn.getAttribute("data-take-count")) || 5;
            const paginationCount = parseInt(btn.getAttribute("data-pagination-count")) || 5;
            const reviewListContainer = document.getElementById("acadlix-course-reviews-list");
            if (!courseId) {
                console.error("Course ID is missing.");
                return;
            }

            if (!currentPage || !totalPages) {
                console.error("Current page or total pages is invalid.");
                return;
            }

            if (!skipCount || !takeCount) {
                console.error("Skip count or take count is invalid.");
                return;
            }

            if (currentPage >= totalPages) {
                console.log("No more reviews to load.");
                return;
            }

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
                if (data?.data?.reviews_html) {
                    reviewListContainer.insertAdjacentHTML('beforeend', data?.data?.reviews_html);
                }
                if (data?.data?.next_page) {
                    btn.setAttribute("data-current-page", data?.data?.next_page);
                    btn.setAttribute("data-skip-count", data?.data?.next_page * paginationCount);
                    btn.setAttribute("data-take-count", (data?.data?.next_page + 1) * paginationCount);
                    if (data?.data?.next_page >= totalPages) {
                        btn.style.display = "none";
                    }
                }
                callback();
            }
            const onError = (error) => {
                console.error(error);
                callback();
            }

            loadMoreReviewsMutation.mutate({
                course_id: courseId,
                current_page: currentPage,
                skip_count: skipCount,
                take_count: takeCount,
            }, {
                onSuccess: (data) => {
                    onSuccess(data);
                },
                onError: (error) => {
                    onError(error);
                }
            });
        }
    };

    methods = window?.acadlixHooks?.applyFilters?.(
        "acadlix.front_button_listener.methods",
        methods,
        course
    ) ?? methods;

    let buttonListeners = [
        {
            selector: ".acadlix-buy-now",
            event: "click",
            handler: (btn) => methods?.buyNow(btn),
        },
        {
            selector: ".acadlix-start-now",
            event: "click",
            handler: (btn) => methods?.startNow(btn),
        },
        {
            selector: ".acadlix-add-to-wishlist",
            event: "click",
            handler: (btn) => methods?.addToWishlist(btn),
        },
        {
            selector: ".acadlix-remove-from-wishlist",
            event: "click",
            handler: (btn) => methods?.removeFromWishlist(btn),
        },
        {
            selector: "#acadlix-add-edit-review-button",
            event: "click",
            handler: (btn) => methods?.toggleAddEditReviewForm(btn),
        },
        {
            selector: ".acadlix-ratings-selectable i",
            event: "mouseover",
            handler: (btn) => methods?.ratingMouseOver(btn),
        },
        {
            selector: ".acadlix-ratings-selectable i",
            event: "click",
            handler: (btn) => methods?.ratingClick(btn),
        },
        {
            selector: ".acadlix-ratings-selectable",
            event: "mouseout",
            handler: (btn) => methods?.ratingMouseOut(btn),
        },
        {
            selector: ".acadlix-submit-review-btn",
            event: "click",
            handler: (btn, e) => {
                e.preventDefault();
                methods?.submitReview(btn);
            }
        },
        {
            selector: "#acadlix-load-review-button",
            event: "click",
            handler: (btn) => methods?.loadMoreReview(btn),
        },
    ];

    buttonListeners = window?.acadlixHooks?.applyFilters?.(
        "acadlix.front_button_listener.button_listeners",
        buttonListeners,
        methods,
        course
    ) ?? buttonListeners;

    useEffect(() => {
        buttonListeners.forEach(({ selector, handler, event = "click" }) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach((btn) => {
                btn.addEventListener(event, (e) => handler(btn, e));
            });
        });
    }, []);
    return null;
}

export default FrontButtonListener