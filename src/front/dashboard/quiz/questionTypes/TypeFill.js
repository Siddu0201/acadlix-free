import { Box, Typography } from "@mui/material";
import React from "react";
import CustomTextField from "../../../../components/CustomTextField";
import { SiTicktick } from "react-icons/si";
import { ImCross } from "react-icons/im";

const TypeFill = (props) => {
  let rxp = /{([^}]+)}/g;
  let currmatch,
    found = [],
    i = 0, j = 0;
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
        answer_data: data?.filter((d) => d.yourAnswer).length ? data : "",
      },
      { shouldDirty: true }
    );
  };

  const getAnswerData = (data) => {
    j++;
    let answer = '';
    let newrxp = /\[([^\][]*)]/g;
    if(data.includes('|')){
      data = data?.split('|')?.[0];
    }
    if(data?.match(newrxp)?.length > 0){
      let newCurrMatch;
      while(newCurrMatch = newrxp.exec(data)){
        answer = `${answer}/${newCurrMatch[1]}`;
      }
      return answer;
    }else{
      return data;
    }
  }

  return (
    <Box
      sx={{
        display: props?.selected ? "block" : "none",
      }}
    >
      <Typography>
        {props?.question}
        <br />
      </Typography>
      <Box
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
        {props?.watch("view_answer") && <Typography>Your answer</Typography>}
        <Box
          sx={{
            display: "flex",
          }}
        >
          <Box>
            {props?.answer_data?.[props?.type]?.option
              ?.split(rxp)
              ?.map((data) => {
                if (found?.includes(data)) {
                  return (
                    <CustomTextField
                      variant="standard"
                      size="small"
                      sx={{
                        ".MuiInputBase-inputSizeSmall": {
                          padding: "0px 3px",
                        },
                      }}
                      value={
                        props?.answer_data?.[props?.type]?.correctOption?.[i]
                          .yourAnswer
                      }
                      disabled={props?.watch("view_answer")}
                      onChange={handleChange.bind(this, i++)}
                    />
                  );
                }
                return data;
              })}
          </Box>
          {props?.watch("view_answer") && (
            <Box
              sx={{
                position: "relative",
                marginLeft: "5px",
                top: "2px",
              }}
            >
              {props?.watch(
                `questions.${props?.index}.result.correct_count`
              ) ? (
                <SiTicktick
                  style={{
                    color: props?.colorCode?.correct,
                  }}
                />
              ) : (
                <ImCross
                  style={{
                    fontSize: "smaller",
                    color: props?.colorCode?.incorrect,
                  }}
                />
              )}
            </Box>
          )}
        </Box>
        {props?.watch("view_answer") && (
          <>
            <Typography>Correct answer</Typography>
            <Box>
              {props?.answer_data?.[props?.type]?.option
                ?.split(rxp)
                ?.map((data) => {
                  if (found?.includes(data)) {
                    return (
                      <>
                        <CustomTextField
                          variant="standard"
                          size="small"
                          sx={{
                            ".MuiInputBase-inputSizeSmall": {
                              padding: "0px 3px",
                            },
                          }}
                          value={
                            getAnswerData(found[j])
                          }
                          disabled
                        />
                      </>
                    );
                  }
                  return data;
                })}
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default TypeFill;
