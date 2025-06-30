import {
  Avatar,
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import React from "react";
import { TiTick, RxCross2 } from "@acadlix/helpers/icons";

import CustomLatex from "@acadlix/modules/latex/CustomLatex";

const TypeSingleChoice = (props) => {
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
      })
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
        answer_data: data?.filter((d) => d.isChecked).length > 0 ? data?.filter(d => d.isChecked).map(d => d.position) : null,
      },
      { shouldDirty: true }
    );

    if (props?.watch("attempt_and_move_forward")) {
      if (props?.last) {
        props?.setValue("finish", true, { shouldDirty: true });
      }
      props?.setValue(
        "questions",
        props.watch("questions")?.map((question, index) => {
          if (question.selected) {
            question.result.time =
              question.result.time +
              Math.round((Date.now() - props?.watch("last")) / 1000);
          }
          if (index === props?.num) {
            question.selected = true;
          } else {
            question.selected = false;
          }
          return question;
        }),
        { shouldDirty: true }
      );
      props?.setValue("last", Date.now(), { shouldDirty: true });
    }
  };

  // console.log(props?.answer_data?.[props?.type]);

  const alphabate = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];

  const isDisabled = () => {
    if (props?.watch("view_answer") || props?.watch(`questions.${props?.index}.check`)) {
      return true;
    }
    return false;
  }

  return (
    <FormControl
      sx={{
        width: "100%",
        padding: props?.watch("mode") !== "advance_mode" ? "5px" : 0,
        marginY: props?.watch("mode") !== "advance_mode" ? "5px" : 0,
        overflow: "auto",
      }}
    >
      <RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        name="radio-buttons-group"
        onChange={handleChange}
        sx={{
          flexDirection: props?.nta ? "row" : "column",
          gap: props?.watch("mode") !== "advance_mode" ? "6px" : 0,
        }}
      >
        {props?.answer_data?.[props?.type]?.length > 0 &&
          props?.answer_data?.[props?.type]?.map((data, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                border: props?.watch("mode") !== "advance_mode" ? props?.watch(`questions.${props?.index}.check`)
                  ? data?.isCorrect
                    ? (theme) => `1px solid ${theme.palette.success.dark}`
                    : data?.isChecked
                      ? (theme) => `1px solid ${theme.palette.error.dark}`
                      : (theme) => `1px solid ${theme.palette.grey[300]}`
                  : (theme) => `1px solid ${theme.palette.grey[300]}`
                  : "none",
                backgroundColor: props?.watch(`questions.${props?.index}.check`)
                  ? data?.isCorrect
                    ? (theme) => theme.palette.success.light
                    : data?.isChecked
                      ? (theme) => theme.palette.error.light
                      : "transparent"
                  : "transparent",
                borderRadius: 1,
                paddingX: props?.watch("mode") !== "advance_mode" ? 2 : 0,
              }}
            >
              {props?.watch("answer_bullet")
                ? (
                  <Avatar
                    sx={{
                      height: 24,
                      width: 24,
                      fontSize: 14,
                      fontWeight: "bold",
                      backgroundColor: props?.watch(
                        `questions.${props?.index}.check`
                      )
                        ? data?.isCorrect
                          ? (theme) => theme.palette.success.main
                          : data?.isChecked
                            ? (theme) => theme.palette.error.main
                            : (theme) => theme.palette.grey[500]
                        : (theme) => theme.palette.grey[500]
                    }}
                  >
                    {props?.watch("answer_bullet_type") === "numeric"
                      ? index + 1
                      : alphabate[index % 26]}
                  </Avatar>
                ) : (
                  <></>
                )}
              <FormControlLabel
                checked={data?.isChecked}
                control={
                  <Radio
                    inputProps={{
                      sx: {
                        opacity: `0 !important`,
                      }
                    }}
                    disabled={isDisabled()}
                  />
                }
                value={index}
                label={
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography component="div">
                      <CustomLatex>
                        {data?.option}
                      </CustomLatex>
                    </Typography>
                    <Box
                      sx={{
                        position: "relative",
                        marginLeft: "5px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {props?.watch("view_answer") ||
                        props?.watch(`questions.${props?.index}.check`) ? (
                        data?.isCorrect ? (
                          <Avatar sx={{
                            height: {
                              xs: 24,
                            },
                            width: {
                              xs: 24
                            },
                            bgcolor: theme => theme?.palette?.success?.main
                          }}>
                            <TiTick />
                          </Avatar>
                        ) : data?.isChecked ? (
                          <Avatar sx={{
                            height: {
                              xs: 24,
                            },
                            width: {
                              xs: 24
                            },
                            bgcolor: theme => theme.palette.error?.main
                          }}>
                            <RxCross2 />
                          </Avatar>
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
                  paddingX: props?.watch("mode") !== "advance_mode" ? 2 : 0,
                  paddingY: props?.watch("mode") !== "advance_mode" ? 2 : 0,
                  width: props?.watch("mode") !== "advance_mode" ? "100%" : "auto",
                  marginLeft: 0,
                  marginRight: 0,
                  "& svg": {
                    height: "15px",
                    width: "15px",
                  },
                }}
                componentsProps={{
                  typography: {
                    sx: {
                      width: "100%",
                      "&.Mui-disabled": {
                        color: "initial !important",
                      },
                    },
                  },
                }}
              />
            </Box>
          ))}
      </RadioGroup>
    </FormControl>
  );
};

export default TypeSingleChoice;
