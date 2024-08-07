import React from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";

const QuizLanguage = (props) => {
  const selectedQuestion = props?.watch("questions")?.filter(q => q?.selected)?.[0];
  const selectedQuestionIndex = props?.watch("questions")?.findIndex(q => q?.selected);
  const handleLanguageChange = (e) => {
    props?.setValue(`questions.${selectedQuestionIndex}.language`, selectedQuestion?.language?.map((l) => {
      if(e?.target?.value === l?.language_id){
        l.selected = true;
      }else{
        l.selected = false;
      }
      return l;
    }));
  };

  return (
    <Box
      id="acadlix_quiz_language"
      sx={{
        backgroundColor: props?.colorCode?.language_background,
        display: "flex",
      }}
    >
      <Box
        sx={{
          display: "flex",
          marginLeft: "auto",
          alignItems: "center",
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            color: props?.colorCode?.langauge_text_color,
          }}
        >
          View in:
        </Typography>
        <FormControl
          sx={{
            m: 1,
            minWidth: {
              xs: 100,
              sm: 120,
            },
          }}
          size="small"
        >
          <Select
            labelId="demo-select-small-label"
            id="demo-select-small"
            variant="outlined"
            displayEmpty
            value={selectedQuestion?.language?.filter(d => d?.selected)?.[0]?.language_id ?? null}
            onChange={handleLanguageChange}
            sx={{
              borderRadius: 0,
              "& .MuiSelect-select": {
                borderRadius: 0,
                padding: "5.5px 14px 5.5px 6px",
                backgroundColor: props?.colorCode?.language_dropdown_background,
                "&:focus": {
                  borderColor: "green",
                  borderRadius: 0,
                },
                "&:after": {
                  borderColor: "green",
                },
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderWidth: "0px !important",
              },
            }}
          >
            {selectedQuestion?.language?.length > 0 &&
              selectedQuestion?.language?.map((lang, lang_index) => (
                <MenuItem key={lang_index} value={lang?.language_id}
                  sx={{
                    display: lang?.question?.length > 0 ? "" : "none",
                  }}
                >{lang?.language_name}</MenuItem>
              ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};

export default QuizLanguage;
