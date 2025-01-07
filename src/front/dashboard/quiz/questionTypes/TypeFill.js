import { Avatar, Box, Chip, Typography } from "@mui/material";
import React from "react";
import CustomTextField from "../../../../components/CustomTextField";
import parse from "html-react-parser";
import { TiTick, RxCross2 } from "../../../../helpers/icons";

const TypeFill = (props) => {
  let rxp = /{([^}]+)}/g;
  let currmatch,
    found = [],
    i = 0,
    j = 0;
  while ((currmatch = rxp.exec(props?.answer_data?.[props?.type]?.option))) {
    found.push(currmatch[1]);
  }

  const handleChange = (index, e) => {
    props?.setValue(
      `questions.${props?.index}.language.${props?.lang_index}.answer_data.${props?.type}.correctOption.${index}.yourAnswer`,
      e.target.value.trim(),
      { shouldDirty: true }
    );

    let data = props?.watch(
      `questions.${props?.index}.language.${props?.lang_index}.answer_data.${props?.type}.correctOption`
    );
    let answer_data = props?.watch(
      `questions.${props?.index}.language.${props?.lang_index}.answer_data.${props?.type}`
    );
    props?.setValue(
      `questions.${props?.index}.result`,
      {
        ...props?.watch(`questions.${props?.index}.result`),
        correct_count:
          data?.filter((d) => d.option.includes(d.yourAnswer)).length ===
          data.length
            ? 1
            : 0,
        incorrect_count:
          data?.filter((d) => d.option.includes(d.yourAnswer)).length ===
          data.length
            ? 0
            : 1,
        solved_count: data?.filter((d) => d.yourAnswer).length ? 1 : 0,
        answer_data: data?.filter((d) => d.yourAnswer).length
          ? answer_data
          : "",
      },
      { shouldDirty: true }
    );
  };

  const getAnswerData = (data) => {
    j++;
    let answer = "";
    let newrxp = /\[([^\][]*)]/g;
    if (data.includes("|")) {
      data = data?.split("|")?.[0];
    }
    if (data?.match(newrxp)?.length > 0) {
      let newCurrMatch;
      while ((newCurrMatch = newrxp.exec(data))) {
        answer = `${answer}/${newCurrMatch[1]}`;
      }
      return answer;
    } else {
      return data;
    }
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
          props?.watch("mode") !== "advance_mode"
            ? props?.watch(`questions.${props?.index}.check`)
              ? props?.watch(`questions.${props?.index}.result.correct_count`)
                ? (theme) => `1px solid ${theme.palette.success.dark}`
                : (theme) => `1px solid ${theme.palette.error.dark}`
              : (theme) => `1px solid ${theme.palette.grey[300]}`
            : "none",
        borderRadius: 1,
        padding: props?.watch("mode") !== "advance_mode" ? 2 : 2,
        marginY: props?.watch("mode") !== "advance_mode" ? "5px" : 0,
        overflow: "auto",
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
        <Box>
          {props?.answer_data?.[props?.type]?.option
            ?.split(rxp)
            ?.map((data, index) => {
              if (found?.includes(data)) {
                return (
                  <CustomTextField
                    key={index}
                    variant="standard"
                    size="small"
                    sx={{
                      ".MuiInputBase-inputSizeSmall": {
                        padding: "0px 3px",
                      },
                    }}
                    inputProps={{
                      sx: {
                        height: "1.4375em !important",
                      }
                    }}
                    value={
                      props?.answer_data?.[props?.type]?.correctOption?.[i]
                        .yourAnswer
                    }
                    disabled={
                      props?.watch("view_answer") ||
                      props?.watch(`questions.${props?.index}.check`)
                    }
                    onChange={handleChange.bind(this, i++)}
                  />
                );
              }
              return parse(data);
            })}
        </Box>
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
            <b>Correct answer</b>
          </Typography>
          <Box>
            {props?.answer_data?.[props?.type]?.option
              ?.split(rxp)
              ?.map((data, index) => {
                if (found?.includes(data)) {
                  return (
                    <React.Fragment key={index}>
                      <CustomTextField
                        variant="standard"
                        size="small"
                        sx={{
                          ".MuiInputBase-inputSizeSmall": {
                            padding: "0px 3px",
                          },
                        }}
                        inputProps={{
                          sx: {
                            height: "1.4375em !important",
                          }
                        }}
                        value={getAnswerData(found[j])}
                        disabled
                      />
                    </React.Fragment>
                  );
                }
                return parse(data);
              })}
          </Box>
        </>
      )}
    </Box>
  );
};

export default TypeFill;
