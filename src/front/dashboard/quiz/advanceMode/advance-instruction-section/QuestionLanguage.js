import { Box, FormControl, MenuItem, Select, Typography } from "@mui/material";
import React from "react";

const QuestionLanguage = (props) => {
  const handleLanguageChange = (e) => {
    props?.setValue("selected_language_id", e?.target?.value, {shouldDirty: true});
    props?.setValue(
      `questions`,
      props?.watch(`questions`)?.map((q) => {
        let selectedLang = q?.language?.find(
          (l) => l?.language_id === e?.target?.value
        );
        let selectedLangIndex = q?.language?.findIndex(
          (l) => l?.language_id === e?.target?.value
        );

        if (selectedLangIndex !== -1 && selectedLang?.question?.length > 0) {
          q?.language?.map((l, l_index) => {
            if (l_index === selectedLangIndex) {
              l.selected = true;
            } else {
              l.selected = false;
            }
            return l;
          });
        } else {
          q?.language?.map((l) => {
            if (l?.default) {
              l.selected = true;
            } else {
              l.selected = false;
            }
            return l;
          });
        }
        return q;
      })
    );
  };
  return (
    <Box
      id="acadlix_instruction_question_language"
      sx={{
        display: "flex",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Typography variant="body2" color="black">Choose your default language: </Typography>
        <FormControl
          sx={{
            minWidth: {
              xs: 90,
              sm: 90,
            },
          }}
          size="small"
        >
          <Select
            labelId="demo-select-small-label"
            id="demo-select-small"
            variant="outlined"
            displayEmpty
            value={
              props?.watch("selected_language_id") ?? ''
            }
            onChange={handleLanguageChange}
            sx={{
              borderRadius: 0,
              "& .MuiSelect-select": {
                border: `1px solid black`,
                borderRadius: "4px",
                padding: "2.5px 14px 2.5px 6px",
                backgroundColor: props?.colorCode?.language_dropdown_background,
                "&:focus": {
                  borderColor: "green",
                  borderRadius: "4px",
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
            <MenuItem value=''>--Select--</MenuItem>
            {props?.watch("languages")?.length > 0 &&
              props?.watch("languages")?.map((lang, lang_index) => (
                <MenuItem key={lang_index} value={lang?.language_id}>
                  {lang?.language?.language_name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};

export default QuestionLanguage;
