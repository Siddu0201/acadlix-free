import { Card, CardContent, CardHeader, FormControlLabel, Grid } from "@mui/material";
import React from "react";
import CustomSwitch from "../../../../components/CustomSwitch";

const QuestionMessageSection = () => {
  return (
    <Grid item xs={12} sm={12}>
      <Card>
        <CardHeader
          title="Message with correct answer"
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
                control={<CustomSwitch />}
                label="Different Message with Correct and Incorrect Answer?"
              />
            </Grid>
            <Grid item xs={12} lg={12}>
              <textarea
                id="correct_message"
                style={{
                  width: "100%",
                }}
              />
            </Grid>
            <Grid item xs={12} lg={12}>
              <textarea
                id="incorrect_message"
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
