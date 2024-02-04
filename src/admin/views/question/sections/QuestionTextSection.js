import { Card, CardContent, CardHeader, Grid } from "@mui/material";
import React from "react";

const QuestionTextSection = (props) => {
  const loadPage = () => {
      props?.loadEditor(`question_${props?.lang?.language_id}`, `language.${props?.index}.question`);
  };

  React.useEffect(() => {
    loadPage();
    window.addEventListener("load", loadPage);

    return () => {
        props?.removeEditor(`question_${props?.lang?.language_id}`);
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
          title={`Question (${
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
        <CardContent>
          <Grid container spacing={4}>
            <Grid item xs={12} lg={12}>
              <textarea
                id={`question_${props?.lang?.language_id}`}
                style={{
                  width: "100%",
                }}
                value={props?.watch(`language.${props?.index}.question`)}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default QuestionTextSection;
