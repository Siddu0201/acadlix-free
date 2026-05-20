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
import { __ } from "@wordpress/i18n";

function TrueFalse(props) {
  return (
    <Card>
      <CardHeader
        title={__('True/False', 'acadlix') + ` ${props?.watch("multi_language") ? `(${props?.lang?.language_name})` : ""}`}
      ></CardHeader>
      <CardContent
        sx={{
          paddingTop: 1,
        }}
      >
        <Controller
          control={props.control}
          name={`language.${props.index}.answer_data.${props.type}`}
          rules={{
            validate: (answers) => {
              const hasCorrect = answers?.some(a => a?.isCorrect);

              if (
                props.watch(`language.${props.index}.default`) &&
                !hasCorrect
              ) {
                return __("Please set atleast one correct option", "acadlix");
              }

              return true;
            },
          }}
          render={() => null}
        />
        {props.formState.errors?.language?.[props.index]
          ?.answer_data?.[props.type] && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {
                props.formState.errors.language[props.index]
                  .answer_data[props.type].message
              }
            </Alert>
          )}
        <RadioGroup row>
          {props?.watch(`language.${props?.index}.answer_data.${props?.type}`)?.length > 0 &&
            props?.watch(`language.${props?.index}.answer_data.${props?.type}`)?.map(
              (option, option_index) => (
                <Controller
                  key={option_index}
                  // rules={{
                  //   required: props?.watch(`language.${props?.index}.default`) &&
                  //     props
                  //       ?.watch(
                  //         `language.${props?.index}.answer_data.${props?.type}`
                  //       )
                  //       .filter((d) => d?.isCorrect).length === 0
                  // }}
                  control={props?.control}
                  name={`language.${props?.index}.answer_data.${props?.type}.${option_index}.isCorrect`}
                  render={(data) => (
                    <FormControlLabel
                      key={option_index}
                      control={<Radio />}
                      onBlur={data.field.onBlur}
                      checked={data.field.value}
                      onChange={() => {
                        const answers = props.watch(
                          `language.${props.language_index}.answer_data.${props.type}`
                        );

                        answers.forEach((_, index) => {
                          props.setValue(
                            `language.${props.language_index}.answer_data.${props.type}.${index}.isCorrect`,
                            index === option_index,
                            {
                              shouldDirty: true,
                              shouldValidate: true,
                            }
                          );
                        });
                        // props?.setValue(
                        //   "language",
                        //   props?.watch("language")?.map((lang) => {
                        //     lang.answer_data[props?.type] = lang?.answer_data?.[
                        //       props?.type
                        //     ]?.map((answer, o_index) => {
                        //       if (option_index === o_index) {
                        //         answer.isCorrect = true;
                        //       } else {
                        //         answer.isCorrect = false;
                        //       }
                        //       return answer;
                        //     });
                        //     return lang;
                        //   }),
                        //   { shouldDirty: true }
                        // );
                      }}
                      label={option?.option === "True" ? __("True", "acadlix") : __("False", "acadlix")}
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
