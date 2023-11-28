import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Toolbar,
  Typography,
} from "@mui/material";
import React from "react";

const QuizSubjectAndLanguage = (props) => {
  const [language, setLanguage] = React.useState("");
  const [subject, setSubject] = React.useState("");

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleSubjectChange = (e) => {
    setSubject(e.target.value);
  };

  return (
    <Toolbar
      sx={{
        boxShadow: 6,
        display: "flex",
        justifyContent: "space-between",
        padding: 0,
        minHeight: "100% !important",
      }}
      className="acadlix_quiz_subject_and_language"
    >
      <Box
        sx={{
          display: "flex",
        }}
      >
        <Typography
          sx={{
            display: {
              xs: 'none',
              md: 'flex',
            },
            alignItems: "center",
            fontSize: {
              xs: "14px",
              md: "16px",
            },
          }}
        >
          SUBJECT:
        </Typography>
        {props?.isDesktop ? (
          <Box
            sx={{
              display: "flex",
              maxWidth: {
                xs: "180px",
                md: "710px",
              },
              overflowX: "auto",
            }}
          >
            <Button
              size={props?.isDesktop ? "medium" : "small"}
              variant="contained"
              color="section"
              disableElevation
              sx={{
                margin: `4px !important`,
              }}
            >
              Quantitative Aptitude
            </Button>
            <Button
              size={props?.isDesktop ? "medium" : "small"}
              variant="contained"
              color="section"
              disableElevation
              sx={{
                margin: `4px !important`,
              }}
            >
              English Language
            </Button>
            <Button
              size={props?.isDesktop ? "medium" : "small"}
              variant="contained"
              color="section"
              disableElevation
              sx={{
                margin: `4px !important`,
              }}
            >
              GK
            </Button>
            <Button
              size={props?.isDesktop ? "medium" : "small"}
              variant="contained"
              color="section"
              disableElevation
              sx={{
                margin: `4px !important`,
              }}
            >
              Reasoning
            </Button>
          </Box>
        ) : (
          <Box>
            <FormControl
              sx={{
                m: 1,
                minWidth: 100,
              }}
              size="small"
            >
              <InputLabel id="demo-select-small-label">Subj.</InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                value={subject}
                label="Age"
                onChange={handleSubjectChange}
              >
                <MenuItem value="Quantitative Aptitude">
                  Quantitative Aptitude
                </MenuItem>
                <MenuItem value="English Language">English Language</MenuItem>
                <MenuItem value="GK">GK</MenuItem>
                <MenuItem value="Reasoning">Reasoning</MenuItem>
              </Select>
            </FormControl>
          </Box>
        )}
      </Box>
      <Box>
        <FormControl
          sx={{
            m: 1,
            minWidth: {
              xs: 100,
              md: 155,
            }
          }}
          size="small"
        >
          <InputLabel id="demo-select-small-label">
            {props?.isDesktop ? "Select Language" : "Lang."}
          </InputLabel>
          <Select
            labelId="demo-select-small-label"
            id="demo-select-small"
            value={language}
            label="Age"
            onChange={handleLanguageChange}
          >
            <MenuItem value="Hindi">Hindi</MenuItem>
            <MenuItem value="English">English</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Toolbar>
  );
};

export default QuizSubjectAndLanguage;
