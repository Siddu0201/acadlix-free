import React from 'react'
import { Box, FormControl, InputLabel, Select, MenuItem, Typography } from "@mui/material"

const QuizLanguage = (props) => {
  const [language, setLanguage] = React.useState("Hindi");

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  return (
    <Box
      id="acadlix_quiz_language"
      sx={{
        backgroundColor: props?.colorCode?.language_background,
        display: "flex",
      }}>
      <Box sx={{
        display: "flex",
        marginLeft: "auto",
        alignItems: "center",
      }}>
        <Typography variant="subtitle2" sx={{
          color: props?.colorCode?.langauge_text_color
        }}>View in:</Typography>
        <FormControl
          sx={{
            m: 1,
            minWidth: {
              xs: 100,
              sm: 120,
            }
          }}
          size="small"
        >
          <Select
            labelId="demo-select-small-label"
            id="demo-select-small"
            variant='outlined'
            displayEmpty
            value={language}
            onChange={handleLanguageChange}
            sx={{
              borderRadius: 0,
              '& .MuiSelect-select': {
                borderRadius: 0,
                padding: "5.5px 14px 5.5px 6px",
                backgroundColor: props?.colorCode?.language_dropdown_background,
                '&:focus': {
                  borderColor: "green",
                  borderRadius: 0,
                },
                '&:after': {
                  borderColor: "green",
                }
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderWidth: "0px !important",
              }
            }}
          >
            <MenuItem value="Hindi">Hindi</MenuItem>
            <MenuItem value="English">English</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  )
}

export default QuizLanguage
