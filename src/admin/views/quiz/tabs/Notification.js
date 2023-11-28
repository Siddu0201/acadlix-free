import React from "react";
import {
  Grid,
  FormControlLabel,
  Switch,
} from "@mui/material";
import GridItem1 from "../../../../components/GridItem1";
import CustomTextField from "../../../../components/CustomTextField";

function Notification() {
  return (
    <div>
        <Grid container>
          <GridItem1 xs={12} lg={12}>
            <FormControlLabel
              control={<Switch />}
              label="Admin Email Notification"
            />
          </GridItem1>
          <GridItem1 xs={12} lg={6}>
            <CustomTextField
              fullWidth
              size="small"
              label="To"
            />
          </GridItem1>
          <GridItem1 xs={12} lg={6}>
            <CustomTextField
              fullWidth
              size="small"
              label="From"
            />
          </GridItem1>
          <GridItem1 xs={12} lg={12}>
            <CustomTextField
              fullWidth
              size="small"
              label="Subject"
            />
          </GridItem1>
          <GridItem1 xs={12} lg={12}>
            <CustomTextField
              fullWidth
              size="small"
              label="Message"
              multiline
              rows={4}
            />
          </GridItem1>
          <GridItem1 xs={12} lg={12}>
            <FormControlLabel
              control={<Switch />}
              label="Student Email Notification"
            />
          </GridItem1>
          <GridItem1 xs={12} lg={6}>
            <CustomTextField
              fullWidth
              size="small"
              label="To"
            />
          </GridItem1>
          <GridItem1 xs={12} lg={6}>
            <CustomTextField
              fullWidth
              size="small"
              label="From"
            />
          </GridItem1>
          <GridItem1 xs={12} lg={12}>
            <CustomTextField
              fullWidth
              size="small"
              label="Subject"
            />
          </GridItem1>
          <GridItem1 xs={12} lg={12}>
            <CustomTextField
              fullWidth
              size="small"
              label="Message"
              multiline
              rows={4}
            />
          </GridItem1>

          {/* Instructor Email Only for Panel Mode  */}
          <GridItem1 xs={12} lg={12}>
            <FormControlLabel
              control={<Switch />}
              label="Instructor Email Notification"
            />
          </GridItem1>
          <GridItem1 xs={12} lg={6}>
            <CustomTextField
              fullWidth
              size="small"
              label="To"
            />
          </GridItem1>
          <GridItem1 xs={12} lg={6}>
            <CustomTextField
              fullWidth
              size="small"
              label="From"
            />
          </GridItem1>
          <GridItem1 xs={12} lg={12}>
            <CustomTextField
              fullWidth
              size="small"
              label="Subject"
            />
          </GridItem1>
          <GridItem1 xs={12} lg={12}>
            <CustomTextField
              fullWidth
              size="small"
              label="Message"
              multiline
              rows={4}
            />
          </GridItem1>
        </Grid>
    </div>
  );
}

export default Notification;
