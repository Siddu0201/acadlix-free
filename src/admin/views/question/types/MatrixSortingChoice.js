import React, {useEffect} from "react";
import {
  CardHeader,
  CardContent,
  Button,
  Card,
  Grid,
  Typography,
} from "@mui/material";
import GridItem1 from "../../../../components/GridItem1";
import { __ } from "@wordpress/i18n";

function MatrixSortingChoice(props) {

  return (
    <Card>
      <CardHeader title={__('Matrix Sorting Choice', 'acadlix') + ` (${
        props?.lang?.language_name
      })`}
      titleTypographyProps={{
        variant: 'h6'
      }}
      ></CardHeader>
      <CardContent>
        <Grid container spacing={4}>
          {
              props?.lang?.answer_data?.[props?.type]?.length > 0 &&
              props?.lang?.answer_data?.[props?.type]?.map((option, index) => (
                <Grid item xs={12} lg={12} key={index}>
                  <Option 
                    {...props}
                    title={__('Option', 'acadlix') + ` ${index + 1}`} 
                    criteria_id={`crt_${props?.index}_${index}`}
                    element_id={`elm_${props?.index}_${index}`}
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
          <Grid item xs={12} lg={12}>
            <Button 
              variant="contained" 
              color="success"
              onClick={() => {
                props?.watch("language")?.forEach((_, index) => {
                  props?.setValue(
                      `language.${index}.answer_data.${props?.type}`, 
                      [...props?.watch(`language.${index}.answer_data.${props?.type}`), 
                       ...props?.getAnswerData(props?.type)?.map((opt) => {
                        return {...opt, position: props?.watch(`language.${index}.answer_data.${props?.type}`)?.length}
                       })
                      ], 
                      {shouldDirty: true}
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
    props?.loadEditor(props?.criteria_id, `language.${props?.language_index}.answer_data.${props?.type}.${props?.option_index}.criteria`);
    props?.loadEditor(props?.element_id, `language.${props?.language_index}.answer_data.${props?.type}.${props?.option_index}.element`);
  }  

  useEffect(() => {
    loadPage();
    window.addEventListener('load', loadPage);
    
    return () => {
      props?.removeEditor(props?.criteria_id);
      props?.removeEditor(props?.element_id);
      window.removeEventListener('load', loadPage);
    }
  },[]);
  return (
    <Card>
      <CardHeader title={props?.title}
      titleTypographyProps={{
        variant: 'h6'
      }}></CardHeader>
      <CardContent sx={{
        paddingTop: 1
      }}>
        <Grid container spacing={2}>
          <Grid item xs={6} lg={6}>
            <Typography variant="body1" sx={{
              fontWeight: 500,
              marginY: 2
            }}>
              {__('Criteria', 'acadlix')}
            </Typography>
            <textarea 
              id={props?.criteria_id} 
              style={{
                width: '100%'
              }}
              value={props?.option?.criteria}
              onChange={(e) => {
                let value = e?.target?.value;
                if (window.tinymce) {
                  const editor = window.tinymce.get(props?.criteria_id);
                  if (editor && editor.getContent() !== value) {
                    editor.setContent(value || "");
                  }
                }
                props.setValue(`language.${props?.language_index}.answer_data.${props?.type}.${props?.option_index}.criteria`, value, {
                  shouldDirty: true,
                });
              }}
            />
          </Grid>
          <Grid item xs={6} lg={6}>
            <Typography variant="body1" sx={{
              fontWeight: 500,
              marginY: 2
            }}>
              {__('Sort Element', 'acadlix')}
            </Typography>
            <textarea 
              id={props?.element_id} 
              style={{
                width: '100%'
              }}
              value={props?.option?.element}
              onChange={(e) => {
                let value = e?.target?.value;
                if (window.tinymce) {
                  const editor = window.tinymce.get(props?.element_id);
                  if (editor && editor.getContent() !== value) {
                    editor.setContent(value || "");
                  }
                }
                props.setValue(`language.${props?.language_index}.answer_data.${props?.type}.${props?.option_index}.element`, value, {
                  shouldDirty: true,
                });
              }}
            />
          </Grid>
          <GridItem1 lg={12} xs={12}>
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
                    {shouldDirty: true}
                    );
                })
              }}
            >
              {__('Delete', 'acadlix')}
            </Button>
          </GridItem1>
        </Grid>
      </CardContent>
    </Card>
  );
};
export default MatrixSortingChoice;
