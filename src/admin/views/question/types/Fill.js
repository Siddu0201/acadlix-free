import React from "react";
import { CardHeader, CardContent, Card, Box, Typography, FormControlLabel } from "@mui/material";
import Grid from '@mui/material/Grid';
import CustomTextField from "@acadlix/components/CustomTextField";
import { __ } from "@wordpress/i18n";
import GridItem1 from "@acadlix/components/GridItem1";
import CustomTypography from "@acadlix/components/CustomTypography";
import CustomSwitch from "@acadlix/components/CustomSwitch";

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

  return (
    <Card>
      <CardHeader
        title={__('Fill in the Blank', 'acadlix') + ` ${props?.watch("multi_language") ? `(${props?.lang?.language_name})` : ""}`}
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
                `To create a blank space for users to fill in, enclose the correct word(s) in curly brackets { }. For example:
              "The sky is {blue}."
              
              If you want to allow multiple correct answers, use square brackets [ ] inside the curly brackets. For example:
              "She {[runs][walks][jogs]} every morning."
              
              You can also add multiple blanks in a single question. For example:
              "{Cats} and {dogs} are common pets."
              `, 'acadlix')}
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
              value={props?.lang?.answer_data?.[props?.type]?.option}
              onChange={fillChange}
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
  );
}

export default Fill;
