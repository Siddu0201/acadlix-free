import React from "react";
import {
  GetCheckoutCart,
  PostCheckoutPaypal,
  PostCheckoutPayu,
  PostCheckoutRazorpay,
  PostFailRazorpayPayment,
  PostFreeCheckout,
  PostVerifyRazorpayPayment,
} from "../../requests/front/FrontCheckoutRequest";
import { Box, CircularProgress, Link, Typography } from "@mui/material";
import Grid from '@mui/material/Grid';
import BillingDetail from "./BillingDetail";
import PaymentMethod from "./PaymentMethod";
import OrderDetail from "./OrderDetail";
import OrderSummary from "./OrderSummary";
import { useForm } from "react-hook-form";
import parse from "html-react-parser";
import toast from "react-hot-toast";
import UserAuth from "@acadlix/modules/user-auth/UserAuth";
import { __ } from "@wordpress/i18n";
import { formatPrice } from "@acadlix/helpers/util";

const Checkout = () => {
  const getUserMetaValue = (key = "") => {
    return acadlixOptions?.user?.user_metas?.find((m) => m?.meta_key === key)
      ?.meta_value;
  };

  const methods = useForm({
    defaultValues: {
      is_checkout_locked: false,
      is_checkout_loading: false,
      login_modal: false,
      billing_info: {
        first_name: getUserMetaValue("first_name") ?? "",
        last_name: getUserMetaValue("last_name") ?? "",
        email: acadlixOptions?.user?.user_email ?? "",
        phonecode: getUserMetaValue("_acadlix_profile_phonecode") ?? null,
        phone_number: getUserMetaValue("_acadlix_profile_phone_number") ?? "",
        address: getUserMetaValue("_acadlix_profile_address") ?? "",
        user_url: acadlixOptions?.user?.user_url ?? "",
        country: getUserMetaValue("_acadlix_profile_country") ?? null,
        city: getUserMetaValue("_acadlix_profile_city") ?? "",
        zip_code: getUserMetaValue("_acadlix_profile_zip_code") ?? "",
      },
      payment_method: "",
      user_id: acadlixOptions?.user_id,
      is_user_logged_in: acadlixOptions?.user_id > 0 ? true : false,
      cart_token: acadlixOptions?.cart_token,
      cart: [],
      order_items: [],
      total_amount: 0,
      //Payment Gatway
      currency: acadlixOptions?.settings?.acadlix_currency,
      razorpay: acadlixOptions?.settings?.acadlix_razorpay_active === "yes",
      razorpay_client_id: acadlixOptions?.settings?.acadlix_razorpay_client_id,
      razorpay_secret_key:
        acadlixOptions?.settings?.acadlix_razorpay_secret_key,
      paypal: acadlixOptions?.settings?.acadlix_paypal_active === "yes",
      paypal_client_id: acadlixOptions?.settings?.acadlix_paypal_client_id,
      paypal_secret_key: acadlixOptions?.settings?.acadlix_paypal_secret_key,
      paypal_sandbox:
        acadlixOptions?.settings?.acadlix_paypal_sandbox === "yes",
      payu: acadlixOptions?.settings?.acadlix_payu_active === "yes",
      payu_merchant_key:
        acadlixOptions?.settings?.acadlix_payu_merchant_key,
      payu_salt: acadlixOptions?.settings?.acadlix_payu_salt,
      payu_sandbox: acadlixOptions?.settings?.acadlix_payu_sandbox === "yes",
    },
  });

  const getCart = GetCheckoutCart(
    methods?.watch("user_id"),
    methods?.watch("cart_token")
  );

  const setCartData = (cart = []) => {
    methods?.setValue("is_checkout_locked", false, { shouldDirty: true });
    methods?.setValue("cart", [...cart], {
      shouldDirty: true,
    });

    methods?.setValue(
      "order_items",
      cart?.map((c) => {
        let price = formatPrice(
          Boolean(Number(c?.course?.rendered_metas?.enable_sale_price)) ? c?.course?.rendered_metas?.sale_price : c?.course?.rendered_metas?.price
        );
        let tax = 0;
        if (c?.course?.rendered_metas?.tax !== 0 && c?.course?.rendered_metas?.tax_percent !== 0) {
          tax = formatPrice((price * c?.course?.rendered_metas?.tax_percent) / 100);
        }
        return {
          course_id: c?.course_id,
          course_title: c?.course?.post_title,
          quantity: 1,
          price: price,
          discount: 0,
          price_after_discount: 0,
          tax: tax,
          price_after_tax: price + tax,
        };
      })
    );

    methods?.setValue(
      "total_amount",
      formatPrice(
        methods
          ?.watch("order_items")
          ?.reduce((total, c) => total + c?.price_after_tax, 0)
      ),
      { shouldDirty: true }
    );
  };

  React.useLayoutEffect(() => {
    if (!getCart?.isFetching && getCart?.data?.data?.cart?.length > 0) {
      setCartData(getCart?.data?.data?.cart);
    }
  }, [getCart?.isFetching, getCart?.data?.data?.cart]);

  React.useEffect(() => {
    if (!methods?.watch("is_user_logged_in") && methods?.watch("cart")?.length > 0) {
      methods?.setValue("login_modal", true, { shouldDirty: true });
    }
  }, [methods?.watch("cart")?.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const convertToRazorpayUnit = (amount = 0) => {
    if (isNaN(amount)) {
      throw new Error(__('Invalid amount', 'acadlix'));
    }
    const decimalPlaces =
      acadlixOptions?.settings?.acadlix_number_of_decimals ?? 2;
    const multiplier = Math.pow(10, decimalPlaces);
    return Math.round(
      Number(
        amount
          .toString()
          .replace(
            acadlixOptions?.settings?.acadlix_thousand_separator || "",
            ""
          )
      ) * multiplier
    );
  };

  const razorpayMutation = PostCheckoutRazorpay();
  const verifyRazorpayMutation = PostVerifyRazorpayPayment();
  const failRazorpayMutation = PostFailRazorpayPayment();
  const handleRazorpay = (data = {}) => {
    razorpayMutation?.mutate(
      {
        ...data,
        amount: convertToRazorpayUnit(methods?.watch("total_amount")),
      },
      {
        onSuccess: (data) => {
          methods?.setValue("is_checkout_loading", false, {
            shouldDirty: true,
          });
          if (data?.data?.success) {
            const options = {
              key: methods?.watch("razorpay_client_id"), // Replace with your Razorpay key ID
              amount: convertToRazorpayUnit(methods?.watch("total_amount")), // Amount in paise (1000 paise = INR 10)
              currency: methods?.watch("currency"),
              name: acadlixOptions?.site_title,
              description: "Buy now",
              order_id: data?.data?.data?.id, // Get this order ID from your backend
              handler: function (response) {
                methods?.setValue("is_checkout_loading", true, {
                  shouldDirty: true,
                });
                verifyRazorpayMutation?.mutate(response, {
                  onSuccess: (data) => {
                    if (data?.data?.success) {
                      if (data?.data?.data?.razorpay_order_id) {
                        window.location.href = `${acadlixOptions?.thankyou_url}?token=${data?.data?.data?.razorpay_order_id}`;
                      }
                    }
                    methods?.setValue("is_checkout_loading", false, {
                      shouldDirty: true,
                    });
                  },
                  onError: (data) => {
                    methods?.setValue("is_checkout_loading", false, {
                      shouldDirty: true,
                    });
                  },
                });
                // Send payment response to your server for verification
              },
              prefill: {
                name: methods?.watch("billing_info.first_name"),
                email: methods?.watch("billing_info.email"),
              },
              notes: {
                address: methods?.watch("address"),
              },
              theme: {
                color: "#F37254",
              },
              modal: {
                ondismiss: function () {
                  console.log(data?.data?.data?.id);
                  methods?.setValue("is_checkout_loading", true, {
                    shouldDirty: true,
                  });
                  failRazorpayMutation.mutate(
                    {
                      razorpay_order_id: data?.data?.data?.id,
                    },
                    {
                      onSuccess: (data) => {
                        toast.error(__('Payment failed.', 'acadlix'));
                      },
                      onSettled: () => {
                        methods?.setValue("is_checkout_loading", false, {
                          shouldDirty: true,
                        });
                      }
                    }
                  );
                },
              },
            };
            const razorpay = new window.Razorpay(options);
            razorpay.open();
          }
        },
        onError: (data) => {
          methods?.setValue("is_checkout_loading", false, {
            shouldDirty: true,
          });
          toast?.error(__('Opps! Something went wrong', 'acadlix'));
        },
      }
    );
  };

  const paypalMutation = PostCheckoutPaypal();
  const handlePaypal = (data = {}) => {
    paypalMutation?.mutate(data, {
      onSuccess: async (data) => {
        methods?.setValue("is_checkout_loading", false, {
          shouldDirty: true,
        });
        const paypalUrl = methods?.watch("paypal_sandbox")
          ? `https://www.sandbox.paypal.com/checkoutnow?token=${data?.data.orderId}`
          : `https://www.paypal.com/checkoutnow?token=${data?.data?.orderId}`;
        window.location.href = paypalUrl;
      },
      onError: (data) => {
        toast?.error(__('Opps! Something went wrong', 'acadlix'));
        methods?.setValue("is_checkout_loading", false, {
          shouldDirty: true,
        });
      },
    });
  };

  const payuMutation = PostCheckoutPayu();
  const handlePayu = (data = {}) => {
    payuMutation?.mutate(data, {
      onSuccess: (data) => {
        methods?.setValue("is_checkout_loading", false, { shouldDirty: true });
        if (
          data?.data?.status === "success" &&
          data?.data?.payment_url &&
          data?.data?.formData
        ) {
          const form = document.createElement("form");
          form.method = "POST";
          form.action = data?.data.payment_url;

          Object.keys(data?.data?.formData).forEach((key) => {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = key;
            input.value = data?.data?.formData[key];
            form.appendChild(input);
          });

          document.body.appendChild(form);
          form.submit();

          // window.location.href = data?.data?.payment_url;
        }
      },
      onError: (data) => {
        toast?.error(__("Opps! Something went wrong", "acadlix"));
        methods?.setValue("is_checkout_loading", false, { shouldDirty: true });
      },
    });
  };

  const freeMutation = PostFreeCheckout();
  const handleFreeCheckout = (data = {}) => {
    freeMutation?.mutate(data, {
      onSuccess: (data) => {
        methods?.setValue("is_checkout_loading", false, { shouldDirty: true });
        window.location.href = `${acadlixOptions?.dashboard_url}`;
      },
      onError: (data) => {
        toast?.error(__('Opps! Something went wrong', 'acadlix'));
        methods?.setValue("is_checkout_loading", false, { shouldDirty: true });
      },
    })
  };

  const paymentHandlers = {
    razorpay: handleRazorpay,
    paypal: handlePaypal,
    payu: handlePayu,
  };

  const handlePaymentGateway = (data = {}) => {
    const method = methods?.watch("payment_method");
    if (paymentHandlers[method]) {
      paymentHandlers[method](data);
    }
  };

  /**
   * Initiates the checkout process by setting the loading state and 
   * validating the selected payment method. If no payment method is 
   * selected, it displays an error message. If a payment method is 
   * selected, it delegates the payment process to the appropriate 
   * handler based on the selected payment gateway.
   * 
   * @param {Object} data - The data to be used in the checkout process.
   */
  const handleCheckout = (data) => {
    // Set the loading state to true to indicate that the checkout process is starting
    methods?.setValue("is_checkout_loading", true, { shouldDirty: true });
    const totalAmount = methods?.watch("total_amount");
    if (totalAmount > 0) {
      const selectedPaymentMethod = methods.watch("payment_method");
      // Check if a payment method has been selected
      if (!selectedPaymentMethod) {
        // If no payment method is selected, display an error message to the user
        toast.error(__('Please select a payment gateway.', 'acadlix'));

        // Set the loading state back to false since the process cannot proceed
        methods?.setValue("is_checkout_loading", false, { shouldDirty: true });
        return; // Exit the function early
      }

      // If a payment method is selected, proceed to handle the payment
      // The appropriate payment handler is called based on the selected payment gateway
      handlePaymentGateway(data);
    } else {
      // handle free checkout
      handleFreeCheckout(data);
    }
  };

  if (getCart?.isFetching) {
    return (
      <Box sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingY: 5
      }}>
        <CircularProgress size={30} />
      </Box>
    );
  }


  return (
    <Box
      sx={{
        width: {
          xs: "95%",
          md: "85%",
        },
        marginX: "auto",
        marginY: 2,
      }}
    >
      <UserAuth
        login_modal={methods?.watch("login_modal")}
        users_can_register={Boolean(Number(acadlixOptions?.users_can_register))}
        ajax_url={acadlixOptions?.ajax_url}
        nonce={acadlixOptions?.nonce}
        handleClose={() => methods?.setValue("login_modal", false)}
      />
      {
        methods?.watch("cart")?.length > 0 ?
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, sm: 12, md: 7 }}>
              <Grid container spacing={4}>
                {
                  !methods?.watch("is_user_logged_in") &&
                  <Grid size={{ xs: 12, lg: 12 }}>
                    <Typography>
                      {__('Please login/register to proceed: ', 'acadlix')}
                      <Link
                        onClick={() => methods?.setValue("login_modal", true, { shouldDirty: true })}
                        sx={{
                          cursor: "pointer"
                        }}
                      >
                        {__('Login/Register', 'acadlix')}
                      </Link>
                    </Typography>
                  </Grid>
                }
                <Grid size={{ xs: 12, lg: 12 }}>
                  <BillingDetail {...methods} />
                </Grid>
                <Grid size={{ xs: 12, lg: 12 }}>
                  <OrderDetail
                    {...methods}
                    isFetching={getCart?.isFetching}
                    setCartData={setCartData}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 5 }}>
              <Grid container spacing={4}>
                {
                  methods?.watch("total_amount") > 0 &&
                  <Grid size={{ xs: 12, lg: 12 }}>
                    <PaymentMethod {...methods} />
                  </Grid>
                }
                <Grid size={{ xs: 12, lg: 12 }}>
                  <OrderSummary
                    {...methods}
                    isFetching={getCart?.isFetching}
                    handleCheckout={handleCheckout}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          :
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 12 }}>
              <Typography variant="body1">{__('Your cart is currently empty.', 'acadlix')}</Typography>
            </Grid>
          </Grid>
      }
    </Box>
  );
};

export default Checkout;
