import React from "react";
import {
  Box,
  Grid,
  Button,
  TextField,
} from "@mui/material";
import GridItem1 from "../../../components/GridItem1";
import User from "./User.png";

const Profile = () => {
  return (
    <Box>
      <Grid container spacing={4}>
        <GridItem1 lg={3} md={3} sm={12} xs={12}>
          <GridItem1>
            <img
              src={User}
              alt="User"
              style={{
                objectFit: "contain",
                width: "70%",
              }}
            />
          </GridItem1>
          <GridItem1>
            <TextField
              label="New Password"
              fullWidth
              name="title"
              size="small"
            />
          </GridItem1>
          <GridItem1>
            <TextField
              label="Re-Enter New Password"
              fullWidth
              name="title"
              size="small"
            />
          </GridItem1>
          <GridItem1>
            <Button variant="contained" color="success">
              Update Password
            </Button>
          </GridItem1>
        </GridItem1>
        <GridItem1 lg={9} md={9} sm={12} xs={12}>
          <Grid container>
            <GridItem1 lg={6} md={6} sm={12} xs={12}>
              <GridItem1>
                <TextField
                  label="First Name"
                  fullWidth
                  name="title"
                  size="small"
                />
              </GridItem1>
              <GridItem1>
                <TextField
                  label="Email"
                  fullWidth
                  name="title"
                  size="small"
                />
              </GridItem1>
              <GridItem1>
                <TextField
                  label="Address Line 1"
                  fullWidth
                  name="title"
                  size="small"
                />
              </GridItem1>
              <GridItem1>
                <TextField
                  label="City/Town"
                  fullWidth
                  name="title"
                  size="small"
                />
              </GridItem1>
              <GridItem1>
                <TextField
                  label="Country"
                  fullWidth
                  name="title"
                  size="small"
                />
              </GridItem1>
            </GridItem1>
            <GridItem1 lg={6} md={6} sm={12} xs={12}>
              <GridItem1>
                <TextField
                  label="Last Name"
                  fullWidth
                  name="title"
                  size="small"
                />
              </GridItem1>
              <GridItem1>
                <TextField
                  label="Mobile Number"
                  fullWidth
                  name="title"
                  size="small"
                />
              </GridItem1>
              <GridItem1>
                <TextField
                  label="Address Line 2"
                  fullWidth
                  name="title"
                  size="small"
                />
              </GridItem1>
              <GridItem1>
                <TextField
                  label="State"
                  fullWidth
                  name="title"
                  size="small"
                />
              </GridItem1>
              <GridItem1>
                <TextField
                  label="Pin Code/Zip"
                  fullWidth
                  name="title"
                  size="small"
                />
              </GridItem1>
            </GridItem1>
          </Grid>
          <div style={{ float: "right", marginTop: "10px" }}>
            <Button variant="contained" color="success">
              Update Details
            </Button>
          </div>
        </GridItem1>
      </Grid>
    </Box>
  );
};

export default Profile;
