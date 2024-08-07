import { Box, Chip, Typography } from "@mui/material";
import React from "react";
import CustomTextField from "../../../../components/CustomTextField";
import { SiTicktick } from "react-icons/si";
import { ImCross } from "react-icons/im";

const TypeNumerical = (props) => {
  const handleChange = (e) => {
    props?.setValue(
      `questions.${props?.index}.language`,
      props?.watch(`questions.${props?.index}.language`)?.map((lang) => {
        lang.answer_data[props?.type].yourAnswer = e?.target.value
          ? Number(e.target.value)
          : "";
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
        correct_count: data?.yourAnswer === data?.option ? 1 : 0,
        incorrect_count: data?.yourAnswer === data?.option ? 0 : 1,
        solved_count: data?.yourAnswer ? 1 : 0,
        answer_data: data?.yourAnswer ? data : "",
      },
      { shouldDirty: true }
    );
  };

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor:
          props?.watch("mode") !== "advance_mode"
            ? props?.watch(`questions.${props?.index}.check`)
            ? props?.watch(`questions.${props?.index}.result.correct_count`)
            ? (theme) => theme.palette.success.light
            : (theme) => theme.palette.error.light
            : ""
            : "",
        border:
          props?.watch("mode") !== "advance_mode"
          ? props?.watch(`questions.${props?.index}.check`)
          ? props?.watch(`questions.${props?.index}.result.correct_count`)
          ? (theme) => `1px solid ${theme.palette.success.dark}`
          : (theme) => `1px solid ${theme.palette.error.dark}`
          : (theme) => `1px solid ${theme.palette.grey[300]}`
          : "none",
        borderRadius: 1,
        padding: props?.watch("mode") !== "advance_mode" ? "5px" : 2,
        marginTop: props?.watch("mode") !== "advance_mode" ? "5px" : 0,
        marginBottom: props?.watch("mode") !== "advance_mode" ? "10px" : 0,
      }}
    >
      {(props?.watch("view_answer") ||
        props?.watch(`questions.${props?.index}.check`)) && (
        <Typography>
          <b>Your answer</b>
        </Typography>
      )}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <CustomTextField
          type="number"
          label={props?.watch("view_answer") || props?.watch(`questions.${props?.index}.check`) ? "" : "Type your answer"}
          size="small"
          inputProps={{
            step: 0.01,
          }}
          disabled={props?.watch("view_answer") || props?.watch(`questions.${props?.index}.check`)}
          sx={{
            marginY: 2,
            "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
              {
                display: "none",
              },
            "& input[type=number]": {
              MozAppearance: "textfield",
            },
          }}
          onChange={handleChange}
          value={props?.answer_data?.[props?.type]?.yourAnswer}
        />
        {(props?.watch("view_answer") ||
          props?.watch(`questions.${props?.index}.check`)) && (
          <Box
            sx={{
              position: "relative",
              marginLeft: "5px",
              display: "flex",
              alignItems: "center",
            }}
          >
            {props?.watch(`questions.${props?.index}.result.correct_count`) ? (
              <Chip label="Correct Answer" color="success" />
            ) : (
              <Chip label="Your Answer" color="error" />
            )}
          </Box>
        )}
      </Box>

      {(props?.watch("view_answer") ||
        props?.watch(`questions.${props?.index}.check`)) && (
        <>
          <Typography>
            <b>Correct answer</b>
          </Typography>
          <Typography>{props?.answer_data?.[props?.type]?.option}</Typography>
        </>
      )}
    </Box>
  );
};

export default TypeNumerical;
