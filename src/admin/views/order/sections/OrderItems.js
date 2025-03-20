import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from '@mui/material';
import Grid from '@mui/material/Grid2';
import React from 'react'
import { __ } from '@wordpress/i18n';
import { FaTrash } from '../../../../helpers/icons';

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
            <TableContainer component={Paper}>
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
    )
}

export default OrderItems
