import { Box, FormControl, MenuItem, Select } from "@mui/material";
import React from "react";

const LanguageSection = (props) => {
  const handleLanguageChange = (e) => {
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
      sx={{
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
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
          value={
            props?.question?.language?.find((d) => d?.selected)?.language_id ??
            null
          }
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
          {props?.question?.language?.length > 0 &&
            props?.question?.language?.map((lang, lang_index) => (
              <MenuItem
                key={lang_index}
                value={lang?.language_id}
                sx={{
                  display: lang?.question?.length > 0 ? "" : "none",
                }}
              >
                {lang?.language_name}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default LanguageSection;
