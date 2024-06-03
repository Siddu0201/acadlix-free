import React from "react";
import { CardHeader, CardContent, Grid, Card } from "@mui/material";
import CustomTextField from "../../../../components/CustomTextField";

function RangeType(props) {
  return (
    <Card>
      <CardHeader
        title={`Range Type (${props?.lang?.language_name})`}
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
          <Grid item xs={12} lg={6}>
            <CustomTextField
              fullWidth
              size="small"
              label="Range From"
              type="Number"
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
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            <CustomTextField
              fullWidth
              size="small"
              label="Range To"
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
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default RangeType;
