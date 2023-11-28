import React from "react";
import {
  List,
  Accordion,
  AccordionSummary,
  Box,
  Typography,
  AccordionDetails,
} from "@mui/material";
import { FaAngleDown } from "react-icons/fa";
import SidebarListItem from "./SidebarListItem";

const SidebarList = () => {

  return (
    <Accordion
      disableGutters
      elevation={0}
      square
      sx={{
        border: `1px solid #d1d7dc`,
        "&:not(:last-child)": {
          borderBottom: 0,
        },
        "&:before": {
          display: "none",
        },
      }}
    >
      <AccordionSummary
        expandIcon={
          <FaAngleDown
            style={{
              fontSize: "1rem",
            }}
          />
        }
        sx={{
          backgroundColor: "#f7f9fa",
          paddingX: 3,
          paddingY: 2,
          "& .MuiAccordionSummary-content": {
            marginY: 2,
            marginRight: 2,
          },
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: "1rem",
              fontWeight: 700,
            }}
          >
            Section 1: Intoduction
          </Typography>
          <Typography
            sx={{
              fontSize: "0.7rem",
              fontWeight: 400,
            }}
          >
            2/2 | 19min
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          padding: 0,
        }}
      >
        <List
          sx={{
            padding: 0,
          }}
        >
          <SidebarListItem />
          <SidebarListItem />
        </List>
      </AccordionDetails>
    </Accordion>
  );
};

export default SidebarList;
