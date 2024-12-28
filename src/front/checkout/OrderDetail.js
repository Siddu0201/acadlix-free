import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import React from "react";
import { FaTrashAlt } from "react-icons/fa";
import { DeleteCourseFromCart } from "../../requests/front/FrontCheckoutRequest";

const OrderDetail = (props) => {
  const removeCourseMutation = DeleteCourseFromCart();
  const handleRemoveCourse = (id = 0) => {
    removeCourseMutation?.mutate(
      { id: id },
      {
        onSuccess: (data) => {
          if (data?.data?.cart) {
            props?.setCartData(data?.data?.cart);
          }
        },
      }
    );
  };
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
                  <Grid item xs={12} md={12} key={index}>
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
                          c?.course?.post?.thumbnail_url ??
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
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: "bold",
                          }}
                        >
                          {c?.course?.post?.post_title}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <Typography variant="body1">
                            <b>{`${props?.currencyPosition(
                              Boolean(Number(c?.course?.enable_sale_price))
                                ? c?.course?.sale_price
                                : c?.course?.price
                            )} `}</b>
                          </Typography>
                          {Boolean(Number(c?.course?.enable_sale_price)) && (
                            <Typography variant="body2">
                              <del>
                                {props?.currencyPosition(c?.course?.price)}
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
                          onClick={handleRemoveCourse.bind(this, c?.id)}
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
                ))
              )}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default OrderDetail;
