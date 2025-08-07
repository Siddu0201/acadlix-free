import React from 'react'
import Grid from '@mui/material/Grid';
import { Typography } from '@mui/material';
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { convertToPostDate } from "@acadlix/helpers/util";
import { __ } from "@wordpress/i18n";

const StartDate = (props) => {
    return (
        <Grid size={{ xs: 12, sm: 12 }}>
            <DemoContainer components={["DateTimePicker"]}>
                <DateTimePicker
                    format="DD/MM/YYYY hh:mm:a"
                    timeSteps={{
                        minutes: 1,
                    }}
                    sx={{
                        ".MuiInputBase-input": {
                            padding: "8px 14px !important",
                        },
                        ".MuiInputBase-input:focus": {
                            padding: "8px 14px !important",
                        },
                    }}
                    disabled
                    // value={
                    //     props?.watch("meta.start_date")
                    //         ? dayjs(props?.watch("meta.start_date"))
                    //         : null
                    // }
                    onChange={(value) => {
                        props?.setValue("meta.start_date", convertToPostDate(value), {
                            shouldDirty: true,
                        });
                    }}
                />
            </DemoContainer>
            {props?.formState?.errors?.meta?.start_date && (
                <Typography component="p" color="error">
                    {props?.formState?.errors?.meta?.start_date?.message}
                </Typography>
            )}
        </Grid>
    )
}

export default StartDate