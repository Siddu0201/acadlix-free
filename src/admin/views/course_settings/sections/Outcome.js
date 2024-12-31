import { Box, Button, Grid, IconButton, Typography } from "@mui/material";
import React from "react";
import CustomTextField from "../../../../components/CustomTextField";
import { FaPlus, FaTrash } from "../../../../helpers/icons";

const Outcome = (props) => {
  const handleAddOutcome = () => {
    props?.setValue(
      "outcomes",
      [...props?.watch("outcomes"), { id: null, outcome: "" }],
      { shouldDirty: true }
    );
  };

  const handleRemoveOutcome = (index) => {
    props?.setValue(
      "outcomes",
      props?.watch("outcomes")?.filter((o, i) => i !== index),
      { shouldDirty: true }
    );
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12}>
          <Typography
            sx={{
              fontWeight: 600,
            }}
          >
            What you Learn
          </Typography>
        </Grid>
        {props?.watch("outcomes")?.length > 0 &&
          props?.watch("outcomes")?.map((o, index) => (
            <Grid
              item
              xs={12}
              sm={12}
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
                label="Add Outcome"
                value={o?.outcome}
                onChange={(e) => {
                  props?.setValue(
                    `outcomes.${index}.outcome`,
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
                inputProps={{
                  sx: {
                    border: `0 !important`,
                    boxShadow: `none !important`,
                    minHeight: `auto !important`,
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
        <Grid item xs={12} sm={12}>
          <Button
            color="primary"
            variant="contained"
            size="small"
            onClick={handleAddOutcome}
          >
            <FaPlus style={{ paddingRight: 2 }} /> Add New
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Outcome;
