import React from "react";
import { CardHeader, CardContent, Card } from "@mui/material";
import CustomTextField from "../../../../components/CustomTextField";

function Numerical(props) {
  return (
    <Card>
      <CardHeader
        title={`Numerical (${props?.lang?.language_name})`}
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
          size="small"
          type="number"
          label="Enter number"
          helperText="Numerical values only"
          value={props?.lang?.[props?.type]?.option}
          onChange={(e) => {
            props?.watch("language")?.forEach((lang, lindex) => {
              props?.setValue(
                `language.${lindex}.answer_data.${props?.type}.option`,
                e?.target?.value,
                { shouldDirty: true }
              );
            });
          }}
        />
      </CardContent>
    </Card>
  );
}

export default Numerical;
