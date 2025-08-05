import { Box, Button, Card, CardActions, CardContent, Divider, Typography } from "@mui/material";
import Grid from '@mui/material/Grid2';
import React from "react";
import CustomTextField from "@acadlix/components/CustomTextField";
import { __ } from "@wordpress/i18n";
import CustomTypography from "@acadlix/components/CustomTypography";

const Permalink = (props) => {
  return (
    <Card>
      <CardContent>
        <Box>
          <Box
            sx={{
              marginY: 2,
            }}
          >
            <Typography variant="h4">{__("Course Permalink", "acadlix")}</Typography>
            <Divider />
          </Box>
          <Grid
            container
            spacing={4}
            sx={{
              alignItems: "center",
            }}
          >
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <CustomTypography>
                {__("Course base", "acadlix")}
              </CustomTypography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <CustomTextField
                fullWidth
                size="small"
                value={props?.watch("acadlix_course_base")}
                onChange={(e) => {
                  props?.setValue("acadlix_course_base", e?.target?.value, {
                    shouldDirty: true,
                  });
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <CustomTypography>
                {__("Category base", "acadlix")}
              </CustomTypography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <CustomTextField
                fullWidth
                size="small"
                value={props?.watch("acadlix_course_category_base")}
                onChange={(e) => {
                  props?.setValue("acadlix_course_category_base", e?.target?.value, {
                    shouldDirty: true,
                  });
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <CustomTypography>
                {__("Tag base", "acadlix")}
              </CustomTypography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <CustomTextField
                fullWidth
                size="small"
                value={props?.watch("acadlix_course_tag_base")}
                onChange={(e) => {
                  props?.setValue("acadlix_course_tag_base", e?.target?.value, {
                    shouldDirty: true,
                  });
                }}
              />
            </Grid>
          </Grid>
        </Box>
      </CardContent>
      <CardActions>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          loading={props?.isPending}
        >
          {__("Save", "acadlix")}
        </Button>
      </CardActions>
    </Card>
  );
};

export default Permalink;
