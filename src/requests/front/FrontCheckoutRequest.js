import { useMutation, useQuery } from "@tanstack/react-query";
import { useInstance } from "../../helpers/util";

const base = "/front-checkout";

export const GetCheckoutCart = (user_id = 0, cart_token = "") => {
  const instance = useInstance();
  return useQuery({
    queryKey: ["getCheckoutCart", user_id, cart_token],
    queryFn: () => {
      return instance.get(`${base}/get-checkout-cart`, {
        params: {
          user_id: user_id,
          cart_token: cart_token,
        },
      });
    },
  });
};

export const DeleteCourseFromCart = () => {
  const instance = useInstance();
  return useMutation({
    mutationFn: (data) => {
      return instance.delete(`${base}/delete-course-from-cart`, {
        headers: {
          "X-WP-Nonce": acadlixOptions?.nonce,
        },
        data: data,
      });
    },
  });
};

export const PostCheckoutRazorpay = () => {
  const instance = useInstance();
  return useMutation({
    mutationFn: (data) => {
      return instance.post(`${base}/post-checkout-razorpay`, data);
    },
  });
};

export const PostVerifyRazorpayPayment = () => {
  const instance = useInstance();
  return useMutation({
    mutationFn: (data) => {
      return instance.post(`${base}/post-verify-razorpay-payment`, data);
    },
  });
};

export const PostFailRazorpayPayment = () => {
  const instance = useInstance();
  return useMutation({
    mutationFn: (data) => {
      return instance.post(`${base}/post-fail-razorpay-payment`, data);
    },
  });
};

export const PostCheckoutPaypal = () => {
  const instance = useInstance();
  return useMutation({
    mutationFn: (data) => {
      return instance.post(`${base}/post-checkout-paypal`, data);
    },
  });
};

export const PostCheckoutPayu = () => {
  const instance = useInstance();
  return useMutation({
    mutationFn: (data) => {
      return instance.post(`${base}/post-checkout-payu`, data);
    },
  });
};
