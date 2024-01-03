import { Card, CardContent, CardHeader, Grid } from "@mui/material";
import React from "react";

const QuestionHintSection = () => {
  return (
    <Grid item xs={12} sm={12}>
      <Card>
        <CardHeader
          title="Hint(Optional)"
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
                id="hint"
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

export default QuestionHintSection;
