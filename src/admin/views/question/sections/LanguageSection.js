import { Delete, DeleteOutline } from "@mui/icons-material";
import {
  Autocomplete,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
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
            <Grid item xs={12} sm={3}>
              <Autocomplete
                multiple
                fullWidth
                size="small"
                disableCloseOnSelect
                options={props?.availableLanguage}
                getOptionLabel={(option) => option?.name}
                value={
                  props?.watch("language")?.length > 0 ?
                  props?.watch("language")?.map((lang) => {
                    return {
                      id: lang?.language_id,
                      name: props?.availableLanguage?.filter(avl => avl?.id === lang?.language_id)?.[0]?.name
                    }
                  })
                  :
                  null
                }
                isOptionEqualToValue={(option, value) =>
                  option?.id === value?.id
                }
                onChange={(_, newValue) => {
                  let newlang = [];
                    // add language
                    newValue?.forEach((nvalue) => {
                      if(props?.watch("language")?.some((item) => item?.language_id === nvalue?.id)){
                        newlang = [...newlang, ...props?.watch("language")?.filter((lang) => lang?.language_id === nvalue?.id)];
                      }else{
                        newlang = [...newlang, {
                          language_id: nvalue?.id,
                          question: "",
                          correct_msg: "",
                          incorrect_msg: "",
                          hint_msg: "",
                          answer_data: {
                            singleChoice: [],
                            multipleChoice: [],
                            trueFalse: [],
                            sortingChoice: [],
                            matrixSortingChoice: [],
                            fillInTheBlank: [],
                            numerical: [],
                            rangeType: [],
                            paragraph: [],
                          },
                        }];
                      }
                    });
                    console.log(newValue);
                   console.log(newlang);

                  props?.setValue("language", [...newlang], {shouldDirty: true});
                }}
                filterSelectedOptions={true}
                renderOption={(prop, option) => (
                  <li {...prop} disabled={props?.watch("default_language_id") === option?.id}>
                    <Checkbox 
                      sx={{ marginRight: 4 }} 
                      checked={props?.watch("language")?.filter((lang) => lang?.language_id === option?.id)?.length > 0} 
                      disabled={props?.watch("default_language_id") === option?.id}
                    />
                    {option?.name}
                  </li>
                )}
                renderTags={(tagValue, getTagProps) =>
                  tagValue.map((option, index) => (
                    <Chip
                      label={option.name}
                      deleteIcon={<></>}
                      {...getTagProps({ index })}
                    />
                  ))
                }
                disableClearable={true}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Add Language"
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: "code",
                    }}
                  />
                )}
              />
            </Grid>
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
                  value={props?.watch("selected_language_id")}
                  onChange={(e) => {
                    props?.setValue("selected_language_id", Number(e.target.value), {shouldDirty: true});
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
                            {props?.availableLanguage?.filter((avl) => avl?.id === lang?.language_id)?.[0]?.name}
                            {lang?.language_id === props?.watch("default_language_id") ? "(default)" : ""}
                            <IconButton 
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
                            </IconButton>
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
