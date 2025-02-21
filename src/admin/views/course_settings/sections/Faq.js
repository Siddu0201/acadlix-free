import { Box, Button, Typography } from "@mui/material";
import Grid from '@mui/material/Grid2';
import React from "react";
import { FaPlus } from "../../../../helpers/icons";
import { __ } from "@wordpress/i18n";

const Faq = (props) => {
  const handleAddFaq = () => {
    props?.setValue(
      "faqs",
      [...props?.watch("faqs"), { id: null, question: "", answer: "" }],
      { shouldDirty: true }
    );
  };

  const handleRemoveFaq = (index) => {
    props?.setValue(
      "faqs",
      props?.watch("faqs")?.filter((_, i) => i !== index),
      { shouldDirty: true }
    );
  };
  return (
    <Box>
      <Grid container spacing={3}>
        {props?.watch("faqs")?.length > 0 &&
          props?.watch("faqs")?.map((f, index) => (
            <React.Fragment key={index}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 12 }}>
                    <Typography
                      sx={{
                        fontWeight: 600,
                      }}
                    >
                      {__("Question", "acadlix")}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 12 }}>
                    <textarea
                      style={{ width: "100%" }}
                      rows={3}
                      value={f?.question}
                      onChange={(e) => {
                        props?.setValue(
                          `faqs.${index}.question`,
                          e?.target?.value,
                          { shouldDirty: true }
                        );
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 12 }}>
                    <Typography
                      sx={{
                        fontWeight: 600,
                      }}
                    >
                      {__("Answer", "acadlix")}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 12 }}>
                    <textarea
                      style={{ width: "100%" }}
                      rows={3}
                      value={f?.answer}
                      onChange={(e) => {
                        props?.setValue(
                          `faqs.${index}.answer`,
                          e?.target?.value,
                          { shouldDirty: true }
                        );
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid size={{ xs: 12, sm: 12 }}>
                <Button
                  color="error"
                  variant="contained"
                  size="small"
                  onClick={handleRemoveFaq.bind(this, index)}
                >
                  {__("Remove", "acadlix")}
                </Button>
              </Grid>
            </React.Fragment>
          ))}
        <Grid size={{ xs: 12, sm: 12 }}>
          <Button
            color="primary"
            variant="contained"
            size="small"
            onClick={handleAddFaq}
          >
            <FaPlus style={{ paddingRight: 2 }} /> {__("Add New", "acadlix")}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Faq;
