import React from "react";
import {
  List,
  Accordion,
  AccordionSummary,
  Box,
  Typography,
  AccordionDetails,
} from "@mui/material";
import { FaAngleDown } from "@acadlix/helpers/icons";
import SidebarListItem from "./SidebarListItem";
import { __ } from "@wordpress/i18n";

const SidebarList = (props) => {
  const handleChange = () => {
    props?.setValue(`sections.${props?.index}.open`, !props?.s?.open, {shouldDirty: true});
  }

  return (
    <Accordion
      disableGutters
      elevation={0}
      square
      expanded={props?.s?.open}
      onChange={handleChange}
      sx={{
        border: ({theme}) => `1px solid ${theme?.palette?.grey?.dark}`,
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
          paddingX: 3,
          paddingY: 2,
          marginBottom: `0 !important`,
          "& .MuiAccordionSummary-content": {
            marginY: 2,
            marginRight: 2,
          },
          ":hover, :focus": {
            outline: "none",
          }
        }}
      >
        <Box>
          <Typography
            variant="h6"
          >
            {__("Section", "acadlix")} {props?.num}: {props?.s?.title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
          >
            {props?.s?.content?.filter(c => c?.is_completed)?.length}/{props?.s?.content?.length}
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
          {
            props?.watch(`sections.${props?.index}.content`)?.length > 0 &&
            props?.watch(`sections.${props?.index}.content`)?.map((c, c_index, arr) => (
              <SidebarListItem
                key={c_index}
                c_index={c_index}
                c_num={c_index + 1}
                c_first={c_index === 0}
                c_last={arr?.length -1 === c_index}
                c={c}
                {...props}
              />
            ))
          }
        </List>
      </AccordionDetails>
    </Accordion>
  );
};

export default SidebarList;
