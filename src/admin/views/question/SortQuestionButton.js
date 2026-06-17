import React from 'react'
import { Button, useMediaQuery } from '@mui/material';
import { __ } from "@wordpress/i18n";
import { BiSort, LuBrainCircuit } from '@acadlix/helpers/icons';
import { useTheme } from "@mui/material";
import BootstrapDialog from '@acadlix/components/BootstrapDialog';
import SortQuestionModel from './actions/SortQuestionModel';

const SortQuestionButton = (props) => {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
    props.refetch();
  }

  return (
    <>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        sm="90%"
        md="100%"
        height={{
          xs: "auto",
          sm: "85vh",
          md: "85vh",
          xl: "85vh",
        }}
        contentMaxHeight={{
          xs: "450px",
          sm: "450px",
          md: "450px",
          xl: "450px",
        }}
      >
        <SortQuestionModel
          handleClose={handleClose}
          {...props}
        />
      </BootstrapDialog >
      {
        isMobile ? (
          <Button
            variant="contained"
            onClick={handleOpen}
            color="primary"
            sx={{
              minWidth: '48px',
              padding: '9px 6px',
            }}
          >
            <BiSort style={{ fontSize: '1.25rem' }} />
          </Button >
        ) : (
          <Button
            variant="contained"
            onClick={handleOpen}
            color="primary"
            startIcon={<BiSort />}
          >
            {__("Sort Questions", "acadlix")}
          </Button>
        )
      }
    </>
  )
}

export default SortQuestionButton