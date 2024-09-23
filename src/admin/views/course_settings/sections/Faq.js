import { Box, Button, Grid, Typography } from "@mui/material";
import React from "react";
import { FaPlus } from "react-icons/fa";

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
      {shouldDirty: true}
    );
  };
  return (
    <Box>
      <Grid container spacing={3}>
        {props?.watch("faqs")?.length > 0 &&
          props?.watch("faqs")?.map((f, index) => (
            <React.Fragment key={index}>
              <Grid item xs={12} sm={6}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12}>
                    <Typography
                      sx={{
                        fontWeight: 600,
                      }}
                    >
                      Question
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12}>
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
              <Grid item xs={12} sm={6}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12}>
                    <Typography
                      sx={{
                        fontWeight: 600,
                      }}
                    >
                      Answer
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12}>
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
              <Grid item xs={12} sm={12}>
                <Button
                  color="error"
                  variant="contained"
                  size="small"
                  onClick={handleRemoveFaq.bind(this, index)}
                >
                  Remove
                </Button>
              </Grid>
            </React.Fragment>
          ))}
        <Grid item xs={12} sm={12}>
          <Button
            color="primary"
            variant="contained"
            size="small"
            onClick={handleAddFaq}
          >
            <FaPlus style={{ paddingRight: 2 }} /> Add New
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Faq;
