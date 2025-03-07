import { Card, CardContent, CardHeader, FormControlLabel, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import React from 'react'
import { __ } from "@wordpress/i18n";
import GridItem1 from '../../../../components/GridItem1';
import CustomTextField from '../../../../components/CustomTextField';
import CustomTypography from '../../../../components/CustomTypography';
import CustomSwitch from '../../../../components/CustomSwitch';

const FreeChoice = (props) => {
    const freeChoiceChange = (e) => {
        console.log(e?.target?.value);
        props?.watch("language")?.forEach((lang, lindex) => {
            props?.setValue(
                `language.${lindex}.answer_data.${props?.type}.option`,
                e?.target?.value,
                { shouldDirty: true }
            );
            props?.setValue(
                `language.${lindex}.answer_data.${props?.type}.correctOption`,
                e?.target?.value?.split("\n")?.filter((x) => x.trim() !== ""),
                { shouldDirty: true }
            );
        });
    }
    console.log(props?.watch(`language.${props?.index}.answer_data.${props?.type}`));

    return (
        <Card>
            <CardHeader
                title={__('Free choice', 'acadlix') + ` ${props?.watch("multi_language") ? `(${props?.lang?.language_name})` : ""}`}
                slotProps={{
                    title: {
                        variant: 'h6'
                    }
                }}
            ></CardHeader>
            <CardContent
                sx={{
                    paddingTop: 1,
                }}
            >
                <Grid container spacing={3}>
                    <GridItem1 size={{ xs: 12, sm: 12, lg: 12 }}>
                        <Typography variant="body2" sx={{
                            whiteSpace: "pre-line",
                        }}>
                            {__(
                                `correct answers (one per line)`, 'acadlix')}
                        </Typography>
                    </GridItem1>
                    <GridItem1 size={{ xs: 12, sm: 12, lg: 12 }}>
                        <CustomTextField
                            {
                            ...props?.register(
                                `language.${props?.index}.answer_data.${props?.type}.option`,
                                {
                                    required: {
                                        value: props?.watch(
                                            `language.${props?.index}.default`
                                        ),
                                        message: __("Required", "acadlix"),
                                    }
                                }
                            )
                            }
                            fullWidth
                            size="small"
                            multiline
                            rows={4}
                            control={props?.control}
                            value={props?.watch(`language.${props?.index}.answer_data.${props?.type}.option`)}
                            onChange={freeChoiceChange}
                            error={Boolean(props.formState?.errors?.language?.[props?.index]
                                ?.answer_data?.[props?.type]?.option)}
                            helperText={props.formState.errors?.language?.[props?.index]
                                ?.answer_data?.[props?.type]?.option
                                ?.message}
                        />
                    </GridItem1>
                    <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
                        <CustomTypography>{__("Case Sensitive", "acadlix")}</CustomTypography>
                    </GridItem1>
                    <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
                        <FormControlLabel
                            control={
                                <CustomSwitch />
                            }
                            checked={props?.watch(`language.${props?.index}.answer_data.${props?.type}.caseSensitive`) ?? false}
                            onChange={(e) => {
                                props?.watch("language")?.forEach((_, lindex) => {
                                    props?.setValue(
                                        `language.${lindex}.answer_data.${props?.type}.caseSensitive`,
                                        e?.target?.checked,
                                        { shouldDirty: true }
                                    );
                                });
                            }}
                            label={__("Activate", "acadlix")}
                        />
                    </GridItem1>
                </Grid>
            </CardContent>
        </Card>
    )
}

export default FreeChoice
