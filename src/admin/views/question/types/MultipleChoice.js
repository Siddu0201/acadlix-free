import React, {useEffect} from "react";
import {
  CardHeader,
  CardContent,
  FormControlLabel,
  Button,
  Checkbox,
  Card,
  Grid,
} from "@mui/material";

function MultipleChoice(props) {
  return (
    <Card>
      <CardHeader title={`Multiple Choice (${
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
                  title={`Option${index + 1}`} 
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
          <Grid item xs={12} lg={12}>
            <Button 
              variant="contained" 
              color="success"
              onClick={() => {
                props?.watch("language")?.forEach((_, index) => {
                  props?.setValue(
                      `language.${index}.answer_data.${props?.type}`, 
                      [...props?.watch(`language.${index}.answer_data.${props?.type}`), ...props?.getAnswerData(props?.type)], 
                      {shouldDirty: true}
                    );
                })
              }}
            >
              Add More
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
  },[]);

  return (
    <Card>
      <CardHeader title={props?.title}
      titleTypographyProps={{
        variant: 'h6'
      }}
      ></CardHeader>
      <CardContent sx={{
        paddingTop: 1
      }}>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={2}>
            <FormControlLabel 
              control={
                <Checkbox 
                  checked={props?.option?.isCorrect}
                  onClick={(e) => {
                    if(e.target.checked !== undefined){
                      props?.watch("language")?.forEach((lang, lindex) => {
                            props?.setValue(
                              `language.${lindex}.answer_data.${props?.type}.${props?.option_index}.isCorrect`,
                              e.target?.checked,
                              {shouldDirty: true}
                            )
                        })
                    }
                  }}
                />
              } 
              label="Correct" 
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
                    {shouldDirty: true}
                    );
                })
              }}
            >
              Delete
            </Button>
          </Grid>
          <Grid item xs={12} lg={10}>
            <textarea 
              id={props?.id} 
              style={{
                width: '100%'
              }}
              value={props?.option?.option}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
export default MultipleChoice;
