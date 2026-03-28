import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
} from "@mui/material";
import Grid from '@mui/material/Grid';
import React from "react";
import { DeleteCourseFromCart } from "@acadlix/requests/front/FrontCheckoutRequest";
import { currencyPosition } from "@acadlix/helpers/util";
import { DynamicMUIRenderer } from "@acadlix/modules/extensions/muiRecursiveRenderer";

const OrderDetail = (props) => {
  return (
    <Box>
      <Card>
        <CardHeader title="Order Details" />
        <Divider />
        <CardContent>
          <Grid container spacing={4}>
            {
              props?.watch("cart")?.length > 0 && (
                props?.watch("cart")?.map((c, index) => (
                  <OrderItem
                    key={index}
                    index={index}
                    {...props}
                    c={c}
                  />
                ))
              )}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default OrderDetail;

const OrderItem = (props) => {
  const removeItemMutation = DeleteCourseFromCart(props?.c?.id);
  const handleRemoveItem = () => {
    removeItemMutation?.mutate(
      {},
      {
        onSuccess: (data) => {
          if (data?.data?.cart) {
            props?.setCartData(data?.data?.cart);
          }
        },
      }
    );
  };

  const defaultSetting = {
    component: "Grid",
    component_name: "checkout_order_detail_grid",
    props: {
      size: { xs: 12, md: 12 },
    },
    children: [
      {
        component: "Card",
        component_name: "checkout_order_detail_card",
        props: {
          sx: {
            display: "flex",
            alignItems: "center",
          },
        },
        children: [
          {
            component: "CardMedia",
            component_name: "checkout_order_detail_card_media",
            props: {
              sx: {
                height: 100,
                width: 150,
              },
              image: props?.c?.item?.thumbnail?.url ??
                acadlixCheckoutOptions?.default_img_url,
            },
          },
          {
            component: "CardContent",
            component_name: "checkout_order_detail_card_content",
            props: {
              sx: {
                paddingY: 2,
                ":last-child": {
                  paddingY: 2,
                },
              },
            },
            children: [
              props?.c?.errors?.length > 0 && (
                {
                  component: "Box",
                  component_name: "checkout_order_detail_error_box",
                  props: {
                    sx: {
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                    },
                  },
                  children: props?.c?.errors?.map((e, index) => ({
                    component: "Alert",
                    component_name: "checkout_order_detail_error_alert",
                    props: {
                      severity: "error",
                      key: index,
                    },
                    children: [{
                      component: "RawHTML",
                      component_name: "checkout_order_detail_error_text",
                      props: {},
                      value: e,
                    }]
                  })) || [],
                }
              ),
              {
                component: "Typography",
                component_name: "checkout_order_detail_title_typography",
                props: {
                  component: "div",
                  variant: "body1",
                  sx: {
                    fontWeight: "bold",
                  },
                },
                value: props?.c?.item?.post_title,
              },
              {
                component: "Box",
                component_name: "checkout_order_detail_price_box",
                props: {
                  sx: {
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  },
                },
                children: [
                  {
                    component: "Typography",
                    component_name: "checkout_order_detail_sale_price_typography",
                    props: {
                      component: "div",
                      variant: "h6",
                    },
                    value: `${currencyPosition(
                      Boolean(Number(props?.c?.item?.rendered_metas?.enable_sale_price))
                        ? props?.c?.item?.rendered_metas?.sale_price
                        : props?.c?.item?.rendered_metas?.price,
                        props?.watch("currency_symbol")
                    )} `,
                  },
                  Boolean(Number(props?.c?.item?.rendered_metas?.enable_sale_price)) && (
                    {
                      component: "Typography",
                      component_name: "checkout_order_detail_price_typography",
                      props: {
                        component: "div",
                        variant: "body2",
                        sx: {
                          textDecoration: "line-through",
                        }
                      },
                      value: currencyPosition(props?.c?.item?.rendered_metas?.price, props?.watch("currency_symbol")),
                    }
                  )
                ],
              }
            ],
          },
          {
            component: "CardActions",
            component_name: "checkout_order_detail_card_action",
            props: {
              sx: {
                marginLeft: "auto",
              },
            },
            children: [
              {
                component: "IconButton",
                component_name: "checkout_order_detail_remove_order_item_icon_button",
                props: {
                  className: 'acadlix-icon-btn',
                  color: "error",
                  onClick: handleRemoveItem,
                },
                children: [
                  removeItemMutation?.isPending ? (
                    {
                      component: "CircularProgress",
                      component_name: "checkout_order_detail_remove_order_item_circular_progress",
                      props: {
                        size: 20,
                        color: "inherit",
                      },
                    }
                  ) : (
                    {
                      component: "FaTrashAlt",
                      component_name: "checkout_order_detail_remove_order_item_trash_icon",
                      props: {},
                    }
                  ),
                ],
              },
            ],
          }
        ],
      },
    ],
  };

  React.useEffect(() => {
    if (props?.c?.errors && props?.c?.errors?.length > 0) {
      props?.setValue("is_checkout_locked", true, { shouldDirty: true });
    }
  }, []);


  const order_detail = window?.acadlixHooks?.applyFilters?.(
    "acadlix.front.checkout.order_detail",
    [defaultSetting],
    {
      c: props?.c,
      register: props?.register,
      control: props?.control,
      watch: props?.watch,
      setValue: props?.setValue,
      handleRemoveItem: handleRemoveItem,
      removeItemMutation: removeItemMutation,
    }
  ) ?? [];
  
  return (
    <>
      {order_detail.map((field, i) => (
        <React.Fragment key={i}>
          <DynamicMUIRenderer
            item={field}
            index={i}
            formProps={{
              register: props?.register,
              setValue: props?.setValue,
              watch: props?.watch,
              control: props?.control,
            }}
          />
        </React.Fragment>
      ))}
    </>
  )
}
