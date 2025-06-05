import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import React from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom';
import { TiArrowLeftThick } from '../../../helpers/icons';
import { __ } from '@wordpress/i18n';
import OrderItems from './sections/OrderItems';
import OrderOptions from './sections/OrderOptions';
import toast from 'react-hot-toast';
import { PostCreateOrder, UpdateOrderById } from '../../../requests/admin/AdminOrderRequest';

const OrderContent = (props) => {
    const getOrderMetaValue = (order_metas = [], meta_key = "", order_default = "") => {
        return order_metas?.find((o) => o?.meta_key === meta_key)?.meta_value ?? order_default;
    };

    const methods = useForm({
        defaultValues: {
            status: props?.order?.status ?? "pending",
            user_id: props?.order?.user_id ?? null,
            user_name: props?.order?.user?.display_name ?? "",
            user_email: props?.order?.user?.user_email ?? "",
            total_amount: props?.order?.total_amount ?? 0,
            order_items: props?.order?.order_items ?
                props?.order?.order_items?.map((item) => {
                    return {
                        course_id: item?.course_id,
                        course_title: item?.course_title,
                        quantity: item?.quantity,
                        price: item?.price,
                        discount: item?.discount,
                        price_after_discount: item?.price_after_discount,
                        tax: item?.tax,
                        price_after_tax: item?.price_after_tax
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
            },
            
        },
    });

    // console.log(methods?.watch());

    const navigate = useNavigate();
    const createMutation = PostCreateOrder();
    const updateMutation = UpdateOrderById(props?.order_id ?? 0);

    const onSubmit = (data) => {
        if (data?.order_items?.length == 0) {
            toast.error(__("Please add any order item.", "acadlix"));
            return;
        }

        if (!data?.user_id) {
            toast.error(__("Please select user.", "acadlix"));
            return;
        }
        if (props?.create) {
            createMutation?.mutate(data, {
                onSuccess: (data) => {
                    // console.log(data);
                    navigate('/');
                },
                onError: (error) => {
                    toast.error(error?.response?.data?.message);
                }
            });
        } else {
            updateMutation?.mutate(data, {
                onSuccess: (data) => {
                    // console.log(data);
                    navigate('/');
                },
                onError: (error) => {
                    toast.error(error?.response?.data?.message);
                }
            });
        }
    }
    return (
        <Box>
            <form onSubmit={methods?.handleSubmit(onSubmit)}>
                <Grid
                    container
                    rowSpacing={3}
                    spacing={4}
                    sx={{
                        padding: 4,
                    }}
                >
                    <Grid size={{ xs: 12, sm: 12 }}>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                            }}
                        >
                            <Button
                                variant="contained"
                                startIcon={<TiArrowLeftThick />}
                                size="medium"
                                sx={{
                                    width: "fit-content",
                                }}
                                LinkComponent={Link}
                                to="/"
                            >
                                {__("Back", "acadlix")}
                            </Button>
                            <Typography variant="h6">
                                {props?.create ? __("Create Order", "acadlix") : __("Edit Order", "acadlix")}
                            </Typography>
                        </Box>
                    </Grid>

                    <OrderOptions {...methods} {...props} />

                    <OrderItems {...methods} {...props} />

                    <Grid size={{ xs: 12, sm: 12 }}>
                        <Card>
                            <CardContent>
                                <Button
                                    variant="contained"
                                    size="medium"
                                    type="submit"
                                    loading={createMutation?.isPending || updateMutation?.isPending}
                                >

                                    {__("Save Changes", "acadlix")}
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </form>
        </Box>
    )
}

export default OrderContent
