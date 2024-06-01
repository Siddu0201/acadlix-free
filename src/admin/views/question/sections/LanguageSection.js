import {
  Card,
  CardContent,
  CardHeader,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
} from "@mui/material";
import React from "react";

const LanguageSection = (props) => {

  return (
    <Grid item xs={12} sm={12}>
      <Card>
        <CardHeader
          title="Language"
          titleTypographyProps={{
            sx: {
              fontWeight: 500,
              color: "black",
            },
          }}
        />
        <CardContent>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={9}>
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
                  value={props?.watch("language")?.filter(lang => lang?.selected)?.[0]?.language_id}
                  onChange={(e) => {
                    props?.setValue("language", 
                      props?.watch("language")?.map(lang => {
                        if(lang?.language_id === Number(e?.target?.value)){
                          lang.selected = true;
                        }else{
                          lang.selected = false;
                        }
                        return lang;
                      }),
                      {shouldDirty: true}
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
                            {lang?.default ? "(default)" : ""}
                            {/* <IconButton 
                              aria-label="delete" 
                              size="small" 
                              color="error" 
                              sx={{
                                display: lang?.language_id !== props?.watch("default_language_id") && index +1 === props?.watch("language")?.length ? "" : "none"
                              }}
                              onClick={() => {
                                if(props?.watch("selected_language_id") === lang?.language_id){
                                  props?.setValue("selected_language_id", props?.watch("default_language_id"), {shouldDirty: true});
                                }
                                props?.setValue("language", [...props?.watch("language")?.filter((curr) => curr?.language_id !== lang?.language_id)], {shouldDirty: true});
                              }}
                            >
                              <DeleteOutline fontSize="small" />
                            </IconButton> */}
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
