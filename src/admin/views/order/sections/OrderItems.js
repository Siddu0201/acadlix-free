import {
    Autocomplete,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Divider,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import React from 'react'
import { __ } from '@wordpress/i18n';
import { FaTrash } from '@acadlix/helpers/icons';
import { GetOrderCourses } from '@acadlix/requests/admin/AdminOrderRequest';
import CustomTypography from '@acadlix/components/CustomTypography';

const OrderItems = (props) => {
    const handleRemoveOrder = (id) => {
        props.setValue("order_items",
            props?.watch("order_items").filter((item) => item?.course_id !== id),
            { shouldDirty: true }
        );
        props.setValue("courses",
            props?.watch("courses").filter((item) => item?.ID !== id),
            { shouldDirty: true }
        );
    }
    return (
        <Grid size={{ xs: 12, sm: 12 }}>
            <Card>
                <CardContent>
                    <Box
                        sx={{
                            marginY: 2,
                        }}
                    >
                        <Typography variant="h4">{__("Add Course(s) to Order", "acadlix")}</Typography>
                        <Divider />
                    </Box>
                    <Grid
                        container
                        spacing={3}
                        alignItems="center"
                    >
                        <Grid size={{ xs: 12, sm: 6, lg: 2 }}>
                            <CustomTypography>{__("Add Courses", "acadlix")}</CustomTypography>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
                            <OrderCourse {...props} />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 12, lg: 12 }}>
                            <TableContainer>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>{__("Course", "acadlix")}</TableCell>
                                            <TableCell>{__("Quantity", "acadlix")}</TableCell>
                                            <TableCell>{__("Price", "acadlix")}</TableCell>
                                            <TableCell>{__("Discount", "acadlix")}</TableCell>
                                            <TableCell>{__("Price After Discount", "acadlix")}</TableCell>
                                            <TableCell>{__("Tax", "acadlix")}</TableCell>
                                            <TableCell>{__("Price After Tax", "acadlix")}</TableCell>
                                            <TableCell>{__("Action", "acadlix")}</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {props?.watch("order_items")?.map((item, index) => {
                                            return (
                                                <TableRow
                                                    key={index}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell component="th" scope="row">
                                                        {item?.course_title}
                                                    </TableCell>
                                                    <TableCell>{item?.quantity}</TableCell>
                                                    <TableCell>{item?.price}</TableCell>
                                                    <TableCell>{item?.discount}</TableCell>
                                                    <TableCell>{item?.price_after_discount}</TableCell>
                                                    <TableCell>{item?.tax}</TableCell>
                                                    <TableCell>{item?.price_after_tax}</TableCell>
                                                    <TableCell>
                                                        <IconButton onClick={handleRemoveOrder.bind(this, item?.course_id)}>
                                                            <FaTrash style={{
                                                                fontSize: 14,
                                                            }} />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
                                        {props?.watch("order_items")?.length > 0 && (
                                            <>
                                                <TableRow>
                                                    <TableCell rowSpan={4} colSpan={5} />
                                                    <TableCell>{__("Subtotal", "acadlix")}</TableCell>
                                                    <TableCell>{props?.watch("order_items")?.reduce((total, item) => total + item?.price, 0)}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>{__("Discount", "acadlix")}</TableCell>
                                                    <TableCell>{props?.watch("order_items")?.reduce((total, item) => total + item?.discount, 0)}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>{__("Tax", "acadlix")}</TableCell>
                                                    <TableCell>{props?.watch("order_items")?.reduce((total, item) => total + item?.tax, 0)}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>{__("Total", "acadlix")}</TableCell>
                                                    <TableCell><b>{props?.watch("order_items")?.reduce((total, item) => total + item?.price_after_tax, 0)}</b></TableCell>
                                                </TableRow>
                                            </>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Grid>
    )
}

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

export default OrderItems
