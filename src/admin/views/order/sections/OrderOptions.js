import { Autocomplete, Box, Button, Card, CardContent, CircularProgress, Divider, FormControl, FormControlLabel, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import React from 'react'
import { __ } from '@wordpress/i18n';
import CustomTypography from '../../../../components/CustomTypography';
import { GetOrderCourses, GetOrderUsers } from '../../../../requests/admin/AdminOrderRequest';
import CustomSwitch from '../../../../components/CustomSwitch';

const OrderOptions = (props) => {
    return (
        <Grid size={{ xs: 12, sm: 12 }}>
            <Card>
                <CardContent>
                    <Box
                        sx={{
                            marginY: 2,
                        }}
                    >
                        <Typography variant="h6">{__("Order Options", "acadlix")}</Typography>
                        <Divider />
                    </Box>
                    <Grid
                        container
                        spacing={3}
                        alignItems="center"
                        sx={{
                            color: "black",
                        }}
                    >
                        <Grid size={{ xs: 12, sm: 6, lg: 2 }}>
                            <CustomTypography>{__("Add Order Items", "acadlix")}</CustomTypography>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
                            <OrderCourse {...props} />
                        </Grid>
                        {
                            props?.create ?
                                (
                                    <>
                                        <Grid size={{ xs: 12, sm: 6, lg: 2 }}>
                                            <CustomTypography>{__("Select user", "acadlix")}</CustomTypography>
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
                                            <OrderUser {...props} />
                                        </Grid>
                                    </>
                                ) :
                                (
                                    <>
                                        <Grid size={{ xs: 12, sm: 6, lg: 2 }}>
                                            <CustomTypography>{__("User", "acadlix")}</CustomTypography>
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
                                            <Typography variant='body1' component={'div'}>
                                                {props?.watch("user_name")}
                                                {props?.watch("user_email") &&
                                                    <Typography variant='body2'>({props?.watch("user_email")})</Typography>
                                                }
                                            </Typography>
                                        </Grid>
                                    </>
                                )
                        }
                        <Grid size={{ xs: 12, sm: 6, lg: 2 }}>
                            <CustomTypography>{__("Is Free", "acadlix")}</CustomTypography>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
                            <FormControlLabel
                                control={
                                    <CustomSwitch
                                        checked={props.watch("meta.is_free") ?? false}
                                        onChange={(e) => {
                                            if (e?.target?.checked) {
                                                props?.setValue("order_items",
                                                    props?.watch("order_items")?.map((item) => {
                                                        return {
                                                            ...item,
                                                            discount: item?.price,
                                                            price_after_discount: 0,
                                                            tax: 0,
                                                            price_after_tax: 0
                                                        }
                                                    })
                                                );
                                            } else {
                                                props?.setValue("order_items",
                                                    props?.watch("order_items")?.map((item) => {
                                                        const course = props?.watch("courses")?.find(c => c?.ID === item?.course_id);
                                                        const price_after_discount = item?.price;
                                                        const tax = course?.rendered_metas?.tax && Number(course?.rendered_metas?.tax_percent) > 0 ?
                                                            item?.price > 0 ?
                                                                Math.round((Number(course?.rendered_metas?.tax_percent) * price_after_discount / 100) * 100) / 100
                                                                : 0
                                                            : 0;
                                                        const price_after_tax = price_after_discount + tax;
                                                        return {
                                                            ...item,
                                                            discount: 0,
                                                            price_after_discount: price_after_discount,
                                                            tax: tax,
                                                            price_after_tax: price_after_tax
                                                        }
                                                    })
                                                );
                                            }
                                            props?.setValue("total_amount",
                                                props?.watch("order_items")?.reduce((acc, item) => acc + item?.price_after_tax, 0),
                                                {
                                                    shouldDirty: true
                                                });
                                            props?.setValue("meta.is_free", e?.target?.checked, {
                                                shouldDirty: true,
                                            });
                                        }}
                                    />
                                }
                                label={__('Activate', 'acadlix')}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, lg: 2 }}>
                            <CustomTypography>{__("Status", "acadlix")}</CustomTypography>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
                            <FormControl
                                size="small"
                                fullWidth
                            >
                                <InputLabel id="demo-simple-select-label">
                                    {__("Status", "acadlix")}
                                </InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={props?.watch("status")}
                                    label={__("Status", "acadlix")}
                                    onChange={(e) => {
                                        props?.setValue("status", e?.target?.value, {
                                            shouldDirty: true,
                                        });
                                    }}
                                >
                                    <MenuItem value="pending">{__("Pending", "acadlix")}</MenuItem>
                                    <MenuItem value="success">{__("Success", "acadlix")}</MenuItem>
                                    <MenuItem value="failed">{__("Failed", "acadlix")}</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Grid>
    )
}

