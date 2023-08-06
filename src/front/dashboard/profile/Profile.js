import React from "react";
import {
  Box,
  Grid,
  Card,
  CardHeader,
  CardContent,
  TextField,
  FormGroup,
  FormControl,
  FormControlLabel,
  Container,
  Button,
  TextareaAutosize,
} from "@mui/material";
import GridItem1 from "../../../components/GridItem1";
import User from "./User.png";
import Card1 from "../../../components/Card1";
import CustomTextField from "../../../components/CustomTextField";
import { Margin } from "@mui/icons-material";

const Profile = () => {
  return (
    <div>
      <Box>
        <FormControl>
          <Card>
            <CardHeader title="Profile" />
            <CardContent>
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
                    <CustomTextField
                      label="New Password"
                      fullWidth
                      name="title"
                      size="small"
                    />
                  </GridItem1>
                  <GridItem1>
                    <CustomTextField
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
                        <CustomTextField
                          label="First Name"
                          fullWidth
                          name="title"
                          size="small"
                        />
                      </GridItem1>
                      <GridItem1>
                        <CustomTextField
                          label="Email"
                          fullWidth
                          name="title"
                          size="small"
                        />
                      </GridItem1>
                      <GridItem1>
                        <CustomTextField
                          label="Address Line 1"
                          fullWidth
                          name="title"
                          size="small"
                        />
                      </GridItem1>
                      <GridItem1>
                        <CustomTextField
                          label="City/Town"
                          fullWidth
                          name="title"
                          size="small"
                        />
                      </GridItem1>
                      <GridItem1>
                        <CustomTextField
                          label="Country"
                          fullWidth
                          name="title"
                          size="small"
                        />
                      </GridItem1>
                    </GridItem1>
                    <GridItem1 lg={6} md={6} sm={12} xs={12}>
                      <GridItem1>
                        <CustomTextField
                          label="Last Name"
                          fullWidth
                          name="title"
                          size="small"
                        />
                      </GridItem1>
                      <GridItem1>
                        <CustomTextField
                          label="Mobile Number"
                          fullWidth
                          name="title"
                          size="small"
                        />
                      </GridItem1>
                      <GridItem1>
                        <CustomTextField
                          label="Address Line 2"
                          fullWidth
                          name="title"
                          size="small"
                        />
                      </GridItem1>
                      <GridItem1>
                        <CustomTextField
                          label="State"
                          fullWidth
                          name="title"
                          size="small"
                        />
                      </GridItem1>
                      <GridItem1>
                        <CustomTextField
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
            </CardContent>
          </Card>
        </FormControl>
      </Box>
    </div>
  );
};

export default Profile;
