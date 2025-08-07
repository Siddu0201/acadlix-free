import React from "react";
import { CardHeader, CardContent, Card } from "@mui/material";
import Grid from '@mui/material/Grid';
import CustomTextField from "@acadlix/components/CustomTextField";
import { __ } from "@wordpress/i18n";

function RangeType(props) {
  return (
    <Card>
      <CardHeader
        title={
          props?.watch("multi_language")
            ? __("Range Type", "acadlix") +
            ` (${props?.lang?.language_name})`
            : __("Range Type", "acadlix")
        }
        titleTypographyProps={{
          variant: "h6",
        }}
      ></CardHeader>
      <CardContent
        sx={{
          paddingTop: 1,
        }}
      >
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, lg: 6 }}>
            <CustomTextField
              {...props?.register(
                `language.${props?.index}.answer_data.${props?.type}.from`,
                {
                  valueAsNumber: true,
                  required: {
                    value: props?.watch(`language.${props?.index}.default`),
                    message: __("Required", "acadlix"),
                  },
                }
              )}
              fullWidth
              size="small"
              label={__("Range From", "acadlix")}
              type="number"
              inputProps={{
                step: 0.00001,
              }}
              value={props?.lang?.answer_data?.[props?.type]?.from}
              onChange={(e) => {
                props?.watch("language")?.forEach((lang, lindex) => {
                  props?.setValue(
                    `language.${lindex}.answer_data.${props?.type}.from`,
                    e?.target?.value,
                    { shouldDirty: true }
                  );
                });
              }}
              sx={{
                "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                {
                  display: "none",
                },
                "& input[type=number]": {
                  MozAppearance: "textfield",
                },
              }}
              error={Boolean(
                props.formState?.errors?.language?.[props?.index]
                  ?.answer_data?.[props?.type]?.from
              )}
              helperText={
                props.formState.errors?.language?.[props?.index]?.answer_data?.[
                  props?.type
                ]?.from?.message
              }
            />
          </Grid>
          <Grid size={{ xs: 12, lg: 6 }}>
            <CustomTextField
              {...props?.register(
                `language.${props?.index}.answer_data.${props?.type}.to`,
                {
                  valueAsNumber: true,
                  required: {
                    value: props?.watch(`language.${props?.index}.default`),
                    message: __("Required", "acadlix"),
                  },
                  validate: (value) =>
                    value >
                    props?.watch(
                      `language.${props?.index}.answer_data.${props?.type}.from`
                    ) || __("Must be greater than from", "acadlix"),
                }
              )}
              fullWidth
              size="small"
              label={__("Range To", "acadlix")}
              type="number"
              inputProps={{
                step: 0.00001,
              }}
              value={props?.lang?.answer_data?.[props?.type]?.to}
              onChange={(e) => {
                props?.watch("language")?.forEach((lang, lindex) => {
                  props?.setValue(
                    `language.${lindex}.answer_data.${props?.type}.to`,
                    e?.target?.value,
                    { shouldDirty: true }
                  );
                });
              }}
              sx={{
                "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                {
                  display: "none",
                },
                "& input[type=number]": {
                  MozAppearance: "textfield",
                },
              }}
              error={Boolean(
                props.formState?.errors?.language?.[props?.index]
                  ?.answer_data?.[props?.type]?.to
              )}
              helperText={
                props.formState.errors?.language?.[props?.index]?.answer_data?.[
                  props?.type
                ]?.to?.message
              }
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default RangeType;
