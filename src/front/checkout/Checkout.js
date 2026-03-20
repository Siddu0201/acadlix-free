import React from "react";
import {
  GetCheckoutCart,
  PostCheckoutOfflinePayment,
  PostCheckoutPaypal,
  PostCheckoutPayu,
  PostCheckoutRazorpay,
  PostCheckoutStripe,
  PostFreeCheckout,
} from "../../requests/front/FrontCheckoutRequest";
import { Box, CircularProgress } from "@mui/material";
import BillingDetail from "./BillingDetail";
import PaymentMethod from "./PaymentMethod";
import OrderDetail from "./OrderDetail";
import OrderSummary from "./OrderSummary";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import UserAuth from "@acadlix/modules/user-auth/UserAuth";
import { __ } from "@wordpress/i18n";
import { convertToUnitPrice, formatPrice } from "@acadlix/helpers/util";
import { Country } from "country-state-city";
import { DynamicMUIRenderer } from "@acadlix/modules/extensions/muiRecursiveRenderer";
import OfflinePaymentModal from "./modal/OfflinePaymentModal";
import Coupon from "./Coupon";

const Checkout = () => {
  const getUserMetaValue = (key = "") => {
    return acadlixCheckoutOptions?.user?.user_metas?.find((m) => m?.meta_key === key)
      ?.meta_value;
  };

  const baseSetting = {
    is_checkout_locked: false,
    is_checkout_loading: false,
    login_modal: false,
    offline_modal: false,
    billing_info: {
      first_name: getUserMetaValue("first_name") ?? "",
      last_name: getUserMetaValue("last_name") ?? "",
      email: acadlixCheckoutOptions?.user?.user_email ?? "",
      phonecode: getUserMetaValue("_acadlix_profile_phonecode") ?? null,
      isocode: getUserMetaValue("_acadlix_profile_isocode") ?? null,
      phone_number: getUserMetaValue("_acadlix_profile_phone_number") ?? "",
      address: getUserMetaValue("_acadlix_profile_address") ?? "",
      user_url: acadlixCheckoutOptions?.user?.user_url ?? "",
      country_code:
        Country.getAllCountries()?.find(
          (country) =>
            country?.name === getUserMetaValue("_acadlix_profile_country")
        )?.isoCode ?? null,
      country: getUserMetaValue("_acadlix_profile_country") ?? null,
      city: getUserMetaValue("_acadlix_profile_city") ?? "",
      zip_code: getUserMetaValue("_acadlix_profile_zip_code") ?? "",
    },
    payment_method:
      acadlixCheckoutOptions?.settings?.acadlix_default_payment_gateway ?? "",
    user_id: acadlixCheckoutOptions?.user_id,
    is_user_logged_in: acadlixCheckoutOptions?.user_id > 0 ? true : false,
    cart_token: acadlixCheckoutOptions?.cart_token,
    cart: [],
    order_items: [],
    coupon: null,
    coupon_id: null,
    coupon_code: "",
    coupon_amount: 0,
    discount_type: null,
    total_amount: 0,
    currency: acadlixCheckoutOptions?.settings?.acadlix_currency,
    currency_symbol: acadlixCheckoutOptions?.currency_symbol,
    offline_user_text: "",
    offline_upload_file: null,
  };

  const filteredDefaults = window?.acadlixHooks?.applyFilters(
    "acadlix.admin.checkout.defaultValues",
    baseSetting,
    acadlixCheckoutOptions
  ) ?? baseSetting;

  const methods = useForm({
    defaultValues: filteredDefaults,
  });

  if (process?.env?.REACT_APP_MODE === "development") {
    console.log(methods?.watch());
  }

  const getCart = GetCheckoutCart(
    methods?.watch("user_id"),
    methods?.watch("cart_token")
  );

  const setCartData = (cart = []) => {
    methods?.setValue("is_checkout_locked", false, { shouldDirty: true });
    methods?.setValue("cart",
      window?.acadlixHooks?.applyFilters?.("acadlix.front.checkout.set_cart_data", [...cart], {
        cart: cart,
        methods: methods,
      }) ?? [...cart],
      {
        shouldDirty: true,
      });

    methods?.setValue(
      "order_items",
      window?.acadlixHooks?.applyFilters?.("acadlix.front.checkout.set_order_items", cart?.map((c) => {
        let price = formatPrice(
          Boolean(Number(c?.course?.rendered_metas?.enable_sale_price))
            ? c?.course?.rendered_metas?.sale_price
            : c?.course?.rendered_metas?.price
        );
        let discount = 0;
        let additional_fee = 0;
        let price_after_discount = (price + additional_fee) - discount;
        let tax = 0;
        if (
          c?.course?.rendered_metas?.tax !== 0 &&
          c?.course?.rendered_metas?.tax_percent !== 0
        ) {
          tax = formatPrice(
            (price_after_discount * c?.course?.rendered_metas?.tax_percent) / 100
          );
        }
        let price_after_tax = price_after_discount + tax;
        return {
          course_id: c?.course_id,
          course_title: c?.course?.post_title,
          quantity: 1,
          price: price,
          discount: discount,
          price_after_discount: price_after_discount,
          additional_fee: additional_fee,
          tax: tax,
          price_after_tax: price_after_tax,
        };
      }),
        {
          cart: cart,
          methods: methods,
        }
      ),
      {
        shouldDirty: true,
      }
    );

    // methods?.setValue(
    //   "total_amount",
    //   window?.acadlixHooks?.applyFilters?.("acadlix.front.checkout.set_total_amount", formatPrice(
    //     methods
    //       ?.watch("order_items")
    //       ?.reduce((total, c) => total + c?.price_after_tax, 0)
    //   ),
    //     {
    //       cart: cart,
    //       methods: methods,
    //     }),
    //   { shouldDirty: true }
    // );
  };

  React.useEffect(() => {
    if (methods?.watch("order_items")?.length > 0) {
      methods?.setValue(
        "total_amount",
        window?.acadlixHooks?.applyFilters?.("acadlix.front.checkout.set_total_amount", formatPrice(
          methods
            ?.watch("order_items")
            ?.reduce((total, c) => total + c?.price_after_tax, 0)
        ),
          {
            methods: methods,
          }),
        { shouldDirty: true }
      );
    }
  }, [methods?.watch("order_items")]); // eslint-disable-line react-hooks/exhaustive-deps

  React.useLayoutEffect(() => {
    if (!getCart?.isFetching && getCart?.data?.data?.cart?.length > 0) {
      setCartData(
        window?.acadlixHooks?.applyFilters?.("acadlix.front.checkout.set_cart_data", getCart?.data?.data?.cart, {
          cart: getCart?.data?.data?.cart,
          methods: methods,
        })
      );
    }
  }, [getCart?.isFetching, getCart?.data?.data?.cart]);

  React.useEffect(() => {
    if (
      !methods?.watch("is_user_logged_in") &&
      methods?.watch("cart")?.length > 0
    ) {
      methods?.setValue("login_modal", true, { shouldDirty: true });
    }
  }, [methods?.watch("cart")?.length]); // eslint-disable-line react-hooks/exhaustive-deps


  const razorpayMutation = PostCheckoutRazorpay();
  const handleRazorpay = (data = {}) => {
    razorpayMutation?.mutate(
      window?.acadlixHooks?.applyFilters?.("acadlix.front.checkout.set_razorpay_data", {
        currency: data?.currency,
        billing_info: data?.billing_info,
        user_id: data?.user_id,
        payment_method: data?.payment_method,
        order_items: data?.order_items,
        total_amount: data?.total_amount,
        amount: convertToUnitPrice(data?.total_amount),
        coupon_id: data?.coupon_id,
        coupon_code: data?.coupon_code,
        coupon_amount: data?.coupon_amount,
        discount_type: data?.discount_type,
      },
        {
          methods: methods,
        }
      ),
      {
        onSuccess: (data) => {
          methods?.setValue("is_checkout_loading", false, {
            shouldDirty: true,
          });
          let options = window.acadlixHooks?.applyFilters?.("acadlix.front.checkout.razorpay_options", {
            ...data?.data,
            modal: {
              ondismiss: function () {
                window.location.href = data?.data?.cancel_url;
              },
            },
          },
            {
              methods: methods,
            });
          const razorpay = new window.Razorpay(options);
          razorpay.open();
        },
        onError: (data) => {
          methods?.setValue("is_checkout_loading", false, {
            shouldDirty: true,
          });
          toast?.error(
            data?.response?.data?.message ??
            __("Opps! Something went wrong", "acadlix")
          );
        },
      }
    );
  };

  const paypalMutation = PostCheckoutPaypal();
  const handlePaypal = (data = {}) => {
    paypalMutation?.mutate(
      window?.acadlixHooks?.applyFilters?.("acadlix.front.checkout.set_paypal_data", {
        currency: data?.currency,
        billing_info: data?.billing_info,
        user_id: data?.user_id,
        payment_method: data?.payment_method,
        order_items: data?.order_items,
        total_amount: data?.total_amount,
        coupon_id: data?.coupon_id,
        coupon_code: data?.coupon_code,
        coupon_amount: data?.coupon_amount,
        discount_type: data?.discount_type,
      },
        {
          methods: methods,
        }
      ),
      {
        onSuccess: async (data) => {
          methods?.setValue("is_checkout_loading", false, {
            shouldDirty: true,
          });
          if (data?.data?.redirect_url) {
            window.location.href = data?.data?.redirect_url;
          } else {
            toast?.error(__("Opps! Something went wrong", "acadlix"));
          }
        },
        onError: (data) => {
          toast?.error(
            data?.response?.data?.message ??
            __("Opps! Something went wrong", "acadlix")
          );
          methods?.setValue("is_checkout_loading", false, {
            shouldDirty: true,
          });
        },
      }
    );
  };

  const payuMutation = PostCheckoutPayu();
  const handlePayu = (data = {}) => {
    payuMutation?.mutate(
      window?.acadlixHooks?.applyFilters?.("acadlix.front.checkout.set_payu_data", {
        currency: data?.currency,
        billing_info: data?.billing_info,
        user_id: data?.user_id,
        payment_method: data?.payment_method,
        order_items: data?.order_items,
        total_amount: data?.total_amount,
        coupon_id: data?.coupon_id,
        coupon_code: data?.coupon_code,
        coupon_amount: data?.coupon_amount,
        discount_type: data?.discount_type,
      },
        {
          methods: methods,
        }
      ),
      {
        onSuccess: (data) => {
          methods?.setValue("is_checkout_loading", false, {
            shouldDirty: true,
          });
          if (data?.data?.payment_url && data?.data?.formData) {
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
          }
        },
        onError: (data) => {
          toast?.error(
            data?.response?.data?.message ??
            __("Opps! Something went wrong", "acadlix")
          );
          methods?.setValue("is_checkout_loading", false, {
            shouldDirty: true,
          });
        },
      }
    );
  };

  const freeMutation = PostFreeCheckout();
  const handleFreeCheckout = (data = {}) => {
    freeMutation?.mutate(
      window?.acadlixHooks?.applyFilters?.(
        "acadlix.front.checkout.set_free_data",
        data,
        {
          methods: methods,
        }),
      {
        onSuccess: (data) => {
          methods?.setValue("is_checkout_loading", false, { shouldDirty: true });
          window.location.href = `${acadlixCheckoutOptions?.dashboard_url}`;
        },
        onError: (data) => {
          toast?.error(
            data?.response?.data?.message ??
            __("Opps! Something went wrong", "acadlix")
          );
          methods?.setValue("is_checkout_loading", false, { shouldDirty: true });
        },
      });
  };

  const stripeMutation = PostCheckoutStripe();
  const handleStripe = (data = {}) => {
    stripeMutation?.mutate(
      window?.acadlixHooks?.applyFilters?.("acadlix.front.checkout.set_stripe_data", {
        currency: data?.currency,
        billing_info: data?.billing_info,
        user_id: data?.user_id,
        payment_method: data?.payment_method,
        order_items: data?.order_items,
        total_amount: data?.total_amount,
        amount: convertToUnitPrice(data?.total_amount),
        coupon_id: data?.coupon_id,
        coupon_code: data?.coupon_code,
        coupon_amount: data?.coupon_amount,
        discount_type: data?.discount_type,
      }
      ),
      {
        onSuccess: (data) => {
          methods?.setValue("is_checkout_loading", false, {
            shouldDirty: true,
          });
          window.location.href = data?.data?.redirect_url;
        },
        onError: (data) => {
          toast?.error(
            data?.response?.data?.message ??
            __("Opps! Something went wrong", "acadlix")
          );
          methods?.setValue("is_checkout_loading", false, {
            shouldDirty: true,
          });
        },
      }
    );
  };

  const offlineMutation = PostCheckoutOfflinePayment();
  const handleOfflinePayment = () => {
    const offlineData = window?.acadlixHooks?.applyFilters?.("acadlix.front.checkout.set_offline_payment_data", {
      currency: methods?.watch("currency"),
      billing_info: methods?.watch("billing_info"),
      user_id: methods?.watch("user_id"),
      payment_method: methods?.watch("payment_method"),
      order_items: methods?.watch("order_items"),
      total_amount: methods?.watch("total_amount"),
      offline_user_text: methods?.watch("offline_user_text"),
      offline_upload_file: methods?.watch("offline_upload_file"),
      coupon_id: data?.coupon_id,
      coupon_code: data?.coupon_code,
      coupon_amount: data?.coupon_amount,
      discount_type: data?.discount_type,
    });

    // Convert to FormData
    const formData = new FormData();
    Object.entries(offlineData).forEach(([key, value]) => {
      if (key === 'offline_upload_file' && value) {
        formData.append(key, value); // File object
      } else if (typeof value === 'object' && value !== null) {
        formData.append(key, JSON.stringify(value)); // For objects/arrays
      } else if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });
    offlineMutation?.mutate(
      formData,
      {
        onSuccess: (data) => {
          console.log(data);
          window.location.href = data?.data?.redirect_url;
        },
        onError: (data) => {
          toast?.error(
            data?.response?.data?.message ??
            __("Opps! Something went wrong", "acadlix")
          );
        },
      });
  };
  const handleOfflineModal = () => {
    methods?.setValue("offline_modal", true, { shouldDirty: true });
  };

  const paymentHandlers = {
    razorpay: handleRazorpay,
    paypal: handlePaypal,
    payu: handlePayu,
    stripe: handleStripe,
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
    const selectedPaymentMethod = methods.watch("payment_method");

    const checkoutType = window?.acadlixHooks?.applyFilters?.(
      'acadlix.front.checkout.checkout_type',
      totalAmount > 0 ? 'paid' : 'free',
      data
    );

    if (checkoutType === 'paid') {
      if (!selectedPaymentMethod) {
        // If no payment method is selected, display an error message to the user
        toast.error(__("Please select a payment gateway.", "acadlix"));
        methods?.setValue("is_checkout_loading", false, { shouldDirty: true });
        return; // Exit the function early
      }

      if (selectedPaymentMethod === 'offline' && !methods?.watch("offline_modal")) {
        // Handle offline modal
        handleOfflineModal(data);
        methods?.setValue("is_checkout_loading", false, { shouldDirty: true });
        return;
      }

      // If a payment method is selected, proceed to handle the payment
      // The appropriate payment handler is called based on the selected payment gateway
      handlePaymentGateway(data);
    } else if (checkoutType === 'free') {
      // handle free checkout
      handleFreeCheckout(data);
    }
  };

  if (getCart?.isFetching) {
    return (
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingY: 5,
        }}
      >
        <CircularProgress size={30} />
      </Box>
    );
  }

  const defaultSetting = {
    component: "Box",
    component_name: "checkout_box",
    props: {
      sx: {
        width: {
          xs: "95%",
          md: "85%",
        },
        marginX: "auto",
        marginY: 2,
      },
    },
    children: [
      {
        component: <UserAuth
          login_modal={methods?.watch("login_modal")}
          users_can_register={Boolean(Number(acadlixCheckoutOptions?.users_can_register))}
          ajax_url={acadlixCheckoutOptions?.ajax_url}
          nonce={acadlixOptions?.nonces?.auth || ""}
          handleClose={() => methods?.setValue("login_modal", false)}
        />,
        component_name: "checkout_user_auth",
      },
      {
        component: <OfflinePaymentModal
          {...methods}
          open={methods?.watch("offline_modal")}
          handleClose={() => methods?.setValue("offline_modal", false)}
          handleOfflinePayment={handleOfflinePayment}
          isPending={offlineMutation?.isPending}
        />,
        component_name: "checkout_offline_payment_modal",
      },
      methods?.watch("cart")?.length > 0 ? (
        {
          component: "Grid",
          component_name: "checkout_cart_grid_container",
          props: {
            container: true,
            spacing: 4,
          },
          children: [
            {
              component: "Grid",
              component_name: "checkout_cart_first_grid_item",
              props: {
                size: { xs: 12, sm: 12, md: 7 },
              },
              children: [
                {
                  component: "Grid",
                  component_name: "checkout_cart_first_grid_container",
                  props: {
                    container: true,
                    spacing: 4,
                  },
                  children: [
                    !methods?.watch("is_user_logged_in") && ({
                      component: "Grid",
                      component_name: "checkout_login_grid_item",
                      props: {
                        size: { xs: 12, sm: 12 },
                      },
                      children: [
                        {
                          component: "Typography",
                          component_name: "checkout_login_grid_item_typography",
                          props: {
                            component: "div",
                          },
                          children: [
                            {
                              component: "span",
                              component_name: "checkout_login_grid_item_span",
                              value: __("Please login/register to proceed: ", "acadlix"),
                            },
                            {
                              component: "Link",
                              component_name: "checkout_login_grid_item_link",
                              props: {
                                onClick: () =>
                                  methods?.setValue("login_modal", true, {
                                    shouldDirty: true,
                                  }),
                                sx: {
                                  cursor: "pointer",
                                },
                              },
                              value: __("Login/Register", "acadlix"),
                            },
                          ],
                        },
                      ],
                    }),
                    {
                      component: "Grid",
                      component_name: "checkout_billing_detail_grid_item",
                      props: {
                        size: { xs: 12, sm: 12 },
                      },
                      children: [
                        {
                          component: <BillingDetail {...methods} />,
                          component_name: "checkout_billing_detail",
                        },
                      ],
                    },
                    {
                      component: "Grid",
                      component_name: "checkout_order_detail_grid_item",
                      props: {
                        size: { xs: 12, sm: 12 },
                      },
                      children: [
                        {
                          component: <OrderDetail
                            {...methods}
                            isFetching={getCart?.isFetching}
                            setCartData={setCartData}
                          />,
                          component_name: "checkout_order_detail",
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              component: "Grid",
              component_name: "checkout_cart_second_grid_item",
              props: {
                size: { xs: 12, sm: 12, md: 5 },
              },
              children: [
                {
                  component: "Grid",
                  component_name: "checkout_cart_second_grid_container",
                  props: {
                    container: true,
                    spacing: 4,
                  },
                  children: [
                    {
                      component: "Grid",
                      component_name: "checkout_payment_method_grid_item",
                      props: {
                        size: { xs: 12, sm: 12 },
                        sx: {
                          display: methods?.watch("total_amount") > 0 ? "block" : "none",
                        },
                      },
                      children: [
                        {
                          component: <PaymentMethod {...methods} />,
                          component_name: "checkout_payment_method",
                        }
                      ]
                    },
                    {
                      component: "Grid",
                      component_name: "checkout_coupon_grid_item",
                      props: {
                        size: { xs: 12, sm: 12 },
                        sx: {
                          display: acadlixCheckoutOptions?.settings?.acadlix_enable_coupon_code === "yes" ? "block" : "none",
                        },
                      },
                      children: [
                        {
                          component: <Coupon {...methods} />,
                          component_name: "checkout_coupon",
                        }
                      ]
                    },
                    {
                      component: "Grid",
                      component_name: "checkout_order_summary_grid_item",
                      props: {
                        size: { xs: 12, sm: 12 },
                      },
                      children: [
                        {
                          component: <OrderSummary
                            {...methods}
                            isFetching={getCart?.isFetching}
                            handleCheckout={handleCheckout}
                          />,
                          component_name: "checkout_order_summary",
                        }
                      ]
                    }
                  ],
                },
              ],
            },
          ],
        }
      ) : (
        {
          component: "Grid",
          component_name: "checkout_cart_empty_grid_container",
          props: {
            container: true,
            spacing: 4,
          },
          children: [
            {
              component: "Grid",
              component_name: "checkout_cart_empty_grid_item",
              props: {
                container: true,
                spacing: 4,
              },
              children: [
                {
                  component: "Typography",
                  component_name: "checkout_cart_empty_grid_item_typography",
                  props: {
                    variant: "body1",
                    component: "div",
                  },
                  value: __("Your cart is currently empty.", "acadlix"),
                },
              ],
            }
          ],
        }
      ),
    ],
  };

  const checkout = window?.acadlixHooks?.applyFilters?.(
    "acadlix.front.checkout",
    [defaultSetting],
    {
      register: methods?.register,
      control: methods?.control,
      watch: methods?.watch,
      setValue: methods?.setValue,
      handleCheckout: handleCheckout,
      isFetching: getCart?.isFetching,
    }
  ) ?? [];

  return (
    <>
      {checkout.map((field, i) => (
        <React.Fragment key={i}>
          <DynamicMUIRenderer
            item={field}
            index={i}
            formProps={{
              register: methods?.register,
              setValue: methods?.setValue,
              watch: methods?.watch,
              control: methods?.control,
            }}
          />
        </React.Fragment>
      ))}
    </>
  );

};

export default Checkout;
