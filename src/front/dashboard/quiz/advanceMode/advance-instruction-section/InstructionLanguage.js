import { Box, FormControl, MenuItem, Select, Typography } from "@mui/material";
import React from "react";

const InstructionLanguage = (props) => {
  const handleLanguageChange = (e) => {
    props?.setValue(
      "language_data",
      props?.watch("language_data")?.map((l) => {
        if (l?.language_id === e?.target?.value) {
          l.selected = true;
        } else {
          l.selected = false;
        }
        return l;
      })
    );
  };
  return (
    <Box
      id="acadlix_instruction_language"
      sx={{
        display: "flex",
      }}
    >
      <Box
        sx={{
          display: "flex",
          marginLeft: "auto",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Typography variant="body2">View in: </Typography>
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
              props?.watch("language_data")?.find((d) => d?.selected)
                ?.language_id ?? null
            }
            onChange={handleLanguageChange}
            sx={{
              borderRadius: 0,
              "& .MuiSelect-select": {
                border: `1px solid black`,
                borderRadius: '4px',
                padding: "2.5px 14px 2.5px 6px",
                backgroundColor: props?.colorCode?.language_dropdown_background,
                "&:focus": {
                  borderColor: "green",
                  borderRadius: '4px',
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
            {props?.watch("language_data")?.length > 0 &&
              props?.watch("language_data")?.map((lang, lang_index) => (
                <MenuItem key={lang_index} value={lang?.language_id}>
                  {lang?.language_name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};

export default InstructionLanguage;
