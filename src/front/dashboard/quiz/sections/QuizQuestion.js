import {
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import React from "react";
import TypeSingleChoice from "../question-types/TypeSingleChoice";

const QuizQuestion = (props) => {
  return (
    <Box
      sx={{
        maxHeight: `calc(100% - ${props?.questionHeight + 5}px)`,
        overflow: "auto",
        width: {
          xs: "100%",
          sm: props?.isOpen ? "calc(100% - 300px)" : "100%",
        },
      }}
    >
      <Box
        sx={{
          padding: 1,
          paddingX: 3,
        }}
      >
        <TypeSingleChoice />
        {/* Your content goes here
        <Typography>
          Which is the Indian state surrounded by Bangladesh from three sides?
          <br />
        </Typography>

        <FormControl>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="val1"
            name="radio-buttons-group"
          >
            <FormControlLabel
              value="Mizoram"
              control={
                <Radio
                  sx={{
                    "&.Mui-checked": {
                      color: "red !important",
                    },
                  }}
                />
              }
              label="Mizoram"
            />
            <FormControlLabel
              value="Assam"
              control={
                <Radio
                  sx={{
                    "&.Mui-checked": {
                      color: "red !important",
                    },
                  }}
                />
              }
              label="Assam"
            />
            <FormControlLabel
              value="West Bengal"
              control={
                <Radio
                  sx={{
                    "&.Mui-checked": {
                      color: "red !important",
                    },
                  }}
                />
              }
              label="West Bengal"
            />
            <FormControlLabel
              value="Tripura"
              control={
                <Radio
                  sx={{
                    "&.Mui-checked": {
                      color: "red !important",
                    },
                  }}
                />
              }
              label="Tripura"
            />
          </RadioGroup>
        </FormControl> */}
      </Box>
    </Box>
  );
};

export default QuizQuestion;
