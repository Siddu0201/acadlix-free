import { Card, CardContent, CardHeader, FormControlLabel, Grid } from "@mui/material";
import React from "react";
import CustomSwitch from "../../../../components/CustomSwitch";

const QuestionHintSection = (props) => {
  const loadPage = () => {
    props?.loadEditor(`hint_msg_${props?.lang?.language_id}`, `language.${props?.index}.hint_msg`);
  };

  React.useEffect(() => {
    loadPage();
    window.addEventListener("load", loadPage);

    return () => {
      props?.removeEditor(`hint_msg_${props?.lang?.language_id}`);
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
          props?.lang?.selected
            ? "block"
            : "none",
      }}
    >
      <Card>
        <CardHeader
          title={`Hint (${
            props?.lang?.language_name
          })`}
          titleTypographyProps={{
            sx: {
              fontWeight: 500,
              color: "black",
            },
          }}
        />
        <CardContent>
          <Grid container spacing={4}>
            <Grid item xs={12} lg={12}>
              <FormControlLabel
                control={<CustomSwitch 
                  checked={props?.watch("hint_enabled")}
                  onChange={(e)=> {
                    props?.setValue("hint_enabled", e?.target?.checked, {shouldDirty: true});
                  }}  
                />}
                label="Enable Hint"
              />
            </Grid>
            <Grid item xs={12} lg={12} sx={{
              display: props?.watch("hint_enabled") ? "" : "none",
            }}>
              <textarea
                id={`hint_msg_${props?.lang?.language_id}`}
                style={{
                  width: "100%",
                }}
                value={props?.watch(`language.${props?.index}.hint_msg`)}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default QuestionHintSection;
