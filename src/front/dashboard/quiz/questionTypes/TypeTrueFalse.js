import {
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import React from "react";
import { ImCross } from "react-icons/im";
import { SiTicktick } from "react-icons/si";

const TypeTrueFalse = (props) => {
  const handleChange = (e) => {
    props?.setValue(
      `questions.${props?.index}.language`,
      props?.watch(`questions.${props?.index}.language`)?.map((lang) => {
        lang.answer_data[props?.type] = lang.answer_data[props?.type]?.map(
          (answer, index) => {
            if (index == e.target.value) {
              answer.isChecked = true;
            } else {
              answer.isChecked = false;
            }
            return answer;
          }
        );
        return lang;
      }),
      { shouldDirty: true }
    );

    let data = props?.watch(
      `questions.${props?.index}.language.${props?.lang_index}.answer_data.${props?.type}`
    );
    props?.setValue(
      `questions.${props?.index}.result`,
      {
        ...props?.watch(`questions.${props?.index}.result`),
        correct_count:
          data?.filter((d) => d.isChecked === d.isCorrect).length ===
          data.length
            ? 1
            : 0,
        incorrect_count:
          data?.filter((d) => d.isChecked === d.isCorrect).length ===
          data.length
            ? 0
            : 1,
        solved_count: data?.filter((d) => d.isChecked).length > 0 ? 1 : 0,
        answer_data: data?.filter((d) => d.isChecked).length > 0 ? data : "",
      },
      { shouldDirty: true }
    );
  };
  return (
    <Box
      sx={{
        display: props?.selected ? "block" : "none",
      }}
    >
      <Typography>
        {props?.question}
      </Typography>

      <FormControl
        sx={{
          width: "100%",
          backgroundColor:
            props?.watch("mode") !== "advance_mode"
              ? props?.colorCode?.option_background
              : "",
          border:
            props?.watch("mode") !== "advance_mode"
              ? `1px solid ${props?.colorCode?.option_border}`
              : "",
          padding: props?.watch("mode") !== "advance_mode" ? "5px" : 0,
          marginTop: props?.watch("mode") !== "advance_mode" ? "5px" : 0,
          marginBottom: props?.watch("mode") !== "advance_mode" ? "10px" : 0,
        }}
      >
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          name="radio-buttons-group"
          onChange={handleChange}
        >
          {props?.answer_data?.[props?.type]?.length > 0 &&
            props?.answer_data?.[props?.type]?.map((data, index) => (
              <FormControlLabel
                key={index}
                checked={data?.isChecked}
                control={<Radio disabled={props?.watch("view_answer") || props?.watch(`questions.${props?.index}.check`)} />}
                value={index}
                label={
                  <Box
                    sx={{
                      display: "flex",
                    }}
                  >
                    <Typography>{data?.option}</Typography>
                    <Box
                      sx={{
                        position: "relative",
                        marginLeft: "5px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {props?.watch("view_answer") || props?.watch(`questions.${props?.index}.check`) ? (
                        data?.isCorrect ? (
                          <SiTicktick
                            style={{
                              color: props?.colorCode?.correct,
                            }}
                          />
                        ) : data?.isChecked ? (
                          <ImCross
                            style={{
                              fontSize: "smaller",
                              color: props?.colorCode?.incorrect,
                            }}
                          />
                        ) : (
                          <></>
                        )
                      ) : (
                        <></>
                      )}
                    </Box>
                  </Box>
                }
                sx={{
                  width: 'fit-content',
                  marginLeft: 0,
                  "& svg": {
                    height: "15px",
                    width: "15px",
                  },
                }}
                componentsProps={{
                  typography: {
                    sx: {
                      "&.Mui-disabled": {
                        color: "initial !important",
                      },
                    },
                  },
                }}
              />
            ))}
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

export default TypeTrueFalse;
