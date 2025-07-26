import React from 'react'
import Grid from '@mui/material/Grid2';
import { Typography } from '@mui/material';
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { convertToPostDate } from "@acadlix/helpers/util";
import { __ } from "@wordpress/i18n";

const EndDate = (props) => {
    return (
        <Grid size={{ xs: 12, sm: 12 }}>
            <DemoContainer components={["DateTimePicker"]}>
                <DateTimePicker
                    format="DD/MM/YYYY hh:mm:a"
                    timeSteps={{
                        minutes: 1,
                    }}
                    sx={{
                        // ".MuiFormControl-root ": {
                        //     maxHeight: "42px",
                        // },
                        ".MuiInputBase-input": {
                            padding: "8px 14px !important",
                            border: `0 !important`,
                            boxShadow: `none !important`,
                        },
                        ".MuiInputBase-input:focus": {
                            padding: "8px 14px !important",
                            border: `0 !important`,
                            boxShadow: `none !important`,
                        },
                        ".MuiFormLabel-root": {
                            top: "-7px !important",
                        },
                        ".MuiInputLabel-shrink": {
                            top: "0px !important",
                        },
                    }}
                    disabled
                    // value={
                    //     props?.watch("meta.end_date")
                    //         ? dayjs(props?.watch("meta.end_date"))
                    //         : null
                    // }
                    onChange={(value) => {
                        props?.setValue("meta.end_date", convertToPostDate(value), {
                            shouldDirty: true,
                        });
                    }}
                />
            </DemoContainer>
            {props?.formState?.errors?.meta?.end_date && (
                <Typography component="p" color="error">
                    {props?.formState?.errors?.meta?.end_date?.message}
                </Typography>
            )}
        </Grid>
    )
}

export default EndDate