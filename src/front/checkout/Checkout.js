import React, { useEffect, useLayoutEffect } from "react";
import {
  GetCheckoutCart,
  PostCheckoutPaypal,
  PostCheckoutPayu,
  PostCheckoutRazorpay,
  PostVerifyRazorpayPayment,
} from "../../requests/front/FrontCheckoutRequest";
import { Box, Dialog, Grid, styled } from "@mui/material";
import BillingDetail from "./BillingDetail";
import PaymentMethod from "./PaymentMethod";
import OrderDetail from "./OrderDetail";
import OrderSummary from "./OrderSummary";
import { useForm } from "react-hook-form";
import parse from "html-react-parser";
import axios from "axios";
import Login from "./modal/Login";
import toast from "react-hot-toast";
import Register from "./modal/Register";

const Checkout = () => {
  const methods = useForm({
    defaultValues: {
      is_checkout_loading: false,
      login_modal: false,
      login_modal_type: "login", // login/register
      billing_info: {
        first_name: "",
        last_name: "",
        email: "",
        phonecode: null,
        phone_number: "",
        address: "",
        company_url: "",
        country: null,
        city: "",
        zip_code: "",
      },
      payment_method: "",
      user_id: acadlixOptions?.user_id,
      cart_token: acadlixOptions?.cart_token,
      users_can_register: Boolean(Number(acadlixOptions?.users_can_register)),
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
      acadlix_payu_merchant_key:
        acadlixOptions?.settings?.acadlix_payu_merchant_key,
      payu_salt:
        acadlixOptions?.settings?.acadlix_payu_salt,
      payu_sandbox:
        acadlixOptions?.settings?.acadlix_payu_sandbox === "yes",
    },
  });

  const getCart = GetCheckoutCart(
    methods?.watch("user_id"),
    methods?.watch("cart_token")
  );

  const formatPrice = (price = 0) => {
    if (isNaN(price)) return price;

    // Split the number into the integer and decimal parts
    let [integerPart, decimalPart] = parseFloat(price)
      .toFixed(acadlixOptions?.settings?.acadlix_number_of_decimals)
      .split(".");

    // Add thousand separators to the integer part
    integerPart = integerPart.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      acadlixOptions?.settings?.acadlix_thousand_separator
    );

    // Join the integer and decimal parts with the custom decimal separator
    return Number(
      decimalPart
        ? integerPart +
            acadlixOptions?.settings?.acadlix_decimal_seprator +
            decimalPart
        : integerPart
    );
  };

  const currencyPosition = (price = 0) => {
    let symbol = parse(acadlixOptions?.currency_symbol);
    let newPrice = formatPrice(price);
    switch (acadlixOptions?.settings?.acadlix_currency_position) {
      case "Left ( $99.99 )":
        return `${symbol}${newPrice}`;
      case "Right ( 99.99$ )":
        return `${newPrice}${symbol}`;
      case "Left with space ( $ 99.99 )":
        return `${symbol} ${newPrice}`;
      case "Right with space ( 99.99 $ )":
        return `${newPrice} ${symbol}`;
      default:
        return `${symbol}${price}`;
    }
  };

  useLayoutEffect(() => {
    if (!getCart?.isFetching) {
      if (getCart?.data?.data?.cart?.length > 0) {
        methods?.setValue("cart", [...getCart?.data?.data?.cart], {
          shouldDirty: true,
        });

        methods?.setValue(
          "order_items",
          getCart?.data?.data?.cart?.map((c) => {
            let price = formatPrice(
              c?.course?.sale_price === 0
                ? c?.course?.price
                : c?.course?.sale_price
            );
            let tax = 0;
            if (c?.course?.tax !== 0 && c?.course?.tax_percent !== 0) {
              tax = formatPrice((price * c?.course?.tax_percent) / 100);
            }
            return {
              course_id: c?.course_id,
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
          methods
            ?.watch("order_items")
            ?.reduce((total, c) => total + c?.price_after_tax, 0),
          { shouldDirty: true }
        );
      }
    }
  }, [getCart?.data?.data]);
  //   window.paypal
  //     .Buttons({
  //       createOrder: (data, actions) => {
  //         return actions.order.create({
  //           purchase_units: [
  //             {
  //               amount: {
  //                 value: "100.00", // Dynamic value based on cart or total amount
  //                 currency_code: "USD", // Set the currency here
  //               },
  //             },
  //           ],
  //         });
  //       },
  //       onApprove: (data, actions) => {
  //         return actions.order.capture().then(function (details) {
  //           // Handle the response, send the orderID and payment details to backend
  //           fetch("/wp-json/myplugin/v1/paypal/capture/", {
  //             method: "POST",
  //             headers: {
  //               "Content-Type": "application/json",
  //             },
  //             body: JSON.stringify({
  //               orderID: data.orderID,
  //               payerID: details.payer.payer_id,
  //             }),
  //           })
  //             .then((response) => response.json())
  //             .then((data) => {
  //               if (data.success) {
  //                 alert("Payment successful!");
  //               } else {
  //                 setError("Payment failed");
  //               }
  //             });
  //         });
  //       },
  //       onError: (err) => {
  //         setError(err.message);
  //       },
  //     })
  //     .render("#paypal-button-container"); // Render PayPal buttons
  //     setPaypalButtonRendered(true);
  // };

  const convertToSmallestUnit = (amount = 0) => {
    return parseInt(
      amount
        .toString()
        .replace(acadlixOptions?.settings?.acadlix_decimal_seprator, "")
        .replace(acadlixOptions?.settings?.acadlix_thousand_separator, "")
    );
  };

  const razorpayMutation = PostCheckoutRazorpay();
  const verifyRazorpayMutation = PostVerifyRazorpayPayment();
  const handleRazorpay = (data = {}) => {
    razorpayMutation?.mutate(
      {
        ...data,
        amount: convertToSmallestUnit(methods?.watch("total_amount")),
      },
      {
        onSuccess: (data) => {
          console?.log(data?.data);
          methods?.setValue("is_checkout_loading", false, {
            shouldDirty: true,
          });
          if (data?.data?.success) {
            const options = {
              key: methods?.watch("razorpay_client_id"), // Replace with your Razorpay key ID
              amount: convertToSmallestUnit(methods?.watch("total_amount")), // Amount in paise (1000 paise = INR 10)
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
                    console.log(data?.data);
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
                    console.log(data);
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
            };
            const razorpay = new window.Razorpay(options);
            razorpay.open();
          }
        },
        onError: (data) => {
          console.log(data);
          methods?.setValue("is_checkout_loading", false, {
            shouldDirty: true,
          });
          toast?.error("Opps! Something went wrong");
        },
      }
    );
  };

  const paypalMutation = PostCheckoutPaypal();
  const handlePaypal = (data = {}) => {
    paypalMutation?.mutate(data, {
      onSuccess: async (data) => {
        console.log(data?.data);
        methods?.setValue("is_checkout_loading", false, {
          shouldDirty: true,
        });
        const paypalUrl = methods?.watch("paypal_sandbox")
          ? `https://www.sandbox.paypal.com/checkoutnow?token=${data?.data.orderId}`
          : `https://www.paypal.com/checkoutnow?token=${data?.data?.orderId}`;
        window.location.href = paypalUrl;
      },
      onError: (data) => {
        console.error(data?.message);
        toast?.error("Opps! Something went wrong");
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
        console.log(data?.data);
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
        toast?.error("Opps! Something went wrong");
        methods?.setValue("is_checkout_loading", false, { shouldDirty: true });
      },
    });
  };

  const handlePaymentGatway = (data = {}) => {
    switch (methods?.watch("payment_method")) {
      case "razorpay":
        handleRazorpay(data);
        return;
      case "paypal":
        handlePaypal(data);
        return;
      case "payu":
        handlePayu(data);
        return;
      default:
        return;
    }
  };

  const handleCheckout = (data) => {
    methods?.setValue("is_checkout_loading", true, { shouldDirty: true });

    if (acadlixOptions?.user_id > 0) {
      if (methods?.watch("payment_method") === "") {
        toast.error("Please select payment gatway.");
        methods?.setValue("is_checkout_loading", false, { shouldDirty: true });
        return;
      }
      handlePaymentGatway(data);
    } else {
      axios
        .post(
          acadlixOptions?.ajax_url,
          new URLSearchParams({
            action: "check_user_login_status",
          })
        )
        .then((response) => {
          if (response?.data?.success) {
            if (response?.data?.data?.logged_id) {
            } else {
              methods?.setValue("login_modal", true, { shouldDirty: true });
              methods?.setValue("is_checkout_loading", false, {
                shouldDirty: true,
              });
            }
          }
        })
        .catch((err) => {
          methods?.setValue("is_checkout_loading", false, {
            shouldDirty: true,
          });
          console.error(err);
        });
    }
  };

  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
      padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
      padding: theme.spacing(1),
    },
    "& .MuiPaper-root": {
      width: "100%",
    },
  }));

  const handleClose = () => {
    methods?.setValue("login_modal", false, { shouldDirty: true });
  };

  return (
    <Box
      sx={{
        width: {
          xs: "95%",
          md: "80%",
        },
        marginX: "auto",
      }}
    >
      <BootstrapDialog
        open={methods?.watch("login_modal")}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {methods?.watch("login_modal_type") === "login" ? (
          <Login {...methods} handleClose={handleClose} />
        ) : (
          <Register {...methods} handleClose={handleClose} />
        )}
      </BootstrapDialog>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={12} md={7}>
          <Grid container spacing={4}>
            <Grid item xs={12} lg={12}>
              <BillingDetail {...methods} />
            </Grid>
            <Grid item xs={12} lg={12}>
              <PaymentMethod {...methods} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={12} md={5}>
          <Grid container spacing={4}>
            <Grid item xs={12} lg={12}>
              <OrderDetail
                {...methods}
                isFetching={getCart?.isFetching}
                currencyPosition={currencyPosition}
              />
            </Grid>
            <Grid item xs={12} lg={12}>
              <OrderSummary
                {...methods}
                isFetching={getCart?.isFetching}
                handleCheckout={handleCheckout}
                currencyPosition={currencyPosition}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Checkout;
