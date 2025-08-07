import { Box, Button, IconButton, Typography } from "@mui/material";
import Grid from '@mui/material/Grid';
import React from "react";
import CustomTextField from "@acadlix/components/CustomTextField";
import { FaPlus, FaTrash } from "@acadlix/helpers/icons";
import { __ } from "@wordpress/i18n";

const Outcome = (props) => {
  const handleAddOutcome = () => {
    props?.setValue(
      "meta.outcomes",
      [...props?.watch("meta.outcomes"), ""],
      { shouldDirty: true }
    );
  };

  const handleRemoveOutcome = (index) => {
    props?.setValue(
      "meta.outcomes",
      props?.watch("meta.outcomes")?.filter((o, i) => i !== index),
      { shouldDirty: true }
    );
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 12 }}>
          <Typography
            sx={{
              fontWeight: 600,
            }}
          >
            {__("What you Learn", "acadlix")}
          </Typography>
        </Grid>
        {props?.watch("meta.outcomes")?.length > 0 &&
          props?.watch("meta.outcomes")?.map((o, index) => (
            <Grid size={{ xs: 12, sm: 12, lg: 12 }}
              key={index}
              sx={{
                display: "flex",
                gap: 2,
              }}
            >
              <CustomTextField
                fullWidth
                size="small"
                type="text"
                label={__("Add Outcome", "acadlix")}
                value={o}
                onChange={(e) => {
                  props?.setValue(
                    `meta.outcomes.${index}`,
                    e?.target?.value,
                    {
                      shouldDirty: true,
                    }
                  );
                }}
                onKeyDown={props?.handleKeyDown}
                sx={{
                  "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                  {
                    display: "none",
                  },
                  "& input[type=number]": {
                    MozAppearance: "textfield",
                  },
                }}
              />
              <IconButton
                color="error"
                size="small"
                onClick={handleRemoveOutcome.bind(this, index)}
              >
                <FaTrash />
              </IconButton>
            </Grid>
          ))}
        <Grid size={{ xs: 12, sm: 12 }}>
          <Button
            color="primary"
            variant="contained"
            size="small"
            onClick={handleAddOutcome}
          >
            <FaPlus style={{ paddingRight: 2 }} /> {__("Add New", "acadlix")}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Outcome;
