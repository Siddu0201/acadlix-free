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
import { __ } from "@wordpress/i18n";

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
          {__("SUBJECT:", "acadlix")}:
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
              disableElevation
              sx={{
                margin: `4px !important`,
              }}
            >
              {__("Quantitative Aptitude", "acadlix")}
            </Button>
            <Button
              size={props?.isDesktop ? "medium" : "small"}
              variant="contained"
              disableElevation
              sx={{
                margin: `4px !important`,
              }}
            >
              {__("English Language", "acadlix")}
            </Button>
            <Button
              size={props?.isDesktop ? "medium" : "small"}
              variant="contained"
              disableElevation
              sx={{
                margin: `4px !important`,
              }}
            >
              {__("GK", "acadlix")}
            </Button>
            <Button
              size={props?.isDesktop ? "medium" : "small"}
              variant="contained"
              disableElevation
              sx={{
                margin: `4px !important`,
              }}
            >
              {__("Reasoning", "acadlix")}
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
              <InputLabel id="demo-select-small-label">
                {__("Subject", "acadlix")}
              </InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                value={subject}
                label="Age"
                onChange={handleSubjectChange}
              >
                <MenuItem value="Quantitative Aptitude">
                  {__("Quantitative Aptitude", "acadlix")}
                </MenuItem>
                <MenuItem value="English Language">
                  {__("English Language", "acadlix")}
                </MenuItem>
                <MenuItem value="GK">{__("GK", "acadlix")}</MenuItem>
                <MenuItem value="Reasoning">
                  {__("Reasoning", "acadlix")}
                </MenuItem>
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
            {props?.isDesktop ? __("Select Language", "acadlix") : __("Lang.", "acadlix")}
          </InputLabel>
          <Select
            labelId="demo-select-small-label"
            id="demo-select-small"
            value={language}
            label={__("Age", "acadlix")}
            onChange={handleLanguageChange}
          >
            <MenuItem value="Hindi">{__("Hindi", "acadlix")}</MenuItem>
            <MenuItem value="English">{__("English", "acadlix")}</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Toolbar>
  );
};

export default QuizSubjectAndLanguage;
