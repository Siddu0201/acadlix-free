import React from "react";
import { CardHeader, CardContent, Card } from "@mui/material";
import CustomTextField from "../../../../components/CustomTextField";
import { __ } from "@wordpress/i18n";

function Numerical(props) {
  return (
    <Card>
      <CardHeader
        title={
          props?.watch("multi_language")
            ? __("Numerical", "acadlix") + ` (${props?.lang?.language_name})`
            : __("Numerical", "acadlix")
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
        <CustomTextField
          {...props?.register(
            `language.${props?.index}.answer_data.${props?.type}.option`,
            {
              valueAsNumber: true,
              required: {
                value: props?.watch(`language.${props?.index}.default`),
                message: "Required",
              },
            }
          )}
          size="small"
          type="number"
          label={__("Enter number", "acadlix")}
          inputProps={{
            step: 0.000001,
          }}
          value={props?.lang?.answer_data?.[props?.type]?.option}
          onChange={(e) => {
            props?.watch("language")?.forEach((lang, lindex) => {
              props?.setValue(
                `language.${lindex}.answer_data.${props?.type}.option`,
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
            props.formState?.errors?.language?.[props?.index]?.answer_data?.[
              props?.type
            ]?.option
          )}
          helperText={
            props.formState.errors?.language?.[props?.index]?.answer_data?.[
              props?.type
            ]?.option?.message
          }
        />
      </CardContent>
    </Card>
  );
}

export default Numerical;
