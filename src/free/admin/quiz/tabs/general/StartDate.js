import React from 'react'
import GridItem1 from "@acadlix/components/GridItem1";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { convertToPostDate } from "@acadlix/helpers/util";
import { __ } from "@wordpress/i18n";
import Typography from "@mui/material/Typography";

const StartDate = (props) => {
    return (
        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
            <DemoContainer components={["DateTimePicker"]} sx={{
                "& .MuiFormControl-root ": {
                    minWidth: "100% !important",
                },
            }}>
                <DateTimePicker
                    label={__("Enter Start Date*", "acadlix")}
                    format="DD/MM/YYYY hh:mm:a"
                    timeSteps={{
                        minutes: 1,
                    }}
                    sx={{
                        "& .MuiFormControl-root ": {
                            maxHeight: "42px",
                        },
                        ".MuiInputBase-input": {
                            padding: "9px 14px !important",
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
        </GridItem1>
    )
}

export default StartDate