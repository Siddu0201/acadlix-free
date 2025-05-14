import React from 'react'
import CustomTypography from '../../../../components/CustomTypography';
import { Autocomplete, Box, Divider, FormControl, FormControlLabel, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { Typography } from '@mui/material';
import { Card, CardContent } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { __ } from '@wordpress/i18n';
import GridItem1 from '../../../../components/GridItem1';
import CustomSwitch from '../../../../components/CustomSwitch';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { convertToPostDate } from '../../../../helpers/util';
import CustomTextField from '../../../../components/CustomTextField';

const OptionSection = (props) => {
    const MimeTypes = [
        {
            extension: "pdf",
            label: "PDF",
        },
        {
            extension: "doc",
            label: "Word",
        },
        {
            extension: "docx",
            label: "Word",
        },
        {
            extension: "xls",
            label: "Excel",
        },
        {
            extension: "xlsx",
            label: "Excel",
        },
        {
            extension: "txt",
            label: "Text",
        },
        {
            extension: "ppt",
            label: "PowerPoint",
        },
        {
            extension: "pptx",
            label: "PowerPoint",
        },
        {
            extension: "jpeg",
            label: "Images",
        },
        {
            extension: "jpg",
            label: "Images",
        },
        {
            extension: "png",
            label: "Images",
        },

    ];

    return (
        <Grid size={{ xs: 12, sm: 12 }}>
            <Card>
                <CardContent>
                    <Box
                        sx={{
                            marginY: 2,
                        }}>
                        <Box sx={{ color: "black" }}>
                            <Typography variant="h6">{__("Options", "acadlix")}</Typography>
                            <Divider />
                        </Box>
                    </Box>
                    <Grid
                        container
                        spacing={3}
                        alignItems="center"
                    >
                        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
                            <CustomTypography>{__("Select Assignment Type", "acadlix")}</CustomTypography>
                        </GridItem1>
                        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
                            <FormControl fullWidth size="small">
                                <InputLabel id="assignment-type">
                                    {__("Select Assignment Type", "acadlix")}
                                </InputLabel>
                                <Select
                                    labelId="assignment-type"
                                    id="assignment-type"
                                    value={props?.watch(`meta.assignment_type`)}
                                    label={__("Select Assignment Type", "acadlix")}
                                    onChange={(e) => {
                                        props?.setValue(
                                            `meta.assignment_type`,
                                            e?.target?.value,
                                            {
                                                shouldDirty: true,
                                            }
                                        );
                                    }}
                                >
                                    <MenuItem value="writing">{__("Writing", "acadlix")}</MenuItem>
                                    <MenuItem value="file_upload">{__("File Upload", "acadlix")}</MenuItem>
                                </Select>
                            </FormControl>
                        </GridItem1>
                        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
                            <CustomTypography>{__("Allow Multiple", "acadlix")}</CustomTypography>
                        </GridItem1>
                        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
                            <FormControlLabel
                                control={<CustomSwitch />}
                                checked={props?.watch("meta.allow_multiple") ?? false}
                                onChange={(e) => {
                                    props?.setValue("meta.allow_multiple", e?.target?.checked, {
                                        shouldDirty: true,
                                    });
                                }}
                                disabled={
                                    props?.watch("meta.assignment_type") !== "file_upload"
                                }
                                label={__("Activate", "acadlix")}
                            />
                        </GridItem1>
                        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
                            <CustomTypography>{__("Allowed Mime Type(s)", "acadlix")}</CustomTypography>
                        </GridItem1>
                        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
                            <Autocomplete
                                size="small"
                                fullWidth
                                multiple
                                id="mime-types"
                                options={MimeTypes}
                                getOptionLabel={(option) => `${option.label} (.${option.extension})`}
                                filterSelectedOptions
                                value={props?.watch(`meta.allowed_mime_types`)}
                                onChange={(event, value) => {
                                    props?.setValue(`meta.allowed_mime_types`, value, {
                                        shouldDirty: true,
                                    });
                                }}
                                disabled={
                                    props?.watch("meta.assignment_type") !== "file_upload"
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        slotProps={{
                                            input: {
                                                ...params.InputProps,
                                                autoComplete: "mime-types",
                                            }
                                        }}
                                        variant="outlined"
                                        label={__("Allowed Mime Type(s)", "acadlix")}
                                        placeholder={__("Select Mime Type(s)", "acadlix")}
                                    />
                                )}
                            />
                        </GridItem1>
                        <GridItem1 size={{ xs: 12, sm: 12, lg: 6 }} />
                        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
                            <CustomTypography>{__("Enable marking", "acadlix")}</CustomTypography>
                        </GridItem1>
                        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
                            <FormControlLabel
                                control={<CustomSwitch />}
                                checked={props?.watch("meta.enable_marking") ?? false}
                                onChange={(e) => {
                                    props?.setValue("meta.enable_marking", e?.target?.checked, {
                                        shouldDirty: true,
                                    });
                                }}
                                label={__("Activate", "acadlix")}
                            />
                        </GridItem1>
                        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
                            <CustomTypography>{__("Max. Marks", "acadlix")}</CustomTypography>
                        </GridItem1>
                        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
                            <CustomTextField
                                size="small"
                                fullWidth
                                type="number"
                                value={props?.watch(`meta.max_marks`)}
                                onChange={(e) => {
                                    props?.setValue(`meta.max_marks`, Number(e?.target?.value), {
                                        shouldDirty: true,
                                    });
                                }}
                                label={__("Max. Marks", "acadlix")}
                                disabled={!props?.watch("meta.enable_marking")}
                            />
                        </GridItem1>
                        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
                            <CustomTypography>{__("Start Date", "acadlix")}</CustomTypography>
                        </GridItem1>
                        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
                            <DemoContainer components={["DateTimePicker"]} sx={{
                                "& .MuiFormControl-root ": {
                                    minWidth: "100% !important",
                                },
                            }}>
                                <DateTimePicker
                                    label={__("Enter Start Date", "acadlix")}
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
                                    value={
                                        props?.watch("meta.start_date")
                                            ? dayjs(props?.watch("meta.start_date"))
                                            : null
                                    }
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
                        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
                            <CustomTypography>{__("End Date", "acadlix")}</CustomTypography>
                        </GridItem1>
                        <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
                            <DemoContainer components={["DateTimePicker"]} sx={{
                                "& .MuiFormControl-root ": {
                                    minWidth: "100% !important",
                                },
                            }}>
                                <DateTimePicker
                                    label={__("Enter End Date", "acadlix")}
                                    timeSteps={{
                                        minutes: 1,
                                    }}
                                    sx={{
                                        ".MuiFormControl-root ": {
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
                                    format="DD/MM/YYYY hh:mm:a"
                                    value={
                                        props?.watch("meta.end_date")
                                            ? dayjs(props?.watch("meta.end_date"))
                                            : null
                                    }
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
                        </GridItem1>

                    </Grid>
                </CardContent>
            </Card>
        </Grid>
    )
}

export default OptionSection