import React from 'react'
import { set, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom';
import { TiArrowLeftThick } from '@acadlix/helpers/icons';
import { __ } from '@wordpress/i18n';
import OrderItems from './sections/OrderItems';
import OrderOptions from './sections/OrderOptions';
import toast from 'react-hot-toast';
import { PostCreateOrder, UpdateOrderById } from '@acadlix/requests/admin/AdminOrderRequest';
import OrderActivityLogs from './sections/OrderActivityLogs';
import { DynamicMUIRenderer } from '@acadlix/modules/extensions/muiRecursiveRenderer';
import OrderBillingInfo from './sections/OrderBillingInfo';
import OrderDetails from './sections/OrderDetails';
import { formatPrice } from '@acadlix/helpers/util';

const OrderContent = (props) => {
  const [error, setError] = React.useState(null);
  const getOrderMetaValue = (order_metas = [], meta_key = "", order_default = "") => {
    return order_metas?.find((o) => o?.meta_key === meta_key)?.meta_value ?? order_default;
  };

  const getTransactionId = (order_metas = []) => {
    switch (getOrderMetaValue(order_metas, "payment_method")) {
      case "razorpay":
        return getOrderMetaValue(order_metas, "razorpay_order_id");
      case "paypal":
        return getOrderMetaValue(order_metas, "paypal_order_id");
      case "payu":
        return getOrderMetaValue(order_metas, "payu_txn_id");
      case "stripe":
        return getOrderMetaValue(order_metas, "stripe_order_id");
      default:
        return "N/A";
    }
  };

  const baseSetting = {
    id: props?.order?.id ?? 0,
    admin_id: acadlixOptions?.user_id ?? 0,
    status: props?.order?.status ?? "pending",
    user_id: props?.order?.user_id ?? null,
    user_name: props?.order?.user?.display_name ?? "",
    user_email: props?.order?.user?.user_email ?? "",
    total_amount: formatPrice(props?.order?.total_amount ?? 0),
    coupon_id: props?.order?.coupon_id ?? null,
    coupon_code: props?.order?.coupon_code ?? "",
    order_items: props?.order?.order_items ?
      props?.order?.order_items?.map((item) => {
        return {
          course_id: item?.course_id,
          course_title: item?.course_title,
          quantity: item?.quantity,
          price: formatPrice(item?.price),
          discount: formatPrice(item?.discount),
          additional_fee: formatPrice(item?.additional_fee ?? 0),
          price_after_discount: formatPrice(item?.price_after_discount),
          tax: formatPrice(item?.tax),
          price_after_tax: formatPrice(item?.price_after_tax)
        }
      })
      : [],
    courses: props?.order?.order_items ?
      props?.order?.order_items?.map((item) => {
        return {
          ID: item?.course?.ID,
          post_title: item?.course?.post_title,
          rendered_metas: item?.course?.rendered_metas
        }
      })
      : [],
    meta: {
      payment_method: props?.order?.order_metas ?
        getOrderMetaValue(props?.order?.order_metas, "payment_method", "razorpay")
        : "admin",
      is_free: props?.order?.order_metas ?
        Boolean(Number(getOrderMetaValue(props?.order?.order_metas, "is_free", 0)))
        : false,
      currency: props?.order?.order_metas ?
        getOrderMetaValue(props?.order?.order_metas, "currency", acadlixOptions?.settings?.acadlix_currency || "USD")
        : acadlixOptions?.settings?.acadlix_currency || "USD",
      transaction_id: getTransactionId(props?.order?.order_metas),
      offline_user_text: props?.order?.order_metas ?
        getOrderMetaValue(props?.order?.order_metas, "offline_user_text", "")
        : "",
      offline_upload_file: props?.order?.order_metas ?
        getOrderMetaValue(props?.order?.order_metas, "offline_upload_file", null)
        : null,
    },
    activity_logs: props?.order?.activity_logs ?? [],
    billing_info: {
      first_name: getOrderMetaValue(props?.order?.order_metas, "billing_info", "")?.first_name ?? "",
      last_name: getOrderMetaValue(props?.order?.order_metas, "billing_info", "")?.last_name ?? "",
      email: getOrderMetaValue(props?.order?.order_metas, "billing_info", "")?.email ?? "",
      phonecode: getOrderMetaValue(props?.order?.order_metas, "billing_info", "")?.phonecode ?? "",
      isocode: getOrderMetaValue(props?.order?.order_metas, "billing_info", "")?.isocode ?? "",
      phone_number: getOrderMetaValue(props?.order?.order_metas, "billing_info", "")?.phone_number ?? "",
      address: getOrderMetaValue(props?.order?.order_metas, "billing_info", "")?.address ?? "",
      country: getOrderMetaValue(props?.order?.order_metas, "billing_info", "")?.country ?? "",
      city: getOrderMetaValue(props?.order?.order_metas, "billing_info", "")?.city ?? "",
      zip_code: getOrderMetaValue(props?.order?.order_metas, "billing_info", "")?.zip_code ?? "",
    },
    user_type: "single", // single/multiple
    users: [],
    skip_already_purchased: false,
  };

  const filteredDefaults = window?.acadlixHooks?.applyFilters(
    "acadlix.admin.order.defaultValues",
    baseSetting,
    props?.order
  ) ?? baseSetting;

  const methods = useForm({
    defaultValues: filteredDefaults,
  });

  if (process.env.REACT_APP_MODE === 'development') {
    console.log(methods?.watch());
  }

  const navigate = useNavigate();
  const createMutation = PostCreateOrder();
  const updateMutation = UpdateOrderById(props?.order_id ?? 0);

  const onSubmit = (data) => {
    if (data?.order_items?.length == 0) {
      toast.error(__("Please add any order item.", "acadlix"));
      return;
    }

    if (!data?.user_id && data?.user_type === "single") {
      toast.error(__("Please select user.", "acadlix"));
      return;
    }

    if (data?.users?.length == 0 && data?.user_type === "multiple") {
      toast.error(__("Please add at least one user.", "acadlix"));
      return;
    }
    setError(null);

    if (props?.create) {
      createMutation?.mutate(data, {
        onSuccess: (data) => {
          // console.log(data);
          navigate('/');
        },
        onError: (error) => {
          // console.log(error);
          setError(error?.response?.data?.message || __("Something went wrong.", "acadlix"));
        }
      });
    } else {
      updateMutation?.mutate(data, {
        onSuccess: (data) => {
          // console.log(data);
          navigate('/');
        },
        onError: (error) => {
          // console.log(error);
          setError(error?.response?.data?.message || __("Something went wrong.", "acadlix"));
        }

      });
    }
  }

  const defaultSetting = {
    component: "Box",
    component_name: "order_content_box",
    children: [
      {
        component: "form",
        component_name: "order_content_form",
        props: {
          onSubmit: methods?.handleSubmit(onSubmit)
        },
        children: [
          {
            component: "Grid",
            component_name: "order_content_grid",
            props: {
              container: true,
              spacing: {
                xs: 2,
                sm: 4,
              },
              sx: {
                padding: {
                  xs: 2,
                  sm: 4,
                },
              }
            },
            children: [
              {
                component: "Grid",
                component_name: "order_content_grid_item",
                props: {
                  size: {
                    xs: 12,
                    lg: 12,
                  },
                },
                children: [
                  {
                    component: "Box",
                    component_name: "order_content_box_item",
                    props: {
                      sx: {
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                      }
                    },
                    children: [
                      {
                        component: "Button",
                        component_name: "order_content_back_button",
                        props: {
                          variant: "contained",
                          startIcon: <TiArrowLeftThick />,
                          size: "medium",
                          sx: {
                            width: "fit-content",
                          },
                          LinkComponent: Link,
                          to: "/",
                        },
                        value: __("Back", "acadlix")
                      },
                      {
                        component: "Typography",
                        component_name: "order_content_title_typography",
                        props: {
                          variant: "h3",
                        },
                        value: props?.create ? __("Create Order", "acadlix") : __("Edit Order", "acadlix")
                      }
                    ]
                  }
                ]
              },
              {
                component_name: "order_content_order_options",
                component: <OrderOptions {...methods} {...props} />
              },
              !props?.create && ({
                component_name: "order_content_order_details",
                component: <OrderDetails {...methods} {...props} />
              }),
              methods?.watch("user_type") === "single" && ({
                component_name: "order_content_order_billing_info",
                component: <OrderBillingInfo {...methods} {...props} />
              }),
              {
                component_name: "order_content_order_items",
                component: <OrderItems {...methods} {...props} />
              },
              methods?.watch("activity_logs")?.length > 0 && ({
                component_name: "order_content_order_activity_logs",
                component: <OrderActivityLogs {...methods} {...props} />
              }),
              error != null && ({
                component: "Grid",
                component_name: "order_content_error_grid",
                props: {
                  size: {
                    xs: 12,
                    sm: 12,
                  },
                },
                children: [
                  {
                    component: "Alert",
                    component_name: "order_content_error_alert",
                    props: {
                      severity: "error",
                    },
                    children: [
                      {
                        component: "RawHTML",
                        component_name: "order_content_error_raw_html",
                        value: error
                      }
                    ]
                  }
                ]
              }),
              {
                component_name: "order_content_action_grid",
                component: "Grid",
                props: {
                  size: {
                    xs: 12,
                    sm: 12,
                  },
                },
                children: [
                  {
                    component: "Card",
                    component_name: "order_content_action_card",
                    children: [
                      {
                        component: "CardContent",
                        component_name: "order_content_action_card_content",
                        children: [
                          {
                            component: "Button",
                            component_name: "order_content_action_button",
                            props: {
                              variant: "contained",
                              size: "medium",
                              type: "submit",
                              loading: createMutation?.isPending || updateMutation?.isPending,
                            },
                            value: __("Save Change", "acadlix")
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  };

  const order_content = window?.acadlixHooks?.applyFilters?.(
    "acadlix.admin.order.order_content",
    [defaultSetting],
    {
      register: methods?.register,
      control: methods?.control,
      watch: methods?.watch,
      setValue: methods?.setValue,
    }
  ) ?? [];

  return (
    <>
      {order_content.map((field, i) => (
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
  )
}

export default OrderContent
