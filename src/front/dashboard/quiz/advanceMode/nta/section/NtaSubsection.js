import { Box, Button, Typography } from "@mui/material";
import React from "react";

const NtaSubsection = (props) => {
  return (
    <Box
      id="acadlix_nta_subsection"
      sx={{
        display: "flex",
        borderColor: props?.colorCode?.subsection_border,
        backgroundColor: props?.colorCode?.subsection_background,
        gap: 2,
        paddingX: 4,
        paddingY: 1,
        alignItems: "center",
      }}
    >
      <Typography>Subjects:</Typography>
      {props?.watch("subjects")?.length > 0 &&
        props
          ?.watch("subjects")
          ?.map((s, s_index) => (
            <SubsectionButton
              key={s_index}
              s_index={s_index}
              active={s?.selected}
              {...props}
              {...s}
            />
          ))}
    </Box>
  );
};

export default NtaSubsection;

const SubsectionButton = (props) => {
  const handleSubjectChange = () => {
    if (props?.watch("quiz_timing_type") === "subject_wise_time") {
      return;
    }
    props?.setValue(
      "subjects",
      props?.watch("subjects")?.map((s, s_index) => {
        if (s_index === props?.s_index) {
          s.selected = true;
        } else {
          s.selected = false;
        }
        return s;
      })
    );

    let i = 0;
    props?.setValue(
      "questions",
      props?.watch("questions")?.map((q) => {
        if (q.selected) {
          q.result.time =
            q.result.time +
            Math.round((Date.now() - props?.watch("last")) / 1000);
        }
        if (q?.subject_id == props?.subject_id) {
          if (i === 0) {
            q.selected = true;
            q.visit = true;
            i++;
          } else {
            q.selected = false;
          }
        } else {
          q.selected = false;
        }
        return q;
      })
    );
    props?.setValue("last", Date.now(), { shouldDirty: true });
  };
  return (
    <Box>
      <Button
        variant="outlined"
        size="small"
        onClick={handleSubjectChange}
        sx={{
          borderRadius: 0,
          boxShadow: "none",
          marginBottom: "0px !important",
          backgroundColor: props?.active
            ? props?.colorCode?.subsection_button_active_background
            : props?.colorCode?.subsection_button_background,
          color: props?.active
            ? props?.colorCode?.subsection_button_active_color
            : `${props?.colorCode?.subsection_button_color} !important`,
          borderColor: props?.active ? props?.colorCode?.backgroundColor : "grey",  
          // borderLeft: props?.active
          //   ? "0px"
          //   : `1px solid ${props?.colorCode?.subsection_button_border}`,
          // borderRight: props?.active
          //   ? "0px"
          //   : `1px solid ${props?.colorCode?.subsection_button_border}`,
          ":hover, :focus": {
            backgroundColor: props?.active
              ? props?.colorCode?.subsection_button_active_background
              : props?.colorCode?.subsection_button_background,
            color: props?.active
              ? props?.colorCode?.subsection_button_active_color
              : `${props?.colorCode?.subsection_button_color} !important`,
            boxShadow: "none",
          },
        }}
        
      >
        {props?.subject_name}
      </Button>
    </Box>
  );
};
