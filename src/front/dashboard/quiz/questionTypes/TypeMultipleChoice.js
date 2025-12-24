import {
  Avatar,
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  Typography,
} from "@mui/material";
import React from "react";
import { TiTick, RxCross2 } from "@acadlix/helpers/icons";

import CustomLatex from "@acadlix/modules/latex/CustomLatex";
import { getCurrentDateString } from "@acadlix/helpers/util";

const TypeMultipleChoice = (props) => {
  const handleChange = (e) => {
    props?.setValue(
      `questions.${props?.index}.language`,
      props?.watch(`questions.${props?.index}.language`)?.map((lang) => {
        lang.answer_data[props?.type] = lang.answer_data[props?.type]?.map(
          (answer, index) => {
            if (index == e.target.value && e.target.checked !== undefined) {
              answer.isChecked = !answer.isChecked;
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
        answer_data: data?.filter((d) => d.isChecked).length > 0 ? data?.filter((d) => d.isChecked)?.map((d) => d.position) : null,
        attempted_at: getCurrentDateString(),
      },
      { shouldDirty: true }
    );
  };

  const alphabate = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];

  return (
    <FormControl
      sx={{
        // flexDirection: props?.nta ? "row" : "column",
        display: props?.watch("enable_inline_answer_options_layout") ? "grid" : "flex",
        gridTemplateColumns: props?.watch("enable_inline_answer_options_layout")
          ? `repeat(${props?.watch("options_per_row") > 0 ? props?.watch("options_per_row") :
            props?.answer_data?.[props?.type]?.length > 0 ? props?.answer_data?.[props?.type]?.length : 1}, minmax(0, 1fr))`
          : "none",
        width: "100%",
        padding: props?.watch("mode") !== "advance_mode" || props?.watch("view_answer") ? "5px" : 0,
        marginY: props?.watch("mode") !== "advance_mode" || props?.watch("view_answer") ? "5px" : 0,
        gap: props?.watch("mode") !== "advance_mode" || props?.watch("view_answer") ? "6px" : 0,
        overflow: "auto",
      }}
    >
      {props?.answer_data?.[props?.type]?.length > 0 &&
        props?.answer_data?.[props?.type]?.map((data, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              border:
                props?.watch("mode") !== "advance_mode" || props?.watch("view_answer")
                  ? props?.watch(`questions.${props?.index}.check`)
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
              paddingX: props?.watch("mode") !== "advance_mode" || props?.watch("view_answer") ? 2 : 0,
            }}
          >
            {props?.watch("answer_bullet") ? (
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
                    : (theme) => theme.palette.grey[500],
                }}
              >
                {props?.watch("answer_bullet_type") === "numeric"
                  ? index + 1
                  : alphabate[index % 26]}
              </Avatar>
            )
              : (
                <></>
              )}
            <FormControlLabel
              checked={data?.isChecked}
              control={
                <Checkbox
                  inputProps={{
                    sx: {
                      opacity: `0 !important`,
                    }
                  }}
                  disabled={props?.isDisabled ?? false}
                />
              }
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
                        <Avatar
                          sx={{
                            height: {
                              xs: 24,
                            },
                            width: {
                              xs: 24,
                            },
                            bgcolor: (theme) => theme?.palette?.success?.main,
                          }}
                        >
                          <TiTick />
                        </Avatar>
                      ) : data?.isChecked ? (
                        <Avatar
                          sx={{
                            height: {
                              xs: 24,
                            },
                            width: {
                              xs: 24,
                            },
                            bgcolor: (theme) => theme.palette.error?.main,
                          }}
                        >
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
              onChange={handleChange}
              value={index}
              sx={{
                paddingX: props?.watch("mode") !== "advance_mode" || props?.watch("view_answer") ? 2 : 0,
                paddingY: props?.watch("mode") !== "advance_mode" || props?.watch("view_answer") ? 2 : 0,
                width:
                  props?.watch("mode") !== "advance_mode" || props?.watch("view_answer") ? "100%" : "auto",
                marginLeft: 0,
                marginRight: 0,
                "& svg": {
                  height: "20px",
                  width: "20px",
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
    </FormControl>
  );
};

export default TypeMultipleChoice;
