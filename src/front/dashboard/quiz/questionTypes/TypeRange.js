import { Avatar, Box, Typography } from "@mui/material";
import React from "react";
import CustomTextField from "@acadlix/components/CustomTextField";
import { TiTick, RxCross2 } from "@acadlix/helpers/icons";
import { __ } from "@wordpress/i18n";
import { getCurrentDateString } from "@acadlix/helpers/util";

const TypeRange = (props) => {
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
        correct_count:
          Number(data?.yourAnswer) >= Number(data?.from) &&
            Number(data?.yourAnswer) <= Number(data?.to)
            ? 1
            : 0,
        incorrect_count:
          Number(data?.yourAnswer) >= Number(data?.from) &&
            Number(data?.yourAnswer) <= Number(data?.to)
            ? 0
            : 1,
        solved_count: data?.yourAnswer ? 1 : 0,
        answer_data: data?.yourAnswer ?? null,
        attempted_at: getCurrentDateString(),
      },
      { shouldDirty: true }
    );
  };

  return (
    <Box
      sx={{
        width: "auto",
        backgroundColor:
          props?.watch(`questions.${props?.index}.check`)
            ? props?.watch(`questions.${props?.index}.result.correct_count`)
              ? (theme) => theme.palette.success.light
              : (theme) => theme.palette.error.light
            : "",
        border:
          props?.watch("mode") !== "advance_mode" || props?.watch("view_answer")
            ? props?.watch(`questions.${props?.index}.check`)
              ? props?.watch(`questions.${props?.index}.result.correct_count`)
                ? (theme) => `1px solid ${theme.palette.success.dark}`
                : (theme) => `1px solid ${theme.palette.error.dark}`
              : (theme) => `1px solid ${theme.palette.grey[300]}`
            : "none",
        borderRadius: 1,
        padding: props?.watch("mode") !== "advance_mode" || props?.watch("view_answer") ? "5px" : 2,
        marginY: props?.watch("mode") !== "advance_mode" || props?.watch("view_answer") ? "5px" : 0,
        overflow: "auto",
      }}
    >
      {(props?.watch("view_answer") ||
        props?.watch(`questions.${props?.index}.check`)) && (
          <Typography>
            <b>{__("Your answer", "acadlix")}</b>
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
          label={
            props?.watch("view_answer") ||
              props?.watch(`questions.${props?.index}.check`)
              ? ""
              : "Type your answer"
          }
          size="small"
          inputProps={{
            step: 0.01,
          }}
          disabled={props?.isDisabled ?? false}
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
          onKeyPress={(e) => {
            if (e?.key === "Enter") {
              e?.target?.blur();
            }
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
              ) : (
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
              )}
            </Box>
          )}
      </Box>
      {(props?.watch("view_answer") ||
        props?.watch(`questions.${props?.index}.check`)) && (
          <>
            <Typography>
              <b>{__("Correct answer", "acadlix")}</b>
            </Typography>
            <Typography>
              {props?.answer_data?.[props?.type]?.from} -{" "}
              {props?.answer_data?.[props?.type]?.to}
            </Typography>
          </>
        )}
    </Box>
  );
};

export default TypeRange;
