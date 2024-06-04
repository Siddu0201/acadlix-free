import React from "react";
import {
  CardHeader,
  CardContent,
  FormControlLabel,
  RadioGroup,
  Radio,
  Card,
  Alert,
} from "@mui/material";
import { Controller } from "react-hook-form";

function TrueFalse(props) {
  return (
    <Card>
      <CardHeader
        title="True/False"
        titleTypographyProps={{
          variant: "h6",
        }}
      ></CardHeader>
      <CardContent
        sx={{
          paddingTop: 1,
        }}
      >
        {Boolean(
          props.formState?.errors?.language?.[props?.index]
            ?.answer_data?.[props?.type]?.length > 0
        ) && (
          <Alert
            severity="error"
            sx={{
              marginTop: 2,
            }}
          >
            Please set atleast one correct option
          </Alert>
        )}
        <RadioGroup row>
          {props?.lang?.answer_data?.[props?.type]?.length > 0 &&
            props?.lang?.answer_data?.[props?.type]?.map(
              (option, option_index) => (
                <Controller
                  rules={{
                    required: props?.watch(`language.${props?.index}.default`) &&
                    props
                      ?.watch(
                        `language.${props?.index}.answer_data.${props?.type}`
                      )
                      .filter((d) => d?.isCorrect).length === 0
                  }}
                  control={props?.control}
                  name={`language.${props?.index}.answer_data.${props?.type}.${option_index}.isCorrect`}
                  render={(data) => (
                    <FormControlLabel
                      key={option_index}
                      control={
                        <Radio
                          checked={option?.isCorrect}
                          onChange={() => {
                            props?.setValue(
                              "language",
                              props?.watch("language")?.map((lang) => {
                                lang.answer_data[props?.type] = lang?.answer_data?.[
                                  props?.type
                                ]?.map((answer, o_index) => {
                                  if (option_index === o_index) {
                                    answer.isCorrect = true;
                                  } else {
                                    answer.isCorrect = false;
                                  }
                                  return answer;
                                });
                                return lang;
                              }),
                              { shouldDirty: true }
                            );
                          }}
                        />
                      }
                      label={option?.option}
                    />
                  )}
                />
              )
            )}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}

export default TrueFalse;