export default OrderOptions


const OrderCourse = (props) => {
    const [inputValue, setInputValue] = React.useState("");
    const [course, setCourse] = React.useState(null);

    const { data, isFetching, refetch } = GetOrderCourses(inputValue);
    React.useEffect(() => {
        if (inputValue?.length >= 3) {
            refetch();
        }
    }, [inputValue]);
    const handleAddOrderItem = () => {
        if (course) {
            const price = course?.rendered_metas?.enable_sale_price ?
                Number(course?.rendered_metas?.sale_price) || 0
                : Number(course?.rendered_metas?.price) || 0;
            const discount = props?.watch("meta.is_free") ? price : 0;
            const price_after_discount = price - discount;
            const tax = course?.rendered_metas?.tax && Number(course?.rendered_metas?.tax_percent) > 0 ?
                price > 0 ?
                    Math.round((Number(course?.rendered_metas?.tax_percent) * price_after_discount / 100) * 100) / 100
                    : 0
                : 0;
            const price_after_tax = price_after_discount + tax;
            props?.setValue("courses", [...props?.watch("courses"), course], { shouldDirty: true });
            props?.setValue(
                "order_items",
                [...props?.watch("order_items"),
                {
                    course_id: course?.ID,
                    course_title: course?.post_title,
                    quantity: 1,
                    price: price,
                    discount: discount,
                    price_after_discount: price_after_discount,
                    tax: tax,
                    price_after_tax: price_after_tax
                }
                ]);

            props?.setValue("total_amount",
                props?.watch("order_items")?.reduce((acc, item) => acc + item?.price_after_tax, 0),
                {
                    shouldDirty: true
                });
            setInputValue("");
            setCourse(null);
        }
    }


    return (
        <Box sx={{
            display: "flex",
            gap: 2
        }}>
            <Autocomplete
                size="small"
                freeSolo
                disableClearable
                inputValue={inputValue}
                loading={isFetching}
                fullWidth
                value={course}
                options={data?.data?.courses?.length > 0 ?
                    data?.data?.courses?.filter(c => !props?.watch("order_items")?.some(o => o?.course_id === c?.ID)) : []}
                getOptionLabel={(option) => option?.post_title || ""}
                isOptionEqualToValue={(option, value) => option?.ID === value?.ID}
                filterOptions={(x) => x}
                onInputChange={(event, newValue) => setInputValue(newValue)}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="outlined"
                        label={__('Type atleast 3 character', 'acadlix')}
                        slotProps={{
                            input: {
                                ...params.InputProps,
                                type: "search",
                                endAdornment: (
                                    <>
                                        {isFetching ? <CircularProgress color="inherit" size={20} /> : null}
                                        {params.InputProps.endAdornment}
                                    </>
                                ),
                            }
                        }}
                    />
                )}
                onChange={(_, newValue) => {
                    setCourse(newValue);
                }}
            />
            <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={handleAddOrderItem}
            >
                {__('Add', 'acadlix')}
            </Button>
        </Box>
    )
}


const OrderUser = (props) => {
    const [inputValue, setInputValue] = React.useState("");
    const { data, isFetching, refetch } = GetOrderUsers(inputValue);

    React.useEffect(() => {
        if (inputValue?.length >= 3) {
            refetch();
        }
    }, [inputValue]);

    return (
        <Autocomplete
            freeSolo
            disableClearable
            loading={isFetching}
            size="small"
            fullWidth
            value={
                data?.data?.users?.find(u => u?.ID == props?.watch("user_id")) ?? null
            }
            options={data?.data?.users?.length > 0 ?
                data?.data?.users : []}
            getOptionLabel={(option) => option?.display_name || ""}
            isOptionEqualToValue={(option, value) => option?.ID === value?.ID}
            filterOptions={(x) => x}
            onInputChange={(event, newValue) => setInputValue(newValue)}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="outlined"
                    label={__('Type atleast 3 character', 'acadlix')}
                    slotProps={{
                        input: {
                            ...params.InputProps,
                            type: "search",
                            endAdornment: (
                                <>
                                    {isFetching ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </>
                            ),
                        }
                    }}
                />
            )}
            onChange={(_, newValue) => {
                props?.setValue("user_id", newValue?.ID, {
                    shouldDirty: true
                });
                setInputValue("");
            }}
        />
    )
}
