import React from "react";
import {
  CardHeader,
  CardContent,
  Grid,
  Card,
} from "@mui/material";
import CustomTextField from "../../../../components/CustomTextField";

function RangeType(props) {
  return (
    <Card>
      <CardHeader title={`Range Type (${
          props?.availableLanguage?.filter(
            (avl) => avl?.id === props?.lang?.language_id
          )?.[0]?.name
        })`}
      titleTypographyProps={{
        variant: 'h6'
      }}></CardHeader>
      <CardContent sx={{
        paddingTop: 1
      }}>
        {
          props?.lang?.answer_data?.[props?.type]?.length > 0 &&
          props?.lang?.answer_data?.[props?.type]?.map((option, index) => (
            <Grid container spacing={4} key={index}>
              <Grid item xs={12} lg={6}>
                <CustomTextField
                  fullWidth
                  size="small"
                  label="Range From"
                  type="Number"
                  value={option?.from}
                  onChange={(e) =>{
                    props?.watch("language")?.forEach((lang, lindex) => {
                      lang?.answer_data?.[props?.type]?.forEach((_, option_index) => {
                          props?.setValue(
                            `language.${lindex}.answer_data.${props?.type}.${option_index}.from`,
                            e?.target?.value,
                            {shouldDirty: true}
                          );
                        
                      });
                    })
                  }}
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <CustomTextField
                  fullWidth
                  size="small"
                  label="Range To"
                  type="number"
                  value={option?.to}
                  onChange={(e) =>{
                    props?.watch("language")?.forEach((lang, lindex) => {
                      lang?.answer_data?.[props?.type]?.forEach((_, option_index) => {
                          props?.setValue(
                            `language.${lindex}.answer_data.${props?.type}.${option_index}.to`,
                            e?.target?.value,
                            {shouldDirty: true}
                          );
                        
                      });
                    })
                  }}
                />
              </Grid>
            </Grid>
          ))
        }
      </CardContent>
    </Card>
  );
}

export default RangeType;
