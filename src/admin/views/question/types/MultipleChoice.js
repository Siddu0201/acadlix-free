import React, { useEffect } from "react";
import {
  CardHeader,
  CardContent,
  FormControlLabel,
  Button,
  Checkbox,
  Card,
  Alert,
} from "@mui/material";
import Grid from '@mui/material/Grid';
import { Controller } from "react-hook-form";
import { __ } from "@wordpress/i18n";

function MultipleChoice(props) {
  return (
    <Card>
      <CardHeader title={__('Multiple Choice', 'acadlix') + ` ${props?.watch("multi_language") ? `(${props?.lang?.language_name})` : ""}`}
      ></CardHeader>
      <CardContent>
        <Grid container spacing={4}>
          {
            props?.lang?.answer_data?.[props?.type]?.length > 0 &&
            props?.lang?.answer_data?.[props?.type]?.map((option, index) => (
              <Grid size={{ xs: 12, lg: 12 }} key={index}>
                <Option
                  {...props}
                  title={__('Option', 'acadlix') + ` ${index + 1}`}
                  id={`opt_${props?.index}_${index}`}
                  loadEditor={props?.loadEditor}
                  removeEditor={props?.removeEditor}
                  option={option}
                  option_index={index}
                  language_index={props?.index}
                  last={props?.lang?.answer_data?.[props?.type]?.length - 1 === index}
                />
              </Grid>
            ))
          }
          <Grid size={{ xs: 12, lg: 12 }}>
            <Button
              variant="contained"
              color="success"
              onClick={() => {
                props?.watch("language")?.forEach((_, index) => {
                  props?.setValue(
                    `language.${index}.answer_data.${props?.type}`,
                    [
                      ...props?.watch(`language.${index}.answer_data.${props?.type}`),
                      ...props?.getAnswerData(props?.type, props?.watch(`language.${index}.answer_data.${props?.type}`)?.length)
                    ],
                    { shouldDirty: true }
                  );
                })
              }}
            >
              {__('Add More', 'acadlix')}
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
const Option = (props) => {

  const loadPage = () => {
    props?.loadEditor(props?.id, `language.${props?.language_index}.answer_data.${props?.type}.${props?.option_index}.option`);
  }

  useEffect(() => {
    loadPage();
    window.addEventListener('load', loadPage);

    return () => {
      props?.removeEditor(props?.id);
      window.removeEventListener('load', loadPage);
    }
  }, []);

  return (
    <Card>
      <CardHeader title={props?.title}
        slotProps={{
          title: {
            variant: 'h6'
          }
        }}
      ></CardHeader>
      <CardContent sx={{
        paddingTop: 1
      }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, lg: 2 }}>
            {Boolean(
              props.formState?.errors?.language?.[props?.language_index]
                ?.answer_data?.[props?.type]?.[props?.option_index]?.isCorrect
            ) && (
                <Alert
                  severity="error"
                  sx={{
                    marginTop: 2,
                  }}
                >
                  {
                    props.formState.errors?.language?.[props?.language_index]
                      ?.answer_data?.[props?.type]?.[props?.option_index]
                      ?.isCorrect?.message
                  }
                </Alert>
              )}
            <Controller
              rules={{
                required: {
                  value:
                    props?.watch(`language.${props?.index}.default`) &&
                    props
                      ?.watch(
                        `language.${props?.language_index}.answer_data.${props?.type}`
                      )
                      .filter((d) => d?.isCorrect).length === 0,
                  message: __(
                    "Please set at least one correct option",
                    "acadlix"
                  ),
                },
              }}
              control={props.control}
              name={`language.${props?.language_index}.answer_data.${props?.type}.${props?.option_index}.isCorrect`}
              render={(data) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={props?.option?.isCorrect}
                      onBlur={data.field.onBlur}
                      onChange={(e) => {
                        if (e.target.checked !== undefined) {
                          props?.watch("language")?.forEach((lang, lindex) => {
                            props?.setValue(
                              `language.${lindex}.answer_data.${props?.type}.${props?.option_index}.isCorrect`,
                              e.target?.checked,
                              { shouldDirty: true }
                            )
                          })
                        }
                      }}
                    />
                  }
                  label={__('Correct', 'acadlix')}
                />
              )}
            />
            <Button
              variant="contained"
              color="error"
              sx={{
                display: props?.last ? "" : "none"
              }}
              onClick={() => {
                props?.watch("language")?.forEach((_, lindex) => {
                  props?.setValue(
                    `language.${lindex}.answer_data.${props?.type}`,
                    props?.watch(`language.${lindex}.answer_data.${props?.type}`)?.filter((_, index) => index !== props?.option_index),
                    { shouldDirty: true }
                  );
                })
              }}
            >
              {__('Delete', 'acadlix')}
            </Button>
          </Grid>
          <Grid size={{ xs: 12, lg: 10 }}>
            <textarea
              {...props?.register(
                `language.${props?.language_index}.answer_data.${props?.type}.${props?.option_index}.option`,
                {
                  required: {
                    value: props?.watch(
                      `language.${props?.language_index}.default`
                    ),
                    message: __(
                      "Option is required",
                      "acadlix"
                    ),
                  },
                }
              )}
              id={props?.id}
              style={{
                width: '100%'
              }}
              value={props?.option?.option}
              onChange={(e) => {
                let value = e?.target?.value;
                if (window.tinymce) {
                  const editor = window.tinymce.get(props?.id);
                  if (editor && editor.getContent() !== value) {
                    editor.setContent(value || "");
                  }
                }
                props.setValue(`language.${props?.language_index}.answer_data.${props?.type}.${props?.option_index}.option`, value, {
                  shouldDirty: true,
                });
              }}
            />
            {Boolean(
              props.formState?.errors?.language?.[props?.language_index]
                ?.answer_data?.[props?.type]?.[props?.option_index]?.option
            ) && (
                <Alert
                  severity="error"
                  sx={{
                    marginTop: 2,
                  }}
                >
                  {
                    props.formState.errors?.language?.[props?.language_index]
                      ?.answer_data?.[props?.type]?.[props?.option_index]?.option
                      ?.message
                  }
                </Alert>
              )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
export default MultipleChoice;
