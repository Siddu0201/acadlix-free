import {
  Alert,
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  CircularProgress,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import Grid from '@mui/material/Grid';
import React from "react";
import { FaTrashAlt } from "@acadlix/helpers/icons";
import { DeleteCourseFromCart } from "@acadlix/requests/front/FrontCheckoutRequest";
import { RawHTML } from "@wordpress/element";
import { currencyPosition, formatPrice } from "@acadlix/helpers/util";

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

  React.useEffect(() => {
    if (props?.c?.errors && props?.c?.errors?.length > 0) {
      props?.setValue("is_checkout_locked", true, { shouldDirty: true });
    }
  }, []);

  return (
    <Grid size={{ xs: 12, md: 12 }}>
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
            acadlixOptions?.default_img_url
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
    </Grid>
  )
}
