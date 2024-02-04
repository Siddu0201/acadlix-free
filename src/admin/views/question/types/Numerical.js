import React from "react";
import {
  CardHeader,
  CardContent,
  Card,
} from "@mui/material";
import CustomTextField from "../../../../components/CustomTextField";

function Numerical(props) {
  return (
    <Card>
      <CardHeader title={`Numerical (${
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
            <CustomTextField
              key={index}
              size="small"
              type="number"
              label="Enter number"
              helperText="Numerical values only"
              value={option?.option}
              onChange={(e) => {
                console.log(e?.target?.value);
                props?.watch("language")?.forEach((lang, lindex) => {
                  lang?.answer_data?.[props?.type]?.forEach((_, option_index) => {
                      props?.setValue(
                        `language.${lindex}.answer_data.${props?.type}.${option_index}.option`,
                        e?.target?.value,
                        {shouldDirty: true}
                      );
                    
                  });
                })
              }}
            />
          ))
        }
      </CardContent>
    </Card>
  );
}

export default Numerical;
