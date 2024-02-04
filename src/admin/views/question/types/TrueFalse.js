import React from "react";
import {
  CardHeader,
  CardContent,
  FormControlLabel,
  RadioGroup,
  Radio,
  Card,
} from "@mui/material";

function TrueFalse(props) {

  return (
    <Card>
      <CardHeader title="True/False"
      titleTypographyProps={{
        variant: 'h6'
      }}></CardHeader>
      <CardContent sx={{
        paddingTop: 1
      }}>
        <RadioGroup row>
          {
            props?.lang?.answer_data?.[props?.type]?.length > 0 &&
            props?.lang?.answer_data?.[props?.type]?.map((option, option_index) => (
              <FormControlLabel
                key={option_index} 
                control={
                  <Radio 
                    checked={option?.isCorrect}
                    onClick={() => {
                      console.log(option)
                      props?.watch("language")?.forEach((lang, index) => {
                        lang?.answer_data?.[props?.type]?.forEach((_, oindex) => {
                          if(option_index === oindex){
                            props?.setValue(
                              `language.${index}.answer_data.${props?.type}.${oindex}.isCorrect`,
                              true,
                              {shouldDirty: true}
                            );
                          }else{
                            props?.setValue(
                              `language.${index}.answer_data.${props?.type}.${oindex}.isCorrect`,
                              false,
                              {shouldDirty: true}
                            );

                          }
                        })
                      })
                    }}
                  />
                } 
                label={option?.option} 
              />
            ))
          }
        </RadioGroup>
      </CardContent>
    </Card>
  );
}

export default TrueFalse;
