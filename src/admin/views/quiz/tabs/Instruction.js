import {
  Box,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import React from "react";
import GridItem1 from "../../../../components/GridItem1";
import CustomTextField from "../../../../components/CustomTextField";
import CustomTypography from "../../../../components/CustomTypography";

const Instruction = (props) => {
  return (
    <Box sx={{ color: "black" }}>
      <Box
        sx={{
          marginY: 2,
        }}
      >
        <Typography variant="h6">Instruction Options</Typography>
        <Divider />
      </Box>
      <Grid container spacing={3} alignItems="center">
        {
          props?.watch("languages")?.length > 0 &&
          <React.Fragment>
            <GridItem1 xs={12} sm={6} lg={3}>
              <CustomTypography>Change Language:</CustomTypography>
            </GridItem1>
            <GridItem1 xs={12} sm={6} lg={9}>
              <FormControl
                sx={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <RadioGroup
                  row
                  value={
                    props
                      ?.watch("meta.language_data")
                      ?.filter((lang) => lang?.selected)?.[0]?.language_id
                  }
                  onChange={(e) => {
                    props?.setValue(
                      "meta.language_data",
                      props?.watch("meta.language_data")?.map((lang) => {
                        if (lang?.language_id === Number(e?.target?.value)) {
                          lang.selected = true;
                        } else {
                          lang.selected = false;
                        }
                        return lang;
                      })
                    );
                  }}
                >
                  {props?.watch("meta.language_data")?.length > 0 &&
                    props?.watch("meta.language_data")?.map((lang, index) => (
                      <FormControlLabel
                        key={index}
                        control={<Radio />}
                        value={lang?.language_id ?? ""}
                        label={
                          <>
                            {props?.languages?.find((l) => l?.term_id === lang?.language_id)?.name}
                            {lang?.default ? "(default)" : ""}
                          </>
                        }
                      />
                    ))}
                </RadioGroup>
              </FormControl>
            </GridItem1>
          </React.Fragment>
        }
        {props?.watch("meta.language_data")?.length > 0 &&
          props
            ?.watch("meta.language_data")
            ?.map((lang, index) => (
              <React.Fragment key={index}>
                {lang?.selected && (
                  <LangInstruction {...props} index={index} lang={lang} />
                )}
              </React.Fragment>
            ))}
      </Grid>
    </Box>
  );
};

export default Instruction;

const LangInstruction = (props) => {
  const loadPage = () => {
    props?.loadEditor(
      `instruction1_${props?.index}`,
      `meta.language_data.${props?.index}.instruction1`
    );
    props?.loadEditor(
      `instruction2_${props?.index}`,
      `meta.language_data.${props?.index}.instruction2`
    );
  };

  React.useEffect(() => {
    loadPage();
    window.addEventListener("load", loadPage);

    return () => {
      props?.removeEditor(`instruction1_${props?.index}`);
      props?.removeEditor(`instruction2_${props?.index}`);
      window.removeEventListener("load", loadPage);
    };
  }, []);

  return (
    <React.Fragment>
      <GridItem1 xs={12} sm={6} lg={3}>
        <CustomTypography>Instruction 1</CustomTypography>
      </GridItem1>
      <GridItem1 xs={12} sm={6} lg={9}>
        <textarea
          id={`instruction1_${props?.index}`}
          style={{
            width: "100%",
          }}
          value={props?.lang?.instruction1}
          onChange={(e) => {
            let value = e?.target?.value;
            if (window.tinymce) {
              const editor = window.tinymce.get(`instruction1_${props?.index}`);
              if (editor && editor.getContent() !== value) {
                editor.setContent(value || "");
              }
            }
            props.setValue(`meta.language_data.${props?.index}.instruction1`, value, {
              shouldDirty: true,
            });
          }}
        />
      </GridItem1>
      <GridItem1 xs={12} sm={6} lg={3}>
        <CustomTypography>Instruction 2</CustomTypography>
      </GridItem1>
      <GridItem1 xs={12} sm={6} lg={9}>
        <textarea
          id={`instruction2_${props?.index}`}
          style={{
            width: "100%",
          }}
          value={props?.lang?.instruction2}
          onChange={(e) => {
            let value = e?.target?.value;
            if (window.tinymce) {
              const editor = window.tinymce.get(`instruction2_${props?.index}`);
              if (editor && editor.getContent() !== value) {
                editor.setContent(value || "");
              }
            }
            props.setValue(`meta.language_data.${props?.index}.instruction2`, value, {
              shouldDirty: true,
            });
          }}
        />
      </GridItem1>
      <GridItem1 xs={12} sm={6} lg={3}>
        <CustomTypography>Term and condition</CustomTypography>
      </GridItem1>
      <GridItem1 xs={12} sm={6} lg={9}>
        <CustomTextField
          fullWidth
          size="small"
          multiline
          rows={3}
          label="Term and condition"
          control={props?.control}
          value={props?.lang?.term_and_condition_text}
          onChange={(e) =>
            props?.setValue(
              `meta.language_data.${props?.index}.term_and_condition_text`,
              e?.target?.value,
              { shouldDirty: true }
            )
          }
        />
      </GridItem1>
      <GridItem1 xs={12} sm={6} lg={3}>
        <CustomTypography>Term and condition warning</CustomTypography>
      </GridItem1>
      <GridItem1 xs={12} sm={6} lg={9}>
        <CustomTextField
          fullWidth
          size="small"
          multiline
          label="Term and condition warning"
          rows={1}
          control={props?.control}
          value={props?.lang?.term_and_condition_warning_text}
          onChange={(e) =>
            props?.setValue(
              `meta.language_data.${props?.index}.term_and_condition_warning_text`,
              e?.target?.value,
              { shouldDirty: true }
            )
          }
        />
      </GridItem1>
    </React.Fragment>
  );
};
