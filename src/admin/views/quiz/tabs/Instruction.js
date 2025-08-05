import {
  Box,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import React from "react";
import GridItem1 from "@acadlix/components/GridItem1";
import CustomTextField from "@acadlix/components/CustomTextField";
import CustomTypography from "@acadlix/components/CustomTypography";
import { __ } from "@wordpress/i18n";

const Instruction = (props) => {
  return (
    <Box>
      <Box
        sx={{
          marginY: 2,
        }}
      >
        <Typography variant="h4">{__("Instruction Options", "acadlix")}</Typography>
        <Divider />
      </Box>
      <Grid 
        container 
        spacing={{
            xs: 2,
            sm: 4,
        }} 
        alignItems="center"
      >
        {
          props?.watch("languages")?.length > 0 &&
          <React.Fragment>
            <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
              <CustomTypography>{__("Change Language:", "acadlix")}</CustomTypography>
            </GridItem1>
            <GridItem1 size={{ xs: 12, sm: 6, lg: 9 }}>
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
      <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
        <CustomTypography>{__("Instruction 1", "acadlix")}</CustomTypography>
      </GridItem1>
      <GridItem1 size={{ xs: 12, sm: 6, lg: 9 }}>
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
      <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
        <CustomTypography>{__("Instruction 2", "acadlix")}</CustomTypography>
      </GridItem1>
      <GridItem1 size={{ xs: 12, sm: 6, lg: 9 }}>
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
      <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
        <CustomTypography>{__("Term and condition", "acadlix")}</CustomTypography>
      </GridItem1>
      <GridItem1 size={{ xs: 12, sm: 6, lg: 9 }}>
        <CustomTextField
          fullWidth
          size="small"
          multiline
          rows={3}
          label={__("Term and condition", "acadlix")}
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
      <GridItem1 size={{ xs: 12, sm: 6, lg: 3 }}>
        <CustomTypography>{__("Term and condition warning", "acadlix")}</CustomTypography>
      </GridItem1>
      <GridItem1 size={{ xs: 12, sm: 6, lg: 9 }}>
        <CustomTextField
          fullWidth
          size="small"
          multiline
          label={__("Term and condition warning", "acadlix")}
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
