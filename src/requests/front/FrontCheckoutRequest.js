import { useMutation, useQuery } from "@tanstack/react-query";
import { useInstance } from "@acadlix/helpers/util";

const base = "/front-checkout";

export const GetCheckoutCart = (user_id = 0, cart_token = "") => {
  const instance = useInstance();
  // return useQuery({
  //   queryKey: ["getCheckoutCart", user_id, cart_token],
  //   queryFn: () => {
  //     return instance.get(`${base}/get-checkout-cart`, {
  //       params: {
  //         user_id: user_id,
  //         cart_token: cart_token,
  //         _t: Date.now(),
  //       },
  //     });
  //   },
  // });
  // Allow overriding the fetch logic before running it
  const fetchFn =
    window?.acadlixHooks?.applyFilters?.(
      "acadlix.front.checkout.fetch_cart",
      async ({ user_id, cart_token, instance }) => {
        // Default fetch logic
        return instance.get(`${base}/get-checkout-cart`, {
          params: {
            user_id,
            cart_token,
            _t: Date.now(),
          },
          headers: {
            "X-WP-Nonce": acadlixOptions?.nonce,
          },
        });
      },
      { user_id, cart_token, instance, base }
    ) ??
    (async ({ user_id, cart_token, instance }) => {
      // Fallback if filter not available
      return instance.get(`${base}/get-checkout-cart`, {
        params: {
          user_id,
          cart_token,
          _t: Date.now(),
        },
        headers: {
          "X-WP-Nonce": acadlixOptions?.nonce,
        },
      });
    });
  return useQuery({
    queryKey: ["getCheckoutCart", user_id, cart_token],
    queryFn: () => fetchFn({ user_id, cart_token, instance }),
  });
};

export const DeleteCourseFromCart = (id) => {
  const instance = useInstance();
  return useMutation({
    mutationFn: () => {
      return instance.delete(`${base}/delete-course-from-cart`, {
        headers: {
          "X-WP-Nonce": acadlixOptions?.nonce,
        },
        data: { id: id },
      });
    },
  });
};

export const PostCheckoutRazorpay = () => {
  const instance = useInstance();
  return useMutation({
    mutationFn: (data) => {
      return instance.post(`${base}/post-checkout-razorpay`, data, {
        headers: {
          "X-WP-Nonce": acadlixOptions?.nonce,
        },
      });
    },
  });
};

export const PostVerifyRazorpayPayment = () => {
  const instance = useInstance();
  return useMutation({
    mutationFn: (data) => {
      return instance.post(`${base}/post-verify-razorpay-payment`, data, {
        headers: {
          "X-WP-Nonce": acadlixOptions?.nonce,
        },
      });
    },
  });
};

export const PostCheckoutPaypal = () => {
  const instance = useInstance();
  return useMutation({
    mutationFn: (data) => {
      return instance.post(`${base}/post-checkout-paypal`, data, {
        headers: {
          "X-WP-Nonce": acadlixOptions?.nonce,
        },
      });
    },
  });
};

export const PostCheckoutPayu = () => {
  const instance = useInstance();
  return useMutation({
    mutationFn: (data) => {
      return instance.post(`${base}/post-checkout-payu`, data, {
        headers: {
          "X-WP-Nonce": acadlixOptions?.nonce,
        },
      });
    },
  });
};

export const PostFreeCheckout = () => {
  const instance = useInstance();
  return useMutation({
    mutationFn: (data) => {
      return instance.post(`${base}/post-free-checkout`, data, {
        headers: {
          "X-WP-Nonce": acadlixOptions?.nonce,
        },
      });
    },
  });
};

export const PostCheckoutStripe = () => {
  const instance = useInstance();
  return useMutation({
    mutationFn: (data) => {
      return instance.post(`${base}/post-checkout-stripe`, data, {
        headers: {
          "X-WP-Nonce": acadlixOptions?.nonce,
        },
      });
    },
  });
};

export const PostCheckoutOfflinePayment = () => {
  const instance = useInstance();
  return useMutation({
    mutationFn: (data) => {
      return instance.post(`${base}/post-checkout-offline-payment`, data, {
        headers: {
          "X-WP-Nonce": acadlixOptions?.nonce,
        },
      });
    },
  });
};