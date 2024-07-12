import {
  Avatar,
  Box,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  Typography,
} from "@mui/material";
import React from "react";
import { ImCross } from "react-icons/im";
import { SiTicktick } from "react-icons/si";
import parse from "html-react-parser";

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
        answer_data: data?.filter((d) => d.isChecked).length > 0 ? data : "",
      },
      { shouldDirty: true }
    );
  };

  const alphabate = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];

  return (
    <FormControl
      sx={{
        width: "100%",
        padding: props?.watch("mode") !== "advance_mode" ? "5px" : 0,
        marginY: props?.watch("mode") !== "advance_mode" ? "5px" : 0,
        gap: "6px",
      }}
    >
      {props?.answer_data?.[props?.type]?.length > 0 &&
        props?.answer_data?.[props?.type]?.map((data, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              border: props?.watch(`questions.${props?.index}.check`)
                ? data?.isCorrect
                  ? (theme) => `1px solid ${theme.palette.success.dark}`
                  : data?.isChecked
                  ? (theme) => `1px solid ${theme.palette.error.dark}`
                  : (theme) => `1px solid ${theme.palette.grey[300]}`
                : (theme) => `1px solid ${theme.palette.grey[300]}`,
              backgroundColor: props?.watch(`questions.${props?.index}.check`)
                ? data?.isCorrect
                  ? (theme) => theme.palette.success.light
                  : data?.isChecked
                  ? (theme) => theme.palette.error.light
                  : "transparent"
                : "transparent",
              borderRadius: 1,
              paddingX: 2,
              paddingY: 2,
            }}
          >
            {props?.watch("answer_bullet") ? (
              props?.watch("answer_bullet_type") === "numeric" ? (
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
                  {index + 1}
                </Avatar>
              ) : (
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
                  {alphabate[index % 26]}
                </Avatar>
              )
            ) : (
              <></>
            )}
            <FormControlLabel
              checked={data?.isChecked}
              control={
                <Checkbox
                  disabled={
                    props?.watch("view_answer") ||
                    props?.watch(`questions.${props?.index}.check`)
                  }
                />
              }
              label={
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography component="div">{parse(data?.option)}</Typography>
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
                        <Chip label="Correct Answer" color="success" />
                      ) : data?.isChecked ? (
                        <Chip label="Your Answer" color="error" />
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
                width: "100%",
                marginLeft: 0,
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
