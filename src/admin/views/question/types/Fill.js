import React from "react";
import { CardHeader, CardContent, Card } from "@mui/material";
import CustomTextField from "../../../../components/CustomTextField";
import { __ } from "@wordpress/i18n";

function Fill(props) {
  const fillChange = (e) => {
    let rxp = /{([^}]+)}/g;
    let currmatch;
    let found = [];
    let points = props?.watch(`points`);
    while (currmatch = rxp.exec(e?.target?.value)) {
      let newrxp = /\[([^\][]*)]/g;
      if (currmatch[1]?.includes('|')) {
        points = currmatch[1]?.split('|')?.[1];
        currmatch[1] = currmatch[1]?.split('|')?.[0];
      }
      if (currmatch[1]?.match(newrxp)?.length > 0) {
        let newCurrMatch, newFound = [];
        while (newCurrMatch = newrxp.exec(currmatch[1])) {
          newFound.push(newCurrMatch[1]);
        }
        found.push({ option: newFound, points: Number(points), yourAnswer: '' });
      } else {
        found?.push({ option: [currmatch[1]], points: Number(points), yourAnswer: '' });
      }
    }
    props?.watch("language")?.forEach((lang, lindex) => {
      props?.setValue(
        `language.${lindex}.answer_data.${props?.type}.option`,
        e?.target?.value,
        { shouldDirty: true }
      );
    });
    props?.watch("language")?.forEach((lang, lindex) => {
      props?.setValue(
        `language.${lindex}.answer_data.${props?.type}.correctOption`,
        found,
        { shouldDirty: true }
      );
    });
  };
  // console.log(props?.lang);

  return (
    <Card>
      <CardHeader
        title={__('Fill in the Blank', 'acadlix') + ` ${props?.watch("multi_language") ? `(${props?.lang?.language_name})` : ""}`}
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
          value={props?.lang?.answer_data?.[props?.type]?.option}
          onChange={fillChange}
          error={Boolean(props.formState?.errors?.language?.[props?.index]
            ?.answer_data?.[props?.type]?.option)}
          helperText={props.formState.errors?.language?.[props?.index]
            ?.answer_data?.[props?.type]?.option
            ?.message}
        />
      </CardContent>
    </Card>
  );
}

export default Fill;
