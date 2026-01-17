import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Button,
  Alert,
} from "@mui/material";
import Grid from '@mui/material/Grid';
import { __ } from "@wordpress/i18n";

function SortingChoice(props) {
  const [newlyAddedOptionIndex, setNewlyAddedOptionIndex] = useState(null);

  return (
    <Card>
      <CardHeader title={__('Sorting Choice', 'acadlix') + ` ${props?.watch("multi_language") ? `(${props?.lang?.language_name})` : ""}`}
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
                  autoFocus={index === newlyAddedOptionIndex}
                  onFocused={() => setNewlyAddedOptionIndex(null)}
                />
              </Grid>
            ))
          }
          <Grid size={{ xs: 12, lg: 12 }}>
            <Button
              variant="contained"
              color="success"
              onClick={() => {
                const currentLength = props?.lang?.answer_data?.[props?.type]?.length ?? 0;
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
                setNewlyAddedOptionIndex(currentLength);
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

  // autofocus only when this option was just added via Add More
  useEffect(() => {
    if (props?.autoFocus) {
      // give time for editor to initialize
      const t = setTimeout(() => {
        const editor = window?.tinymce?.get(props?.id);
        if (editor && typeof editor.focus === "function") {
          editor.focus();
        } else {
          const el = document.getElementById(props?.id);
          if (el && typeof el.focus === "function") el.focus();
        }
        if (typeof props?.onFocused === "function") props.onFocused();
      }, 50);
      return () => clearTimeout(t);
    }
  }, [props?.autoFocus]);

  return (
    <Card>
      <CardHeader title={props?.title}
        slotProps={{
          title: {
            variant: 'h6'
          }
        }}></CardHeader>
      <CardContent>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 12 }}>
            <textarea
              {...props?.register(
                `language.${props?.language_index}.answer_data.${props?.type}.${props?.option_index}.option`,
                {
                  required: {
                    value: props?.watch(
                      `language.${props?.language_index}.default`
                    ),
                    message: __("Option is required", "acadlix"),
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
          <Grid size={{ xs: 12, sm: 12 }}>
            <Button
              variant="contained"
              color="error"
              sx={{
                display: props?.last ? "" : "none",
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
        </Grid>
      </CardContent>
    </Card>
  );
};
export default SortingChoice;
