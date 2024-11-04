import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import React from "react";

const OrderDetail = (props) => {
  return (
    <Box>
      <Card>
        <CardHeader title="Order Details" />
        <Divider />
        <CardContent>
          <Grid container spacing={4}>
            {props?.isFetching ? (
              <Grid
                item
                xs={12}
                md={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <CircularProgress />
              </Grid>
            ) : props?.watch("cart")?.length > 0 ? (
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
                      image={c?.course?.post?.thumbnail_url ?? acadlixOptions?.default_img_url}
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
                      {c?.course?.sale_price === 0 && c?.course?.price === 0 ? (
                        <Chip label="Free" color="success" />
                      ) : (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <Typography variant="body1">
                            <b>{`${props?.currencyPosition(
                              c?.course?.sale_price === 0
                                ? c?.course?.price
                                : c?.course?.sale_price
                            )} `}</b>
                          </Typography>
                          {c?.course?.sale_price !== 0 && (
                            <Typography variant="body2">
                              <del>
                                {props?.currencyPosition(c?.course?.price)}
                              </del>
                            </Typography>
                          )}
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12} md={12}>
                <Typography variant="body1">No item in cart.</Typography>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default OrderDetail;
