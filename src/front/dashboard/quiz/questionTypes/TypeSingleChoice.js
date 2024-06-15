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
import parse from "html-react-parser";

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

  const alphabate = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];
  const renderShortcode = (content) => {
    // Regular expression to find audio shortcode
    const audioRegex = /\[audio\s+src="([^"]+)"\s*\]/g;
    const matches = content.match(audioRegex);
    console.log(content ,matches);

    if (matches) {
      return matches.map((match, index) => {
        // Extract audio URL from shortcode
        const src = match.match(/src="([^"]+)"/)[1];
        return <audio key={index} controls><source src={src} type="audio/mpeg" /></audio>;
      });
    } else {
      return <p>No audio found.</p>;
    }
  };
  
  return (
    <Box
      sx={{
        display: props?.selected ? "block" : "none",
      }}
    >
      <div dangerouslySetInnerHTML={{ __html: props?.question }} />
      {/* <Box>
        {renderShortcode(props?.question)}
        <br />
      </Box> */}

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
          sx={{
            gap: "5px",
          }}
        >
          {props?.answer_data?.[props?.type]?.length > 0 &&
            props?.answer_data?.[props?.type]?.map((data, index) => (
              <Box sx={{
                display: "flex",
                alignItems: "center"
              }}>
                {
                  props?.watch("answer_bullet") 
                  ? props?.watch("answer_bullet_type") === "numeric"
                  ?
                  <Typography>
                    {index + 1}.
                  </Typography>
                  :
                  <Typography>
                    {alphabate[index % 26]}.
                  </Typography>

                  :
                  <></>
                }
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
                      <Typography>{parse(data?.option)}</Typography>
                      <Box
                        sx={{
                          position: "relative",
                          marginLeft: "5px",
                          top: "2px",
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
                    '& svg': {
                      height: "15px",
                      width: "15px",
                    }
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
              </Box>
            ))}
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

export default TypeSingleChoice;
