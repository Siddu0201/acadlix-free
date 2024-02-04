import React from "react";
import { CardHeader, CardContent, Card } from "@mui/material";
import CustomTextField from "../../../../components/CustomTextField";

function Fill(props) {

  return (
    <Card>
      <CardHeader
        title={`Fill in the Blank (${
          props?.availableLanguage?.filter(
            (avl) => avl?.id === props?.lang?.language_id
          )?.[0]?.name
        })`}
        titleTypographyProps={{
          variant: "h6",
        }}
      ></CardHeader>
      <CardContent
        sx={{
          paddingTop: 1,
        }}
      >
        {
          props?.lang?.answer_data?.[props?.type]?.length > 0 &&
          props?.lang?.answer_data?.[props?.type]?.map((option, index) => (
            <CustomTextField
              key={index} 
              fullWidth 
              size="small" 
              multiline 
              rows={4} 
              value={option?.option}
              onChange={(e) => {
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

export default Fill;
