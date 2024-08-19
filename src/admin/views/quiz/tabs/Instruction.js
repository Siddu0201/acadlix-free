import {
  Box,
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

const Instruction = (props) => {
  return (
    <Box sx={{ color: "black" }}>
      <Grid container>
        <GridItem1 xs={12} lg={12}>
          <FormControl
            sx={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <FormLabel
              sx={{
                marginRight: 3,
                color: "black",
                fontWeight: 400,
                fontSize: "1.05rem",
              }}
            >
              Change Language:
            </FormLabel>
            <RadioGroup
              row
              value={
                props
                  ?.watch("language_data")
                  ?.filter((lang) => lang?.selected)?.[0]?.language_id
              }
              onChange={(e) => {
                props?.setValue(
                  "language_data",
                  props?.watch("language_data")?.map((lang) => {
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
              {props?.watch("language_data")?.length > 0 &&
                props?.watch("language_data")?.map((lang, index) => (
                  <FormControlLabel
                    key={index}
                    control={<Radio />}
                    value={lang?.language_id}
                    label={
                      <>
                        {lang?.language_name}
                        {lang?.default ? "(default)" : ""}
                      </>
                    }
                  />
                ))}
            </RadioGroup>
          </FormControl>
        </GridItem1>
        {props?.watch("language_data")?.length > 0 &&
          props
            ?.watch("language_data")
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
      `language_data.${props?.index}.instruction1`
    );
    props?.loadEditor(
      `instruction2_${props?.index}`,
      `language_data.${props?.index}.instruction2`
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
      <GridItem1 xs={12} lg={12}>
        <Typography variant="h6">Instruction 1</Typography>
      </GridItem1>
      <GridItem1 xs={12} lg={12}>
        <textarea
          id={`instruction1_${props?.index}`}
          style={{
            width: "100%",
          }}
          value={props?.lang?.instruction1}
          onChange={(e) => e.preventDefault()}
        />
      </GridItem1>
      <GridItem1 xs={12} lg={12}>
        <Typography variant="h6">Instruction 2</Typography>
      </GridItem1>
      <GridItem1 xs={12} lg={12}>
        <textarea
          id={`instruction2_${props?.index}`}
          style={{
            width: "100%",
          }}
          value={props?.lang?.instruction2}
          onChange={(e) => e.preventDefault()}
        />
      </GridItem1>
      <GridItem1 xs={12} lg={12}>
        <Typography variant="h6">Term and condition</Typography>
      </GridItem1>
      <GridItem1 xs={12} lg={12}>
        <CustomTextField
          fullWidth
          size="small"
          multiline
          rows={3}
          control={props?.control}
          value={props?.lang?.term_and_condition_text}
          onChange={(e) =>
            props?.setValue(
              `language_data.${props?.index}.term_and_condition_text`,
              e?.target?.value,
              { shouldDirty: true }
            )
          }
        />
      </GridItem1>
      <GridItem1 xs={12} lg={12}>
        <Typography variant="h6">Term and condition warning</Typography>
      </GridItem1>
      <GridItem1 xs={12} lg={12}>
        <CustomTextField
          fullWidth
          size="small"
          multiline
          rows={1}
          control={props?.control}
          value={props?.lang?.term_and_condition_warning_text}
          onChange={(e) =>
            props?.setValue(
              `language_data.${props?.index}.term_and_condition_warning_text`,
              e?.target?.value,
              { shouldDirty: true }
            )
          }
        />
      </GridItem1>
    </React.Fragment>
  );
};
