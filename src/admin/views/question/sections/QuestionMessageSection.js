import {
  Card,
  CardContent,
  CardHeader,
  FormControlLabel,
  Grid,
  Typography,
} from "@mui/material";
import React from "react";
import CustomSwitch from "../../../../components/CustomSwitch";

const QuestionMessageSection = (props) => {
  const loadPage = () => {
    props?.loadEditor(`correct_msg_${props?.lang?.language_id}`, `language.${props?.index}.correct_msg`);
    props?.loadEditor(`incorrect_msg_${props?.lang?.language_id}`, `language.${props?.index}.incorrect_msg`);
  };

  React.useEffect(() => {
    loadPage();
    window.addEventListener("load", loadPage);

    return () => {
      props?.removeEditor(`correct_msg_${props?.lang?.language_id}`);
      props?.removeEditor(`incorrect_msg_${props?.lang?.language_id}`);
      window.removeEventListener("load", loadPage);
    };
  }, []);

  return (
    <Grid
      item
      xs={12}
      sm={12}
      sx={{
        display:
          props?.watch("selected_language_id") === props?.lang?.language_id
            ? "block"
            : "none",
      }}
    >
      <Card>
        <CardHeader
          title={`Message with correct answer (${
            props?.availableLanguage?.filter(
              (avl) => avl?.id === props?.lang?.language_id
            )?.[0]?.name
          })`}
          titleTypographyProps={{
            sx: {
              fontWeight: 500,
              color: "black",
            },
          }}
        />
        <CardContent sx={{
          color: "black"
        }}>
          <Grid container spacing={4}>
            <Grid item xs={12} lg={12}>
              <FormControlLabel
                control={<CustomSwitch 
                  checked={props?.watch("different_incorrect_msg")}
                  onChange={(e)=> {
                    props?.setValue("different_incorrect_msg", e.target.checked, {shouldDirty: true});
                  }} 
                  />}
                label="Different Message with Correct and Incorrect Answer?"
              />
            </Grid>
            <Grid item xs={12} lg={12}>
              <Typography variant="subtitle2">Correct Message</Typography>
            </Grid>
            <Grid item xs={12} lg={12}>
              <textarea
                id={`correct_msg_${props?.lang?.language_id}`}
                style={{
                  width: "100%",
                }}
              />
            </Grid>
            <Grid item xs={12} lg={12} sx={{
              display: props?.watch('different_incorrect_msg') ? "" : "none",
            }}>
              <Typography variant="subtitle2">Incorrect Message</Typography>
            </Grid>
            <Grid item xs={12} lg={12} sx={{
              display: props?.watch('different_incorrect_msg') ? "" : "none",
            }}>
              <textarea
                id={`incorrect_msg_${props?.lang?.language_id}`}
                style={{
                  width: "100%",
                }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default QuestionMessageSection;
