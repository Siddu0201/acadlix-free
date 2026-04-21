import React from 'react'
import { Button, useMediaQuery } from '@mui/material';
import { __ } from "@wordpress/i18n";
import { Link } from 'react-router-dom';
import { LuBrainCircuit } from '@acadlix/helpers/icons';
import { useTheme } from "@mui/material";

const AddQuestionWithAiButton = (props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <>
      {
        isMobile ? (
          <Button
            variant="contained"
            LinkComponent={Link}
            to={`/${props?.quiz_id}/question/create_with_ai`}
            color="primary"
            sx={{
              minWidth: '48px',
              padding: '9px 6px',
            }}
          >
            <LuBrainCircuit style={{ fontSize: '1.25rem' }} />
          </Button>
        ) : (
          <Button
            variant="contained"
            LinkComponent={Link}
            to={`/${props?.quiz_id}/question/create_with_ai`}
            color="primary"
            startIcon={<LuBrainCircuit />}
          >
            {__("Add Question with AI", "acadlix")}
          </Button>
        )
      }
    </>
  )
}

export default AddQuestionWithAiButton