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
  const removeCourseMutation = DeleteCourseFromCart(props?.c?.id);
  const handleRemoveCourse = () => {
    removeCourseMutation?.mutate(
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
              image: props?.c?.course?.thumbnail?.url ??
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
                  variant: "body1",
                  sx: {
                    fontWeight: "bold",
                  },
                },
                value: props?.c?.course?.post_title,
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
                      variant: "h6",
                    },
                    value: `${currencyPosition(
                      Boolean(Number(props?.c?.course?.rendered_metas?.enable_sale_price))
                        ? props?.c?.course?.rendered_metas?.sale_price
                        : props?.c?.course?.rendered_metas?.price
                    )} `,
                  },
                  Boolean(Number(props?.c?.course?.rendered_metas?.enable_sale_price)) && (
                    {
                      component: "Typography",
                      component_name: "checkout_order_detail_price_typography",
                      props: {
                        variant: "body2",
                        sx: {
                          textDecoration: "line-through",
                        }
                      },
                      value: currencyPosition(props?.c?.course?.rendered_metas?.price),
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
                  color: "error",
                  onClick: handleRemoveCourse,
                },
                children: [
                  removeCourseMutation?.isPending ? (
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
      handleRemoveCourse: handleRemoveCourse,
      removeCourseMutation: removeCourseMutation,
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
      {/* <Grid size={{ xs: 12, md: 12 }}>
        <Card
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <CardMedia
            sx={{
              height: 100,
              width: 150,
            }}
            image={
              props?.c?.course?.thumbnail?.url ??
              acadlixCheckoutOptions?.default_img_url
            }
            title="product image"
          />
          <CardContent
            sx={{
              paddingY: 2,
              ":last-child": {
                paddingY: 2,
              },
            }}
          >
            {
              props?.c?.errors?.length > 0 &&
              (
                <Box sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1
                }}>
                  {
                    props?.c?.errors?.map((e, index) => (
                      <Alert key={index} severity="error">
                        <RawHTML>
                          {e}
                        </RawHTML>
                      </Alert>
                    ))

                  }
                </Box>
              )

            }
            <Typography
              variant="body1"
              sx={{
                fontWeight: "bold",
              }}
            >
              {props?.c?.course?.post_title}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Typography variant="body1">
                <b>{`${currencyPosition(
                  Boolean(Number(props?.c?.course?.rendered_metas?.enable_sale_price))
                    ? props?.c?.course?.rendered_metas?.sale_price
                    : props?.c?.course?.rendered_metas?.price
                )} `}</b>
              </Typography>
              {Boolean(Number(props?.c?.course?.rendered_metas?.enable_sale_price)) && (
                <Typography variant="body2">
                  <del>
                    {currencyPosition(props?.c?.course?.rendered_metas?.price)}
                  </del>
                </Typography>
              )}
            </Box>
          </CardContent>
          <CardActions
            sx={{
              marginLeft: "auto",
            }}
          >
            <IconButton
              color="error"
              onClick={handleRemoveCourse}
            >
              {removeCourseMutation?.isPending ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <FaTrashAlt />
              )}
            </IconButton>
          </CardActions>
        </Card>
      </Grid> */}
    </>
  )
}
