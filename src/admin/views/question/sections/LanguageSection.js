import {
  Card,
  CardContent,
  CardHeader,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import React from "react";
import { __ } from "@wordpress/i18n";

const LanguageSection = (props) => {

  return (
    <Grid size={{ xs: 12, sm: 12 }}>
      <Card>
        <CardHeader
          title={__("Language", "acadlix")}
        />
        <CardContent>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, sm: 9 }}>
              <FormControl
                sx={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <FormLabel
                  sx={{
                    marginRight: 3,
                    fontWeight: 400,
                    fontSize: "1.05rem",
                  }}
                >
                  {__("Change Language:", "acadlix")}
                </FormLabel>
                <RadioGroup
                  row
                  value={props?.watch("language")?.filter(lang => lang?.selected)?.[0]?.language_id}
                  onChange={(e) => {
                    props?.setValue("language",
                      props?.watch("language")?.map(lang => {
                        if (lang?.language_id === Number(e?.target?.value)) {
                          lang.selected = true;
                        } else {
                          lang.selected = false;
                        }
                        return lang;
                      }),
                      { shouldDirty: true }
                    );
                  }}
                >
                  {
                    props?.watch("language")?.length > 0 &&
                    props?.watch("language")?.map((lang, index) => (
                      <FormControlLabel
                        key={index}
                        control={<Radio />}
                        value={lang?.language_id}
                        label={
                          <>
                            {lang?.language_name}
                            {lang?.default ? __(" (default)", "acadlix") : ""}
                          </>
                        }
                      />
                    ))
                  }
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default LanguageSection;
